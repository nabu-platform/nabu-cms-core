nabu.services.VueService(Vue.extend({
	data: function() {
		return {
			resolved: {},
			groupResolver: null,
			roleResolver: null
		}
	},
	created: function() {
		var self = this;
		this.groupResolver = nabu.utils.misc.BatchResolver(
			// resolver
			function(ids) { return self.$services.swagger.execute("nabu.cms.core.manage.security.rest.group.resolve", {ids:ids}) },
			// cacher
			function(key, value) { if (value) self.merge(key, value); return self.resolved[key] },
			// generator
			function(key) { Vue.set(self.resolved, key, {}); return self.resolved[key]; },
			// mapper
			function(result) { return result.id }
		);
		this.roleResolver = nabu.utils.misc.BatchResolver(
			// resolver
			function(ids) { return self.$services.swagger.execute("nabu.cms.core.manage.security.rest.role.resolve", {ids:ids}) },
			// cacher
			function(key, value) { if (value) self.merge(key, value); return self.resolved[key] },
			// generator
			function(key) { Vue.set(self.resolved, key, {}); return self.resolved[key]; },
			// mapper
			function(result) { return result.id }
		);
	},
	computed: {
		hasAccountType: function() {
			return ${application.configuration("nabu.cms.core.manage.security.configuration")/accountTypeId != null};
		}
	},
	methods: {
		resolveGroup: function(id) {
			if (this.resolved[id]) {
				return this.resolved[id];
			}
			return this.groupResolver(id);
		},
		resolveRole: function(id) {
			if (this.resolved[id]) {
				return this.resolved[id];
			}
			return this.roleResolver(id);
		},
		merge: function(key, value) {
			var self = this;
			Object.keys(value).map(function(childKey) {
				Vue.set(self.resolved[key], childKey, value[childKey]);	
			});
		}
	}
}), {name: "nabu.services.cms.Security"});