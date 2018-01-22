application.views.SecurityGroups = Vue.extend({
	template: "#securityGroups",
	data: function() {
		return {
			groups: [],
			totalPages: 1,
			name: null,
			ids: []
		}
	},
	methods: {
		load: function(page) {
			var self = this;
			return this.$services.swagger.execute("nabu.cms.core.management.security.rest.group.list", { connectionId: this.connection, page: page ? page : 0, name: this.name, ids: this.ids }).then(function(groupList) {
				self.groups.splice(0, self.groups.length);
				if (groupList.groups) {
					nabu.utils.arrays.merge(self.groups, groupList.groups);
				}
				self.totalPages = groupList.page.total;
				self.$refs.paging.set(page ? page : 0);
			});
		},
		loadUsers: function(group) {
			var promise = this.$services.q.defer();
			if (group.users) {
				promise.resolve(group.users);
			}
			else {
				this.$services.swagger.execute("nabu.cms.core.management.security.rest.group.user.list", { groupId: group.id, connectionId: this.connection }).then(function(userList) {
					Vue.set(group, "users", userList.users);
					promise.resolve(group.users);
				}, promise);
			}
			return promise;
		},
		loadRoles: function(group) {
			var promise = this.$services.q.defer();
			if (group.roles) {
				promise.resolve(group.roles);
			}
			else {
				this.$services.swagger.execute("nabu.cms.core.management.security.rest.group.role.list", { groupId: group.id, connectionId: this.connection }).then(function(roleList) {
					Vue.set(group, "roles", roleList.roles);
					promise.resolve(group.roles);
				}, promise);
			}
			return promise;
		},
		addRole: function(group) {
			var self = this;
			this.$prompt(function() {
				return new application.views.SecurityRoles({ data: { notIds: group.roles ? group.roles.map(function(x) { return x.id }) : [] }});
			}).then(function(roles) {
				self.$prompt(
					function() {
						return new application.views.SecurityNodes();
					}).then(function(nodes) {
					self.$services.swagger.execute("nabu.cms.core.management.security.rest.group.role.add", { groupId: group.id, roleId: roles.map(function(x) { return x.id }), connectionId: self.connection, nodeId: nodes ? nodes.map(function(x) { return x.id }) : [] }).then(function() {
						group.roles = null;
						self.loadRoles(group);
					});
				});
			})
		},
		addGroup: function() {
				var self = this;
				this.$prompt(function() {
					return new application.views.SecurityAddGroup();
				}).then(function() {
					self.load();	
				});
		},
		addUser: function(group) {
			var self = this;
			this.$prompt(function() {
				return new application.views.SecurityUsers({ data: { notIds: group.users ? group.users.map(function(x) { return x.id }) : [] }});
			}).then(function(users) {
				self.$services.swagger.execute("nabu.cms.core.management.security.rest.group.user.invite", { groupId: group.id, userId: users.map(function(x) { return x.id }), connectionId: self.connection }).then(function() {
					group.users = null;
					self.loadUsers(group);
				});
			})
		},
		deleteGroup: function(role, group) {
			this.$services.swagger.execute("nabu.cms.core.management.security.rest.role.group.remove", { roleId: role.id, groupId: group.relationId }).then(function() {
				var index = role.groups.indexOf(group);
				if (index >= 0) {
					role.groups.splice(index, 1);
				}
			});
		},
		deleteUser: function(group, user) {
			this.$services.swagger.execute("nabu.cms.core.management.security.rest.group.user.uninvite", { groupId: group.id, userId: user.id, connectionId: this.connection }).then(function() {
				var index = group.users.indexOf(user);
				if (index >= 0) {
					group.users.splice(index, 1);
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