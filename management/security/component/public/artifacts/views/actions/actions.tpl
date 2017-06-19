<template id="securityActions">
	<section id="securityActions">
		<div class="page-menu" v-show="!$resolve">
			<h1 class="title">Actions</h1>
			<button v-if="!ids.length" class="info"><span class="n-icon n-icon-plus"></span>Action</button>
			<button v-if="!ids.length && $services.security.applications().length" @click="addWebApplication()" title="From Web Application"><span class="n-icon n-icon-plus"></span>Web Application</button>
			<button v-if="ids.length" @click="ids.splice(0, ids.length)"><span class="n-icon n-icon-filter"></span>Clear Filter</button>
		</div>
		<div class="filter">
			<n-form-text v-focus v-timeout:input="load" v-model="name" placeholder="search" class="search"/>
		</div>
		<div class="row" :class="{ 'table': $services.manager.tableView() }">
			<div class="card table-header">
				<span>Name</span>
				<span>Created</span>
				<span>Audit</span>
			</div>
			<div class="card fill" v-for="action in actions" :class="{'selected': selected.indexOf(action) >= 0}">
				<h2 v-css.show-details><n-form-checkbox type="checkbox" :editable="true" :item="action" v-model="selected" class="select" v-if="$resolve"/>{{ action.name }}<button @click="$confirm({ message: 'Are you sure you want to delete this action?', type: 'question', ok: 'Delete' }).then(deleteAction.bind(this, action));$event.stopPropagation()" class="delete"></button></h2>
				<div class="property">
					<span class="key">Created</span>
					<span class="value">{{ formatDate(action.created) }}</span>
				</div>
				<div class="property last">
					<span class="key">Audit</span>
					<n-form-switch class="value fill" :value="action.audit" @input="toggleAudit(action)"/>
				</div>
				<n-collapsible title="Roles" :load="function() { return loadRoles(action) }">
					<div class="list">
						<div class="entry" v-for="role in action.roles">
							<a href="javascript:void(0)" @click="$services.router.route('securityRoles', { ids: [role.id] })">{{ role.name }}</a>
							<button class="delete" @click="deleteRole(action, role)"></button>
							<div class="detail" v-if="role.ownerId">{{ role.ownerName }}</div>
						</div>
					</div>
					<div class="actions">
						<button class="add" @click="addRole(action)">Role</button>
					</div>
				</n-collapsible>
			</div>
		</div>
		<n-paging ref="paging" :total="totalPages" :load="load"/>
		<div class="actions" v-if="$resolve">
			<a href="javascript:void(0)" @click="$reject()">Cancel</a>
			<button class="info" @click="$resolve(selected)">Ok</button>
		</div>
	</section>
</template>