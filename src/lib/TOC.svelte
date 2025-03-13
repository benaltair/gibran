<!-- src/lib/TOC.svelte -->
<script>
	export let chapters = [];
</script>

<nav class="toc">
	<ul>
		{#each chapters as chapter}
			<li><a href="#{chapter.slug}">{chapter.title}</a></li>
		{/each}
	</ul>
</nav>
