nabu.services.VueService(Vue.extend({
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
	created: function() {
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
					values: ["id", "name"]
				});
			});
		}	
	},
	computed: {
${{
configuration = application.configuration("nabu.cms.core.configuration")

if (configuration/connectionId != null)
	stripper = lambda(x, structure(x, created: null, modified: null))
	preloaded = series()
	for (name : configuration/masterdata/preloadedCategories)
		entries = nabu.cms.core.database.masterdata.entry.selectByCategory(
			connection: configuration/connectionId,
			parameters: structure(name: name))/results
		entries = nabu.cms.core.services.masterdata.entry.translate(
			connection: configuration/connectionId,
			entries: entries,
			language: application.language(),
			defaultLanguage: configuration/defaultLanguage)/entries
		entries = derive(stripper, entries)
		preloaded = merge(preloaded, structure(
			name: name,
			entries: entries))
	categories = nabu.cms.core.database.masterdata.category.selectAll(configuration/connectionId)/results
	categories = derive(stripper, categories)
else
	preloaded = series()
	categories = series()

echo("		preloaded: function() { return " + json.stringify(structure(preloaded: preloaded)) + "; },\n")
echo("		categories: function() { return " + json.stringify(structure(categories: categories)) + "; }\n")
}}
	},	
	methods: {
		// we can only list preloaded categories, use suggest for other categories	
		list: function(name, q) {
			for (var i = 0; i < this.preloaded.length; i++) {
				if (this.preloaded[i].name == name || this.preloaded[i].id == name) {
					return this.preloaded[i].entries.filter(function(x) {
						return !q || x.label.toLowerCase().indexOf(q.toLowerCase()) >= 0;
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
		
		suggest: function(category, suggestion) {
			return this.$services.swagger.execute("nabu.cms.core.rest.masterdata.category.suggest", {
				categoryId: category,
				q: suggestion
			}, function(x) { return x.entries });
		},
		
		resolve: function(masterdataId) {
			var self = this;
			
			// check if we already have it
			if (this.masterdata.resolved[masterdataId]) {
				return this.masterdata.resolved[masterdataId].label;
			}
			var result = null;
			// check if we have preloaded masterdata
			for (var i = 0; i < this.preloaded.length; i++) {
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
			// the resolving function
			var resolve = function() {
				var ids = self.masterdata.idsToResolve.splice(0, self.masterdata.idsToResolve.length);
				if (ids && ids.length) {
					self.masterdata.timer = null;
					self.$services.swagger.execute("nabu.cms.core.rest.masterdata.entry.resolve", { entryId: ids })
						.then(function(result) {
							if (result.entries && result.entries.length) {
								for (var i = 0; i < result.entries.length; i++) {
									nabu.utils.objects.merge(self.masterdata.resolved[result.entries[i].id], result.entries[i])
								}
							}
						});
				}
			};
			if (result != null) {
				return result.label;
			}
			// if we did not find a result, ask the server
			// add it to the idsToResolve
			if (this.masterdata.idsToResolve.indexOf(masterdataId) < 0) {
				this.masterdata.idsToResolve.push(masterdataId);
				// set a value that can be returned and updated later
				Vue.set(this.masterdata.resolved, masterdataId, {
					id: "",
					label: ""
				});
				// if there is a timer pending, reset it
				if (this.masterdata.timer != null) {
					clearTimeout(this.masterdata.timer);
					this.masterdata.timer = null;
				}
				// set a timeout
				this.masterdata.timer = setTimeout(resolve, 25);
			}
			return this.masterdata.resolved[masterdataId].label;
		}
	}
}), { name: "nabu.services.cms.Masterdata" });