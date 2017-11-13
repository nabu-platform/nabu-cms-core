<template id="nabu-cms-core-login">
	<div class="nabu nabu-cms nabu-cms-core-login">
		<n-form ref="form">
			<n-form-section>
				<n-form-text name="email" @keyup.enter="login" v-focus v-timeout:input.form="validate" label="%{login:Email}" placeholder="%{login:email@example.com}" pattern=".*@.*\..*" v-model="username" :required="true"/>
				<n-form-text name="password" @keyup.enter="login" type="password" v-timeout:input.form="validate" placeholder="%{login:Password}" label="%{login:Password}" v-model="password" :required="true"/>
				<n-form-switch v-if="!alwaysRemember" label="%{login:Remember me}" v-model="remember"/>
			</n-form-section>
			<footer slot="footer">
				<div class="actions">
					<button :disabled="working" class="primary" v-action="login">%{login:Login}</button>
				</div>
				<n-messages :messages="messages"/>
				<slot name="end"><a class="forgot" v-route:forgot>%{login:Forgot your password?}</a></slot>
			</footer>
		</n-form>
	</div>
</template>