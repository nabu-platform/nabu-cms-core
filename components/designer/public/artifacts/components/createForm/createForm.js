if (!nabu) { var nabu = {} }
if (!nabu.designer) { nabu.designer = {} }

nabu.designer.CreateForm = Vue.extend({
	template: "#nabu-design-create-form",
	data: function() {
		return {
			properties: [],
			result: {},
			valid: false
		}
	},
	created: function() {
		for (var i = 0; i < this.properties.length; i++) {
			Vue.set(this.result, this.properties[i], null);
		}
	},
	methods: {
		validate: function() {
			if (this.result.name) {
				console.log("wtf", this.result.name, document.getElementById(this.result.name));
				this.valid = !document.getElementById(this.result.name);
			}
			else {
				this.valid = false;
			}
		}
	}
});