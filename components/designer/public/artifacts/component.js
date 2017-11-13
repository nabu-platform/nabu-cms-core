window.addEventListener("load", function() {
	application.bootstrap(function($services) {
		$services.router.register({
			priority: -1,
			alias: "designIndex",
			module: "nabu.designer",
			enter: function(parameters) {
				return new nabu.designer.RoutePicker({ data: { anchor: "body" }});
			},
			initial: true
		});
		$services.router.register({
			priority: -1,
			alias: "routePicker",
			module: "nabu.designer",
			enter: function(parameters) {
				return new nabu.designer.RoutePicker({ data: parameters });
			}
		});
		
		// design views
		// SCAFFOLDING
		$services.router.register({
			priority: -1,
			category: "scaffold",
			alias: "border",
			module: "nabu.designer",
			template: true,
			component: nabu.designer.Border
		});
		
		return $services.$register({
			designer: nabu.design.Designer
		});
	});
});