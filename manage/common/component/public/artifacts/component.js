window.addEventListener("load", function() {
	application.bootstrap(function($services) {
		var applications = ${json.stringify(nabu.web.application.Services.list())};
		nabu.page.provide("page-enumerate", {
			name: "web-applications",
			enumerate: function() {
				return applications.map(function(x) { return x.id });
			}
		})
	});
});