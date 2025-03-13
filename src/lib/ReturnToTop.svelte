<!-- src/lib/ReturnToTop.svelte -->
<script lang="ts">
	const scrollToTop = () => {
		const topEl = document.getElementById('top');
		if (topEl) {
			topEl.scrollIntoView({ behavior: 'smooth' });
			// Update URL hash to "#top"
			history.replaceState(null, '', '#top');
		}
	};
</script>

<button class="return-to-top" on:click={scrollToTop}> ↑ Top </button>

<style>
	.return-to-top {
		position: fixed;
		bottom: 20px;
		right: 20px;
		background: rgba(0, 0, 0, 0.3);
		color: #fff;
		border: none;
		border-radius: 4px;
		padding: 0.5rem 1rem;
		cursor: pointer;
		opacity: 0.5;
		transition: opacity 0.3s;
		font-size: 0.9rem;
		z-index: 1000;
	}
	.return-to-top:hover {
		opacity: 1;
	}
</style>
