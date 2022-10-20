Vue.service("user", {
	services: ["q", "swagger"],
	data: function() {
		return {
			id: null,
			language: null,
			roles: ["$guest"],
			permissions: [],
			contextualRoles: {},
			application: "${environment('webApplicationId')}",
			remembering: false,
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
		downloadUrl: function(operationId, parameters) {
			var promise = this.$services.q.defer();
			var self = this;
			var operation = this.$services.swagger.operations[operationId];
			if (operation) {
				var correlationId = null;
				// if we don't have these markings, we can't use otp
				if (operation["x-temporary-id"] && operation["x-temporary-secret"]) {
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
				//	self.$services.router.route("error", {message: "%{Could not log in}"});
				//}
			});
			return promise;
		},
		logout: function() {
			var self = this;
			var promise = this.$services.q.defer();
			this.$services.swagger.execute("nabu.cms.core.v2.security.web.forget", {$$skipRemember: true}).then(function(result) {
				self.bearer = null;
				self.roles.splice(0);
				self.permissions.splice(0);
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
							self.$services.$clear().then(function() {
								promise.resolve(result);
								self.remembering = false;
							}, promise);
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
			if (context == "this") {
				context = this.application;
			}
			var fullName = (context ? context + ":" : "") + role;
			return this.roles.indexOf(fullName) >= 0;
		},
		hasPermission: function(action, context) {
			if (context == "this") {
				context = this.application;
			}
			var fullName = (context ? context + ":" : "") + action;
			return this.permissions.indexOf(fullName) >= 0;
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