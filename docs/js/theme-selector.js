function loadTheme() {
  const lightModeOn = localStorage.getItem("light-mode") === "true";
  if (!lightModeOn) {
    injectTheme();
  }
}

function injectTheme() {
  const url =
    "https://cdn.jsdelivr.net/npm/docsify-themeable@0/dist/css/theme-simple-dark.css";
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = url;

  const baseTheme = document.getElementById("base-theme");
  baseTheme.parentNode.insertBefore(link, baseTheme.nextSibling);
}

window.$toggleTheme = () => {
  const lightModeOn = localStorage.getItem("light-mode") === "true";
  localStorage.setItem("light-mode", !lightModeOn);
  window.location.reload();
};

const customCss = /*css*/ `
.theme-select {
  position: fixed;
  z-index: 1000;
  font-size: 20px;
  bottom: 15px;
  right: 15px;
  width: 35px;
  height: 35px;
  cursor: pointer;
  background-color: var(--theme-color);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
`;

function creteChangeThemeButton() {
  const lightModeOn = localStorage.getItem("light-mode") === "true";
  const themeButton = document.createElement("div");
  themeButton.classList.add("theme-select");
  themeButton.addEventListener("click", () => window.$toggleTheme());
  if (lightModeOn) {
    themeButton.innerText = "🌘";
  } else {
    themeButton.innerText = "☀️";
  }

  const style = document.createElement("style");
  style.innerHTML = customCss;

  document.body.appendChild(themeButton);
  document.head.appendChild(style);
}

function themePlugin(hook, _) {
  hook.ready(() => {
    loadTheme();
    creteChangeThemeButton();
  });
}

$docsify = $docsify || {};
$docsify.plugins = [...($docsify.plugins || []), themePlugin];
