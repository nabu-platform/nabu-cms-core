var Nabue = {
	// the parameters must contain:
	// 		- nodeId
	//		- endpoint (optional), if no endpoint is given it is relative
	//		- view
	node: function(name, parameters) {
		var originalActivate = parameters.activate;
		var endpoint = parameters.endpoint ? parameters.endpoint.replace("[/]+$", "") + "/" : "";
		parameters.activate = function(done) {
			var self = this;
			nabu.utils.ajax({
				method: "GET",
				url: endpoint + "node/" + parameters.nodeId,
				success: function(response) {
					self.node = JSON.parse(response.responseText);
					if (originalActivate) {
						originalActivate(done);
					}
					else {
						done();
					}
				}
			});
		};
		if (!parameters.methods) {
			parameters.methods = {};
		}
		// method to check if the current user is allowed to perform a certain action
		parameters.methods.can = function(action) {
			return this.node && this.node.actions && nabu.utils.arrays.find(this.node.actions, { name: action }) != null;
		};
		return Vue.component(name, parameters);
	},
	list: function(name, parameters) {

	}
};
