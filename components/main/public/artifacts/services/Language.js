nabu.services.VueService(Vue.extend({
	services: ["user", "cookies"],
	data: function() {
		return {
			available: [],
			cookieValue: null
		}
	},
	computed: {
		current: {
			get: function() {
				var result = null;
				// if we have a language configured for the user in the backend, that wins
				if (this.$services.user.language) {
					result = this.$services.user.language;
				}
				else {
					// otherwise we check the local value if any (comes from a cookie)
					if (this.cookieValue && this.available.indexOf(this.cookieValue) >= 0) {
						result = this.cookieValue;
					}
					else {
						// otherwise we check the browser settings
						var language = navigator.language || navigator.userLanguage;
						var languages = language.split(/[\s]*;[\s]*/);
						for (var i = 0; i < languages.length; i++) {
							if (this.available.indexOf(languages[i]) >= 0) {
								result = languages[i];
								break;
							}
							else if (this.available.indexOf(languages[i].replace(/-.*/, "")) >= 0) {
								result = this.available.indexOf(languages[i].replace(/-.*/, ""));
								break;
							}
						}
						// if we still have no result, take the first language in the dropdown
						if (!result && this.available.length) {
							result = this.available[0];
						}
					}
				}
				return result;
			},
			set: function(newValue) {
				// first check that it is a valid language (or null)
				if (newValue == null || this.available.indexOf(newValue) >= 0) {
					// if the user is logged in, update his profile
					if (this.$services.user.loggedIn) {
						var self = this;
						this.$services.swagger.execute("nabu.cms.core.rest.user.updateLanguage", { language: newValue }).then(function() {
							self.$services.user.language = newValue;
						});
					}
					// otherwise, set it in a cookie
					else {
						this.$services.cookies.set("language", newValue, newValue ? 365 : -1);
						this.cookieValue = newValue ? newValue : null;
					}
					// force a reload to get the new language
					window.location.reload(true);
				}
			}
		}
	},
	created: function() {
		// we inject the languages that exist in the database
		var languages = JSON.parse('${json.stringify(structure(languages: nabu.cms.core.database.masterdata.entry.selectByCategory(application.configuration("nabu.cms.core.configuration")/connectionId, parameters: structure(name: "language"))/results/name))}');
		if (languages) {
			nabu.utils.arrays.merge(this.available, languages);
		}
		this.cookieValue = this.$services.cookies.get("language");
	}
}), { name: "nabu.services.cms.Language", lazy: true });