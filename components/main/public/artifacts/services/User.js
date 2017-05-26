if (!nabu) { var nabu = {} }
if (!nabu.services) { nabu.services = {} }
if (!nabu.services.cms) { nabu.services.cms = {} }

nabu.services.cms.User = function User($services) {
	var self = this;
	
	this.state = {
		token: null
	};
	
	// make it watchable
	Vue.observe(this.state, true);

	this.token = function() {
		return this.state.token;
	}
	
	this.login = function(username, password, remember) {
		var self = this;
		return $services.swagger.execute("nabu.cms.core.login", { 
			body: {
				alias: username,
				password: password,
				remember: remember ? remember : false
			}})
			.then(
				function(token) {
					Vue.set(self.state, "token", token);
				}
			);
	}
	
	this.loggedIn = function() {
		return this.state.token != null;
	}
	
	this.logout = function() {
		var self = this;
		return $services.swagger.execute("nabu.cms.core.logout").then(
			function() {
				Vue.set(self.state, "token", null);
				$services.$clear();
			}
		);
	}
	
	this.remember = function() {
		var self = this;
		return $services.swagger.execute("nabu.cms.core.remember").then(
			function(token) {
				Vue.set(self.state, "token", token);
			}
		);
	}
	
	this.$initialize = function() {
		// TODO: register auto-remember on 401!
	}
};