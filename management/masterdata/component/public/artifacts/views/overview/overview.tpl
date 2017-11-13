<template id="masterdataOverview">
	<div class="masterdataOverview">
		<h1 class="title">Masterdata</h1>
		<div class="select">
			<select v-model="dialect">
				<option :value="null">-- DIALECT --</option>
				<option v-for="dialect in $services.manager.dialects()" :value="dialect">{{ dialect }}</option>
			</select>
			<button :disabled="!dialect || (!selectedEntries.length && !selectedCategories.length)" @click="buildInserts">Build Inserts</button>
			<button :disabled="!inserts.length" @click="clearInserts">Clear Inserts</button>
		</div>
		<div class="categories">
			<div class="selectAll item" v-show="$services.manager.connection() && !message">
				<input type="checkbox" v-model="allCategories" v-show="categories.length"/>
				<span v-show="categories.length" @click="selectAllCategories">Select All</span>
				<button @click="addCategory">Add</button>
				<button @click="deleteCategories">Delete</button>
			</div>
			<div v-for="category in categories" class="item">
				<input type="checkbox" :value="category" v-model="selectedCategories"/>
				<span @click="loadEntries(category)">{{ category.name }}</span>
			</div>
		</div>
		<div class="entries">
			<div class="selectAll item" v-show="$services.manager.connection() && !message">
				<input type="checkbox" v-model="allEntries" v-show="entries.length" @click="selectAllEntries"/>
				<span v-show="entries.length" @click="selectAllEntries">Select All</span>
				<span v-if="currentCategory">({{ currentCategory.name }})</span>
				<button @click="addEntry">Add</button>
				<button @click="deleteEntries">Delete</button>
			</div>
			<div v-for="entry in entries" class="item">
				<input type="checkbox" :value="entry" v-model="selectedEntries"/>
				<span>{{ entry.name }}</span>
			</div>
		</div>
		<div class="inserts" contenteditable="true">
			<div v-for="insert in inserts" :key="$index">{{ insert }}</div>
		</div>
	</div>
</template>