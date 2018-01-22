<template id="nabu-cms-core-reset">
	<div class="nabu nabu-cms nabu-cms-core-reset">
		<n-form ref="form" v-if="!updated">
			<slot name="form" :validate="validate" :reset="resetPassword"></slot>
			<n-form-section>
				<n-form-text pattern="${nabu.cms.core.utils.initializeConfiguration(application.configuration('nabu.cms.core.configuration'))/configuration/passwordRegex}" @keyup.enter="resetPassword" type="password" v-focus v-timeout:input.form="validate" label="%{reset:New password}" placeholder="%{reset:New password}" v-model="password1" :required="true"/>
				<n-form-text :validator="validatePassword" pattern="${nabu.cms.core.utils.initializeConfiguration(application.configuration('nabu.cms.core.configuration'))/configuration/passwordRegex}" @keyup.enter="resetPassword" type="password" v-timeout:input.form="validate" label="%{reset:Confirm new password}" placeholder="%{reset:Confirm new password}" v-model="password2" :required="true"/>
			</n-form-section>
			<footer slot="footer">
				<slot name="footer">
					<div class="actions">
						<button :disabled="working" class="primary" v-action="resetPassword">{{ initialize ? "%{initialize:Set initial password}" : "%{reset:Reset password}" }}</button>
					</div>
					<n-messages :messages="messages"/>
				</slot>
				<slot name="end"><a v-if="!initialize" class="login" v-route:login>%{reset:Still remember your password?}</a></slot>
			</footer>
		</n-form>
		<div v-if="updated" class="completed">
			<slot>
				<span v-if="initialize">%{initialize:Your password has been set, click to <a v-route:login>log in</a>}</span>
				<span v-else>%{reset:Your password has been reset, click to <a v-route:login>log in</a>}</span>
			</slot>
		</div>
	</div>
</template>