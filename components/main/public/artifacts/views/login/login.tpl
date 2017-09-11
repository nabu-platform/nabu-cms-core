<template id="nabu-cms-core-login">
	<div class="nabu nabu-cms nabu-cms-core-login">
		<h1 class="title">{{ loginLabel }}</h1>
		<n-form class="classic" ref="form">
			<n-form-section>
				<n-form-text v-timeout:input.form="validate" :label="aliasLabel" pattern=".*@.*\..*" v-model="username" :required="true"/>
				<n-form-text type="password" v-timeout:input.form="validate" :label="passwordLabel" v-model="password" :required="true"/>
				<n-form-switch :label="rememberLabel" v-model="remember"/>
			</n-form-section>
			<footer slot="footer">
				<div class="actions">
					<button :disabled="!valid || working" class="primary" @click="login">{{ loginLabel }}</button>
				</div>
				<n-messages :messages="messages"/>
			</footer>
		</n-form>
	</div>
</template>