if (!nabu) { var nabu = {} }
if (!nabu.views) { nabu.views = {} }
if (!nabu.views.cms) { nabu.views.cms = {} }
if (!nabu.views.cms.core) { nabu.views.cms.core = {} }

nabu.views.cms.core.Login = Vue.component("n-view-login", {
	props: {
		aliasLabel: {
			type: String,
			required: false,
			default: "%{user:Your Email}"
		},
		passwordLabel: {
			type: String,
			required: false,
			default: "%{user:Your Password}"
		},
		rememberLabel: {
			type: String,
			required: false,
			default: "%{user:Remember?}"
		},
		loginLabel: {
			type: String,
			required: false,
			default: "%{user:Log In}"
		},
		messages: {
			type: Array,
			required: false,
			default: []
		}
	},
	template: "#nabuCmsCoreLogin",
	data: function() {
		return {
			username: null,
			password: null,
			remember: false,
			working: false,
			valid: false
		};
	},
	methods: {
		login: function() {
			this.messages.splice(0, this.messages.length);
			this.working = true;
			var self = this;
			this.$services.user.login(this.username, this.password, this.remember).then(
				function(profile) {
					self.$emit("login", profile);
					self.working = false;
				},
				function(error) {
					self.$emit("error", error);
					self.working = false;
				});
		},
		validate: function() {
			var messages = this.$refs.form.validate();
			this.valid = messages.length == 0;
			this.$emit("validation", this.valid, messages);
			return this.valid;
		}
	}
});