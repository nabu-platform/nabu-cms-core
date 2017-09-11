if (!nabu) { var nabu = {} }
if (!nabu.services) { nabu.services = {} }
if (!nabu.services.cms) { nabu.services.cms = {} }

// TODO: the user language (if any)
// only remember: get back all the redirect uris for all supported oauth2 schemes if you are not logged in
// no additional roundtrip necessary
nabu.services.VueService(function($services) {
	data: function() {
		return {
			token: null
		}
	},
	computed: {
		loggedIn: function() {
			return this.token != null;
		}
	},
	methods: {
		login: function(username, password, remember) {
			var self = this;
			return this.$services.swagger.execute("nabu.cms.core.login", { 
				body: {
					alias: username,
					password: password,
					remember: remember ? remember : false
				}})
				.then(
					function(token) {
						Vue.set(self, "token", token);
					}
				);
		},
		logout: function() {
			var self = this;
			return this.$services.swagger.execute("nabu.cms.core.logout").then(
				function() {
					Vue.set(self, "token", null);
					self.$services.$clear();
				}
			);
		},
		remember: function() {
			var self = this;
			return this.$services.swagger.execute("nabu.cms.core.remember").then(
				function(token) {
					Vue.set(self, "token", token);
				}
			);
		}
	}
}, { name: "nabu.services.cms.User" });