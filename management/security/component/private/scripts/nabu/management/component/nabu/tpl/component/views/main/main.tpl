<template id="securityMain">
	<h1>Security</h1>
	<div class="select">
		<select v-model="connection">
			<option :value="null">-- CONNECTION --</option>
			<option v-for="connection in connections" :value="connection">{{ connection }}</option>
		</select>
	</div>
	<div class="tabs">
		<button @click="tab = 'roles'" :class="{ 'active': tab == 'roles'}">Roles</button>
		<button @click="tab = 'groups'" :class="{ 'active': tab == 'groups'}">Groups</button>
		<button @click="tab = 'actions'" :class="{ 'active': tab == 'actions'}">Actions</button>
		<button @click="tab = 'users'" :class="{ 'active': tab == 'users'}">Users</button>
	</div>
	<section class="roles" v-show="tab == 'roles'">
		<div class="role" :class="{ 'neutral': role.pseudo }" v-for="role in roles">
			<div class="title">
				<input type="checkbox" v-model="selectedRoles" :value="role"/>
				<span>{{ role.name }}</span>
				<span v-if="role.ownerId"> ({{ role.ownerId | formatOwner }})</span>
			</div>
			<div class="detail" v-if="selectedRoles.indexOf(role) >= 0">
				<span class="key">Groups: </span>
				<div class="value" v-for="groupId in getRoleGroups(role.id)">
					<span>{{ groupId | formatGroup }}</span>
					<button class="action" @click="deleteGroupFromRole(role, groupId)">
						<img src="${server.root()}resources/images/icons/remove.png"/>
					</button>
				</div>
			</div>
		</div>
	</section>
	<section class="roles" v-show="tab == 'groups'">
		
	</section>
	<section class="roles" v-show="tab == 'actions'">
		
	</section>
	<section class="roles" v-show="tab == 'users'">
		
	</section>
</template>