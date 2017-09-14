<template id="securityUsers">
	<section class="securityUsers">
		<div class="page-menu" v-show="!$resolve">
			<h1 class="title">Users</h1>
			<button v-if="!ids.length" class="info" @click="addUser"><span class="n-icon n-icon-plus"></span>User</button>
			<button v-if="ids.length" @click="ids.splice(0, ids.length)"><span class="n-icon n-icon-filter"></span>Clear Filter</button>
		</div>
		<div class="filter">
			<n-form-text v-timeout:input="load" v-focus v-model="name" placeholder="search" class="search"/>
		</div>
		<div class="row" :class="{ 'table': $services.manager.tableView() }">
			<div class="card table-header">
				<span>Alias</span>
				<span>Created</span>
				<span>Verified</span>
				<span>Password</span>
				<span>Enabled</span>
			</div>
			<div class="card fill" v-for="user in users" :class="{'selected': selected.indexOf(user) >= 0}">
				<h2 v-css.show-details><n-form-checkbox v-model="selected" :item="user" v-if="$resolve"/>{{ user.alias }}<span class="detail">{{ user.realm }}</span></h2>
				<div class="property">
					<span class="key">Created</span>
					<span class="value">{{ formatDate(user.created) }}<a class="button info" target="_blank" v-if="$services.security.canRemoteAuthenticate(user.realm)" :href="$services.security.remoteAuthenticate(user.realm, user.alias)" title="Remote Authenticate"><span class="n-icon n-icon-user"></span></a></span>
				</div>
				<div class="property">
					<span class="key">Verified</span>
					<span class="value" :class="{'highlight': !user.verified}">{{ user.verified ? formatDate(user.verified) : 'no' }} <button class="success" v-if="!user.verified" @click="verify(user)" title="Verify"><span class="n-icon n-icon-check"></span></button></span>
				</div>
				<div class="property">
					<span class="key">Password</span>
					<span class="value" :class="{'highlight': !user.passwordModified}">{{ user.passwordModified ? formatDate(user.passwordModified) : 'unmodified' }} <button class="info" @click="updatePassword(user)" title="Set New Password"><span class="n-icon n-icon-refresh"></span></button></span>
				</div>
				<div class="property last">
					<span class="key">Enabled</span>
					<n-form-switch class="value fill" :value="user.enabled" @input="updateEnabled(user)"/>
				</div>
				<n-collapsible title="Groups" :load="function() { return loadGroups(user) }">
					<div class="list">
						<div class="entry" v-for="group in user.groups">
							<a href="javascript:void(0)" @click="$services.router.route('securityGroups', { ids: [group.id] })">{{ group.name }}</a>
							<span class="tag" v-if="group.nodeId">{{ group.nodeName }}</span>
							<button class="delete" @click="deleteGroup(role, group)"></button>
							<div class="detail" title="Owner of the group" v-if="group.ownerId">{{ group.ownerName }}</div>
						</div>
					</div>
					<div class="actions">
						<button class="add" @click="addGroup(user)">Group</button>
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