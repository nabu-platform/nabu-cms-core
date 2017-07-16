if (!nabu) { var nabu = {} };
if (!nabu.cms) { nabu.cms = {} };

nabu.cms.Security = function Security($services) {
	var self = this;
	
	this.state = {
		applications: [],
		realms: [],
		remoteAuthentication: ${json.stringify(structure(remote: configuration("nabu.cms.core.management.security.securityConfiguration")/remoteAuthentication))}
	};
	
	Vue.observe(this.state, true);
	
	this.applications = function() {
		return this.state.applications;
	}
	
	this.realms = function() {
		return this.state.realms;
	}
	
	this.canRemoteAuthenticate = function(realm) {
		if (this.state.remoteAuthentication instanceof Array) {
			for (var i = 0; i < this.state.remoteAuthentication.length; i++) {
				if (this.state.remoteAuthentication[i].realm == realm) {
					return true;
				}
			}
		}
		return false;
	}
	
	this.remoteAuthenticate = function(realm, alias) {
		return $services.swagger.parameters("nabu.management.cms.security.remoteAuthenticate", { realm: realm, alias: alias }).url;
	}
	
	this.$initialize = function() {
		return $services.q.defer($services.swagger.execute("nabu.cms.core.management.security.rest.masterdata").then(function(masterdata) {
			nabu.utils.arrays.merge(self.state.applications, masterdata.applications);
			nabu.utils.arrays.merge(self.state.realms, masterdata.realms);
		}), self);
	}
	
}