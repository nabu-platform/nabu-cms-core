Vue.service("Language", {
	services: ["user", "cookies"],
	optionalServices: ["environment"],
	data: function() {
		return {
			cookieValue: null
		}
	},
	computed: {
		available: function() {
			var self = this;
			var result = [];
			if (this.$services.environment) {
				var languages = this.$services.environment.get("languages");
				if (languages) {
					languages = languages.entries;
				}
				if (languages) {
					// if you are combining it without optimization, we don't want language entries twice
					if (result.length > 0) {
						languages = languages.filter(function(x) {
							var existing = result.filter(function(y) {
								return y.name == x.name
							})[0];
							return !existing;
						});
					}
					languages.forEach(function(x) {
						if (self.$services.translator) {
							x.label = self.$services.translator.translationFor("language", x.name);
						}
					});
					nabu.utils.arrays.merge(result, languages);
				}
			}
			return result;
		},
		names: function() {
			return this.available.map(function(x) { return x.name });
		},
		current: {
			get: function() {
				// we first select the name of the language
				var result = null;
				// if we have a language configured for the user in the backend, that wins
				if (this.$services.user.language && this.names.indexOf(this.$services.user.language) >= 0) {
					result = this.names[this.names.indexOf(this.$services.user.language)];
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
				// can set a string value
				if (typeof(newValue) == "string") {
					newValue = this.available.filter(function(x) {
						return x.name == newValue;
					})[0];
				}
				// first check that it is a valid language (or null)
				// only trigger if the value was actually changed, otherwise we do reloads etc for nothing
				if (newValue == null || this.available.indexOf(newValue) >= 0 && newValue.name != this.$services.user.language) {
					console.log("Switching language switch from '" + this.$services.user.language + "' to '" + (newValue ? newValue.name : "none") + "'");
					
					// must synchronously update this, because the get() is immediately executed again, if only done async it will re-enforce the old value
					this.$services.user.language = newValue ? newValue.name : null;
					// always set it as a cookie so we know your selection if you are not known to the server (yet) for example before the remember kicks in on a dead session
					this.$services.cookies.set("language", newValue ? newValue.name : "none", newValue && newValue.name ? 365 : -1);
					this.cookieValue = newValue ? newValue.name : null;
					
					// if the user is logged in, update his profile
					if (this.$services.user.loggedIn) {
						var self = this;
						this.$services.swagger.execute("nabu.cms.core.rest.user.updateLanguage", { userId: this.$services.user.id, languageId: newValue ? newValue.id : null }).then(function() {
							self.$services.user.language = newValue ? newValue.name : null;
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
		this.cookieValue = this.$services.cookies.get("language");
		done();
	}
}); 