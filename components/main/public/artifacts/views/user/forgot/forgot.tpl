<template id="nabu-cms-core-forgot">
	<div class="nabu nabu-cms nabu-cms-core-forgot">
		<slot name="title"><h1 class="title">%{forgot:Forgot password}</h1></slot>
		<slot name="tagline"></slot>
		<n-form ref="form" v-if="!requested">
			<n-form-section>
				<n-form-text @keyup.enter="requestPassword" v-focus v-timeout:input.form="validate" placeholder="%{forgot:Email}" pattern=".*@.*\..*" v-model="username" :required="true"/>
			</n-form-section>
			<footer slot="footer">
				<div class="actions">
					<button :disabled="!valid || working" class="primary" @click="requestPassword">%{forgot:Request new password}</button>
				</div>
				<n-messages :messages="messages"/>
			</footer>
		</n-form>
		<div v-if="requested" class="completed">
			<slot>%{forgot:An email has been sent to your address, please follow the instructions inside to reset your password}</slot>
		</div>
		<slot name="end"></slot>
	</div>
</template>