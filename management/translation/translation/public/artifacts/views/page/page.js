application.views.TranslationPage = Vue.extend({
	template: "#translationPage",
	props: {
		filter: {
			type: Function,
			required: true
		}	
	},
	data: function() {
		return {
			translated: false,
			language: null,
			languages: [],
			search: null,
			page: {
				current: 0,
				total: 1
			},
			translations: [],
			webApplications: []
		}
	},
	activate: function(done) {
		this.masterdata().then(function() {
			done();
		});
	},
	methods: {
		masterdata: function() {
			var self = this;
			return this.$services.swagger.execute("nabu.cms.core.management.translation.rest.masterdata", { connection: this.$services.manager.connection() }).then(function(masterdata) {
				self.languages.splice(0, self.languages.length);
				if (masterdata && masterdata.languages) {
					nabu.utils.arrays.merge(self.languages, masterdata.languages.map(function(x) { return x.name }));
				}
				self.webApplications.splice(0, self.webApplications.length);
				if (masterdata && masterdata.webApplications) {
					nabu.utils.arrays.merge(self.webApplications, masterdata.webApplications);
				}
			});	
		},
		load: function(page) {
			var self = this;
			if (this.language) {
				return this.filter(this.language, this.translated, this.search, page ? page : 0, this).then(function(resultList) {
					self.translations.splice(0, self.translations.length);
					if (resultList.translations) {
						for (var i = 0; i < resultList.translations.length; i++) {
							resultList.translations[i].working = false;
							if (!resultList.translations[i].translation) {
								resultList.translations[i].translation = null;
							}
						}
						nabu.utils.arrays.merge(self.translations, resultList.translations);
					}
					if (resultList.page) {
						nabu.utils.objects.merge(self.page, resultList.page);
					}
				});
			}
		},
		save: function(translation, newTranslation) {
			translation.working = true;
			return this.$services.swagger.execute("nabu.cms.core.management.translation.rest.translation.merge", { connection: this.$services.manager.connection(), language: this.language, body: translation }).then(function(result) {
				translation.id = result && result.id ? result.id : null;
				translation.working = false;
			}, function() {
				translation.working = false;
			});
		}
	},
	watch: {
		'$services.manager.state.connection': function(newValue) {
			var self = this;
			this.language = null;
			self.translations.splice(0, self.translations.length);
			this.masterdata().then(function() {
				self.load();
			});
		}
	}
})