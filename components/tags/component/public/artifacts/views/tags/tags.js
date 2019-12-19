Vue.view("node-tags", {
	props: {
		nodeId: {
			type: Object,
			required: true
		},
		masterDataCategoryId: {
			type: String,
			required: true
		}
	},
	data: function() {
		return {
			tags: []
		}
	},
	activate: function(done) {
		var self = this;
		this.$services.swagger.execute("nabu.cms.core.components.tags.rest.list", {nodeId: this.nodeId, masterDataCategoryId: this.masterDataCategoryId }).then(function(list) {
			if (list && list.tagIds) {
				nabu.utils.arrays.merge(self.tags, list.tagIds);
			}
			done();
		});
	}
});

Vue.view("node-tags-editor", {
	props: {
		nodeId: {
			type: Object,
			required: true
		},
		masterDataCategoryId: {
			type: String,
			required: true
		}
	},
	data: function() {
		return {
			setTags: [],
			allTags: [],
			showAvailable: false
		}
	},
	computed: {
		availableTags: function() {
			var result = [];
			nabu.utils.arrays.merge(result, this.allTags);
			this.setTags.forEach(function(x) {
				var index = result.indexOf(x);
				if (index >= 0) {
					result.splice(index, 1);
				}
			});
			return result;
		}
	},
	activate: function(done) {
		var self = this;
		this.$services.swagger.execute("nabu.cms.core.components.tags.rest.list", {nodeId: this.nodeId, masterDataCategoryId: this.masterDataCategoryId }).then(function(list) {
			if (list && list.tagIds) {
				nabu.utils.arrays.merge(self.setTags, list.tagIds);
			}
			var available = self.$services.masterdata.list(self.masterDataCategoryId);
			if (available) {
				nabu.utils.arrays.merge(self.allTags, available.map(function(x) { return x.id }));
			}
			done();
		});
	},
	methods: {
		addTag: function(tag) {
			var self = this;
			var result = [];
			nabu.utils.arrays.merge(result, this.setTags);
			result.push(tag);
			this.$services.swagger.execute("nabu.cms.core.components.tags.rest.update", {
				nodeId: this.nodeId,
				masterDataCategoryId: this.masterDataCategoryId,
				tagIds: result
			}).then(function() {
				self.setTags.push(tag);
			})
		},
		removeTag: function(tag) {
			var self = this;
			var result = [];
			nabu.utils.arrays.merge(result, this.setTags);
			var index = result.indexOf(tag);
			if (index >= 0) {
				result.splice(index, 1);
				this.$services.swagger.execute("nabu.cms.core.components.tags.rest.update", {
					nodeId: this.nodeId,
					masterDataCategoryId: this.masterDataCategoryId,
					tagIds: result
				}).then(function() {
					var index = self.setTags.indexOf(tag);
					if (index >= 0) {
						self.setTags.splice(index, 1);
					}
				})
			}
		}
	}
});