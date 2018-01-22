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
				<tr v-for="translation in translations" :key="translation.context + ':' + translation.name">
					<td>{{ translation.context ? translation.context : "" }}</td>
					<td class="content" v-content="highlight(translation.name)"></td>
					<td class="translation">
						<n-form-text type="area" :disabled="false && translation.working" :timeout="600" v-model="translation.translation" @input="save(translation)"/>
						<span class="n-icon n-icon-spinner" :class="{'hide': !translation.working }"></span>
						<n-info v-if="translation.name && highlight(translation.name) != translation.name">Copy the grey parts verbatim and translate only the black text</n-info>
					</td>
				</tr>
			</tbody>
			<tfoot>
				<n-paging :value="page.current" :total="page.total" :load="load"/>
			</tfoot>
		</table>
	</div>
</template>