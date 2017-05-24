application.configuration.modules.push(function($services) {
	var entry = {
		title: "Security",
		handler: function() {
			application.services.router.route("securityMain");
		}
	};
	var menu = $services.manager.findMenu("CMS");
	
	if (!menu) {
		$services.manager.menu({
			title: "CMS",
			actions: [entry]
		});
	}
	else {
		menu.actions.push(entry);
	}
});