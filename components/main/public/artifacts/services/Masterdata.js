if (!nabu) { var nabu = {} }
if (!nabu.services) { nabu.services = {} }
if (!nabu.services.cms) { nabu.services.cms = {} }

nabu.services.cms.Masterdata = function Masterdata($services) {
	var self = this;
	
	this.state = {
		masterdata: {
			// ids pending resolution
			idsToResolve: [],
			// the resolution timer
			timer: null,
			// id = record
			resolved: {}
		}
	};
	
${{

configuration = application.configuration("nabu.cms.core.configuration")

stripper = lambda(x, structure(x, created: null, modified: null))
preloaded = series()
for (name : configuration/masterdata/preloadedCategories)
	entries = nabu.cms.core.database.masterdata.entry.selectByCategory(
		connection: configuration/connectionId,
		parameters: structure(name: name))/results
	entries = derive(stripper, entries)
	preloaded = merge(preloaded, structure(
		name: name,
		entries: entries))
echo("	this.preloaded = " + json.stringify(structure(preloaded: preloaded)) + ";\n")

categories = nabu.cms.core.database.masterdata.category.selectAll(application.configuration("nabu.cms.core.configuration")/connectionId)/results
categories = derive(stripper, categories)

echo("	this.categories = " + json.stringify(structure(categories: categories)) + ";\n")
}}

	// make it watchable
	Vue.observe(this.state, true);

	// we can only list preloaded categories, use suggest for other categories	
	this.list = function(name) {
		for (var i = 0; i < this.preloaded.length; i++) {
			if (this.preloaded[i].name == name || this.preloaded[i].id == name) {
				return this.preloaded[i].entries;
			}
		}
		return null;
	}
	
	this.entry = function(category, name) {
		for (var i = 0; i < this.preloaded.length; i++) {
			if (this.preloaded[i].name == category || this.preloaded[i].id == category) {
				for (var j = 0; j < this.preloaded[i].entries.length; j++) {
					if (this.preloaded[i].entries[j].name == name || this.preloaded[i].entries[j].id == name) {
						return this.preloaded[i].entries[j];
					}
				}
			}
		}
		return null;
	}
	
	this.suggest = function(category, suggestion) {
		return $services.swagger.execute("nabu.cms.core.rest.masterdata.category.suggest", {
			categoryId: category,
			q: suggestion
		});
	}
	
	this.resolve = function(masterdataId) {
		// check if we already have it
		if (this.state.masterdata.resolved[masterdataId]) {
			return this.state.masterdata.resolved[masterdataId].name;
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
			var ids = self.state.masterdata.idsToResolve.splice(0, self.state.masterdata.idsToResolve.length);
			if (ids && ids.length) {
				self.state.masterdata.timer = null;
				$services.swagger.execute("nabu.cms.core.rest.masterdata.entry.resolve", { entryId: ids })
					.then(function(result) {
						if (result.entries && result.entries.length) {
							for (var i = 0; i < result.entries.length; i++) {
								nabu.utils.objects.merge(self.state.masterdata.resolved[result.entries[i].id], result.entries[i])
							}
						}
					});
			}
		};
		if (result != null) {
			return result.name;
		}
		// if we did not find a result, ask the server
		// add it to the idsToResolve
		if (this.state.masterdata.idsToResolve.indexOf(masterdataId) < 0) {
			this.state.masterdata.idsToResolve.push(masterdataId);
			// set a value that can be returned and updated later
			Vue.set(this.state.masterdata.resolved, masterdataId, {
				id: "",
				name: ""
			});
			// if there is a timer pending, reset it
			if (this.state.masterdata.timer != null) {
				clearTimeout(this.state.masterdata.timer);
				this.state.masterdata.timer = null;
			}
			// set a timeout
			this.state.masterdata.timer = setTimeout(resolve, 25);
		}
		return this.state.masterdata.resolved[masterdataId].name;
	}
}