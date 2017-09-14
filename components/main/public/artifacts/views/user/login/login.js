if (!nabu) { var nabu = {} }
if (!nabu.views) { nabu.views = {} }
if (!nabu.views.cms) { nabu.views.cms = {} }
if (!nabu.views.cms.core) { nabu.views.cms.core = {} }

nabu.views.cms.core.Login = Vue.component("n-cms-login", {
	template: "#nabu-cms-core-login",
	props: {
		alwaysRemember: {
			type: Boolean,
			required: false
		},
		route: {
			type: String,
			required: false,
			default: "home"
		}
	},
	data: function() {
		return {
			username: null,
			password: null,
			remember: false,
			working: false,
			valid: false,
			messages: []
		};
	},
	methods: {
		login: function() {
			if (this.valid) {
				this.messages.splice(0, this.messages.length);
				this.working = true;
				var self = this;
				this.$services.user.login(this.username, this.password, this.remember || this.alwaysRemember).then(
					function(profile) {
						self.$services.router.route(self.route);
						self.working = false;
					},
					function(error) {
						self.messages.push({
							title: "%{login:Login failed}",
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