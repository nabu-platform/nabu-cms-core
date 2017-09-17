if (!nabu) { var nabu = {} }
if (!nabu.designer) { nabu.designer = {} }

nabu.designer.CreateForm = Vue.extend({
	template: "#nabu-design-create-form",
	data: function() {
		return {
			properties: [],
			result: {}
		}
	}
});