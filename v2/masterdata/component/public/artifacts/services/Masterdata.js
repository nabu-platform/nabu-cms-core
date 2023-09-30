Vue.service("masterdata", {
	optionalServices: ["translator", "environment"],
	data: function() {
		return {
			masterdata: {
				// ids pending resolution
				idsToResolve: [],
				// the resolution timer
				timer: null,
				// id = record
				resolved: {}
			}
		}	
	},
	activate: function(done) {
		var self = this;
		if (nabu.page && nabu.page.provide) {
			nabu.page.provide("page-enumerate", {
				name: "masterdata-categories",
				enumerate: function() {
					return self.categories;
				},
				label: "name",
				value: "id"
			});
			this.preloaded.map(function(preloaded) {
				nabu.page.provide("page-enumerate", {
					name: "masterdata-category-" + preloaded.name,
					enumerate: function() {
						return preloaded.entries;
					},
					label: "name",
					value: "id",
					values: ["id", "name"],
					//labels: ["name", "label"]
					labels: ["name", "title"]
				});
			});
		}
		done();
	},
	computed: {
		preloaded: function() {
			var result = [];
			if (this.$services.environment && this.$services.environment.settings
					&& this.$services.environment.settings.data
					&& this.$services.environment.settings.data.masterdata
					&& this.$services.environment.settings.data.masterdata.categories) {
				nabu.utils.arrays.merge(result, this.$services.environment.settings.data.masterdata.categories);
				
				var self = this;
				result.forEach(function(x) {
					if (x.entries) {
						x.entries.forEach(self.labelize);
					}
				});
			}
			return result;
		},
		// there are very few usecases for this listing except perhaps the suggest
		// on the flipside, there is no configuration of which categories you want to expose and simply exposing all by default is too much information
		// for now, in the new version, we will only populate this based on the preloaded categories
		categories: function() {
			var result = [];
			this.preloaded.forEach(function(x) {
				var existing = result.filter(function(y) {
					return y.name == x.name;
				})[0];
				if (!existing) {
					result.push({
						id: x.id,
						name: x.name
					});
				}
			});
			return result;
		},
	},	
	methods: {
		// add a label if it isn't there yet
		labelize: function(entry) {
			if (!entry.label) {
				// pretty printed
				var defaultValue = entry.name.substring(0, 1).toUpperCase()
					+ entry.name.substring(1).replace(/([A-Z]+)/g, " $1").trim();
				// check if we have a translation
				if (this.$services.translator) {
					entry.label = this.$services.translator.translationFor(entry.id, "name", defaultValue);
				}
				// otherwise, just set the default value
				else {
					entry.label = defaultValue;
				}
			}
		},
		// we can only list preloaded categories, use suggest for other categories	
		list: function(name, q) {
			for (var i = 0; i < this.preloaded.length; i++) {
				if (this.preloaded[i].name == name || this.preloaded[i].id == name) {
					return this.preloaded[i].entries == null ? [] : this.preloaded[i].entries.filter(function(x) {
						return !q || x.name.toLowerCase().indexOf(q.toLowerCase()) >= 0;
					});
				}
			}
			return null;
		},
		category: function(name) {
			for (var i = 0; i < this.categories.length; i++) {
				if (this.categories[i].name == name || this.categories[i].id == name) {
					return this.categories[i];
				}
			};
			return null;
		},
		entry: function(category, name) {
			// if we didn't get a name, we must be searching by id
			if (!name) {
				for (var i = 0; i < this.preloaded.length; i++) {
					if (this.preloaded[i].entries) {
						for (var j = 0; j < this.preloaded[i].entries.length; j++) {
							if (this.preloaded[i].entries[j].id == category) {
								return this.preloaded[i].entries[j];
							}
						}
					}
				}
			}
			else {
				for (var i = 0; i < this.preloaded.length; i++) {
					if (this.preloaded[i].name == category || this.preloaded[i].id == category) {
						if (this.preloaded[i].entries) {
							for (var j = 0; j < this.preloaded[i].entries.length; j++) {
								if (this.preloaded[i].entries[j].name == name || this.preloaded[i].entries[j].id == name) {
									return this.preloaded[i].entries[j];
								}
							}
						}
					}
				}
			}
			return null;
		},
		resolve: function(masterdataId) {
			if (!masterdataId || !masterdataId.match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}|[0-9a-fA-F]{32}/)) {
				return masterdataId;
			}
			var self = this;
			// check if we already have it
			if (this.masterdata.resolved[masterdataId]) {
				return this.masterdata.resolved[masterdataId].title ? this.masterdata.resolved[masterdataId].title : this.masterdata.resolved[masterdataId].name;
			}
			var result = null;
			if (this.preloaded) {
				// check if we have preloaded masterdata
				for (var i = 0; i < this.preloaded.length; i++) {
					if (this.preloaded[i].entries) {
						for (var j = 0; j < this.preloaded[i].entries.length; j++) {
							if (this.preloaded[i].entries[j].id == masterdataId) {
								result = this.preloaded[i].entries[j];
								break;
							}
						}
						if (result != null) {
							break;
						}
					}
				}
			}
			// the resolving function
			var resolve = function() {
				var ids = self.masterdata.idsToResolve.splice(0, self.masterdata.idsToResolve.length);
				if (ids && ids.length) {
					self.masterdata.timer = null;
					self.$services.swagger.execute("nabu.cms.core.v2.masterdata.rest.resolve", { id: ids })
						.then(function(result) {
							if (result.results && result.results.length) {
								result.results.forEach(self.labelize);
								for (var i = 0; i < result.results.length; i++) {
									nabu.utils.objects.merge(self.masterdata.resolved[result.results[i].id], result.results[i])
								}
							}
						});
				}
			};
			if (result != null) {
				return result.title ? result.title : result.name;
			}
			// if we did not find a result, ask the server
			// add it to the idsToResolve
			if (this.masterdata.idsToResolve.indexOf(masterdataId) < 0) {
				this.masterdata.idsToResolve.push(masterdataId);
				// set a value that can be returned and updated later
				Vue.set(this.masterdata.resolved, masterdataId, {
					id: "",
					title: ""
				});
				// if there is a timer pending, reset it
				if (this.masterdata.timer != null) {
					clearTimeout(this.masterdata.timer);
					this.masterdata.timer = null;
				}
				// set a timeout
				this.masterdata.timer = setTimeout(resolve, 25);
			}
			return this.masterdata.resolved[masterdataId].title;
		}
	}
});