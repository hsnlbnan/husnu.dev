<script>
  import Terminal from "./Terminal.svelte";
</script>

<svelte:head>
  <title>Welcome to Husnu's Website</title>
  <meta name="description" content="Svelte demo app" />

  <meta property="og:title" content="Welcome to Husnu's Website" />
  <meta
    property="og:description"
    content="Husnu Lubnan is a Frontend Developer who loves to build things with JavaScript. He is currently working at a @Nono Company"
  />
  <meta property="og:image" content="/og.png" />
  <meta property="og:url" content="https://husnu.dev" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@hsnlbnan" />
  <meta name="twitter:creator" content="@hsnlbnan" />
  <meta name="twitter:title" content="Welcome to Husnu's Website" />
  <meta
    name="twitter:description"
    content="Husnu Lubnan is a Frontend Developer who loves to build things with JavaScript. He is currently working at a @Nono Company"
  />
  <meta name="twitter:image" content="/og.png" />
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
</style>
