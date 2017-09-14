if (!nabu) { var nabu = {} }
if (!nabu.views) { nabu.views = {} }
if (!nabu.views.cms) { nabu.views.cms = {} }
if (!nabu.views.cms.emails) { nabu.views.cms.emails = {} }

nabu.views.cms.emails.Skeleton = Vue.extend({
	template: "#nabu-cms-email-skeleton"
});