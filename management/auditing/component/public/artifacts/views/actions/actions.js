application.views.AuditingActions = Vue.extend({
	template: "#auditingActions",
	data: function() {
		return {
			audits: [],
			totalPages: 1,
			name: null
		}
	},
	methods: {
		load: function(page) {
			var self = this;
			return this.$services.swagger.execute("nabu.cms.core.management.auditing.rest.audit.list", { connectionId: this.connection, page: page ? page : 0, name: this.name }).then(function(auditList) {
				self.audits.splice(0, self.audits.length);
				if (auditList.audits) {
					nabu.utils.arrays.merge(self.audits, auditList.audits);
				}
				self.totalPages = auditList.page.total;
				self.$refs.paging.set(page ? page : 0);
			});
		},
		loadChanges: function(audit) {
			var promise = this.$services.q.defer();
			if (audit.changes) {
				promise.resolve(audit.changes);
			}
			else {
				this.$services.swagger.execute("nabu.cms.core.management.auditing.rest.audit.change.list", { connectionId: this.connection, auditId: audit.id }).then(function(changeList) {
					Vue.set(audit, "changes", changeList.changes);
					promise.resolve(audit.changes);
				});
			}
			return promise;
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
		}
	}
})