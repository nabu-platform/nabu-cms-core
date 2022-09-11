Vue.service("translator", {
	services: ["language"],
	data: function() {
		return {
			translations: []
		}
	},
	activate: function(done) {
		var self = this;
		this.$services.swagger.execute("nabu.cms.core.rest.translation.list").then(function(result) {
			if (result && result.results) {
				nabu.utils.arrays.merge(self.translations, result.results);
			}
			done();
		}, function(error) {
			done();
		});
	},
	methods: {
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
					var parts = available.split("::");
					var translation = this.translations.filter(function(x) {
						return ((parts.length == 1 && x.context == null)
								|| (parts.length == 2 && x.context == parts[0]))
							&& (x.name == (parts.length == 1 ? parts[0] : parts[1]));
					})[0];
					var translatedString = translation ? translation.translation : null;
					// a provided default
					if (!translatedString && defaultValue) {
						translatedString = defaultValue;
					}
					// the string itself
					if (!translatedString) {
						translatedString = parts.length == 1 ? parts[0] : parts[1];
					}
					value = value.substring(0, start) + translatedString + value.substring(end + 1);
				}
			}
			return value;
		}
	}
})