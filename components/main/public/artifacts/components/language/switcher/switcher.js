Vue.component("n-language-switcher", {
	services: ["language"],
	template: "#nabu-cms-core-language-switcher",
	props: {
		layout: {
			type: String,
			required: false,
			default: "flat"
		}
	}
})