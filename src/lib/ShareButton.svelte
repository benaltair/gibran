<!-- src/lib/ShareButton.svelte -->
<script lang="ts">
	async function shareContent() {
		const shareData = {
			title: document.title,
			text: 'Check out this book: ' + document.title,
			url: window.location.href
		};

		if (navigator.share) {
			try {
				await navigator.share(shareData);
			} catch (err) {
				console.error('Error sharing:', err);
			}
		} else if (navigator.clipboard) {
			try {
				await navigator.clipboard.writeText(window.location.href);
				alert('URL copied to clipboard!');
			} catch (err) {
				console.error('Error copying URL:', err);
			}
		} else {
			alert('Sharing not supported on this browser.');
		}
	}
</script>

<button class="share-button" on:click={shareContent}> Share </button>

<style>
	.share-button {
		position: fixed;
		bottom: 20px;
		right: 100px; /* Adjust offset as needed so it's next to the top button */
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
	.share-button:hover {
		opacity: 1;
	}
</style>
