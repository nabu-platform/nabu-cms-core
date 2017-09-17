if (!nabu) { var nabu = {} }
if (!nabu.designer) { nabu.designer = {} }

nabu.designer.CssEditor = Vue.component("n-css-editor", {
	template: "#nabu-design-css-editor",
	data: function() {
		return {
			show: false,
			cssKey: {}
		}
	},
	created: function() {
		for (var i = 0; i < this.anchors.length; i++) {
			Vue.set(this.cssKey, this.anchors[i], "");
		}	
	},
	methods: {
		getKeys: function(styleKey, typed) {
			if (typed) {
				return this.component.remainingCssKeys(styleKey).filter(function(x) { return x.toLowerCase().indexOf(typed.toLowerCase()) >= 0 });
			}
			else {
				return this.component.remainingCssKeys(styleKey);
			}
		},
		addKey: function(styleKey, key) {
			console.log("setting", styleKey, key);
			if (key) {
				Vue.set(this.component.style[styleKey], key, "");
			}
		},
		getAnchors: function(style) {
			return Object.keys(style);
		}
	},
	watch: {
		cssKey: {
			deep: true,
			handler: function(newValue) {
				for (var key in newValue) {
					if (newValue[key] && !this.component.style[key][newValue[key]]) {
						Vue.set(this.component.style[key], newValue[key], "");
						// unset the value
						newValue[key] = "";
					}
				}
			}
		}
	}
});