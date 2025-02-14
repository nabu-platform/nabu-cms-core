<template id="cms-login">
	<n-form ref="form">
		<n-form-section>
			<n-form-text name="username" v-focus v-timeout:input.form="validate" label="%{default::Username}" placeholder="%{default::email@example.com}" v-model="username" :required="true"/>
			<n-form-text name="password" type="password" v-timeout:input.form="validate" placeholder="%{default::Password}" label="%{default::Password}" v-model="password" :required="true"/>
			<n-form-switch label="%{default::Remember me}" v-model="remember"/>
		</n-form-section>
		<footer>
			<slot name="footer" :messages="messages" :finalize="login">
				<div class="actions">
					<button :disabled="working" class="primary" v-action="login">%{default::Login}</button>
				</div>
				<n-messages :messages="messages"/>
			</slot>
		</footer>
	</n-form>
</template>