if (!nabu) { var nabu = {} }
if (!nabu.views) { nabu.views = {} }
if (!nabu.views.cms) { nabu.views.cms = {} }
if (!nabu.views.cms.core) { nabu.views.cms.core = {} }

nabu.views.cms.core.Loader = Vue.component("n-loader", {
	template: "<span class='n-icon n-icon-spinner n-loader fa spinner' style='display: block; text-align: center; margin: auto;'></span>"
})