application.views.SecurityAddUser = Vue.extend({
	template: "#securityAddUser",
	data: function() {
		return {
			alias: null,
			realm: null,
			password1: null,
			password2: null,
			valid: false,
			verified: false,
			sendEmail: false
		}
	},
	methods: {
		validate: function() {
			this.valid = this.alias && this.realm && this.password1 && this.password2 && this.password1 == this.password2;
		},
		create: function() {
			var self = this;
			this.$services.swagger.execute("nabu.cms.core.management.security.rest.user.create", { connectionId: this.$services.manager.connection(), body: {
				alias: self.alias,
				realm: self.realm,
				password: self.password1,
				verified: self.verified,
				sendEmail: self.sendEmail
			}}).then(function() {
				self.$resolve();
			}, function() {
				self.$reject();
			})
		}
	}
})