<template id="securityNodes">
	<section class="securityNodes">
		<div class="page-menu" v-show="!$resolve">
			<h1 class="title">Nodes</h1>
			<button v-if="!ids.length" class="info"><span class="n-icon n-icon-plus"></span>Node</button>
			<button v-if="ids.length" @click="ids.splice(0, ids.length)"><span class="n-icon n-icon-filter"></span>Clear Filter</button>
		</div>
		<div class="filter">
			<n-form-text v-focus v-timeout:input="load" v-model="name" placeholder="search" class="search"/>
		</div>
		<div class="row" :class="{ 'table': $services.manager.tableView() }">
			<div class="card table-header">
				<span>Name</span>
				<span>Created</span>
				<span>Owner</span>
			</div>
			<div class="card fill" v-for="node in nodes" :class="{'selected': selected.indexOf(node) >= 0}">
				<h2 v-css.show-details><n-form-checkbox v-model="selected" :item="node" v-if="$resolve"/>{{ node.name ? node.name : 'Unnamed' }}<span title="Component" class="tag">{{ node.componentName }}</span></h2>
				<div class="property">
					<span class="key">Created</span>
					<span class="value">{{ formatDate(node.created) }}</span>
				</div>
				<div class="property last">
					<span class="key">Owner</span>
					<span class="value">{{ node.ownerName }}</span>
				</div>
			</div>
		</div>
		<n-paging ref="paging" :total="totalPages" :load="load"/>
		<div class="actions" v-if="$resolve">
			<a href="javascript:void(0)" @click="$reject()">Cancel</a>
			<button class="info" @click="$resolve(selected)">Ok</button>
		</div>
	</section>
</template>