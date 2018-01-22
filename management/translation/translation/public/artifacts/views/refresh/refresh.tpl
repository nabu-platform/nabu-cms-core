<template id="translationRefresh">
	<div>
		<p v-if="refreshing" class="message">Refreshing, this may take a while...</p>
		<p v-if="!refreshing && $services.manager.connection()"><button class="info" @click="refresh">Refresh!</button></p>
		<p v-if="!refreshing && !$services.manager.connection()">Select a connection</p>
	</div>
</template>