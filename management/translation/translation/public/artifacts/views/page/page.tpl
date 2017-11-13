<template id="translationPage">
	<div class="translationPage">
		<n-form class="layout1">
			<n-form-section>
				<n-form-combo v-timeout:input.form="load" label="Language" v-model="language" :items="languages"/>
				<n-form-switch v-timeout:input.form="load" label="Translated" v-model="translated"/>
				<n-form-text v-timeout:input.form="load" label="Search" v-model="search"/>
			</n-form-section>
		</n-form>
		<table class="classic">
			<thead>
				<tr>
					<td>Category</td>
					<td>Value</td>
					<td>Translation</td>
				</tr>
			</thead>
			<tbody>
				<tr v-for="translation in translations" :key="translation.id ? translation.id : translation.context + ':' + translation.name">
					<td>{{ translation.context ? translation.context : "" }}</td>
					<td>{{ translation.name }}</td>
					<td><n-form-text :disabled="translation.working" :timeout="600" v-model="translation.translation" @input="save(translation)"/></td>
				</tr>
			</tbody>
			<tfoot>
				<n-paging :value="page.current" :total="page.total" :load="load"/>
			</tfoot>
		</table>
	</div>
</template>