application.views.SecurityMain = Vue.extend({
	template: "#securityMain",
	data: function() {
		return {
			tab: 'roles',
			roles: [],
			actions: [],
			users: [],
			userGroups: [],
			groups: [],
			groupRoles: [],
			actionRoles: [],
			owners: [],
			contexts: [],
			connections: [],
			connection: null,
			dialects: [],
			selectedRoles: []
		};
	},
	activate: function(done) {
		var self = this;
		nabu.utils.ajax({
			url: "${server.root()}api/connection",
			success: function(response) {
				var content = JSON.parse(response.responseText);
				if (content.ids) {
					nabu.utils.arrays.merge(self.connections, content.ids);
				}
				if (content.dialects) {
					nabu.utils.arrays.merge(self.dialects, content.dialects);
				}
				done();
			}
		});
	},
	methods: {
		load: function(connection) {
			var self = this;
			self.groups.splice(0, self.groups.length);
			self.roles.splice(0, self.roles.length);
			self.actions.splice(0, self.actions.length);
			self.actionRoles.splice(0, self.actionRoles.length);
			self.groupRoles.splice(0, self.groupRoles.length);
			self.owners.splice(0, self.owners.length);
			self.contexts.splice(0, self.contexts.length);
			nabu.utils.ajax({
				url: "${server.root()}api/cms/security/all?connectionId=" + connection,
				success: function(response) {
					if (response.responseText) {
						var result = JSON.parse(response.responseText);
						if (result.groups) {
							nabu.utils.arrays.merge(self.groups, result.groups);
						}
						if (result.roles) {
							nabu.utils.arrays.merge(self.roles, result.roles);
						}
						if (result.actions) {
							nabu.utils.arrays.merge(self.actions, result.actions);
						}
						if (result.actionRoles) {
							nabu.utils.arrays.merge(self.actionRoles, result.actionRoles);
						}
						if (result.groupRoles) {
							nabu.utils.arrays.merge(self.groupRoles, result.groupRoles);
						}
						if (result.owners) {
							nabu.utils.arrays.merge(self.owners, result.owners);
						}
					}
				}
			});
		},
		getRoleGroups: function(roleId) {
			var groups = [];
			for (var i = 0; i < this.groupRoles.length; i++) {
				if (this.groupRoles[i].roleId == roleId) {
					groups.push(this.groupRoles[i].groupId);
				}
			}
			return groups;
		},
		deleteGroupFromRole: function(role, groupId) {
			
		}
	},
	watch: {
		connection: function(newValue) {
			if (newValue) {
				this.load(newValue);
			}
		}
	},
	filters: {
		formatOwner: function(ownerId) {
			for (var i = 0; i < this.owners.length; i++) {
				if (this.owners[i].id == ownerId) {
					return this.owners[i].name;
				}
			}
		},
		formatGroup: function(groupId) {
			for (var i = 0; i < this.groups.length; i++) {
				if (this.groups[i].id == groupId) {
					return this.groups[i].name;
				}
			}
			console.log("groups are", this.groups);
		}
	}
});