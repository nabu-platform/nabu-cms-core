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
			remembering: false
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
					if (result.roles) {
						nabu.utils.arrays.merge(self.roles, result.roles);
					}
					if (result.actions) {
						nabu.utils.arrays.merge(self.actions, result.actions);
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
				self.roles.splice(0, self.roles.length, "$guest");
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
					if (result.roles) {
						nabu.utils.arrays.merge(self.roles, result.roles);
					}
					if (result.actions) {
						nabu.utils.arrays.merge(self.actions, result.actions);
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
					promise.reject(error);
					this.remembering = false;
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
		}
	}
}), { name: "nabu.services.cms.User" });