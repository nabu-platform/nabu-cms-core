<template id="nabu-cms-core-language-switcher">
	<ul class="nabu nabu-cms nabu-cms-core-language-switcher" :class="layout">
		<li class="item"
			v-for="language in $services.language.available"
			:class="{'selected': $services.language.current == language }"
			@click="$services.language.current = language">
			<slot language="language"><span>{{ language.label }}</span></slot>
		</li>
	</ul>
</template>