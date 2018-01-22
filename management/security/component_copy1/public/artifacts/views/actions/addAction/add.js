application.views.SecurityAddAction = Vue.extend({
	template: "#securityActionAdd",
	data: function() {
		return {
			name: null
		};
	},
	methods: {
		create: function() {
			var self = this;
			this.$services.swagger.execute("nabu.cms.core.management.security.rest.action.create", { connectionId: this.$services.manager.connection(), body: {
				name: self.name
			}}).then(function() {
				self.$resolve();
			})
		}
	}
});