application.views.TranslationRefresh = Vue.extend({
	template: "#translationRefresh",
	data: function() {
		return {
			refreshing: false,
			success: false
		}
	},
	mounted: function() {
		this.refresh();
	},
	methods: {
		refresh: function() {
			if (this.$services.manager.connection()) {
				this.refreshing = true;
				var self = this;
				this.$services.swagger.execute("nabu.cms.core.management.translation.rest.translation.refresh", { connection: this.$services.manager.connection()}).then(function() {
					self.success = true;
					self.refreshing = false;
				}, function() {
					self.success = false;
					self.refreshing = false;
				})
			}
		}
	}
})