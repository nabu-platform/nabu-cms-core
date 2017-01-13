application.initialize.modules.push(function() {
	var entry = {
		title: "Masterdata",
		handle: function() {
			application.services.router.route("masterdataOverview");
		}
	};
	var found = false;
	for (var i = 0; i < application.services.vue.menu.length; i++) {
		if (application.services.vue.menu[i].title == "CMS") {
			application.services.vue.menu.children.push(entry);
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