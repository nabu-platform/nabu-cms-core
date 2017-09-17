<template id="nabu-design-create-form">
	<div class="nabu-design-create-form">
		<n-form class="layout1">
			<n-form-section>
				<n-form-text v-for="property in properties" v-model="result[property]" :label="property"/>
			</n-form-section>
			<footer class="actions">
				<button @click="$reject()">Cancel</button>
				<button @click="$resolve(result)">Create</button>
			</footer>
		</n-form>
	</div>
</template>