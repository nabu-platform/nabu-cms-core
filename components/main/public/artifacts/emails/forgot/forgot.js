if (!nabu) { var nabu = {} }
if (!nabu.views) { nabu.views = {} }
if (!nabu.views.cms) { nabu.views.cms = {} }
if (!nabu.views.cms.emails) { nabu.views.cms.emails = {} }

nabu.views.cms.emails.Forgot = Vue.component("n-cms-email-forgot", {
	template: "#nabu-cms-email-forgot",
	data: function() {
		return {
			userId: null,
			verificationCode: null
		};
	},
	computed: {
		values: function() {
			return {
				userId: this.userId,
				verificationCode: this.verificationCode
			};
		}
	}
});