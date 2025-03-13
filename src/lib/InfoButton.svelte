<!-- src/lib/InfoButton.svelte -->
<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	let showModal = false;

	function toggleModal() {
		showModal = !showModal;
		if (showModal && typeof window !== 'undefined') {
			// Focus the overlay for keyboard accessibility
			setTimeout(() => {
				const overlay = document.getElementById('infoModal');
				overlay?.focus();
			}, 0);
		}
	}

	function closeModal() {
		showModal = false;
	}

	function closeIfOverlay(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			closeModal();
		}
	}

	function handleKey(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			closeModal();
		}
	}

	onMount(() => {
		if (typeof window !== 'undefined') {
			window.addEventListener('keydown', handleKey);
		}
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('keydown', handleKey);
		}
	});
</script>

<button
	class="info-button"
	on:click={toggleModal}
	aria-haspopup="dialog"
	aria-expanded={showModal ? 'true' : 'false'}
	aria-label="Show information about this project"
>
	ℹ
</button>

{#if showModal}
	<div
		class="modal-overlay"
		role="dialog"
		aria-modal="true"
		aria-labelledby="infoModalTitle"
		id="infoModal"
		tabindex="0"
		on:click={closeIfOverlay}
		on:keydown={handleKey}
	>
		<!-- Added role="presentation" to the inner modal -->
		<div class="modal" role="presentation" on:click|stopPropagation>
			<button class="close" on:click={closeModal} aria-label="Close dialog">×</button>
			<p>
				This book holds a special place in my heart. After a previous online version went down, I
				decided to create this project as a simple, elegant way for anyone to read it. I hope you
				enjoy it as much as I do.
			</p>
			<p style="text-align: right;">-Ben</p>
		</div>
	</div>
{/if}

<style>
	.info-button {
		position: fixed;
		bottom: 20px;
		left: 20px;
		background: rgba(0, 0, 0, 0.3);
		color: #fff;
		border: none;
		border-radius: 50%;
		width: 40px;
		height: 40px;
		font-size: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		opacity: 0.5;
		transition: opacity 0.3s;
		z-index: 1000;
	}
	.info-button:hover {
		opacity: 1;
	}
	.modal-overlay {
		position: fixed;
		inset: 0;
		background: transparent;
		z-index: 1001;
	}
	.modal {
		/* Added role="presentation" below to satisfy a11y requirements */
		position: fixed;
		bottom: 80px;
		left: 20px;
		background: rgba(255, 255, 255, 0.95);
		color: #333;
		border: 1px solid #ccc;
		border-radius: 4px;
		padding: 1rem;
		width: 250px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
		z-index: 1002;
	}
	.modal::after {
		content: '';
		position: absolute;
		bottom: -10px;
		left: 20px;
		border-width: 10px 10px 0;
		border-style: solid;
		border-color: rgba(255, 255, 255, 0.95) transparent;
		display: block;
		width: 0;
	}
	.close {
		position: absolute;
		top: 5px;
		right: 5px;
		background: transparent;
		border: none;
		font-size: 1rem;
		cursor: pointer;
	}
</style>
