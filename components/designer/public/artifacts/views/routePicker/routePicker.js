if (!nabu) { var nabu = {} }
if (!nabu.designer) { nabu.designer = {} }

nabu.designer.RoutePicker = Vue.extend({
	template: "#nabu-designer-route-picker",
	props: {
		// the anchor this route should be in
		anchor: {
			type: String,
			required: false
		},
		parent: {
			type: Object,
			required: false
		}
	},
	data: function() {
		return {
			routes: [],
			route: null
		}
	},
	computed: {
		labels: function() {
			var labels = [];
			// there is a dedicated category for the initial scaffold when the target is the body
			if (this.anchor == "body") {
				labels.push("scaffold");
			}
			else {
				for (var i = 0; i < this.routes.length; i++) {
					var category = this.routes[i].category ? this.routes[i].category : "other";
					if (labels.indexOf(category) < 0 && category != "scaffold") {
						labels.push(category);
					}
				}
			}
			return labels;
		}
	},
	created: function() {
		nabu.utils.arrays.merge(this.routes, this.$services.router.list().filter(function(route) { return route.template && route.component }));
	},
	methods: {
		getRoutes: function(content, label) {
			var routes = [];
			for (var i = 0; i < this.routes.length; i++) {
				var category = this.routes[i].category ? this.routes[i].category : "other";
				if (label == category) {
					if (!content || !content.trim().length || this.routes[i].alias.toLowerCase().indexOf(content.toLowerCase()) >= 0) {
						routes.push(this.routes[i]);
					}
				}
			}
			return routes;
		},
		register: function() {
			var properties = this.route.properties ? this.route.properties : [];
			if (properties.indexOf("name") < 0 && this.parent) {
				properties.push("name");
			}
			
			var self = this;
			var handler = function(configuration) {
				self.$services.designer.addRoute(self.parent, self.anchor, {
					alias: self.parent ? configuration.name : "index",
					configuration: configuration,
					template: self.route.alias,
					initial: !self.parent
				});
			};
			
			if (properties.length) {
				this.$prompt(function() {
					return new nabu.designer.CreateForm({ data: { properties : properties }});
				}).then(handler);
			}
			else {
				handler({});
			}
		}
	}
})