<template id="nabu-design-css-editor">
	<div class="nabu-design-css-editor" v-if="true || $services.designer.designing">
		<span class="n-icon n-icon-css3" @click="show = !show"></span>
		<div class="menu" v-if="show">
			<n-form class="layout1 anchor" v-for="anchor in getAnchors(component.style)">
				<h2>{{ anchor == "$self" ? "General" : anchor }}</h2>
				<div v-for="key in component.usedCssKeys(anchor)">
					<n-form-text :label="key" v-model="component.style[anchor][key]"/>
				</div>
				<n-form-combo label="Add CSS" :filter="getKeys.bind(this, anchor)" @input="addKey.bind(this, anchor)" v-model="cssKey[anchor]"/>
			</n-form>
		</div>
	</div>
</template>