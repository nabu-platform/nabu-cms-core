<template id="securityAddUser">
	<div class="securityAddUser">
		<n-form class="layout1">
			<n-form-section>
				<n-form-text v-timeout:input="validate" v-focus :required="true" v-model="realm" label="Realm"/>
				<n-form-text v-timeout:input="validate" :required="true" v-model="alias" label="Alias"/>
				<n-form-text v-timeout:input="validate" type="password" :required="true" v-model="password1" label="Password"/>
				<n-form-text v-timeout:input="validate" type="password" :required="true" v-model="password2" label="Password Again"/>
				<n-form-switch v-timeout:input="validate" v-model="verified" label="Automatically Verified"/>
				<n-form-switch v-timeout:input="validate" v-model="sendEmail" label="Send Email"/>
			</n-form-section>
			<footer class="actions">
				<a href="javascript:void(0)" class="bad" @click="$reject()">Cancel</a>
				<button :disabled="!valid" class="info" @click="create">Create User</button>
			</footer>
		</n-form>
	</div>
</template>