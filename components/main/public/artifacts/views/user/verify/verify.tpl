<template id="nabu-cms-core-verify">
	<div class="nabu nabu-cms nabu-cms-core-verify">
		<n-form ref="form">
			<slot name="form" :validate="validate" :verify="verify"></slot>
			<n-form-section>
				<n-form-text v-model="userId" v-if="provideUserId" label="%{verify:User id}" :required="true"/>
				<n-form-text v-model="verificationCode" v-if="provideVerification" label="%{verify:Verification code}" :required="true"/>
			</n-form-section>
			<footer slot="footer">
				<slot name="footer" :messages="messages">
					<div class="actions">
						<button :disabled="working" class="primary" v-action="verify">%{verify:Verify account}</button>
					</div>
					<n-messages :messages="messages"/>
				</slot>
			</footer>
		</n-form>
	</div>
</template>