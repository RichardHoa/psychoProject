<script>
	import BoxBreathing from '$lib/components/BoxBreathing.svelte';
	import RoughIcon from '$lib/components/wired/RoughIcon.svelte';
	import { m } from '$lib/paraglide/messages.js';

	/**
	 * JavaScript enhancement: the /tho-vuong page opened as a modal over the current page via
	 * shallow routing (see the navbar link in the app layout). Closing is going back in history.
	 * @type {{ doneHref: string }}
	 */
	let { doneHref } = $props();

	/** @type {import('svelte/attachments').Attachment<HTMLDialogElement>} */
	function openModal(dialog) {
		dialog.showModal();
		return () => dialog.close();
	}

	/** @param {Event} e */
	function close(e) {
		e.preventDefault();
		history.back();
	}
</script>

<dialog
	aria-label={m.breathing_dialog_label()}
	class="breathing-dialog sketch-card fade-in m-auto w-[calc(100%-2rem)] max-w-sm rounded-3xl bg-surface-off-white p-6"
	oncancel={close}
	{@attach openModal}
>
	<a
		href={doneHref}
		onclick={close}
		class="sketch-button absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white text-text-subtle hover:text-text-main"
		aria-label={m.breathing_close()}
	>
		<RoughIcon name="close" size={16} stroke="currentColor" strokeWidth={1.8} />
	</a>
	<BoxBreathing {doneHref} onDone={close} headingTag="h2" />
</dialog>

<style>
	.breathing-dialog::backdrop {
		background-color: rgba(36, 43, 40, 0.6);
		backdrop-filter: blur(4px);
	}
</style>
