Vue.service("user", {
	services: ["q", "swagger"],
	data: function() {
		return {
			id: null,
			language: null,
			roles: ["$guest"],
			allowedPermissions: [],
			disallowedPermissions: [],
			permissions: [],
			contextualRoles: {},
			application: "${environment('webApplicationId')}",
			remembering: false,
			canTimer: null,
			// permissions we want to check
			permissionsToCheck: [],
			permissionsBeingChecked: [],
			permissionCheckPromise: null,
			// check if we are already waiting for the swagger call
			batchWaiting: false,
			// the promise while checking
			permissionBeingCheckedPromise: null,
			// we keep track of the token here
			// almost all calls go through the swagger client, which already has the bearer
			// some calls however (like loading the swagger file itself) bypass the swagger client
			bearer: null,
			// keep track of ltp tokens
			ltpStorage: {}
		}
	},
	computed: {
		loggedIn: function() {
			return this.bearer != null;
		},
		normalizedPermissions: function() {
			return this.permissions.map(function(x) {
				var parts = x.split(":");	
				// only the name
				if (parts.length == 1) {
					parts = ["default", "$global", parts[0]];
				}
				// context + name
				else if (parts.length == 2) {
					parts = ["default", parts[0], parts[1]];
				}
				return parts;
			});
		}
	},
	// always try to remember the user
	activate: function(done) {
		this.remember().then(function() {
			done();
		}, function() {
			done();
		})	
	},
	methods: {
		// calculate a download url
		// when downloading a file, we don't have control over the headers being sent
		// this means we can't set a bearer token
		// if the service does not allow anonymous access, we must pass some credentials in the url
		// we can't use the token we already have because it is not authorized for this use
		// instead we want a one time use password that can be used specifically to call this service
		downloadUrl: function(operationId, parameters, reusable) {
			var promise = this.$services.q.defer();
			var self = this;
			var operation = this.$services.swagger.operations[operationId];
			if (operation) {
				var correlationId = null;
				// if we don't have these markings, we can't use otp
				if (operation["x-temporary-id"] && operation["x-temporary-secret"]) {
					if (reusable) {
						this.ltp(operationId).then(function(result) {
							if (result.authenticationId) {
								var cloned = {};
								nabu.utils.objects.merge(cloned, parameters);
								cloned[operation["x-temporary-id"]] = result.authenticationId;
								cloned[operation["x-temporary-secret"]] = result.secret;
								promise.resolve(self.$services.swagger.parameters(operationId, cloned).url);
							}
							else {
								promise.reject();
							}
						});
					}
					else {
						if (operation["x-temporary-correlation-id"]) {
							correlationId = parameters[operation["x-temporary-correlation-id"]];
						}
						this.$services.swagger.execute("nabu.cms.core.v2.security.web.otp", {
							serviceId: operationId,
							correlationId: correlationId
						}).then(function(result) {
							if (result.authenticationId) {
								var cloned = {};
								nabu.utils.objects.merge(cloned, parameters);
								cloned[operation["x-temporary-id"]] = result.authenticationId;
								cloned[operation["x-temporary-secret"]] = result.secret;
								promise.resolve(self.$services.swagger.parameters(operationId, cloned).url);
							}
							else {
								promise.reject();
							}
						}, promise);
					}
				}
				// just resolve it without anything special
				else {
					promise.resolve(self.$services.swagger.parameters(operationId, parameters).url);
				}
			}
			else {
				promise.reject();
			}
			return promise;
		},
		loadCan: function(permissions) {
			var self = this;
			nabu.utils.arrays.merge(self.permissionsToCheck, permissions);
			if (self.canTimer) {
				clearTimeout(self.canTimer);
				self.canTimer = null;
			}
			if (self.permissionsToCheck.length) {
				if (!self.permissionCheckPromise) {
					self.permissionCheckPromise = this.$services.q.defer();
				}
				var waitAndGo = function() {
					self.canTimer = setTimeout(function() {
						self.batchWaiting = false;
						self.permissionBeingCheckedPromise = self.permissionCheckPromise;
						self.permissionCheckPromise = null;
						nabu.utils.arrays.merge(self.permissionsBeingChecked, self.permissionsToCheck.splice(0));
						if (self.permissionsBeingChecked.length) {
							self.$services.swagger.execute("nabu.cms.core.v2.security.shared.can", {
								body: {
									permissions: self.permissionsBeingChecked
								}
							}).then(function(result) {
								self.permissionsBeingChecked.splice(0);
								if (result.allowed) {
									nabu.utils.arrays.merge(self.allowedPermissions, result.allowed);
								}
								if (result.disallowed) {
									nabu.utils.arrays.merge(self.disallowedPermissions, result.disallowed);
								}
								self.permissionBeingCheckedPromise.resolve(result);
								self.permissionBeingCheckedPromise = null;
							}, function(error) {
								self.permissionsBeingChecked.splice(0);
								self.permissionBeingCheckedPromise.reject(error);
								self.permissionBeingCheckedPromise = null;
							});
						}
						else {
							self.permissionBeingCheckedPromise.resolve();
							self.permissionBeingCheckedPromise = null;
						}
					}, 50);
				}
				// if we are already doing a can check, wait until it returns so we don't have parallel checks
				if (self.permissionBeingCheckedPromise) {
					if (!self.batchWaiting) {
						self.permissionBeingCheckedPromise.then(waitAndGo, waitAndGo);
						self.batchWaiting = true;
					}
				}
				else {
					waitAndGo();
				}
				return this.permissionCheckPromise;
			}
			else {
				return this.$services.q.resolve();
			}
		},
		cant: function(permission, context, serviceContext) {
			var promise = this.$services.q.defer();
			this.can(permission, context, serviceContext).then(function(allowed) {
				promise.reject(allowed);
			}, function(disallowed) {
				promise.resolve(disallowed);
			})
			return promise;
		},
		// checks one or more permissions
		// you can send an object or an array of objects where each object has:
		// - context: e.g. the node id
		// - name: the permission name
		// you can also send "name" as the first parameter and context as the second
		can: function(permission, context, serviceContext, cachedOnly) {
			var self = this;
			var sameServiceContext = function(a, b) {
				if (a == null) {
					a = "default";
				}
				if (b == null) {
					b = "default";
				}
				return a == b;
			}
			// allow string based parameters
			if (typeof(permission) == "string") {
				permission = {
					name: permission,
					context: context,
					serviceContext: serviceContext
				};
			}
			if (permission != null) {
				if (!(permission instanceof Array)) {
					permission = [permission];
				}
				var calculateKey = function(permission) {
					return (permission.name ? permission.name : "no-name") + "::"
						+ (permission.context ? permission.context : "no-context") + "::"
						+ (permission.serviceContext ? permission.serviceContext : "default");
				}
				
				// remove doubles from the requested permissions
				if (permission.length > 1) {
					var uniquePermissions = {};
					permission.forEach(function(x) {
						var key = calculateKey(x);
						uniquePermissions[key] = x;
					});
					permission = Object.values(uniquePermissions);
				}
				
				// if we want to check permissions
				if (permission.length) {
					var allowed = [];
					var disallowed = [];
					// first check the already resolved permissions, we might be able to send back an answer immediately
					
					// we check the disallowed first because if _any_ requested are disallowed, the promise is rejected
					this.disallowedPermissions.forEach(function(cache) {
						for (var i = 0; i < permission.length; i++) {
							var toCheck = permission[i];
							if (sameServiceContext(cache.serviceContext, toCheck.serviceContext) && cache.name == toCheck.name && cache.context == toCheck.context) {
								disallowed.push(toCheck);
								permission.splice(i, 1);
								break;
							}
						}
					});
					if (disallowed.length) {
						return this.$services.q.reject(disallowed);
					}
					// check if any are known to be allowed
					if (permission.length) {
						this.allowedPermissions.forEach(function(cache) {
							for (var i = 0; i < permission.length; i++) {
								var toCheck = permission[i];
								if (sameServiceContext(cache.serviceContext, toCheck.serviceContext) && cache.name == toCheck.name && cache.context == toCheck.context) {
									allowed.push(toCheck);
									permission.splice(i, 1);
									break;
								}
							}
						});
					}
					// if we get here and no permissions remain, we assume you are allowed
					if (!permission.length) {
						return this.$services.q.resolve(allowed);
					}
					// we need to do a rest call to check them
					else if (!cachedOnly) {
						// we need to check that the permission is not already queued for checking or actually being checked right now
						if (this.permissionCheckPromise) {
							var keysToCheck = this.permissionsToCheck.map(function(x) {
								return calculateKey(x);
							});
							var permissionsInToCheck = permission.filter(function(x) {
								return keysToCheck.indexOf(calculateKey(x)) >= 0;
							});
							// if there are permissions in the current promise, we wait for that one, even if it is not all permissions
							// other permission checks might be chained later
							if (permissionsInToCheck.length) {
								var promise = this.$services.q.defer();
								this.permissionCheckPromise.then(function() {
									// recheck the permission now that it has been persisted
									self.can(permission)
										.then(promise, promise);
								}, promise);
								return promise;
							}
						}
						if (this.permissionBeingCheckedPromise) {
							var keysBeingChecked = this.permissionsBeingChecked.map(function(x) {
								return calculateKey(x);
							});
							var permissionsInBeingChecked = permission.filter(function(x) {
								return keysBeingChecked.indexOf(calculateKey(x)) >= 0;
							});
							if (permissionsInBeingChecked.length) {
								var promise = this.$services.q.defer();
								this.permissionBeingCheckedPromise.then(function() {
									// recheck the permission now that it has been persisted
									self.can(permission)
										.then(promise, promise);
								}, promise);
								return promise;
							}
						}
						
						var promise = this.$services.q.defer();
						// any actually resolved permissions are rechecked only against the cache
						this.loadCan(permission).then(function() {
							// recheck the permission now that it has been persisted
							self.can(permission, null, null, true)
								.then(promise, promise);
						}, promise);
						return promise;
					}
				}
			}
			// nothing to resolve
			return this.$services.q.reject();
		},
		// get a valid ltp for an operation
		ltp: function(operationId) {
			var promise = this.$services.q.defer();
			// currently hardcoded, at some point configurable
			var maxDuration = "P1D";
			var minDuration = "PT12H";
			var date = new Date();
			if (this.ltpStorage[operationId]) {
				var useUntil = nabu.utils.dates.addDuration(minDuration, this.ltpStorage[operationId].requested);
				if (useUntil.getTime() >= date.getTime()) {
					this.ltpStorage[operationId].promise.then(promise);
					return promise;
				}
			}
			var self = this;
			this.ltpStorage[operationId] = {
				requested: date,
				promise: this.$services.swagger.execute("nabu.cms.core.v2.security.web.ltp", {
						serviceId: operationId,
						duration: maxDuration
					}).then(function(x) {
						if (x && x.authenticationId) {
							self.ltpStorage[operationId].authorization = x;
							promise.resolve(x);
						}
						else {
							promise.reject();
						}
					}, promise)
			}
			return promise;
		},
		addContextualRoles: function(context, role) {
			if (!this.contextualRoles[context]) {
				Vue.set(this.contextualRoles, context, []);
			}
			var self = this;
			if (!(role instanceof Array)) {
				role = [role];
			}
			role.forEach(function(x) {
				if (self.contextualRoles[context].indexOf(x) < 0) {
					self.contextualRoles[context].push(x);
				}
			});
		},
		impersonate: function(userId) {
			var promise = this.$services.q.defer();
			var self = this;
			this.$services.swagger.execute("nabu.cms.core.v2.security.web.impersonate", {userId: userId}).then(function(result) {
				if (result) {
					self.bearer = null;
					self.$services.swagger.bearer = null;
					self.roles.splice(0);
					self.permissions.splice(0);
					if (result) {
						self.bearer = result.token;
						// set the bearer token for the swagger client if we have a jwt token
						self.$services.swagger.bearer = result.token;
						self.language = result.language;
						if (result.roles) {
							nabu.utils.arrays.merge(self.roles, result.roles);
						}
						if (result.permissions) {
							nabu.utils.arrays.merge(self.permissions, result.permissions);
						}
					}
					self.$services.$clear().then(function() {
						promise.resolve(result);
					}, promise);
				}
				else {
					promise.reject();
				}
			}, promise);
			return promise;
		},
		login: function(username, password, remember, type, attemptRedirect) {
			var self = this;
			var promise = this.$services.q.defer();
			// if we are logged in, unset the swagger bearer so we can make the call without being logged in
			// this is more expedient than triggering a logout immediately
			// if the new login fails however, we do want to trigger a logout to get everything set up correctly
			if (this.loggedIn) {
				self.$services.swagger.bearer = null;
			}
			this.$services.swagger.execute("nabu.cms.core.v2.security.web.login", { 
				body: {
					authenticationId: username,
					secret: password,
					type: type ? type : "password"
				},
				remember: remember ? remember : false,
				$$skipRemember: true
			}).then(function(result) {
				// if we received a challenge, we need to continue
				if (result && result.challengeType) {
					promise.resolve(result);
					return;
				}
				
				self.bearer = null;
				self.$services.swagger.bearer = null;
				self.roles.splice(0);
				self.permissions.splice(0);
				if (result) {
					self.bearer = result.token;
					// set the bearer token for the swagger client if we have a jwt token
					self.$services.swagger.bearer = result.token;
					self.language = result.language;
					if (result.roles) {
						nabu.utils.arrays.merge(self.roles, result.roles);
					}
					if (result.permissions) {
						nabu.utils.arrays.merge(self.permissions, result.permissions);
					}
				}
				self.$services.$clear().then(function() {
					promise.resolve(result);
				}, promise);
				if (attemptRedirect) {
					var url = localStorage.getItem("redirect-to");
					if (url) {
						localStorage.removeItem("redirect-to");
						var redirected = false;
						if (self.$services.router && self.$services.router.router && self.$services.router.router.findRoute) {
							var current = null;
							// we want to try to do an internal redirect rather than triggering a full browser redirect
							var parsed = new URL(url);
							// check for actual data route
							if (self.$services.router.router.useHash) {
								current = self.$services.router.router.findRoute(parsed.hash && parsed.hash.length > 1 ? parsed.hash.substring(1) : "/");
							}
							else {
								current = self.$services.router.router.findRoute(self.$services.router.router.localizeUrl(parsed.pathname ? parsed.pathname + parsed.search : "/"));
							}
							if (current && current.route && current.route.alias) {
								// we only support parents at this point
								if (self.$services.router.router.useParents) {
									redirected = true;
									self.$services.router.router.route(current.route.alias, current.parameters);
								}
							}
						}
						if (!redirected) {
							window.location = url;
						}
					}
					else {
						self.$services.router.route("home");
					}
				}
			}, function(error) {
				if (self.loggedIn) {
					self.$services.swagger.bearer = self.bearer;
					self.logout();
				}
				promise.reject(error);
				// better to feed it back to the user in situ!
				//if (attemptRedirect) {
				//	self.$services.router.route("error", {message: "Could not log in"});
				//}
			});
			return promise;
		},
		logout: function() {
			var self = this;
			var promise = this.$services.q.defer();
			this.$services.swagger.execute("nabu.cms.core.v2.security.web.logout", {$$skipRemember: true}).then(function(result) {
				self.bearer = null;
				self.roles.splice(0);
				self.permissions.splice(0);
				self.allowedPermissions.splice(0);
				self.disallowedPermissions.splice(0);
				if (result && result.roles) {
					nabu.utils.arrays.merge(self.roles, result.roles);
				}
				if (result && result.permissions) {
					nabu.utils.arrays.merge(self.permissions, result.permissions);
				}
				self.$services.swagger.bearer = null;
				self.language = null;
				// clear anything that might have stored up data
				self.$services.$clear().then(function() {
					promise.resolve();
				}, promise);
			}, promise);
			return promise;
		},
		remember: function() {
			var self = this;
			// @2024-06-29
			// if we were logged in but are triggering the remember, our token probably expired
			// the likelihood that our actual security rules changed at around the same time are small
			// so we actually skip the clear routine because it is pretty heavy
			var wasLoggedIn = self.bearer != null;
			var promise = this.$services.q.defer();
			if (this.remembering) {
				promise.reject();
			}
			else {
				this.remembering = true;
				// the remember can be triggered for two reasons:
				// initial startup, the application wants to check if the server knows who you are, but more importantly: the frontend doesn't know yet
				// the user walks away from his desk or the server is rebooted or the user gets directed to another server in the cluster and it doesn't know who you are
				// however, the frontend does, if the remember returns the same information we already knew, don't $clear() everything, nothing has actually changed
				this.$services.swagger.execute("nabu.cms.core.v2.security.web.remember", {$$skipRemember: true}).then(function(result) {
					if (result) {
						self.bearer = result.token;
						// set the bearer token for the swagger client if we have a jwt token
						self.$services.swagger.bearer = result.token;
						self.language = result.language;
						self.roles.splice(0);
						self.permissions.splice(0);
						if (result.roles) {
							nabu.utils.arrays.merge(self.roles, result.roles);
						}
						if (result.permissions) {
							nabu.utils.arrays.merge(self.permissions, result.permissions);
						}
						// only do a clear if we actually got remembered, otherwise nothing likely changed!
						if (result.token) {
							if (!wasLoggedIn) {
								self.$services.$clear().then(function() {
									promise.resolve(result);
									self.remembering = false;
								}, promise);
							}
							else {
								promise.resolve(result);
								self.remembering = false;
							}
						}
						else {
							promise.reject(result);
							self.remembering = false;
						}
					}
					else {
						promise.reject(result);
						self.remembering = false;
					}
				}, function(error) {
					// we don't trigger a clear, the remember failed so you are presumably still not logged in
					promise.reject(error);
					self.remembering = false;
				});
			}
			return promise;
		},
		hasContextualRole: function(context) {
			if (this.contextualRoles[context]) {
				for (var i = 1; i < arguments.length; i++) {
					if (this.contextualRoles[context].indexOf(arguments[i]) >= 0) {
						return true;
					}
				}
			}
			return false;
		},
		hasRole: function(role, context) {
			// sometimes you might send an empty role (e.g. when you added a role check but forgot to fill it in)
			if (!role) {
				return true;
			}
			if (role == "$user") {
				return !!this.loggedIn;
			}
			else if (role == "$guest") {
				return !this.loggedIn;
			}
			if (context == "this") {
				context = this.application;
			}
			var fullName = (context ? context + ":" : "") + role;
			return this.roles.indexOf(fullName) >= 0;
		},
		hasPermission: function(action, context, serviceContext) {
			if (context == "this") {
				context = this.application;
			}
			return this.normalizedPermissions.filter(function(permission) {
				return (!serviceContext || permission[0] == serviceContext)
					&& (!context || permission[1] == context)
					&& permission[2] == action;
			}).length > 0;
		},
		hasPermissionInContext: function(context, serviceContext) {
			if (context == "this" || !context) {
				context = this.application;
			}
			return this.normalizedPermissions.filter(function(permission) {
				return permission[1] == context
					&& (!serviceContext || permission[0] == serviceContext);
			}).length > 0;
		},
		hasPermissionInServiceContext: function(serviceContext) {
			if (!serviceContext) {
				serviceContext = "default";
			}
			return this.normalizedPermissions.filter(function(permission) {
				return permission[0] == serviceContext;
			}).length > 0;
		},
		// backwards compatible
		hasPotentialRole: function(role, context) {
			return this.hasRole(role, context);
		},
		// backwards compatible
		hasAction: function(action, context) {
			return this.hasPermission(action, context);
		},
		hasPotentialAction: function(action, context) {
			return this.hasPermission(action, context);
		}
	}
});