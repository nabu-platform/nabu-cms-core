<template id="securityAddRole">
	<div class="securityAddRole">
		<n-form class="layout1">
			<n-form-section>
				<n-form-text v-focus v-model="name" label="Name"/>
				<n-form-switch v-model="pseudo" label="Pseudo"/>
			</n-form-section>
			<footer class="actions">
				<a href="javascript:void(0)" @click="$reject()">Cancel</a>
				<button class="info" @click="create">Create</button>
			</footer>
		</n-form>
	</div>
</template>