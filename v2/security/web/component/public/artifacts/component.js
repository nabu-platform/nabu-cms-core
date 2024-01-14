window.addEventListener("load", function() {
	application.bootstrap(function($services) {
		if (nabu && nabu.page && nabu.page.provide) {
			nabu.page.provide("page-function", {
				id: "cms.login",
				async: true,
				implementation: function(input, $services, $value, resolve, reject) {
					$services.user.login(input.username, input.password, input.remember, input.type, true).then(resolve, reject);
				},
				inputs: [{
					"name": "username",
					"required": true,
					"type": "string"
				}, {
					"name": "password",
					"required": true,
					"type": "string"
				}, {
					"name": "remember",
					"type": "boolean"
				}, {
					"name": "type",
					"type": "string"
				}],
				outputs: [{
					"name": "challengeType",
					"required": false,
					"type": "string"
				}, {
					"name": "token",
					"required": false,
					"type": "string"
				}]
			});
			nabu.page.provide("page-function", {
				id: "cms.logout",
				async: true,
				implementation: function(input, $services, $value, resolve, reject) {
					var promise = $services.user.logout();
					if (input.route) {
						var route = function() {
							setTimeout(function() {
								$services.router.route(input.route);
							}, 1);
						}
						if (input.routeImmediately == true || input.routeImmediately == "true") {
							route();
						}
						else {
							promise.then(route, route);
						}
					}
					promise.then(resolve, reject);
				},
				inputs: [{
					"name": "route",
					"required": false,
					"type": "string"
				}, {
					"name": "routeImmediately",
					"required": false,
					"type": "string"
				}]
			});
			nabu.page.provide("page-function", {
				id: "cms.changeLanguage",
				async: false,
				implementation: function(input, $services, $value) {
					$services.language.current = input.language;
				},
				inputs: [{
					"name": "language",
					"required": true,
					"type": "string"
				}]
			});
		}
	});
});