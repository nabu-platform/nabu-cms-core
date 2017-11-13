nabu.services.VueService(Vue.extend({
	data: function() {
		return  { 
			state: {
				applications: [],
				realms: [],
				remoteAuthentication: ${json.stringify(structure(remote: configuration("nabu.cms.core.management.security.securityConfiguration")/remoteAuthentication))}
			}
		};
	},
	activate: function(done) {
		var self = this;
		return this.$services.swagger.execute("nabu.cms.core.management.security.rest.masterdata").then(function(masterdata) {
			nabu.utils.arrays.merge(self.state.applications, masterdata.applications);
			nabu.utils.arrays.merge(self.state.realms, masterdata.realms);
			done();
		});
	},
	methods: {
		applications: function() {
			return this.state.applications;
		},
		realms: function() {
			return this.state.realms;
		},
		canRemoteAuthenticate: function(realm) {
			if (this.state.remoteAuthentication instanceof Array) {
				for (var i = 0; i < this.state.remoteAuthentication.length; i++) {
					if (this.state.remoteAuthentication[i].realm == realm) {
						return true;
					}
				}
			}
			return false;
		},
		remoteAuthenticate: function(realm, alias) {
			return this.$services.swagger.parameters("nabu.management.cms.security.remoteAuthenticate", { realm: realm, alias: alias }).url;
		}
	}
}), { name: "nabu.cms.Security" });