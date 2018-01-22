<template id="securityRoles">
	<section class="securityRoles">
		<div class="page-menu" v-show="!$resolve">
			<h1 class="title">Roles</h1>
			<button v-if="!ids.length" @click="addRole()" class="info"><span class="n-icon n-icon-plus"></span>Role</button>
			<button v-if="ids.length" @click="ids.splice(0, ids.length)"><span class="n-icon n-icon-filter"></span>Clear Filter</button>
		</div>
		<div class="filter">
			<n-form-text v-focus v-timeout:input="load" v-model="name" placeholder="search" class="search"/>
		</div>
		<div class="row" :class="{ 'table': $services.manager.tableView() }">
			<div class="card table-header">
				<span>Name</span>
				<span>Created</span>
				<span>Pseudo</span>
			</div>
			<div class="card fill" v-for="role in roles" :class="{'selected': selected.indexOf(role) >= 0}">
				<h2 v-css.show-details><n-form-checkbox v-model="selected" :item="role" v-if="$resolve"/>{{ role.name }}<span v-show="role.ownerId" class="detail">{{ role.ownerName }}</span></h2>
				<div class="property">
					<span class="key">Created</span>
					<span class="value">{{ formatDate(role.created) }}</span>
				</div>
				<div class="property last">
					<span class="key">Pseudo</span>
					<n-form-switch class="value fill" :value="role.pseudo"/>
				</div>
				<n-collapsible title="Actions" :load="function() { return loadActions(role) }">
					<div class="list">
						<div class="entry" v-for="action in role.actions">
							<a href="javascript:void(0)" @click="$services.router.route('securityActions', { ids: [action.id] })">{{ action.name }}</a>
							<button class="delete" @click="deleteAction(role, action)"></button>
						</div>
					</div>
					<div class="actions">
						<button class="add" @click="addAction(role)">Action</button>
					</div>
				</n-collapsible>
				<n-collapsible title="Groups" :load="function() { return loadGroups(role) }">
					<div class="list">
						<div class="entry" v-for="group in role.groups">
							<a href="javascript:void(0)" @click="$services.router.route('securityGroups', { ids: [group.id] })">{{ group.name }}</a>
							<span class="tag" :title="group.inherit ? 'Active for this node and its children' : 'Only active for this node'" v-if="group.nodeId">{{ group.nodeName }}</span>
							<button class="delete" @click="deleteGroup(role, group)"></button>
							<div class="detail" title="Owner of the group" v-if="group.ownerId">{{ group.ownerName }}</div>
						</div>
					</div>
					<div class="actions">
						<button class="add" @click="addGroup(role)">Group</button>
					</div>
				</n-collapsible>
				<n-collapsible title="Owner" v-if="role.ownerId"></n-collapsible>
			</div>
		</div>
		<n-paging ref="paging" :total="totalPages" :load="load"/>
		<div class="actions" v-if="$resolve">
			<a href="javascript:void(0)" @click="$reject()">Cancel</a>
			<button class="info" @click="$resolve(selected)">Ok</button>
		</div>
	</section>
</template>