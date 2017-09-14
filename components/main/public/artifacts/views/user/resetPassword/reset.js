if (!nabu) { var nabu = {} }
if (!nabu.views) { nabu.views = {} }
if (!nabu.views.cms) { nabu.views.cms = {} }
if (!nabu.views.cms.core) { nabu.views.cms.core = {} }

nabu.views.cms.core.Reset = Vue.component("n-cms-reset", {
	template: "#nabu-cms-core-reset",
	props: {
		route: {
			type: String,
			required: false
		},
		verificationCode: {
			type: String,
			required: true
		},
		userId: {
			type: String,
			required: true
		}
	},
	data: function() {
		return {
			password1: null,
			password2: null,
			working: false,
			valid: false,
			updated: false,
			messages: []
		};
	},
	methods: {
		resetPassword: function() {
			if (this.valid) {
				this.messages.splice(0, this.messages.length);
				this.working = true;
				var self = this;
				this.$services.user.resetPassword(this.userId, this.verificationCode, this.password1).then(
					function(profile) {
						if (self.route) {
							self.$services.router.route(self.route);
						}
						else {
							self.updated = true;
						}
						self.working = false;
					},
					function(error) {
						self.messages.push({
							title: "%{reset:Password reset failed}",
							severity: "error"
						})
						self.working = false;
					});
			}
		},
		validate: function() {
			var messages = this.$refs.form.validate();
			this.valid = messages.length == 0;
			return this.valid;
		}
	}
});