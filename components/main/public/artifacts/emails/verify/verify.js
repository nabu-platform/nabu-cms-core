if (!nabu) { var nabu = {} }
if (!nabu.views) { nabu.views = {} }
if (!nabu.views.cms) { nabu.views.cms = {} }
if (!nabu.views.cms.emails) { nabu.views.cms.emails = {} }

nabu.views.cms.emails.Verify = Vue.component("n-cms-email-verify", {
	template: "#nabu-cms-email-verify",
	data: function() {
		return {
			userId: null,
			verificationCode: null,
			password: null,
			passwordSet: false,
			route: null
		};
	},
	computed: {
		values: function() {
			return {
				userId: this.userId,
				verificationCode: this.verificationCode,
				route: this.route
			};
		}
	}
});