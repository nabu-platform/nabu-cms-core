window.addEventListener("load", function() {
	application.bootstrap(function($services) {
		// ------------------------------- EMAILS
		$services.router.register({
			priority: -1,
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
			query: ["verificationCode", "userId", "password"],
			enter: function(parameters) {
				return new nabu.views.cms.emails.Verify({data: parameters});
			},
			url: "/email/verify"
		});
		
		// ------------------------------- USER login/forget/reset/verify
		$services.router.register({
			priority: -1,
			alias: "login",
			module: "nabu.cms",
			enter: function() {
				return new nabu.views.cms.core.Login();
			},
			url: "/user/login"
		});
		$services.router.register({
			priority: -1,
			alias: "forgot",
			module: "nabu.cms",
			enter: function() {
				return new nabu.views.cms.core.Forgot();
			},
			url: "/user/forgot"
		});
		$services.router.register({
			priority: -1,
			alias: "reset",
			module: "nabu.cms",
			query: ["verificationCode", "userId"],
			enter: function(parameters) {
				return new nabu.views.cms.core.Reset({ data: parameters });
			},
			url: "/user/reset"
		});
		$services.router.register({
			services: ["user"],
			priority: -1,
			alias: "verify",
			module: "nabu.cms",
			query: ["verificationCode", "userId"],
			enter: function(parameters) {
				$services.user.verify(parameters.userId, parameters.verificationCode).then(function() {
					$services.router.route("login");
				}, function() {
					$services.router.route("error", { message: "%{error:The account could not be verified, perhaps because it is already verified. You can try to <a v-route:login>log in</a>.}" });
				})
			},
			url: "/user/verify"
		});
		
		// ------------------------------- DEFAULT PAGES
		$services.router.register({
			priority: -1,
			alias: "error",
			module: "nabu.cms",
			enter: function(parameters) {
				return new nabu.views.cms.core.Error({ data: parameters });
			},
			url: "/misc/error"
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
		
		// ------------------------------- SERVICES
		$services.$register({
			user: nabu.services.cms.User,
			masterdata: nabu.services.cms.Masterdata,
			language: nabu.services.cms.Language
		});
	});
});