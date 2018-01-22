<template id="securityAddGroup">
	<div class="securityAddGroup">
		<n-form class="layout1">
			<n-form-section>
				<n-form-text v-timeout:input="validate" v-focus :required="true" v-model="name" label="Name"/>
			</n-form-section>
			<footer class="actions">
				<a href="javascript:void(0)" class="bad" @click="$reject()">Cancel</a>
				<button :disabled="!valid" class="info" @click="create">Create Group</button>
			</footer>
		</n-form>
	</div>
</template>