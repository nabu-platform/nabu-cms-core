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
					// if the cookie does not match the persisted value, update the cookie
					if (this.cookieValue != result) {
						this.$services.cookies.set("language", result, result ? 365 : -1);
						this.cookieValue = result ? result : null;
					}
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
					// must synchronously update this, because the get() is immediately executed again, if only done async it will re-enforce the old value
					this.$services.user.languageId = newValue ? newValue.id : null;
					// always set it as a cookie so we know your selection if you are not known to the server (yet) for example before the remember kicks in on a dead session
					this.$services.cookies.set("language", newValue ? newValue.name : "none", newValue && newValue.name ? 365 : -1);
					this.cookieValue = newValue ? newValue.name : null;
					
					// if the user is logged in, update his profile
					if (this.$services.user.loggedIn) {
						var self = this;
						this.$services.swagger.execute("nabu.cms.core.rest.user.updateLanguage", { userId: this.$services.user.id, languageId: newValue ? newValue.id : null }).then(function() {
							self.$services.user.languageId = newValue ? newValue.id : null;
							// force a reload to get the new language
							window.location.reload(true);
						});
					}
					else {
						// force a reload to get the new language
						window.location.reload(true);
					}
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