<template id="node-tags">
	<div class="node-tags">
		<div class="node-tag" v-for="tag in tags">
			<span class="name">{{ $services.masterdata.resolve(tag) }}</span>
		</div>
	</div>
</template>

<template id="node-tags-editor">
	<div class="node-tags-editor">
		<div class="node-tags set-tags">
			<div class="node-tag" v-for="tag in setTags">
				<span class="name">{{ $services.masterdata.resolve(tag) }}</span>
				<span class="fa fa-times" @click="removeTag(tag)"></span>
			</div>
		</div>
		<button @click="showAvailable = !showAvailable" class="add-tag"><span class="fa" :class="{'fa-plus': !showAvailable, 'fa-minus': showAvailable }"></span><span class="title">%{Add Tag}</span></button>
		<div class="node-tags available-tags"v-if="showAvailable">
			<div class="node-tag" v-for="tag in availableTags">
				<span @click="addTag(tag)" class="name">{{ $services.masterdata.resolve(tag) }}</span>
			</div>
		</div>
	</div>
</template>