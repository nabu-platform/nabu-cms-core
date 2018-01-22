<template id="securityActionAdd">
	<n-form class="layout1 securityActionAdd">
		<n-form-section>
			<n-form-section>
				<n-form-text v-focus v-model="name" label="Name"/>
			</n-form-section>
			<footer class="actions">
				<a href="javascript:void(0)" @click="$reject()">Cancel</a>
				<button class="info" @click="create">Create</button>
			</footer>
		</n-form-section>
	</n-form>
</template>