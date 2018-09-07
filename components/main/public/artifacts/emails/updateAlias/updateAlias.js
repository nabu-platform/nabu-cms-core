if (!nabu) { var nabu = {} }
if (!nabu.views) { nabu.views = {} }
if (!nabu.views.cms) { nabu.views.cms = {} }
if (!nabu.views.cms.emails) { nabu.views.cms.emails = {} }

nabu.views.cms.emails.UpdateAlias = Vue.component("n-cms-email-update-alias", {
	template: "#nabu-cms-email-update-alias",
	props: {
		newAlias: {
			type: String,
			required: true
		},
		link: {
			type: String,
			required: true
		}
	}
});