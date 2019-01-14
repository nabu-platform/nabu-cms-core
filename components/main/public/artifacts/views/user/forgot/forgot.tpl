<template id="nabu-cms-core-forgot">
	<div class="nabu nabu-cms nabu-cms-core-forgot">
		<n-form ref="form" v-if="!requested">
			<slot name="form"></slot>
			<n-form-section>
				<div v-if="supportedProtocols.length > 1">
					<span @click="protocol = 'email'" class="protocol n-icon n-icon-at fa fa-at" title="%{forgot:Email}"></span>
					<span @click="protocol = 'text'"  class="protocol n-icon n-icon-phone fa fa-phone" title="%{forgot:Phone number}"></span>
				</div>
				<n-form-text @keyup.enter="requestPassword" v-focus v-timeout:input.form="validate" label="%{forgot:Email}" 
					placeholder="%{forgot:email@example.com}" pattern=".*@.*\..*" v-model="username" :required="true" 
					v-if="protocol == 'email'"/>
				<n-form-text @keyup.enter="requestPassword" v-focus v-timeout:input.form="validate" label="%{forgot:Phone number}" 
					placeholder="%{forgot:+32.....}" v-model="username" :required="true" 
					v-else-if="protocol == 'text'"/>
			</n-form-section>
			<footer>
				<slot name="footer" :messages="messages" :finalize="requestPassword">
					<div class="actions">
						<button :disabled="working" class="primary" v-action="requestPassword">%{forgot:Request new password}</button>
					</div>
					<n-messages :messages="messages"/>
					<slot name="end"><a class="login" v-if="!requested" v-route:login>%{forgot:Still remember your password?}</a></slot>
				</slot>
			</footer>
		</n-form>
		<div v-if="requested" class="completed">
			<slot>%{forgot:An email has been sent to your address, please follow the instructions inside to reset your password}</slot>
		</div>
	</div>
</template>