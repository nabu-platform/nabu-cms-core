<template id="nabu-cms-core-login">
	<div class="nabu nabu-cms nabu-cms-core-login">
		<slot name="title"><h1 class="title">%{login:Log in}</h1></slot>
		<slot name="tagline"></slot>
		<n-form ref="form">
			<n-form-section>
				<n-form-text @keyup.enter="login" v-focus v-timeout:input.form="validate" placeholder="%{login:Email}" pattern=".*@.*\..*" v-model="username" :required="true"/>
				<n-form-text @keyup.enter="login" type="password" v-timeout:input.form="validate" placeholder="%{login:Password}" v-model="password" :required="true"/>
				<n-form-switch v-if="!alwaysRemember" label="%{login:Remember me}" v-model="remember"/>
			</n-form-section>
			<footer slot="footer">
				<div class="actions">
					<button :disabled="!valid || working" class="primary" @click="login">%{login:Login}</button>
				</div>
				<n-messages :messages="messages"/>
			</footer>
		</n-form>
		<slot name="end"></slot>
	</div>
</template>