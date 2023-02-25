<script>
  // @ts-nocheck

  let buttons = [
    {
      id: 1,
      name: "Close",
      color: "#D83B3B",
    },
    {
      id: 2,
      name: "Minimize",
      color: "#E2C423",
      click: () => {
        changeState();
      },
    },
    {
      id: 3,
      name: "Maximize",
      color: "#03CA0B",
      click: () => {},
    },
  ];

  console.log(
    "%cHi there! 👋",
    "font-size: 2rem; font-weight: bold; color: #ff3e00"
  );

  console.log(
    "%cI'm Hüsnü, a software developer from Turkey. I'm currently working at @nono.company. I'm interested in web development, design, and open source. I'm also a big fan of the indie web movement.",
    "font-size: 1.2rem; font-weight: bold; color: #000"
  );

  console.log(
    "%cYou can find me on Twitter, GitHub, and LinkedIn.",
    "font-size: 1.2rem; font-weight: bold; color: #000"
  );
  console.log(
    "%c Please write 'social' in the terminal to see my social media links.",
    "font-size: 1.2rem; font-weight: bold; color: #000"
  );

  console.log(
    "%cIf you want to contact me, you can send me an email at [hsnlbnan@gmail.com]",
    "font-size: 1.2rem; font-weight: bold; color: #000"
  );
</script>

<div class="head">
  <div class="buttons">
    {#each buttons as button (button.id)}
      <button
        class={"button"}
        style={`background-color: ${button.color}`}
        on:click={button.click}
      />
    {/each}
  </div>
  <h3 class="head-title">hsnlbnan@mac ~ %</h3>
</div>

<style>
  .head {
    display: flex;
    align-items: center;
    width: 100%;
    background-color: var(--color-bg-secondary);
    height: 48px;
  }

  .head-title {
    margin: 0 auto;
    color: var(--color-text-primary);
  }

  .buttons {
    margin-left: 16px;
  }

  .button {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: none;
    margin: 0 5px;
  }
</style>
