<template id="securityGroups">
	<section class="securityGroups">
		<div class="page-menu">
			<h1 class="title">Groups</h1>
			<button v-if="!ids.length" class="info" @click="addGroup"><span class="n-icon n-icon-plus"></span>Group</button>
			<button v-if="ids.length" @click="ids.splice(0, ids.length)"><span class="n-icon n-icon-filter"></span>Clear Filter</button>
		</div>
		<div class="filter">
			<n-form-text v-timeout:input="load" v-model="name" placeholder="search" class="search"/>
		</div>
		<div class="row" :class="{ 'table': $services.manager.tableView() }">
			<div class="card table-header">
				<span>Name</span>
				<span>Created</span>
			</div>
			<div class="card fill" v-for="group in groups">
				<h2 v-css.show-details>{{ group.name }}<span v-show="group.ownerId" class="detail">{{ group.ownerName }}</span></h2>
				<div class="property last">
					<span class="key">Created</span>
					<span class="value">{{ formatDate(group.created) }}</span>
				</div>
				<n-collapsible title="Users" :load="function() { return loadUsers(group) }">
					<div class="list">
						<div class="entry" v-for="user in group.users">
							<a href="javascript:void(0)" @click="$services.router.route('securityUsers', { ids: [user.id] })">{{ user.alias }}</a>
							<span class="detail" title="The realm this user belongs to">{{ user.realm }}</span>
							<button class="delete" @click="deleteUser(group, user)"></button>
						</div>
					</div>
					<div class="actions">
						<button class="add" @click="addUser(group)">User</button>
					</div>
				</n-collapsible>
				<n-collapsible title="Roles" :load="function() { return loadRoles(group) }">
					<div class="list">
						<div class="entry" v-for="role in group.roles">
							<a href="javascript:void(0)" @click="$services.router.route('securityRoles', { ids: [role.id] })">{{ role.name }}</a>
							<span @click="$router.route('securityNodes', { ids: [role.nodeId] })" class="tag interactive" :title="role.inherit ? 'Active for this node and its children' : 'Only active for this node'" v-if="role.nodeId">{{ role.nodeName }}</span>
							<button class="delete" @click="deleteRole(group, role)"></button>
							<div class="detail" title="Owner of the role" v-if="role.ownerId">{{ role.ownerName }}</div>
						</div>
					</div>
					<div class="actions">
						<button class="add" @click="addRole(group)">Role</button>
					</div>
				</n-collapsible>
			</div>
		</div>
		<n-paging ref="paging" :total="totalPages" :load="load"/>
	</section>
</template>