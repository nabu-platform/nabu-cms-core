application.configuration.modules.push(function($services) {
	var entry = {
		title: "Security",
		actions: [{
			title: "Roles",
			handler: function() {
				application.services.router.route("securityRoles");
			}
		}, {
			title: "Groups",
			handler: function() {
				application.services.router.route("securityGroups");
			}
		}, {
			title: "Users",
			handler: function() {
				application.services.router.route("securityUsers");
			}
		}, {
			title: "Actions",
			handler: function() {
				application.services.router.route("securityActions");
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

	var loadQuickmenu = function() {
		var buttons = [];
		buttons.push({ class: 'n-icon-user', route: "securityUsers", title: "Users" });
		buttons.push({ class: 'n-icon-users', route: "securityGroups", title: "Groups" });
		buttons.push({ class: 'n-icon-gears', route: "securityRoles", title: "Roles" });
		buttons.push({ class: 'n-icon-link', route: "securityActions", title: "Actions" });
		$services.manager.quickmenu(buttons);
	}
	
	$services.router.register({
		alias: "securityRoles",
		enter: function(parameters) {
			loadQuickmenu();
			return new application.views.SecurityRoles({data:parameters});
		},
		url: "/security/roles"
	});
	
	$services.router.register({
		alias: "securityGroups",
		enter: function(parameters) {
			loadQuickmenu();
			return new application.views.SecurityGroups({data:parameters});
		},
		url: "/security/groups"
	});
	
	$services.router.register({
		alias: "securityUsers",
		enter: function(parameters) {
			loadQuickmenu();
			return new application.views.SecurityUsers({data:parameters});
		},
		url: "/security/users"
	});
	
	$services.router.register({
		alias: "securityActions",
		enter: function(parameters) {
			loadQuickmenu();
			return new application.views.SecurityActions({data:parameters});
		},
		url: "/security/actions"
	});
	
	$services.router.register({
		alias: "securityNodes",
		enter: function(parameters) {
			loadQuickmenu();
			return new application.views.SecurityNodes({data:parameters});
		},
		url: "/security/nodes"
	});
	
	return $services.$register({ security: nabu.cms.Security });
});