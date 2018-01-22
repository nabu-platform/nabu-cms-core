application.services.router.register({
	alias: "securityMain",
	enter: function() {
		return new application.views.SecurityMain();
	},
	url: "/cms/security"
});