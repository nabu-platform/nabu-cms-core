<template id="nabu-cms-email-verify">
	<e-container class="nabu-cms-email-verify">
		<e-row>
			<e-columns small="12" large="12">
				<h2>New account</h2>
			</e-columns>
		</e-row>
		<e-row>
			<e-columns small="12" large="12" class="first last">
				<p>
					<span v-if="password">%{email.verify:An account has been created for you with the following password: <b>{{ password }}</b>.}</span>
					<span v-if="!password">%{email.verify:An account has been created for you.}</span>
					<br/>
					<span v-if="verificationCode">%{email.verify:Please verify your email address by clicking the following link:}</span>
				</p>
			</e-columns>
		</e-row>
		<e-row>
			<e-columns small="12" large="12" class="first last">
				<center>
					<a v-if="verificationCode" class="button float-center" align="center" v-route:verify.absolute="values">%{email.verify:Activate account}</a>
					<a v-if="!verificationCode" class="button float-center" align="center" v-route:login.absolute>%{email.verify:Log in}</a>
				</center>
			</e-columns>
		</e-row>
	</e-container>
</template>