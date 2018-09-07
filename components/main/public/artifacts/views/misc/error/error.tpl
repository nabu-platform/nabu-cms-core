<template id="nabu-cms-core-error">
	<div class="nabu nabu-cms nabu-cms-core-error">
		<p class="message error" v-if="message" v-content.compile="$window.decodeURIComponent(message)"></p>
		<p class="message error" v-if="!message">%{error: A problem has occurred, if it persists please contact an administrator}</p>
	</div>
</template>