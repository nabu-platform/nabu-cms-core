application.configuration.modules.push(function($services) {
	var entry = {
		title: "Auditing",
		handler: function() {
			application.services.router.route("auditingActions");
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
		alias: "auditingActions",
		enter: function(parameters) {
			return new application.views.AuditingActions({data:parameters});
		},
		url: "/auditing/actions"
	});
	
});