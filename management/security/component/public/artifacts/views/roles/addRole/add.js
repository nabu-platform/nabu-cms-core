application.views.SecurityAddRole = Vue.extend({
	template: "#securityAddRole",
	data: function() {
		return {
			name: null,
			pseudo: false
		};
	},
	methods: {
		create: function() {
			var self = this;
			this.$services.swagger.execute("nabu.cms.core.management.security.rest.role.create", { connectionId: this.$services.manager.connection(), body: {
				pseudo: self.pseudo,
				name: self.name
			}}).then(function() {
				self.$resolve();
			})
		}
	}
});