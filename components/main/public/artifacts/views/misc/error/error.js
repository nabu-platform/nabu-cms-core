if (!nabu) { var nabu = {} }
if (!nabu.views) { nabu.views = {} }
if (!nabu.views.cms) { nabu.views.cms = {} }
if (!nabu.views.cms.core) { nabu.views.cms.core = {} }

nabu.views.cms.core.Error = Vue.component("n-cms-error", {
	template: "#nabu-cms-core-error",
	props: {
		message: {
			type: String,
			required: false
		}
	}
});