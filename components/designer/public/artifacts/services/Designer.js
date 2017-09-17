nabu.services.VueService(Vue.extend({
	data: function() {
		return {
			designing: ${be.nabu.eai.repository.EAIResourceRepository.isDevelopment()},
			configuration: null
		}
	},
	activate: function(done) {
		this.configuration = {
			defaultAnchor: "body",
			title: "My Designed Application",
			routes: []
		};
		this.apply();
		done();
	},
	methods: {
		apply: function() {
			// set the page title
			document.title = this.configuration.title;
			
			// set the default anchor for routing
			this.$services.router.router.defaultAnchor = this.configuration.defaultAnchor;
			
			// set a global enter handler for the router that loads child entries
			var originalEnter = this.$services.router.router.enter;

			var self = this;
			console.log("previous enter", this.$services.router.router.enter);
			this.$services.router.router.enter = function(anchor, newRoute, newParameters, oldRoute, oldParameters, newRouteReturn) {
				if (originalEnter) {
					originalEnter(anchor, newRoute, newParameters, oldRoute, oldParameters, newRouteReturn);
				}
				if (newRoute.children) {
					newRouteReturn.then(function() {
						var keys = Object.keys(newRoute.children);
						for (var i = 0; i < keys.length; i++) {
							if (newRoute.children[keys[i]]) {
								self.$services.router.route(newRoute.children[keys[i]].alias, newRoute.children[keys[i]].configuration, keys[i]);
							}
							// if no child registered and we are designing, route a route picker in it
							else if (self.designing) {
								self.$services.router.route("routePicker", {
									anchor: keys[i],
									parent: newRoute
								}, keys[i]);
							}
						}
					});
				}
			};
			
			var originalUnknown = this.$services.router.router.unknown;
			this.$services.router.router.unknown = function(alias, parameters, anchor) {
				if (originalUnknown && anchor != "body") {
					return originalUnknown(alias, parameters, anchor);
				}
			};
		},
		enrichRoute: function(route) {
			var newRoute = {};
			nabu.utils.objects.merge(newRoute, route);
			newRoute.enter = function(parameters, previousRoute, previousParameters, currentRoute) {
				var result = {};
				if (currentRoute.configuration) {
					nabu.utils.objects.merge(result, currentRoute.configuration);
				}
				if (parameters) {
					nabu.utils.objects.merge(result, parameters);
				}
				var component = application.services.router.get(currentRoute.template).component;
				return new component({ data: result });
			};
			return newRoute;
		},
		addRoute: function(parent, anchor, route) {
			// we need to pick up the additional anchors
			var component = this.$services.router.get(route.template).component;
			component = new component({ data: route.configuration });
			var anchors = component.$mount().$el.querySelectorAll("[id]");
			
			route.children = {};
			for (var i = 0; i < anchors.length; i++) {
				var anchor = anchors.item(i);
				route.children[anchor.getAttribute("id")] = null;
			}
			
			this.$services.router.register(this.enrichRoute(route));
			if (!parent) {
				this.configuration.routes.push(route);
				this.$services.router.routeInitial();
			}
			else {
				parent.children[anchor] = route;
				this.$services.router.route(route.alias, route.configuration, anchor);
			}
		}
	}
}), { name: "nabu.design.Designer" });