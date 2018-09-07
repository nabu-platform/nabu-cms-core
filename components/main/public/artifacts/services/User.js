if (!nabu) { var nabu = {} }
if (!nabu.services) { nabu.services = {} }
if (!nabu.services.cms) { nabu.services.cms = {} }

// TODO: the user language (if any)
// only remember: get back all the redirect uris for all supported oauth2 schemes if you are not logged in
// no additional roundtrip necessary
nabu.services.VueService(Vue.extend({
	services: ["q", "swagger"],
	data: function() {
		return {
			id: null,
			alias: null,
			realm: null,
			languageId: null,
			oauth2: {},
			roles: ["$guest"],
			actions: [],
			potentialRoles: [],
			potentialActions: [],
			remembering: false,
			// to be consistent with the backend hasRole will by default also allow potential roles
			// as it is currently impossible to validate in which context a potential role becomes active
			// also, role checking is meant as a more coarse grained level of security, use permissions if you want to finetune
			// or alternatively you can turn this off
			allowPotentialRoles: true
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
		login: function(username, password, remember) {
			var self = this;
			var promise = this.$services.q.defer();
			this.$services.swagger.execute("nabu.cms.core.login", { 
				body: {
					alias: username,
					password: password,
					remember: remember ? remember : false
				}})
				.then(function(result) {
					self.id = result.id;
					self.alias = result.alias;
					self.realm = result.realm;
					self.languageId = result.languageId;
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
						promise.resolve();
					}, promise);
				}, promise);
			return promise;
		},
		logout: function() {
			var self = this;
			var promise = this.$services.q.defer();
			this.$services.swagger.execute("nabu.cms.core.logout").then(function() {
				self.id = null;
				self.alias = null;
				self.realm = null;
				self.languageId = null;
				self.actions.splice(0, self.actions.length);
				self.potentialActions.splice(0, self.potentialActions.length);
				self.roles.splice(0, self.roles.length, "$guest");
				self.potentialRoles.splice(0, self.roles.length, "$guest");
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
				this.$services.swagger.execute("nabu.cms.core.remember").then(function(result) {
					var clear = result.alias != self.alias;
					self.id = result.id;
					self.alias = result.alias;
					self.realm = result.realm;
					self.languageId = result.languageId;
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
					if (clear) {
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