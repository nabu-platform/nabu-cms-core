if (!nabu) { var nabu = {} }
if (!nabu.services) { nabu.services = {} }
if (!nabu.services.cms) { nabu.services.cms = {} }

nabu.services.VueService(Vue.extend({
	services: ["q", "swagger"],
	data: function() {
		return {
			id: null,
			alias: null,
			realm: null,
			language: null,
			oauth2: {},
			roles: ["$guest"],
			actions: [],
			potentialRoles: [],
			potentialActions: [],
			contextualRoles: {},
			remembering: false,
			loggingOut: false,
			// to be consistent with the backend hasRole will by default also allow potential roles
			// as it is currently impossible to validate in which context a potential role becomes active
			// also, role checking is meant as a more coarse grained level of security, use permissions if you want to finetune
			// or alternatively you can turn this off
			allowPotentialRoles: true,
			// this is mostly for GUI switching, you rarely need to distinguish between globally possible actions and contextually so (since you can't deduce for the context)
			allowPotentialActions: true
		}
	},
	computed: {
		loggedIn: function() {
			return this.alias != null;
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
		login: function(username, password, remember, type, force) {
			if (this.loggedIn && !force) {
				var promise = this.$services.q.defer();
				var self = this;
				this.logout().then(function() {
					self.login(username, password, remember, type, true).then(promise, promise);
				});
				return promise;
			}
			else {
				var self = this;
				var promise = this.$services.q.defer();
				this.$services.swagger.execute("nabu.cms.core.login", { 
					body: {
						alias: username,
						password: password,
						remember: remember ? remember : false,
						type: type ? type : "password"
					}})
					.then(function(result) {
						if (result.alias != null) {
							self.id = result.id;
							self.alias = result.alias;
							self.realm = result.realm;
							self.language = result.language;
							self.roles.splice(0, self.roles.length, "$user");
							self.potentialRoles.splice(0, self.roles.length, "$user");
							self.actions.splice(0, self.actions.length);
							self.potentialActions.splice(0, self.potentialActions.length);
							if (result.roles) {
								nabu.utils.arrays.merge(self.roles, result.roles);
							}
							if (result.potentialRoles) {
								nabu.utils.arrays.merge(self.potentialRoles, result.potentialRoles);
							}
							if (result.actions) {
								nabu.utils.arrays.merge(self.actions, result.actions);
							}
							if (result.potentialActions) {
								nabu.utils.arrays.merge(self.potentialActions, result.potentialActions);
							}
							self.$services.$clear().then(function() {
								promise.resolve(result);
							}, promise);
						}
						else {
							promise.resolve(result);
						}
					}, promise);
				return promise;
			}
		},
		logout: function() {
			var self = this;
			var promise = this.$services.q.defer();
			self.loggingOut = true;
			this.$services.swagger.execute("nabu.cms.core.logout").then(function() {
				self.id = null;
				self.alias = null;
				self.realm = null;
				self.language = null;
				self.actions.splice(0, self.actions.length);
				self.potentialActions.splice(0, self.potentialActions.length);
				self.roles.splice(0, self.roles.length, "$guest");
				self.potentialRoles.splice(0, self.roles.length, "$guest");
				self.$services.$clear().then(function() {
					var done = function() {
						promise.resolve();
					};
					// when clearing, remember the new user (even if anonymous) to get the correct roles, oauth settings etc
					self.remember().then(done, done);
					self.loggingOut = false;
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
				this.$services.swagger.execute("nabu.cms.core.remember").then(function(result) {
					var clear = result.alias != self.alias;
					self.id = result.id;
					self.alias = result.alias;
					self.realm = result.realm;
					self.language = result.language;
					self.roles.splice(0, self.roles.length, "$user");
					self.potentialRoles.splice(0, self.roles.length, "$user");
					self.actions.splice(0, self.actions.length);
					self.potentialActions.splice(0, self.potentialActions.length);
					if (result.roles) {
						nabu.utils.arrays.merge(self.roles, result.roles);
					}
					if (result.potentialRoles) {
						nabu.utils.arrays.merge(self.potentialRoles, result.potentialRoles);
					}
					if (result.actions) {
						nabu.utils.arrays.merge(self.actions, result.actions);
					}
					if (result.potentialActions) {
						nabu.utils.arrays.merge(self.potentialActions, result.potentialActions);
					}
					if (result.oauth2) {
						nabu.utils.objects.merge(self.oauth2, result.oauth2);
					}
					if (clear && !self.loggingOut) {
						self.$services.$clear().then(function() {
							promise.resolve();
							self.remembering = false;
						}, promise);
					}
					else {
						promise.resolve();
						self.remembering = false;
					}
				}, function(error) {
					var content = error.responseText ? JSON.parse(error.responseText) : error;
					if (content) {
						if (content.oauth2) {
							nabu.utils.objects.merge(self.oauth2, content.oauth2);
						}
						if (content.roles) {
							nabu.utils.arrays.merge(self.roles, content.roles);
						}
						if (content.actions) {
							nabu.utils.arrays.merge(self.actions, content.actions);
						}
						if (content.language) {
							self.language = content.language;
						}
					}
					promise.reject(error);
					self.remembering = false;
				});
			}
			return promise;
		},
		requestPasswordReset: function(alias) {
			return this.$services.swagger.execute("nabu.cms.core.rest.user.requestPasswordReset", { alias: alias });
		},
		resetPassword: function(userId, verificationCode, newPassword) {
			return this.$services.swagger.execute("nabu.cms.core.rest.user.resetPassword", { userId: userId, body: {
				verificationCode: verificationCode,
				newPassword: newPassword
			}});
		},
		updatePassword: function(oldPassword, newPassword, userId) {
			if (!userId) {
				userId = this.id;
			}
			return this.$services.swagger.execute("nabu.cms.core.rest.user.updatePassword", { userId: userId, body: {
				oldPassword: oldPassword,
				newPassword: newPassword
			}});
		},
		initializePassword: function(userId, verificationCode, newPassword) {
			return this.$services.swagger.execute("nabu.cms.core.rest.user.initializePassword", { userId: userId, body: {
				verificationCode: verificationCode,
				newPassword: newPassword
			}});
		},
		verify: function(userId, verificationCode) {
			return this.$services.swagger.execute("nabu.cms.core.rest.user.verify", { userId: userId, verificationCode: verificationCode });
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
			if (this.allowPotentialRoles) {
				return this.hasPotentialRole.apply(this, arguments);
			}
			return false;
		},
		hasPotentialRole: function() {
			for (var i = 0; i < arguments.length; i++) {
				if (this.potentialRoles.indexOf(arguments[i]) >= 0) {
					return true;
				}
			}
			return false;
		},
		hasAction: function() {
			for (var i = 0; i < arguments.length; i++) {
				if (this.actions.indexOf(arguments[i]) >= 0) {
					return true;
				}
			}
			if (this.allowPotentialActions) {
				return this.hasPotentialAction.apply(this, arguments);
			}
			return false;
		},
		hasPotentialAction: function() {
			for (var i = 0; i < arguments.length; i++) {
				if (this.potentialActions.indexOf(arguments[i]) >= 0) {
					return true;
				}
			}
			return false;
		}
	}
}), { name: "nabu.services.cms.User" });