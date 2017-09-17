if (!nabu) { var nabu = {} }
if (!nabu.designer) { nabu.designer = {} }

nabu.designer.Border = Vue.extend({
	mixins: [nabu.design.mixins.Style],
	props: {
		name: {
			type: String,
			required: false
		}	
	},
	template: "#nabu-design-scaffold-border",
})