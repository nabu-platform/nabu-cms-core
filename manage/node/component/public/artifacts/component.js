window.addEventListener("load", function() {
	application.bootstrap(function($services) {
		nabu.page.provide("page-format", {
			format: function(id) {
				return $services.node.resolve(id).name;
			},
			name: "node-name",
			namespace: "nabu.cms"
		});
		
		return $services.$register({
			node: nabu.services.cms.Node
		});
	})
});