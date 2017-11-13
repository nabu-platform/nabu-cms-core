application.views.MasterdataOverview = Vue.extend({
	template: "#masterdataOverview",
	data: function() {
		return {
			dialect: null,
			categories: [],
			entries: [],
			message: null,
			selectedCategories: [],
			selectedEntries: [],
			currentCategory: null,
			inserts: [],
			allCategories: false,
			allEntries: false
		};
	},
	mounted: function() {
		this.loadCategories();
	},
	methods: {
		addCategory: function() {
			var self = this;
			var value = prompt("Name");
			if (value) {
				nabu.utils.ajax({
					method: "POST",
					url: "${server.root()}api/cms/masterdata/category?connectionId=" + this.$services.manager.connection(),
					data: {
						name: value
					},
					success: function(response) {
						var newItem = JSON.parse(response.responseText);
						self.categories.push(newItem);
						self.loadEntries(newItem);
					}
				});
			}
		},
		addEntry: function() {
			var self = this;
			var value = prompt("Name");
			if (value) {
				nabu.utils.ajax({
					method: "POST",
					url: "${server.root()}api/cms/masterdata/category/" + self.currentCategory.id + "?connectionId=" + this.$services.manager.connection(),
					data: {
						name: value
					},
					success: function(response) {
						var newItem = JSON.parse(response.responseText);
						self.entries.push(newItem);
					}
				});
			}	
		},
		deleteCategories: function() {
			var self = this;
			if (self.selectedCategories.length) {
				nabu.utils.ajax({
					method: "DELETE",
					url: "${server.root()}api/cms/masterdata/category/" + self.selectedCategories[self.selectedCategories.length - 1].id + "?connectionId=" + this.$services.manager.connection(),
					success: function(response) {
						var category = self.selectedCategories.pop();
						if (self.currentCategory && self.currentCategory.id == category.id) {
							self.currentCategory = null;
							self.entries.splice(0, self.entries.length);
						}
						var index = self.categories.indexOf(category);
						if (index >= 0) {
							self.categories.splice(index, 1);
						}
						self.deleteCategories();
					}
				});
			}
			else {
				self.allCategories = false;
			}
		},
		deleteEntries: function() {
			var self = this;
			if (self.selectedEntries.length) {
				nabu.utils.ajax({
					method: "DELETE",
					url: "${server.root()}api/cms/masterdata/entry/" + self.selectedEntries[self.selectedEntries.length - 1].id + "?connectionId=" + this.$services.manager.connection(),
					success: function(response) {
						var entry = self.selectedEntries.pop();
						var index = self.entries.indexOf(entry);
						if (index >= 0) {
							self.entries.splice(index, 1);
						}
						self.deleteEntries();
					}
				});
			}
			else {
				self.allEntries = false;
			}
		},
		selectAllCategories: function() {
			this.allCategories = !this.allCategories;
		},
		selectAllEntries: function() {
			this.allEntries = !this.allEntries;
		},
		clearInserts: function() {
			this.inserts.splice(0, this.inserts.length);	
		},
		buildInserts: function() {
			var self = this;
			nabu.utils.ajax({
				method: "POST",
				url: "${server.root()}api/cms/masterdata/misc/insert?dialect=" + self.dialect,
				data: {
					categories: self.selectedCategories,
					entries: self.selectedEntries
				},
				success: function(response) {
					var content = JSON.parse(response.responseText);
					if (content.inserts) {
						nabu.utils.arrays.merge(self.inserts, content.inserts);
					}
				},
				error: function(response) {
					self.message = "No masterdata for this connection";
				}
			});
		},
		loadEntries: function(category) {
			var self = this;
			self.currentCategory = category;
			self.allEntries = false;
			self.entries.splice(0, self.entries.length);
			nabu.utils.ajax({
				url: "${server.root()}api/cms/masterdata/category/" + category.id,
				parameters: {
					connectionId: this.$services.manager.connection()
				},
				success: function(response) {
					if (response.responseText) {
						var content = JSON.parse(response.responseText);
						if (content.entries) {
							nabu.utils.arrays.merge(self.entries, content.entries);
						}
					}
				},
				error: function(response) {
					self.message = "No masterdata for this connection";
				}
			});
		},
		loadCategories: function() {
			var self = this;
			self.categories.splice(0, self.categories.length);
			self.entries.splice(0, self.entries.length);
			self.message = null;
			if (this.$services.manager.connection()) {
				nabu.utils.ajax({
					url: "${server.root()}api/cms/masterdata/category",
					parameters: {
						connectionId: this.$services.manager.connection()
					},
					success: function(response) {
						var content = JSON.parse(response.responseText);
						if (content.categories) {
							nabu.utils.arrays.merge(self.categories, content.categories);
						}
					},
					error: function(response) {
						self.message = "No masterdata for this connection";
					}
				});
			}
		}
	},
	watch: {
		'$services.manager.state.connection': function(newValue, oldValue) {
			this.loadCategories();
		},
		allCategories: function(newValue, oldValue) {
			var self = this;
			self.selectedCategories.splice(0, self.selectedCategories.length);
			if (newValue) {
				nabu.utils.arrays.merge(self.selectedCategories, self.categories);
			}
		},
		allEntries: function(newValue, oldValue) {
			var self = this;
			self.selectedEntries.splice(0, self.selectedEntries.length);
			if (newValue) {
				nabu.utils.arrays.merge(self.selectedEntries, self.entries);
			}
		}
	}
});