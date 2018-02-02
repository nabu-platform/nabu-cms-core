<template id="nabu-cms-core-update">
	<div class="nabu nabu-cms nabu-cms-core-update">
		<n-form ref="form" v-if="!updated">
			<n-form-section>
				<n-form-text v-model="oldPassword" v-focus v-timeout:input.form="validate" label="%{reset:Old password}"
					@keyup.enter="updatePassword" type="password" :required="true"
					placeholder="%{reset:Old password}"/>
				<n-form-text 
					pattern-comment="%{The password should be at least 8 characters long and contain a number, a lowercase and an uppercase letter}" 
					pattern="${nabu.cms.core.utils.initializeConfiguration(application.configuration('nabu.cms.core.configuration'))/configuration/passwordRegex}"
					@keyup.enter="updatePassword" type="password" v-timeout:input.form="validate" label="%{reset:New password}" 
					placeholder="%{reset:New password}" v-model="password1" :required="true"/>
				<n-form-text :validator="validatePassword"
					pattern-comment="%{The password should be at least 8 characters long and contain a number, a lowercase and an uppercase letter}" 
					pattern="${nabu.cms.core.utils.initializeConfiguration(application.configuration('nabu.cms.core.configuration'))/configuration/passwordRegex}" 
					@keyup.enter="updatePassword" type="password" v-timeout:input.form="validate" label="%{reset:Confirm new password}" 
					placeholder="%{reset:Confirm new password}" v-model="password2" :required="true"/>
			</n-form-section>
			<footer slot="footer">
				<div class="actions">
					<button :disabled="working" class="primary" v-action="updatePassword">%{reset:Update password}</button>
				</div>
				<n-messages :messages="messages"/>
			</footer>
		</n-form>
		<div v-if="updated" class="completed">
			<slot>
				<span>%{reset:Your password has been updated}</span>
			</slot>
		</div>
	</div>
</template>