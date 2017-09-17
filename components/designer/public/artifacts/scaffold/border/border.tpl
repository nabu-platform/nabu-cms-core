<template id="nabu-design-scaffold-border">
	<div class="nabu-design-scaffold-border">
		<div :id="name ? name + '_top' : 'top'" class="border-top"></div>
		<div class="border-content">
			<div :id="name ? name + '_left' : 'left'" class="border-left"></div>
			<div :id="name ? name + '_main' : 'main'" class="border-main"></div>
			<div :id="name ? name + '_right' : 'right'" class="border-right"></div>
		</div>
		<div :id="name ? name + '_bottom' : 'bottom'" class="border-bottom"></div>
	</div>
</template>