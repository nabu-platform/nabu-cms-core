nabu.services.VueService(Vue.extend({
	services: ["user", "cookies", "masterdata"],
	data: function() {
		return {
			available: [],
			cookieValue: null
		}
	},
	computed: {
		names: function() {
			return this.available.map(function(x) { return x.name });
		},
		ids: function() {
			return this.available.map(function(x) { return x.id });
		},
		current: {
			get: function() {
				// we first select the name of the language
				var result = null;
				// if we have a language configured for the user in the backend, that wins
				if (this.$services.user.languageId && this.ids.indexOf(this.$services.user.languageId) >= 0) {
					result = this.names[this.ids.indexOf(this.$services.user.languageId)];
				}
				else {
					// otherwise we check the local value if any (comes from a cookie)
					if (this.cookieValue && this.names.indexOf(this.cookieValue) >= 0) {
						result = this.cookieValue;
					}
					else {
						// otherwise we check the browser settings
						var language = navigator.language || navigator.userLanguage;
						var languages = language.split(/[\s]*;[\s]*/);
						for (var i = 0; i < languages.length; i++) {
							if (this.names.indexOf(languages[i]) >= 0) {
								result = languages[i];
								break;
							}
							else if (this.names.indexOf(languages[i].replace(/-.*/, "")) >= 0) {
								result = this.names.indexOf(languages[i].replace(/-.*/, ""));
								break;
							}
						}
						// if we still have no result, take the first language in the dropdown
						if (!result && this.names.length) {
							result = this.names[0];
						}
					}
				}
				// after that we map the name to the object
				for (var i = 0; i < this.available.length; i++) {
					if (this.available[i].name == result) {
						return this.available[i];
					}
				}
				return null;
			},
			set: function(newValue) {
				// first check that it is a valid language (or null)
				if (newValue == null || this.available.indexOf(newValue) >= 0) {
					// if the user is logged in, update his profile
					if (this.$services.user.loggedIn) {
						var self = this;
						this.$services.swagger.execute("nabu.cms.core.rest.user.updateLanguage", { languageId: newValue.id }).then(function() {
							self.$services.user.languageId = newValue.id;
						});
					}
					// otherwise, set it in a cookie
					else {
						this.$services.cookies.set("language", newValue.name, newValue.name ? 365 : -1);
						this.cookieValue = newValue ? newValue.name : null;
					}
					// force a reload to get the new language
					window.location.reload(true);
				}
			}
		}
	},
	activate: function(done) {
		// we inject the languages that exist in the database
		var languages = this.$services.masterdata.list("language");
		if (languages) {
			nabu.utils.arrays.merge(this.available, languages);
		}
		this.cookieValue = this.$services.cookies.get("language");
		done();
	}
}), { name: "nabu.services.cms.Language" });