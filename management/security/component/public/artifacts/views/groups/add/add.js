application.views.SecurityAddGroup = Vue.extend({
	template: "#securityAddGroup",
	data: function() {
		return {
			name: null,
			valid: false
		};
	},
	methods: {
		create: function() {
			if (this.name) {
				var self = this;
				var create = function(ownerId) {
					self.$services.swagger.execute("nabu.cms.core.management.security.rest.group.create", { connectionId: self.$services.manager.connection(), 
						name: self.name,
						ownerId: ownerId ? ownerId : null
					}).then(function() {
						self.$resolve();
					})
				}
				this.$prompt(function() {
					return new application.views.SecurityUsers();
				}).then(function(users) {
					create(users && users.length ? users[0].id : null);
				}, function() {
					create(null);
				});
			}
		},
		validate: function() {
			this.valid = !!this.name;
		}
	}
});
