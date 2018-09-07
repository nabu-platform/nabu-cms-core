<template id="nabu-cms-email-update-alias">
	<e-container class="nabu-cms-email-update-alias">
		<e-row>
			<e-columns small="12" large="12">
				<h2>%{email.updateAlias:Update Email}</h2>
			</e-columns>
		</e-row>
		<e-spacer/>
		<e-row>
			<e-columns small="12" large="12" class="first last">
				<p>%{email.updateAlias:We received a request to update your email address, click here to set '{{newAlias}}' as your new address:}</p>
			</e-columns>
		</e-row>
		<e-spacer/>
		<e-row>
			<e-columns small="12" large="12" class="first last">
				<center>
					<a class="button float-center" align="center" :href="link">%{email.updateAlias:Set new email}</a>
				</center>
			</e-columns>
		</e-row>
		<e-spacer/>
		<e-row>
			<e-columns small="12" large="12" class="first last">
				<p>%{email.updateAlias:If you didn't mean to update your email address, then you can just ignore this email; your address will not change.}</p>
			</e-columns>
		</e-row>
	</e-container>
</template>