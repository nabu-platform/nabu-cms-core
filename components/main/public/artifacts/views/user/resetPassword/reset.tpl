<template id="nabu-cms-core-reset">
	<div class="nabu nabu-cms nabu-cms-core-reset">
		<slot name="title"><h1 class="title">{{ initialize ? "%{initialize:Set initial password}" : "%{reset:Reset password}" }}</h1></slot>
		<slot name="tagline"></slot>
		<n-form ref="form" v-if="!updated">
			<n-form-section>
				<n-form-text @keyup.enter="resetPassword" type="password" v-focus v-timeout:input.form="validate" placeholder="%{reset:New password}" v-model="password1" :required="true"/>
				<n-form-text @keyup.enter="resetPassword" type="password" v-timeout:input.form="validate" placeholder="%{reset:Confirm new password}" v-model="password2" :required="true"/>
			</n-form-section>
			<footer slot="footer">
				<div class="actions">
					<button :disabled="!valid || working || password1 != password2" class="primary" @click="resetPassword">{{ initialize ? "%{initialize:Set initial password}" : "%{reset:Reset password}" }}</button>
				</div>
				<n-messages :messages="messages"/>
			</footer>
		</n-form>
		<div v-if="updated" class="completed">
			<slot>{{ initialize ? "%{initialize:Your password has been set, click to <a v-route:login>log in</a>}" : "%{reset:Your password has been reset, click to <a v-route:login>log in</a>}" }}</slot>
		</div>
		<slot name="end"></slot>
	</div>
</template>