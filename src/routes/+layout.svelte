<script>
  import "./styles.css";
</script>

<div class="app">
  <!-- TODO: Add a header -->
  <main>
    <slot />
  </main>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    justify-content: center;
    align-items: center;
    overflow: hidden;

    background: var(--wallpaper);
  }
</style>
