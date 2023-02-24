<script>
  // @ts-nocheck

  import TerminalHead from "../components/TerminalHead.svelte";
  import TerminalBody from "../components/TerminalBody.svelte";
  import { maximize } from "../store/stores";
  import Dragable from "../components/Dragable.svelte";
  import { browser } from "$app/environment";

  // FIXME: The Dragable not working

  if (browser) {
    document.body.setAttribute("data-theme", "dark");
  }
</script>

<Dragable>
  <div class="terminal">
    <TerminalHead />
    <TerminalBody />
  </div>
</Dragable>

<style>
  .terminal {
    overflow: hidden;
    background-color: var(--color-bg-tertiary);
    color: var(--color-text-primary);
    border-radius: 8px;
    box-shadow: 0 0 185px -50px #484848;
    height: 100%;
    min-height: 500px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  @media (max-width: 768px) {
    .terminal {
      min-height: 100%;
      height: 100%;
    }
  }
</style>
