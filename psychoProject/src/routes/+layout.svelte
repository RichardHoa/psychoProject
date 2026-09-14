<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import SearchModal from '$lib/components/SearchModal.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

<!-- Global Fullscreen Search Modal (Unconstrained by any parent container or backdrop-blur) -->
<SearchModal />
