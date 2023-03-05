<script>
  // @ts-nocheck

  import { browser } from "$app/environment";
  import { t, locale, locales } from "../i18n";

  //detect language from browser and set it
  if (browser) {
    const browserLanguage = navigator.language.split("-")[0];
    if (window.localStorage.getItem("lang") === null) {
      if (locales.includes(browserLanguage)) {
        locale.set(browserLanguage);
      } else {
        locale.set("en");
      }
    }
  }

  let text = "";

  let writtenCommands = [];

  let terminalTexts = [
    {
      text: `terminal.title`,
      type: "text",
      hasTranslation: true,
    },
    {
      text: `terminal.welcome`,
      type: "text",
      hasTranslation: true,
    },
    {
      text: "terminal.help",
      type: "text",
      hasTranslation: true,
    },
  ];

  let commands = [
    {
      name: `help`,
      description: "List all available commands",
      execute: () => {
        handleFocusInput();
        terminalTexts = [
          ...terminalTexts,
          {
            text: `social - ${$t("description.list")}`,
            type: "text",
          },
          {
            text: `cv - ${$t("description.cv")}`,
            type: "text",
          },
          {
            text: `mail - ${$t("description.mail")}`,
            type: "text",
          },
          {
            text: `lang - ${$t("description.lang")}`,
            type: "text",
          },
          {
            text: `theme - ${$t("description.theme")}`,
            type: "text",
          },
        ];
      },
    },

    {
      name: "set",
      description: "Set a variable",
      execute: () => {},
    },
    {
      name: "social",
      description: "List all available social media",
      execute: () => {
        handleFocusInput();
        terminalTexts = [
          ...terminalTexts,
          {
            text: "twitter",
            link: "https://twitter.com/hsnlbnan",
            type: "link",
          },
          {
            text: "instagram",
            link: "https://www.instagram.com/hsnlbnan/",
            type: "link",
          },
          {
            text: "github",
            link: "https://github.com/hsnlbnan",
            type: "link",
          },
          {
            text: "LinkedIn",
            link: "https://www.linkedin.com/in/husnu/",
            type: "link",
          },
        ];
      },
    },
    {
      name: "cv",
      description: "Download my CV",
      execute: () => {
        handleFocusInput();
        window.open("/cv.pdf", "_blank").focus();
      },
    },
    {
      name: "mail",
      description: "Send me an email",
      execute: () => {
        handleFocusInput();
        window.open("mailto:hsnlbnan@gmail.com", "_blank").focus();
      },
    },
    {
      name: "twitter",
      description: "Open my Twitter profile",
      execute: () => {
        handleFocusInput();
        window.open("https://twitter.com/hsnlbnan", "_blank").focus();
      },
    },

    {
      name: "instagram",
      description: "Open my Instagram profile",
      execute: () => {
        handleFocusInput();
        window.open("https://www.instagram.com/hsnlbnan/", "_blank").focus();
      },
    },
    {
      name: "github",
      description: "Open my Github profile",
      execute: () => {
        handleFocusInput();
        window.open("https://github.com/hsnlbnan", "_blank").focus();
      },
    },
    {
      name: "linkedin",
      description: "Open my LinkedIn profile",
      execute: () => {
        handleFocusInput();
        window.open("https://www.linkedin.com/in/husnu/", "_blank").focus();
      },
    },

    {
      name: "lang",
      description: "Change language",
      execute: () => {
        handleFocusInput();
        terminalTexts = [
          ...terminalTexts,
          {
            text: "en",
            type: "text",
          },
          {
            text: "tr",
            type: "text",
          },
        ];
      },
    },
    {
      name: "en",
      description: "Change language to English",
      execute: () => {
        handleFocusInput();
        locale.set("en");
        window.localStorage.setItem("locale", "en");

        terminalTexts = [
          ...terminalTexts,
          {
            text: "Language changed to English",
            type: "text",
          },
        ];
      },
    },
    {
      name: "tr",
      description: "Change language to Turkish",
      execute: () => {
        handleFocusInput();
        locale.set("tr");
        window.localStorage.setItem("locale", "tr");
        terminalTexts = [
          ...terminalTexts,
          {
            text: "Dil Türkçe olarak değiştirildi",
            type: "text",
          },
        ];
      },
    },

    {
      name: "theme",
      description: "Change theme",
      execute: () => {
        handleFocusInput();
        terminalTexts = [
          ...terminalTexts,
          {
            text: "light",
            type: "text",
          },
          {
            text: "dark",
            type: "text",
          },
        ];
      },
    },
    {
      name: "light",
      description: "Change theme to light",
      execute: () => {
        handleFocusInput();
        document.body.attributes.removeNamedItem("data-theme");

        terminalTexts = [
          ...terminalTexts,
          {
            text: "Theme changed to light",
            type: "text",
          },
        ];
      },
    },
    {
      name: "dark",
      description: "Change theme to dark",
      execute: () => {
        handleFocusInput();
        document.body.setAttribute("data-theme", "dark");
        terminalTexts = [
          ...terminalTexts,
          {
            text: "Theme changed to dark",
            type: "text",
          },
        ];
      },
    },
  ];

  /**
   * @param {{ target: { value: string; }; }} event
   */
  function handleInput(event) {
    text = event.target.value;
  }

  function handleEnter() {
    if (text === "") return;

    writtenCommands = [...writtenCommands, text];

    const command = commands.find((command) => command.name === text);

    if (command) {
      command.execute();
      handleFocusInput();
    } else {
      terminalTexts = [
        ...terminalTexts,
        {
          text: `${$t("terminal.error")}`,
          type: "text",
        },
      ];
    }

    terminalTexts = [
      ...terminalTexts,
      {
        text: text,
        type: "input",
      },
    ];

    text = "";
  }

  function handleKeydown(event) {
    switch (event.key) {
      case "Enter":
        handleEnter();
        break;

      default:
        break;
    }
  }

  function handleFocusInput() {
    const input = document.querySelector(".terminal-input");
    input.focus();
  }
</script>

<div class="terminal-body">
  <div class="terminal-body__content">
    {#each terminalTexts as terminalText}
      {#if terminalText.type === "text"}
        {#if terminalText.hasTranslation}
          <p>{$t(terminalText.text)}</p>
        {:else}
          <p>{terminalText.text}</p>
        {/if}
      {:else if terminalText.type === "link"}
        <a href={terminalText.link} target="_blank" n rel="noopener noreferrer">
          >
          {terminalText.text}
        </a>
      {/if}
    {/each}
    <input
      class="terminal-input"
      type="text"
      bind:value={text}
      placeholder={`${$t("terminal.placeholder")}`}
      on:change={handleInput}
      on:keydown={handleKeydown}
    />
  </div>
</div>

<style>
  p {
    margin: 0;
    padding: 0;
    max-width: 800px;
    width: 100%;
  }

  input::placeholder {
    color: #b6b6b6;
  }

  a {
    font-family: var(--font-mono);
    font-weight: bold;
  }
  .terminal-body {
    background-color: var(--color-bg-tertiary);
    color: var(--color-text-primary);
    font-family: monospace;
    font-size: 1.2rem;
    overflow: auto;
    padding: 1rem;
  }

  .terminal-body__content {
    height: 100%;
    max-height: 400px;
  }

  .terminal-input {
    border: none;
    font-family: var(--font-mono);
    font-size: 1.2rem;
    outline: none;
    width: 100%;
    background-color: var(--color-bg-tertiary);
    color: var(--color-text-primary);
  }

  @media (max-width: 1280px) {
    .terminal-input {
      font-size: 0.7rem;
    }
  }
</style>
