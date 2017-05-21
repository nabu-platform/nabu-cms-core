application.configuration.modules.push(function($services) {
	var entry = {
		title: "Masterdata",
		handler: function() {
			$services.router.route("masterdataOverview");
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
	
	$services.router.register({
		alias: "masterdataOverview",
		enter: function() {
			return new application.views.MasterdataOverview();
		},
		url: "/cms/masterdata/overview"
	});
});