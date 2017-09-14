<template id="nabu-cms-email-forgot">
	<e-container class="nabu-cms-email-forgot">
		<e-row>
			<e-columns small="12" large="12">
				<h2>Forgot password</h2>
			</e-columns>
		</e-row>
		<e-row>
			<e-columns small="12" large="12" class="first last">
				<p>%{email.forgot:We received a request to reset your password, click here to choose a new one:}</p>
			</e-columns>
		</e-row>
		<e-row>
			<e-columns small="12" large="12" class="first last">
				<center>
					<a class="button float-center" align="center" v-route:reset.absolute="values">%{email.forgot:Choose a new password}</a>
				</center>
			</e-columns>
		</e-row>
		<e-row>
			<e-columns small="12" large="12" class="first last">
				<p>%{email.forgot:If you didn't mean to reset your password, then you can just ignore this email; your password will not change.}</p>
			</e-columns>
		</e-row>
	</e-container>
</template>