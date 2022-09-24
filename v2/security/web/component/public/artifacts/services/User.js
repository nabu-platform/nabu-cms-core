Vue.service("user", {
	services: ["q", "swagger"],
	data: function() {
		return {
			id: null,
			language: null,
			roles: ["$guest"],
			permissions: [],
			contextualRoles: {},
			remembering: false,
			// we keep track of the token here
			// almost all calls go through the swagger client, which already has the bearer
			// some calls however (like loading the swagger file itself) bypass the swagger client
			bearer: null
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
		login: function(username, password, remember, type) {
			var self = this;
			var promise = this.$services.q.defer();
			this.$services.swagger.execute("nabu.cms.core.v2.security.web.login", { 
				body: {
					authenticationId: username,
					secret: password,
					type: type ? type : "password"
				},
				remember: remember ? remember : false,
				$$skipRemember: true
				})
				.then(function(result) {
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
				}, promise);
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
		hasRole: function() {
			for (var i = 0; i < arguments.length; i++) {
				if (this.roles.indexOf(arguments[i]) >= 0) {
					return true;
				}
			}
			return false;
		},
		hasPermission: function() {
			for (var i = 0; i < arguments.length; i++) {
				if (this.permissions.indexOf(arguments[i]) >= 0) {
					return true;
				}
			}
			return false;
		},
		// backwards compatible
		hasPotentialRole: function() {
			return this.hasRole(arguments);
		},
		// backwards compatible
		hasAction: function() {
			return this.hasPermission(arguments);
		},
		hasPotentialAction: function() {
			return this.hasAction(arguments);
		}
	}
});