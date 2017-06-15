application.views.SecurityUpdatePassword = Vue.extend({
	template: "#securityUpdatePassword",
	data: function() {
		return {
			newPassword1: null,
			newPassword2: null,
			valid: false
		}
	},
	methods: {
		validate: function() {
			this.valid = this.newPassword1 && this.newPassword2 && this.newPassword1 == this.newPassword2;
		}
	}
})