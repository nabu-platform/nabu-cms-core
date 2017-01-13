application.services.router.register({
	alias: "masterdataOverview",
	enter: function() {
		return new application.views.MasterdataOverview();
	},
	url: "/cms/masterdata/overview"
});