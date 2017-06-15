application.views.SecurityUsers = Vue.extend({
	template: "#securityUsers",
	data: function() {
		return {
			users: [],
			totalPages: 1,
			name: null,
			ids: [],
			grid: false
		}
	},
	methods: {
		load: function(page) {
			var self = this;
			return this.$services.swagger.execute("nabu.cms.core.management.security.rest.user.list", { connectionId: this.connection, page: page ? page : 0, name: this.name, ids: this.ids }).then(function(userList) {
				self.users.splice(0, self.users.length);
				if (userList.users) {
					nabu.utils.arrays.merge(self.users, userList.users);
				}
				self.totalPages = userList.page.total;
				self.$refs.paging.set(page ? page : 0);
			});
		},
		updatePassword: function(user) {
			var self = this;
			this.$prompt(function() {
				return new application.views.SecurityUpdatePassword();
			}).then(function(password) {
				self.$services.swagger.execute("nabu.cms.core.management.security.rest.user.update", { connectionId: self.connection, userId: user.id, body: { newPassword: password }}).then(function() {
					user.passwordModified = new Date();
				});
			});
		},
		loadGroups: function(user) {
			var promise = this.$services.q.defer();
			if (user.groups) {
				promise.resolve(user.groups);
			}
			else {
				this.$services.swagger.execute("nabu.cms.core.management.security.rest.user.group.list", { userId: user.id, connectionId: this.connection }).then(function(groupList) {
					Vue.set(user, "groups", groupList.groups);
					promise.resolve(user.groups);
				}, promise);
			}
			return promise;
		},
		addGroup: function(role) {
			
		},
		addAction: function(role) {
			
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
			this.$services.swagger.execute("nabu.cms.core.management.security.rest.role.action.remove", { roleId: role.id, actionId: action.id }).then(function() {
				var index = role.actions.indexOf(action);
				if (index >= 0) {
					role.actions.splice(index, 1);
				}
			});
		},
		updateEnabled: function(user) {
			this.$services.swagger.execute("nabu.cms.core.management.security.rest.user.update", { connectionId: this.connection, userId: user.id, body: { enabled: !user.enabled }}).then(function() {
				user.enabled = !user.enabled;	
			});
		},
		verify: function(user) {
			this.$services.swagger.execute("nabu.cms.core.management.security.rest.user.update", { connectionId: this.connection, userId: user.id, body: { verified: true }}).then(function() {
				user.verified = new Date();	
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