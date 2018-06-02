nabu.services.VueService(Vue.extend({
	data: function() {
		return {
			resolved: {},
			resolver: null
		}
	},
	created: function() {
		var self = this;
		this.resolver = nabu.utils.misc.BatchResolver(
			// resolver
			function(ids) { return self.$services.swagger.execute("nabu.cms.core.manage.node.rest.node.resolve", {ids:ids}) },
			// cacher
			function(key, value) { if (value) self.merge(key, value); return self.resolved[key] },
			// generator
			function(key) { Vue.set(self.resolved, key, {}); return self.resolved[key]; },
			// mapper
			function(result) { return result.id }
		);
	},
	methods: {
		resolve: function(id) {
			// without this, it goes into an infinite resolving loop
			// only if we use the merge() function, if we simply set the full value it doesn't
			if (this.resolved[id]) {
				return this.resolved[id];
			}
			return this.resolver(id);
		},
		merge: function(key, value) {
			var self = this;
			Object.keys(value).map(function(childKey) {
				Vue.set(self.resolved[key], childKey, value[childKey]);	
			});
		}
	}
}), {name: "nabu.services.cms.Node"})