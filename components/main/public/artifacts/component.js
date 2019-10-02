window.addEventListener("load", function() {
	application.bootstrap(function($services) {
		// ------------------------------- EMAILS
		$services.router.register({
			// must be beyond the initial route that is usually "/.*"
			// you must register an even higher priority to override this one
			priority: 1,
			alias: "email-skeleton",
			module: "nabu.cms",
			enter: function() {
				return new nabu.views.cms.emails.Skeleton();
			},
			initial: true,
			url: "/email/.*"
		})
		$services.router.register({
			priority: -1,
			alias: "email-forgot",
			module: "nabu.cms",
			query: ["verificationCode", "userId"],
			enter: function(parameters) {
				return new nabu.views.cms.emails.Forgot({data: parameters});
			},
			url: "/email/forgot"
		});
		$services.router.register({
			priority: -1,
			alias: "email-verify",
			module: "nabu.cms",
			query: ["verificationCode", "userId", "password", "passwordSet", "route"],
			enter: function(parameters) {
				return new nabu.views.cms.emails.Verify({data: parameters});
			},
			url: "/email/verify"
		});
		$services.router.register({
			priority: -1,
			alias: "email-update-alias",
			module: "nabu.cms",
			query: ["link", "newAlias"],
			enter: function(parameters) {
				return new nabu.views.cms.emails.UpdateAlias({propsData: parameters});
			},
			url: "/email/update-alias"
		});
		
		// ------------------------------- USER login/logout/forget/reset/verify
		$services.router.register({
			priority: -1,
			alias: "login",
			query: ["url", "route"],
			module: "nabu.cms",
			enter: function(parameters) {
				return new nabu.views.cms.core.Login({propsData:parameters});
			},
			url: "/user/login"
		});
			// reusable in other parts
			$services.router.register({
				priority: -1,
				alias: "cms-login",
				query: ["url", "route"],
				module: "nabu.cms",
				enter: function(parameters) {
					return new nabu.views.cms.core.Login({propsData:parameters});
				}
			});
		$services.router.register({
			priority: -1,
			alias: "logout",
			module: "nabu.cms",
			enter: function() {
				$services.user.logout().then(function() {
					$services.router.route("home");
				});
			},
			roles: ["$user"],
			url: "/user/logout"
		});
		$services.router.register({
			priority: -1,
			alias: "forgot",
			module: "nabu.cms",
			query: ["route"],
			enter: function(parameters) {
				return new nabu.views.cms.core.Forgot({propsData:parameters});
			},
			url: "/user/forgot"
		});
			$services.router.register({
				priority: -1,
				alias: "cms-forgot",
				module: "nabu.cms",
				query: ["route"],
				enter: function(parameters) {
					return new nabu.views.cms.core.Forgot({propsData:parameters});
				}
			});
		$services.router.register({
			priority: -1,
			alias: "reset",
			module: "nabu.cms",
			query: ["verificationCode", "userId"],
			enter: function(parameters) {
				return new nabu.views.cms.core.Reset({ propsData: parameters });
			},
			url: "/user/reset"
		});
			$services.router.register({
				priority: -1,
				alias: "cms-reset",
				module: "nabu.cms",
				query: ["verificationCode", "userId"],
				enter: function(parameters) {
					return new nabu.views.cms.core.Reset({ propsData: parameters });
				}
			});
		$services.router.register({
			priority: -1,
			alias: "initialize",
			module: "nabu.cms",
			query: ["verificationCode", "userId"],
			enter: function(parameters) {
				parameters.initialize = true;
				return new nabu.views.cms.core.Reset({ propsData: parameters });
			},
			url: "/user/initialize"
		});
			$services.router.register({
				priority: -1,
				alias: "cms-initialize",
				module: "nabu.cms",
				query: ["verificationCode", "userId"],
				enter: function(parameters) {
					parameters.initialize = true;
					return new nabu.views.cms.core.Reset({ propsData: parameters });
				}
			});
		$services.router.register({
			services: ["user"],
			priority: -1,
			alias: "verify",
			module: "nabu.cms",
			query: ["verificationCode", "userId", "route"],
			enter: function(parameters) {
				if (parameters.verificationCode && parameters.userId) {
					$services.user.verify(parameters.userId, parameters.verificationCode).then(function() {
						$services.router.route(parameters.route ? parameters.route : "login");
					}, function() {
						$services.router.route("error", { message: "%{error:The account could not be verified, perhaps because it is already verified. You could try to <a v-route:login>log in</a>.}" });
					});
				}
				// if we do not have all the parameters, request them
				else {
					return new nabu.views.cms.core.Verify({propsData:parameters});
				}
			},
			url: "/user/verify"
		});
			$services.router.register({
				services: ["user"],
				priority: -1,
				alias: "cms-verify",
				module: "nabu.cms",
				query: ["verificationCode", "userId", "route"],
				enter: function(parameters) {
					if (parameters.verificationCode && parameters.userId) {
						$services.user.verify(parameters.userId, parameters.verificationCode).then(function() {
							$services.router.route(parameters.route ? parameters.route : "login");
						}, function() {
							$services.router.route("error", { message: "%{error:The account could not be verified, perhaps because it is already verified. You could try to <a v-route:login>log in</a>.}" });
						});
					}
					// if we do not have all the parameters, request them
					else {
						return new nabu.views.cms.core.Verify({propsData:parameters});
					}
				}
			});
		$services.router.register({
			priority: -1,
			alias: "update",
			module: "nabu.cms",
			enter: function(parameters) {
				return new nabu.views.cms.core.Update({data:parameters});
			},
			roles: ["$user"],
			url: "/user/update"
		});
			$services.router.register({
				priority: -1,
				alias: "cms-update",
				module: "nabu.cms",
				enter: function(parameters) {
					return new nabu.views.cms.core.Update({data:parameters});
				},
				roles: ["$user"]
			});
		
		// ------------------------------- DEFAULT PAGES
		$services.router.register({
			priority: -1,
			alias: "error",
			module: "nabu.cms",
			enter: function(parameters) {
				return new nabu.views.cms.core.Error({ propsData: parameters });
			},
			url: "/misc/error"
		});
			$services.router.register({
				priority: -1,
				alias: "cms-error",
				module: "nabu.cms",
				query: ["message"],
				enter: function(parameters) {
					return new nabu.views.cms.core.Error({ propsData: parameters });
				}
			});
		$services.router.register({
			priority: -1,
			alias: "notFound",
			module: "nabu.cms",
			enter: function() {
				return "#nabu-cms-core-not-found";
			},
			url: "/misc/notFound"
		});
			$services.router.register({
				priority: -1,
				alias: "cms-notFound",
				module: "nabu.cms",
				enter: function() {
					return "#nabu-cms-core-not-found";
				}
			});
		
		// ------------------------------- PAGE FUNCTIONS
		if (nabu && nabu.page && nabu.page.provide) {
			nabu.page.provide("page-function", {
				id: "cms.login",
				async: true,
				implementation: function(input, $services, $value, resolve, reject) {
					$services.user.login(input.username, input.password, input.remember).then(resolve, reject);
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
				}]
			});
			nabu.page.provide("page-function", {
				id: "cms.logout",
				async: true,
				implementation: function(input, $services, $value, resolve, reject) {
					$services.user.logout().then(resolve, reject);
				},
				inputs: []
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
		
		// ------------------------------- SERVICES
		return $services.$register({
			user: nabu.services.cms.User,
			language: nabu.services.cms.Language
		});
	});
});