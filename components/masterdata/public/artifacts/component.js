window.addEventListener("load", function() {
	application.bootstrap(function($services) {
		// ------------------------------- SERVICES
		return $services.$register({
			masterdata: nabu.services.cms.Masterdata
		});
	});
});