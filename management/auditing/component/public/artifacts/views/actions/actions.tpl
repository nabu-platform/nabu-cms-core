<template id="auditingActions">
	<section class="auditingActions">
		<div class="page-menu">
			<h1 class="title">Auditing</h1>
			<button @click="load()"><span class="n-icon n-icon-refresh"></span></button>
		</div>
		<div class="filter">
			<n-form-text v-focus v-timeout:input="load" v-model="name" placeholder="search" class="search"/>
		</div>
		
		<div class="row" :class="{ 'table': $services.manager.tableView() }">
			<div class="card table-header">
				<span>Action</span>
				<span>Created</span>
				<span>Level</span>
				<span>Actor</span>
				<span>Target</span>
			</div>
			<div class="card fill" v-for="audit in audits" :key="audit.id">
				<h2 v-css.show-details>{{ audit.action }}</h2>
				<div class="property">
					<span class="key">Created</span>
					<span class="value">{{ formatDateTime(audit.created) }}</span>
				</div>
				<div class="property">
					<span class="key">Level</span>
					<span class="value">{{ audit.auditLevel }}</span>
				</div>
				<div class="property">
					<span class="key">Actor</span>
					<span class="value">{{ audit.actorName }}</span>
				</div>
				<div class="property last">
					<span class="key">Target</span>
					<span class="value">{{ audit.nodeName }}<span v-show="audit.componentType" class="tag">{{ audit.componentType }}</span></span>
				</div>
				<n-collapsible title="Changes" :load="function() { return loadChanges(audit) }">
					<div class="list" v-show="audit.changes">
						<div class="entry" v-for="change in audit.changes">
							<span class="target" v-show="change.instanceName" :title="change.tableName">{{ change.instanceName }}: </span
							><span class="table" v-show="!change.instanceName">{{ change.tableName }}.</span
							><span class="field">{{ change.fieldName }}</span
							><span v-show="change.newValue" class="value">= {{ change.newValue }}</span
							><span class="tag">{{ change.changeType }}</span>
						</div>
					</div>
				</n-collapsible>
			</div>
		</div>
		<n-paging ref="paging" :total="totalPages" :load="load"/>
	</section>
</template>