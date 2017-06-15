<template id="securityUpdatePassword">
	<div class="securityUpdatePassword">
		<n-form class="layout1">
			<n-form-section>
				<n-form-text v-timeout:input="validate" v-focus type="password" :required="true" v-model="newPassword1" label="New Password"/>
				<n-form-text v-timeout:input="validate" type="password" :required="true" v-model="newPassword2" label="New Password Again"/>
			</n-form-section>
			<footer class="actions">
				<a href="javascript:void(0)" class="bad" @click="$reject()">Cancel</a>
				<button :disabled="!valid" class="info" @click="$resolve(newPassword1)">Update Password</button>
			</footer>
		</n-form>
	</div>
</template>