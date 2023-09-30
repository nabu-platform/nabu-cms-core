// this can NOT depend on the language service
// for now, the language service is dependent on masterdata
// and masterdata itself is dependent on translator
// that would create a circular dependency
// and it "should" not be necessary...
Vue.service("translator", {
	// wait for environment to resolve so we get the correct language
	services: ["swagger", "environment"],
	data: function() {
		return {
			translations: []
		}
	},
	activate: function(done) {
		this.loadTranslations().then(done, done);
	},
	switchLanguage: function(done) {
		console.log("Switching language");
		// we need to reload all the contexts we currently have
		var contexts = [];
		this.translations.forEach(function(x) {
			if (contexts.indexOf(x.context) < 0) {
				contexts.push(x.context);
			}
		});
		this.loadTranslations(contexts);
	},
	methods: {
		loadTranslations: function(context, clear) {
			var self = this;
			return this.$services.swagger.execute("nabu.cms.core.v2.translation.list", {context: context}).then(function(result) {
				// remove the translations alltogether, in the future we might want to be more specific and only clear the passed in contexts
				if (clear) {
					self.translations.splice(0);
				}
				if (result && result.translations) {
					nabu.utils.arrays.merge(self.translations, result.translations);
				}
			});	
		},
		translationFor: function(context, name, defaultValue) {
			var term = (context ? context + "::" : "") + name;
			var translation = this.translations.filter(function(x) {
				return x.name == term;
			})[0];
			return translation && translation.translation ? translation.translation : (defaultValue ? defaultValue : name);
		},
		translate: function(value, defaultValue) {
			if (value && value.indexOf) {
				while (value.indexOf("%" + "{") >= 0) {
					var start = value.indexOf("%" + "{");
					var depth = 1;
					var end = -1;
					for (var j = start + 2; j < value.length; j++) {
						if (value.charAt(j) == "{") {
							depth++;
						}
						else if (value.charAt(j) == "}") {
							depth--;
							if (depth == 0) {
								end = j;
								break;
							}
						}
					}
					// no end tag
					if (end < 0) {
						break;
					}
					var available = value.substring(start + 2, end);
					// we combine the previous context & name into a single "::" separated string in the translation table as well
					var translation = this.translations.filter(function(x) {
						return x.name == available;
					})[0];
					var translatedString = translation ? translation.translation : null;
					// a provided default
					if (!translatedString && defaultValue) {
						translatedString = defaultValue;
					}
					// the string itself
					if (!translatedString) {
						// anything before the :: is meant to indicate context
						var parts = available.split("::");
						translatedString = parts.length == 1 ? parts[0] : parts[1];
					}
					value = value.substring(0, start) + translatedString + value.substring(end + 1);
				}
			}
			return value;
		}
	}
})