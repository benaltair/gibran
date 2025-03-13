<script lang="ts">
	import { onMount, tick } from 'svelte';
	import ReturnToTop from '$lib/ReturnToTop.svelte';
	import ShareButton from '$lib/ShareButton.svelte';
	import InfoButton from '$lib/InfoButton.svelte';

	interface Chapter {
		slug: string;
		title: string;
		order: number;
		component: any;
	}

	const modules = import.meta.glob('$lib/chapters/*.svx', { eager: true });
	let chapters: Chapter[] = [];
	for (const filePath in modules) {
		const mod = modules[filePath];
		chapters.push({
			slug: mod.metadata.slug || filePath.split('/').pop()?.replace('.svx', '') || 'unknown',
			title: mod.metadata.title,
			order: mod.metadata.order || 0,
			component: mod.default
		});
	}
	chapters.sort((a, b) => a.order - b.order);

	const bookTitle = 'The Prophet';
	const author = 'Khalil Gibran';

	onMount(async () => {
		await tick();
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const id = entry.target.id;
						const current = chapters.find((ch) => ch.slug === id);
						if (current) {
							document.title = `${current.title} - ${bookTitle} - ${author}`;
						}
						history.replaceState(null, '', `#${id}`);
					}
				});
			},
			{
				threshold: 0.1, // trigger when 10% of the chapter is visible
				rootMargin: '0px 0px -80% 0px' // extend the bottom boundary upward so the chapter counts earlier
			}
		);

		const sections = document.querySelectorAll('section.chapter');
		sections.forEach((section) => observer.observe(section));

		if (window.location.hash) {
			const el = document.querySelector(window.location.hash) as HTMLElement | null;
			if (el) el.scrollIntoView({ behavior: 'smooth' });
		}
	});
</script>

<svelte:head>
	<title>{bookTitle} - {author}</title>
</svelte:head>

<nav class="nav">
	{#each chapters as chapter}
		<a href={'#' + chapter.slug}>{chapter.title}</a>
	{/each}
</nav>

<main id="top">
	{#each chapters as chapter}
		<section class="chapter" id={chapter.slug}>
			<svelte:component this={chapter.component} />
		</section>
	{/each}
</main>

<ReturnToTop />
<ShareButton />
<InfoButton />
