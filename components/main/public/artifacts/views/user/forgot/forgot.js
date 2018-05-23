if (!nabu) { var nabu = {} }
if (!nabu.views) { nabu.views = {} }
if (!nabu.views.cms) { nabu.views.cms = {} }
if (!nabu.views.cms.core) { nabu.views.cms.core = {} }

nabu.views.cms.core.Forgot = Vue.component("n-cms-forgot", {
	template: "#nabu-cms-core-forgot",
	props: {
		route: {
			type: String,
			required: false
		}
	},
	data: function() {
		return {
			username: null,
			working: false,
			valid: false,
			messages: [],
			requested: false,
			protocol: 'email'
		};
	},
	computed: {
		supportedProtocols: function() {
			var emailSupported = ${application.configuration("nabu.cms.core.configuration")/emails/smtpClientId != null};
			var textSupported = ${application.configuration("nabu.cms.core.configuration")/texts/textProviderId != null};
			var protocols = [];
			if (emailSupported) {
				protocols.push("email");
			}
			if (textSupported) {
				protocols.push("text");
			}
			return protocols;
		}
	},
	methods: {
		requestPassword: function() {
			if (this.validate(true)) {
				var self = this;
				this.messages.splice(0, this.messages.length);
				this.working = true;
				return this.$services.user.requestPasswordReset(this.username).then(function() {
					if (self.route) {
						self.$services.router.route(self.route);
					}
					// if we sent a text message, redirect to the reset password page where you must enter the code
					else if (self.protocol == 'text') {
						self.$services.router.route("reset");
					}
					self.requested = true;
					self.working = false;
				}, function(error) {
					self.messages.push({
						title: "%{forgot:Password reset request failed}",
						severity: "error"
					})
					self.working = false;
				});
			}
		},
		validate: function(hard) {
			var messages = this.$refs.form.validate(!hard);
			this.valid = messages.length == 0;
			return this.valid;
		}
	}
});