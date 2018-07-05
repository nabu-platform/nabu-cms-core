window.addEventListener("load", function() {
	application.bootstrap(function($services) {
		
		var components = ${json.stringify(structure(components: nabu.cms.core.database.component.selectAll()/results))};
		
		nabu.page.provide("page-enumerate", {
			name: "component",
			namespace: "nabu.cms",
			enumerate: function() {
				return components instanceof Array ? components : [];
			},
			label: "name",
			value: "id"
		});
		
		/*
		nabu.page.provide("page-format", {
			format: function(id) {
				return $services.node.resolve(id).name;
			},
			name: "node",
			namespace: "nabu.cms"
		});
		*/
		
		nabu.page.provide("page-format", {
			format: function(id) {
				var component = components.filter(function(x) { return x.id == id})[0];
				return component ? component.name : null;
			},
			name: "component",
			namespace: "nabu.cms"
		});
		
		return $services.$register({
			node: nabu.services.cms.Node
		});
	})
});