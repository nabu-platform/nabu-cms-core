application.views.SecurityNodes = Vue.extend({
	template: "#securityNodes",
	data: function() {
		return {
			nodes: [],
			totalPages: 1,
			name: null,
			ids: [],
			selected: []
		}
	},
	methods: {
		load: function(page) {
			var self = this;
			return this.$services.swagger.execute("nabu.cms.core.management.security.rest.node.list", { connectionId: this.connection, page: page ? page : 0, name: this.name, ids: this.ids }).then(function(nodeList) {
				self.nodes.splice(0, self.nodes.length);
				if (nodeList.nodes) {
					nabu.utils.arrays.merge(self.nodes, nodeList.nodes);
				}
				self.totalPages = nodeList.page.total;
				self.$refs.paging.set(page ? page : 0);
			});
		}
	},
	computed: {
		connection: function() {
			return this.$services.manager.connection();
		}
	},
	watch: {
		connection: function() {
			this.load();
		},
		ids: function() {
			this.load();
		}
	}
})