<script>
  import Terminal from "./Terminal.svelte";
</script>

<svelte:head>
  <title>Welcome to Husnu's Website</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<section class="wallpaper" aria-label="Welcome to SvelteKit">
  <Terminal />
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  @media (max-width: 1280px) {
    section {
      padding: 30px;
    }
  }

  h1 {
    width: 100%;
  }
</style>
