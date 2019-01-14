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
			required: false
		},
		userId: {
			type: String,
			required: true
		},
		// whether this also serves to initially verify the user
		initialize: {
			type: Boolean,
			required: false,
			default: false
		},
		handler: {
			type: Function,
			required: false
		}
	},
	data: function() {
		return {
			password1: null,
			password2: null,
			working: false,
			valid: false,
			updated: false,
			provideVerification: false,
			messages: []
		};
	},
	created: function() {
		this.provideVerification = !this.verificationCode;
	},
	methods: {
		resetPassword: function() {
			if (this.validate(true)) {
				this.messages.splice(0, this.messages.length);
				this.working = true;
				var self = this;
				var func = this.handler;
				if (func == null) {
					func = this.initialize ? this.$services.user.initializePassword : this.$services.user.resetPassword;
				}
				return func(this.userId, this.verificationCode, this.password1).then(
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
							title: self.initialize ? "%{initialize:Password initialization failed}" : "%{reset:Password reset failed}",
							severity: "error"
						})
						self.working = false;
					});
			}
		},
		validatePassword: function(password2) {
			var messages = [];
			if (this.password1 != password2) {
				messages.push({
					soft: true,
					code: "same",
					severity: "error",
					title: "%{reset:The passwords must match}"
				})
			}
			return messages;
		},
		validate: function(hard) {
			var messages = this.$refs.form.validate(!hard);
			this.valid = messages.length == 0;
			this.messages.splice(0, this.messages.length);
			messages = messages.filter(function(x) { return !x.soft });
			if (messages.length) {
				messages.sort(function(a, b) {
					return a.priority - b.priority;
				});
				this.messages.push(messages[0]);
			}
			return this.valid;
		}
	}
});