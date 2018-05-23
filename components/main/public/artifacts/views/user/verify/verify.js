if (!nabu) { var nabu = {} }
if (!nabu.views) { nabu.views = {} }
if (!nabu.views.cms) { nabu.views.cms = {} }
if (!nabu.views.cms.core) { nabu.views.cms.core = {} }

nabu.views.cms.core.Verify = Vue.component("n-cms-verify", {
	template: "#nabu-cms-core-verify",
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
			required: false
		}
	},
	data: function() {
		return {
			working: false,
			valid: false,
			updated: false,
			provideVerification: false,
			provideUserId: false,
			messages: []
		};
	},
	created: function() {
		this.provideVerification = !this.verificationCode;
		this.provideUserId = !this.userId;
	},
	methods: {
		verify: function() {
			if (this.validate(true)) {
				this.messages.splice(0, this.messages.length);
				this.working = true;
				var self = this;
				return this.$services.user.verify(this.userId, this.verificationCode).then(
					function(profile) {
						if (self.route) {
							self.$services.router.route(self.route);
						}
						else {
							self.$services.router.route("login");
						}
						self.working = false;
					},
					function(error) {
						self.messages.push({
							title: "%{verify:Verification failed}",
							severity: "error"
						})
						self.working = false;
					});
			}
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