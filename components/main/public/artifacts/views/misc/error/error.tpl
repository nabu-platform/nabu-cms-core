<template id="nabu-cms-core-error">
	<div id="nabu nabu-cms nabu-cms-core-error">
		<p class="message error" v-if="message" v-content.compile="message"></p>
		<p class="message error" v-if="!message">%{error: A problem has occurred, if it persists please contact an administrator}</p>
	</div>
</template>