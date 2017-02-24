application.initialize.modules.push(function() {
	var entry = {
		title: "Security",
		handle: function() {
			application.services.router.route("securityMain");
		}
	};
	var found = false;
	for (var i = 0; i < application.services.vue.menu.length; i++) {
		if (application.services.vue.menu[i].title == "CMS") {
			application.services.vue.menu[i].children.push(entry);
			found = true;
			break;
		}	
	}
	if (!found) {
		application.services.vue.menu.push({
			title: "CMS",
			children: [entry]
		});
	}
});