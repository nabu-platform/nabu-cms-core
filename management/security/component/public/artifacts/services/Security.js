if (!nabu) { var nabu = {} };
if (!nabu.cms) { nabu.cms = {} };

nabu.cms.Security = function Security($services) {
	var self = this;
	
	this.state = {
		applications: [],
		realms: []
	};
	
	Vue.observe(this.state, true);
	
	this.applications = function() {
		return this.state.applications;
	}
	
	this.realms = function() {
		return this.state.realms;
	}
	
	this.$initialize = function() {
		return $services.q.defer($services.swagger.execute("nabu.cms.core.management.security.rest.masterdata").then(function(masterdata) {
			nabu.utils.arrays.merge(self.state.applications, masterdata.applications);
			nabu.utils.arrays.merge(self.state.realms, masterdata.realms);
		}), self);
	}
	
}