application.views.SecurityRoles = Vue.extend({
	template: "#securityRoles",
	data: function() {
		return {
			roles: [],
			totalPages: 1,
			name: null,
			ids: []
		}
	},
	methods: {
		load: function(page) {
			var self = this;
			return this.$services.swagger.execute("nabu.cms.core.management.security.rest.role.list", { connectionId: this.connection, page: page ? page : 0, name: this.name, ids: this.ids }).then(function(roleList) {
				self.roles.splice(0, self.roles.length);
				if (roleList.roles) {
					nabu.utils.arrays.merge(self.roles, roleList.roles);
				}
				self.totalPages = roleList.page.total;
				self.$refs.paging.set(page ? page : 0);
			});
		},
		loadActions: function(role) {
			var promise = this.$services.q.defer();
			if (role.actions) {
				promise.resolve(role.actions);
			}
			else {
				this.$services.swagger.execute("nabu.cms.core.management.security.rest.role.action.list", { roleId: role.id, connectionId: this.connection }).then(function(actionList) {
					Vue.set(role, "actions", actionList.actions);
					promise.resolve(role.actions);
				}, promise);
			}
			return promise;
		},
		loadGroups: function(role) {
			var promise = this.$services.q.defer();
			if (role.groups) {
				promise.resolve(role.groups);
			}
			else {
				this.$services.swagger.execute("nabu.cms.core.management.security.rest.role.group.list", { roleId: role.id, connectionId: this.connection }).then(function(groupList) {
					Vue.set(role, "groups", groupList.groups);
					promise.resolve(role.groups);
				}, promise);
			}
			return promise;
		},
		addGroup: function(role) {
			
		},
		addAction: function(role) {
			var self = this;
			this.$prompt(function() {
				return new application.views.SecurityActions({ data: { notIds: role.actions ? role.actions.map(function(x) { return x.id }) : null }});
			}).then(function(actions) {
				self.$services.swagger.execute("nabu.cms.core.management.security.rest.role.action.add", { roleId: role.id, actionId: actions.map(function(x) { return x.id }), connectionId: self.connection }).then(function() {
					role.actions = null;
					self.loadActions(role);
				});
			})
		},
		deleteGroup: function(role, group) {
			this.$services.swagger.execute("nabu.cms.core.management.security.rest.role.group.remove", { roleId: role.id, groupRoleId: group.relationId }).then(function() {
				var index = role.groups.indexOf(group);
				if (index >= 0) {
					role.groups.splice(index, 1);
				}
			});
		},
		deleteAction: function(role, action) {
			this.$services.swagger.execute("nabu.cms.core.management.security.rest.role.action.remove", { roleId: role.id, actionId: action.id, connectionId: this.connection }).then(function() {
				var index = role.actions.indexOf(action);
				if (index >= 0) {
					role.actions.splice(index, 1);
				}
			});
		}
	},
	computed: {
		connection: function() {
			return this.$services.manager.connection();
		}
	},
	watch: {
		connection: function() {
			this.load();
		},
		ids: function() {
			this.load();
		}
	}
})