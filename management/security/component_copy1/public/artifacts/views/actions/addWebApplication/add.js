application.views.SecurityActionsAddWebApplication = Vue.extend({
	template: "#securityActionsAddWebApplication",
	data: function() {
		return {
			application: null,
			applications: null
		}
	},
	created: function() {
		this.applications = this.$services.security.applications();
	}
});