/*
window.addEventListener("load", function() {
	application.bootstrap(function($services) {
		nabu.page.provide("page-format", {
			format: function(id) {
				return $services.security.resolveGroup(id).name;
			},
			name: "security-group",
			namespace: "nabu.cms"
		});
		
		nabu.page.provide("page-format", {
			format: function(id) {
				return $services.security.resolveRole(id).name;
			},
			name: "security-role",
			namespace: "nabu.cms"
		});
		
		return $services.$register({
			security: nabu.services.cms.Security
		});
	})
});
*/