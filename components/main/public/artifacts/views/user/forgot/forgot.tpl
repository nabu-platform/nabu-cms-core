<template id="nabu-cms-core-forgot">
	<div class="nabu nabu-cms nabu-cms-core-forgot">
		<n-form ref="form" v-if="!requested">
			<n-form-section>
				<n-form-text @keyup.enter="requestPassword" v-focus v-timeout:input.form="validate" label="%{forgot:Email}" placeholder="%{forgot:email@example.com}" pattern=".*@.*\..*" v-model="username" :required="true"/>
			</n-form-section>
			<footer slot="footer">
				<div class="actions">
					<button :disabled="working" class="primary" v-action="requestPassword">%{forgot:Request new password}</button>
				</div>
				<n-messages :messages="messages"/>
				<slot name="end"><a class="login" v-if="!requested" v-route:login>%{forgot:Still remember your password?}</a></slot>
			</footer>
		</n-form>
		<div v-if="requested" class="completed">
			<slot>%{forgot:An email has been sent to your address, please follow the instructions inside to reset your password}</slot>
		</div>
	</div>
</template>