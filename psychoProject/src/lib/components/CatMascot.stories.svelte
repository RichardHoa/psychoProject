<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import CatMascot from './CatMascot.svelte';

	const { Story } = defineMeta({
		title: 'Components/CatMascot',
		component: CatMascot,
		tags: ['autodocs']
	});
</script>

<Story name="Default">
	<div class="relative h-48 w-48 bg-[#EDE8DF]">
		<CatMascot class="absolute right-4 bottom-4" />
	</div>
</Story>

<Story name="Navbar Icon (Clickable)">
	<div class="flex h-16 w-64 items-center bg-surface-off-white px-4">
		<CatMascot
			autoplay={false}
			onActivate={() => alert('Navigated home!')}
			sizeClass="h-11 w-11"
			class="shrink-0"
		>
			{#snippet children()}
				<span class="text-xl font-black tracking-tight text-primary">MÈO</span>
			{/snippet}
		</CatMascot>
	</div>
</Story>
