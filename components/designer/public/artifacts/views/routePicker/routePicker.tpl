<template id="nabu-designer-route-picker">
	<div class="nabu-designer-route-picker">
		<n-form class="layout1">
			<n-input-combo :labels="labels" :filter="getRoutes" v-model="route" :formatter="function(x) { return x.alias }">
			<button slot="bottom" :disabled="!route" @click="register">Register</button>
			</n-input-combo>
		</n-form>
	</div>
</template>