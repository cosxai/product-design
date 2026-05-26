import { useLocation } from "react-router-dom";
import { useTheme, Topbar, Breadcrumb, Button } from "@cosx/ui";

// Now built from the kit's own <Topbar> + <Breadcrumb>. The
// docs-site-specific bit is the theme/chrome toggle in the right
// slot, plus mapping the current pathname to a crumb chain.

const SEGMENT_LABELS: Record<string, string> = {
  installation: "Installation",
  theming: "Theming",
  tokens: "Tokens",
  components: "Components",
  layout: "Layout",
  button: "Button",
  shell: "Shell + rails",
  breadcrumb: "Breadcrumb",
  "right-panel": "RightSidebarPanel",
  "sticky-banner": "StickyBanner",
  editorial: "Editorial",
};

// Cycle through all built-in chromes — easier than a 4-way picker
// in the topbar's narrow slot.
const CHROME_CYCLE = ["seamless", "classic", "editorial", "neobrutalism", "ambient", "swiss", "terminal", "bento", "frutiger", "riso", "sketch"] as const;
function nextChrome(c: string): (typeof CHROME_CYCLE)[number] {
  const i = CHROME_CYCLE.indexOf(c as (typeof CHROME_CYCLE)[number]);
  return CHROME_CYCLE[(i + 1) % CHROME_CYCLE.length]!;
}

function pathToCrumbs(pathname: string): string[] {
  if (pathname === "/") return ["Overview"];
  const parts = pathname.split("/").filter(Boolean);
  return parts.map((p) => SEGMENT_LABELS[p] ?? p);
}

export function DocsTopbar() {
  const { theme, toggleTheme, chrome, setChrome } = useTheme();
  const { pathname } = useLocation();
  const crumbs = ["@cosx/ui", ...pathToCrumbs(pathname)];
  return (
    <Topbar
      left={<Breadcrumb items={crumbs} />}
      right={
        <>
          <Button
            variant="ghost"
            onClick={() => setChrome(nextChrome(chrome))}
            title="Cycle chrome variant (seamless · classic · editorial)"
          >
            chrome · {chrome}
          </Button>
          <Button
            variant="ghost"
            onClick={toggleTheme}
            title="Toggle light / dark"
          >
            {theme === "dark" ? "☾" : "☀"} {theme}
          </Button>
        </>
      }
    />
  );
}
