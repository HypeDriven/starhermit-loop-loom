// The look of the menus, HUD, rails and dialogs: the browser build's
// index.html stylesheet, rewritten class-based in tools/ui-style.css and
// converted once with `starhermit css` into assets/ui-style.json (`npm run
// css`), registered at start with the theme the runtime's own widgets
// (checkboxes, selects, dialogs, scroll bars) take, in the system sans. The
// browser build's body.high-contrast palette is a token set here, applied
// while the runtime's high-contrast option is on (the menu backdrop image is
// dropped then, as before).
import { files } from "starhermit:engine";
import * as ui from "starhermit:ui";

type Tokens = Record<string, string | number>;
let base: Tokens = {};
/** index.html body.high-contrast: black panels, white text, a gold accent, strong blue buttons. */
const HIGH_CONTRAST: Tokens = {
  bg: "#000000", panel: "#000000", panel2: "#111111", text: "#ffffff", soft: "#ffffff", dim: "#dddddd",
  accent: "#ffd700", btn: "#005fcc", "btn-hover": "#1a70dd", line: "#ffffff",
};

export function initStyles(): void {
  const css = files.readJson("assets/ui-style.json") as unknown as ui.CssStyles;
  base = { ...(css.tokens as Tokens) };
  ui.setFont({ family: "sans-serif" });
  ui.setTheme({
    fontSize: 16, smallSize: 13, headingSize: 28, padding: 8, spacing: 8, radius: 9,
    text: "#eef1f5", muted: "#9aa4b2", panel: "#1c2028", control: "#22262f", hovered: "#2c313c",
    pressed: "#1a1d24", field: "#15181e", accent: "#e8c07a", focus: "#e8c07a", outline: "#3a4150",
  });
  ui.setTokens(css.tokens);
  ui.setAnimations(css.animations);
  ui.setStyles({
    ...css.styles,
    label: { text: { color: "$text" } },
    paragraph: { text: { color: "$text" } },
    heading: { text: { color: "$text" } },
    widget: { focusRing: { color: "$accent", width: 3, offset: 2 } },
    checkbox: {
      text: { color: "$text" }, minHeight: 44,
      parts: { box: { background: "$panel2", border: { width: 2, color: "$line" }, radius: 4 }, mark: { background: "$accent" } },
    },
    select: { background: "$panel2", border: { width: 1, color: "$line" }, radius: 7, text: { color: "$text" }, minHeight: 40 },
    dialog: { background: "$panel", radius: 14, padding: 24, parts: { backdrop: { background: "#00000080" } } },
    scrollArea: { parts: { bar: { background: "$line", radius: 4 } } },
    tooltip: { background: "$panel", text: { color: "$text" }, radius: 6, padding: 6 },
  });
}

let key = "";
/** The high-contrast tokens over the sheet's while the runtime's option is on. */
export function applyPalette(highContrast: boolean): void {
  const k = String(highContrast);
  if (k === key) return;
  key = k;
  ui.setTokens({ ...base, ...(highContrast ? HIGH_CONTRAST : {}) });
}
