application.views.SecurityActions = Vue.extend({
	template: "#securityActions",
	data: function() {
		return {
			actions: [],
			totalPages: 1,
			name: null,
			ids: [],
			webApplications: []
		}
	},
	methods: {
		load: function(page) {
			var self = this;
			return this.$services.swagger.execute("nabu.cms.core.management.security.rest.action.list", { connectionId: this.connection, page: page ? page : 0, name: this.name, ids: this.ids }).then(function(actionList) {
				self.webApplications.splice(0, self.webApplications.length);
				self.actions.splice(0, self.actions.length);
				if (actionList.actions) {
					nabu.utils.arrays.merge(self.actions, actionList.actions);
				}
				if (actionList.webApplications) {
					nabu.utils.arrays.merge(self.webApplications, actionList.webApplications);
					self.webApplications.sort();
				}
				self.totalPages = actionList.page.total;
				self.$refs.paging.set(page ? page : 0);
			});
		},
		loadRoles: function(action) {
			var promise = this.$services.q.defer();
			if (action.roles) {
				promise.resolve(action.roles);
			}
			else {
				this.$services.swagger.execute("nabu.cms.core.management.security.rest.action.role.list", { actionId: action.id, connectionId: this.connection }).then(function(roleList) {
					Vue.set(action, "roles", roleList.roles);
					promise.resolve(action.roles);
				}, promise);
			}
			return promise;
		},
		addWebApplication: function() {
			var self = this;
			this.$prompt(function() {
				return new application.views.SecurityActionsAddWebApplication({data: {applications: self.webApplications}});
			}).then(function(application) {
				self.$services.swagger.execute("nabu.cms.core.management.security.rest.action.application.add", { application: application, connectionId: self.connection}).then(function(actionList) {
					if (actionList.actions) {
						self.load();
					}	
				});
			})
		},
		addAction: function() {
			
		},
		addRole: function(action) {
			
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
		toggleAudit: function(action) {
			this.$services.swagger.execute("nabu.cms.core.management.security.rest.action.update", { actionId: action.id, connectionId: this.connection, body: { audit: !action.audit }}).then(function() {
				action.audit = !action.audit;
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