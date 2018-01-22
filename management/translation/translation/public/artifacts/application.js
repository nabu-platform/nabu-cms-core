application.configuration.modules.push(function($services) {
	var entry = {
		title: "Translations",
		actions: [{
			title: "Web Page",
			handler: function() {
				$services.router.route("translationPage");
			}
		}, {
			title: "Masterdata",
			handler: function() {
				$services.router.route("translationMasterdata");
			}
		}, {
			title: "Refresh",
			handler: function() {
				$services.router.route("translationRefresh");
			}
		}]
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
		alias: "translationPage",
		enter: function() {
			var filter = function(language, translated, search, page) {
				return $services.swagger.execute("nabu.cms.core.management.translation.rest.page.list", {
					language: language,
					translated: translated,
					search: search,
					page: page,
					connection: $services.manager.connection()
				});
			}
			return new application.views.TranslationPage({data: { filter: filter }});
		},
		url: "/cms/translation/page"
	});
	
	$services.router.register({
		alias: "translationRefresh",
		enter: function() {
			return new application.views.TranslationRefresh();
		},
		url: "/cms/translation/refresh"
	});
	
	$services.router.register({
		alias: "translationMasterdata",
		enter: function() {
			var filter = function(language, translated, search, page) {
				return $services.swagger.execute("nabu.cms.core.management.translation.rest.page.masterdata", {
					language: language,
					translated: translated,
					search: search,
					page: page,
					connection: $services.manager.connection()
				});
			}
			return new application.views.TranslationPage({data: { filter: filter }});
		},
		url: "/cms/translation/masterdata"
	});
});