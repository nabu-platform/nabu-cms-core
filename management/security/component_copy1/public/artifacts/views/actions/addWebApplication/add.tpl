<template id="securityActionsAddWebApplication">
	<n-form class="layout1">
		<n-form-section>
			<n-input-combo label="Web Application" v-model="application" :filter="function() { return applications }"/>
		</n-form-section>
		<footer class="actions">
			<a href="javascript:void(0)" @click="$reject()">Cancel</a>
			<button class="success" :disabled="!application" @click="$resolve(application)">Ok</button>
		</footer>
	</n-form>
</template>