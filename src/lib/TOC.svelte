<!-- src/lib/TOC.svelte -->
<script><script>
  export let chapters: { slug: string, title: string }[] = [];
</script></script>

<nav class="toc">
  <ul>
    {#each chapters as chapter}
      <li><a href={"#" + chapter.slug}>{chapter.title}</a></li>
    {/each}
  </ul>
</nav>

<style>
  .toc {
    margin: 2rem 0;
    text-align: center;
    /* For wide screens, the TOC wraps if needed */
  }

  .toc ul {
    list-style: none;
    padding: 0;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap; /* wrap onto multiple lines if too wide */
    justify-content: center;
    gap: 1rem;
  }

  /* Prevent line breaks within each chapter link */
  .toc li {
    margin: 0;
    white-space: nowrap;
  }

  .toc a {
    font-size: 1.2rem;
    text-decoration: none;
    color: var(--text-color);
  }

  .toc a:hover {
    text-decoration: underline;
  }

  /* Mobile styles */
  @media (max-width: 600px) {
    .toc {
      margin: 1rem 0;
    }

    .toc ul {
      /* flex-wrap: nowrap; /* Don’t wrap, allow horizontal scroll instead */ */
      gap: 0.5rem;
    }

    .toc a {
      font-size: 2.5vw;
    }
  }
</style>
