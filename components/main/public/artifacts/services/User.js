if (!nabu) { var nabu = {} }
if (!nabu.services) { nabu.services = {} }
if (!nabu.services.cms) { nabu.services.cms = {} }

// TODO: the user language (if any)
// only remember: get back all the redirect uris for all supported oauth2 schemes if you are not logged in
// no additional roundtrip necessary
nabu.services.VueService(Vue.extend({
	data: function() {
		return {
			alias: null,
			realm: null,
			languageId: null,
			oauth2: {},
			roles: ["$guest"],
			actions: []
		}
	},
	computed: {
		loggedIn: function() {
			return this.alias != null;
		}
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
			this.$services.swagger.execute("nabu.cms.core.remember").then(function(result) {
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
		requestPasswordReset: function(alias) {
			return this.$services.swagger.execute("nabu.cms.core.rest.user.requestPasswordReset", { alias: alias });
		},
		resetPassword: function(userId, verificationCode, newPassword) {
			return this.$services.swagger.execute("nabu.cms.core.rest.user.resetPassword", { userId: userId, body: {
				verificationCode: verificationCode,
				newPassword: newPassword
			}});
		},
		verify: function(userId, verificationCode) {
			return this.$services.swagger.execute("nabu.cms.core.rest.user.verify", { userId: userId, verificationCode: verificationCode });
		}
	}
}), { name: "nabu.services.cms.User" });