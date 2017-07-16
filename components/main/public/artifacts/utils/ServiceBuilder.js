if (!nabu) { var nabu = {} };
if (!nabu.cms) { nabu.cms = {} };

// builds a service in the given object
// the parameters can include:
// - state: internal state that the service starts with, will be watched
// - cache: whether or not the service should perform caching of the returned results
// - list: the service we can use for listing
// - create: the service we can use for creation
// - update: the service to update an item
// - get: the service we can use for getting a single item,
// - delete: the service we can use to delete

nabu.cms.createBasicService = function(instance, $services, parameters) {
	
	// create internal state
	instance.state = parameters && parameters.state ? parameters.state : {};
	
	// if we enable caching, let's create an empty array
	if (parameters.cache) {
		instance.state.$list = [];
		instance.state.$listResolved = false;
		// based on the output of: nabu.services.jdbc.Services.page
		instance.state.$page = {
			current: 0,
			total: 0,
			pageSize: 0,
			rowOffset: 0,
			totalRowCount: 0
		};
	}
	
	// make it watchable
	Vue.observe(instance.state, true);
	
	// add a method to list all the contents
	if (parameters.list) {
		// lists all the items, the parameters can be additional filters etc
		instance.list = function(properties) {
			var promise = $services.q.defer();
			if (parameters.cache && instance.state.$listResolved) {
				promise.resolve(instance.state.$list);
			}
			else {
				$services.swagger.execute(parameters.list, properties).then(function(listWrapper) {
					var list = null;
					// we try to find a list in the wrapper object
					var keys = Object.keys(listWrapper);
					for (var i = 0; i < keys.length; i++) {
						if (list[keys[i]] instanceof Array) {
							list = list[keys[i]];
							break;
						}
					}
					if (list == null) {
						list = [];
					}

					if (parameters.cache) {
						// don't re-resolve even if it is empty unless we encountered a page variable, then we generally do want to reload the list
						instance.state.$listResolved = !listWrapper.page;
						// unless we explicitly tell the system to retain the previous results (eg for 'load more'), discard previous data
						if (!properties.$retain) {
							instance.state.$list.splice(0, instance.state.$list.length);
						}
						// merge the items into the state
						nabu.utils.arrays.merge(instance.state.$list, list);
					}

					// if we have a page variable, get the necessary information
					if (listWrapper.page) {
						nabu.utils.objects.merge(instance.$page, listWrapper.page);
					}
					else {
						// amount of pages
						instance.$page.total = 1;
						instance.$page.pageSize = parameters.cache ? instance.state.$list.length : list.length;
						instance.$page.totalRowCount = instance.$page.pageSize;
						instance.$page.current = 0;
						instance.$page.rowOffset = 0;
					}
					promise.resolve(parameters.cache ? instance.state.$list : list);
				}, promise);
			}
			return promise;
		}
		
		instance.page = function() {
			return instance.state.$page;
		}
	}
	
	if (parameters.create) {
		instance.create = function(properties) {
			// we assume the newly created item is sent back in the same form as the list service
			return $services.swagger.execute(parameters.create, properties).then(function(single) {
				// if we are caching and you have already obtained a list, make sure the newly created item is added to it
				// otherwise it will appear the first time you do a successful list
				if (single && parameters.cache && instance.state.$listResolved) {
					list.push(single);
				}
			});
		}
	}
	
	if (parameters.update) {
		instance.update = function(properties) {
			// we assume the newly created item is sent back in the same form as the list service
			return $services.swagger.execute(parameters.update, properties);
		}
	}
	
	if (parameters.delete) {
		instance.delete = function(properties) {
			// we assume the newly created item is sent back in the same form as the list service
			return $services.swagger.execute(parameters.delete, properties).then(function() {
				var ids = null;
				if (properties.ids) {
					ids = properties.ids instanceof Array ? properties.ids : [properties.ids];
				}
				else if (properties.id) {
					ids = properties.id instanceof Array ? properties.id : [properties.id];
				}
				if (ids != null && parameters.cache) {
					for (var i = parameters.$state.$list.length - 1; i >= 0; i--) {
						var index = ids.indexOf(parameters.$state.$list[i].id);
						if (index >= 0) {
							parameters.$state.$list.splice(i, 1);
						}
					}
				}
			});
		}
	}
	
	if (parameters.get) {
		instance.get = function(properties) {
			// we have a client-side cache, look through that
			if (instance.state.$list.length) {
				var ids = null;
				if (properties.ids) {
					ids = properties.ids instanceof Array ? properties.ids : [properties.ids];
				}
				else if (properties.id) {
					ids = properties.id instanceof Array ? properties.id : [properties.id];
				}
				var result = [];
				for (var i = 0; i < instance.state.$list.length; i++) {
					if (ids.indexOf(parameters.$state.$list[i].id) >= 0) {
						result.push(parameter.$state.$list[i]);
					}
				}
				if (result.length > 0) {
					var promise = $services.q.defer();
					promise.resolve(result.length == 1 ? result[0] : result);
					return promise;
				}
			}
			return $services.swagger.execute(parameters.get, properties);
		}
	}
	
	return instance;
}