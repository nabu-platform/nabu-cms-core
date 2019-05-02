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
		},
		url: {
			type: String,
			required: false
		},
		useCheckbox: {
			type: Boolean,
			required: false
		},
		handler: {
			type: Function,
			required: false
		}
	},
	computed: {
		oauth2: function() {
			var login = [];
			var self = this;
			if (this.$services.user.oauth2) {
				Object.keys(this.$services.user.oauth2).map(function(provider) {
					login.push({
						provider: provider,
						link: self.$services.user.oauth2[provider]
					})
				})
			}
			return login;
		},
		disableLocalAccounts: function() {
${{
disabled = application.configuration("nabu.cms.core.configuration")/disableLocalAccounts
echo("			return " + when(disabled = null || !disabled, "false", "true") + ";")
}}
		}
	},
	data: function() {
		return {
			username: null,
			password: null,
			remember: true,
			working: false,
			valid: false,
			messages: []
		};
	},
	methods: {
		login: function() {
			if (this.validate(true)) {
				this.messages.splice(0, this.messages.length);
				this.working = true;
				var self = this;
				return this.$services.user.login(this.username, this.password, this.remember || this.alwaysRemember).then(
					function(profile) {
						if (self.url) {
							window.location.href = self.url;
						}
						else if (self.handler) {
							self.handler();
						}
						else {
							self.$services.router.route(self.route);
						}
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
		validate: function(hard) {
			var messages = this.$refs.form.validate(!hard);
			this.valid = messages.length == 0;
			return this.valid;
		}
	}
});