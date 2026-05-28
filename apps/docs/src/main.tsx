import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider, DialogsProvider, ActionBarProvider, CommandProvider } from "@cosxai/ui";
import "@cosxai/ui/styles.css";
import "./styles.css";
import { App } from "./App";
import { OverviewPage } from "./routes/index";
import { InstallationPage } from "./routes/installation";
import { ThemingPage } from "./routes/theming";
import { TokensPage } from "./routes/tokens";
import { ButtonPage } from "./routes/components/button";
import { PrimitivesPage } from "./routes/components/primitives";
import { BonusPage } from "./routes/components/bonus";
import { DialogsPage } from "./routes/components/dialogs";
import { ShellPage } from "./routes/components/layout/shell";
import { BreadcrumbPage } from "./routes/components/layout/breadcrumb";
import { RightPanelPage } from "./routes/components/layout/right-panel";
import { StickyBannerPage } from "./routes/components/layout/sticky-banner";
import { ActionBarPage } from "./routes/components/action-bar";
import { CommandPalettePage } from "./routes/components/command-palette";
import { PwaPage } from "./routes/pwa";
import { EditorialPage } from "./routes/editorial";
import { NeobrutalismPage } from "./routes/neobrutalism";
import { AmbientPage } from "./routes/ambient";
import { SwissPage } from "./routes/swiss";
import { TerminalPage } from "./routes/terminal";
import { BentoPage } from "./routes/bento";
import { RisoPage } from "./routes/riso";
import { SketchPage } from "./routes/sketch";

// Tiny dot used as the icon for category heads in the demo bar.
// Real consumer apps supply proper category icons.
function DotIcon() {
  return (
    <span
      style={{
        display: "inline-block",
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: "currentColor",
        opacity: 0.5,
      }}
    />
  );
}

// v7 data-router. Replaces the legacy <BrowserRouter> wrap which
// had StrictMode-related navigation-drop issues in v7.x on React
// 19. App becomes the layout route (sidebar + outlet); each page
// is a child route rendered into <Outlet />.
// Using `element: <X />` instead of `Component: X`. The `Component`
// prop is newer in v7 and has known navigation-drop regressions in
// 7.15.x under StrictMode — element JSX avoids them. Functionally
// equivalent, just different timing of when React Router materialises
// the route subtree.
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <OverviewPage /> },
      { path: "installation", element: <InstallationPage /> },
      { path: "theming", element: <ThemingPage /> },
      { path: "tokens", element: <TokensPage /> },
      { path: "components/button", element: <ButtonPage /> },
      { path: "components/primitives", element: <PrimitivesPage /> },
      { path: "components/bonus", element: <BonusPage /> },
      { path: "components/dialogs", element: <DialogsPage /> },
      { path: "components/layout/shell", element: <ShellPage /> },
      { path: "components/layout/breadcrumb", element: <BreadcrumbPage /> },
      { path: "components/layout/right-panel", element: <RightPanelPage /> },
      { path: "components/layout/sticky-banner", element: <StickyBannerPage /> },
      { path: "components/action-bar", element: <ActionBarPage /> },
      { path: "components/command-palette", element: <CommandPalettePage /> },
      { path: "pwa", element: <PwaPage /> },
      { path: "editorial", element: <EditorialPage /> },
      { path: "neobrutalism", element: <NeobrutalismPage /> },
      { path: "ambient", element: <AmbientPage /> },
      { path: "swiss", element: <SwissPage /> },
      { path: "terminal", element: <TerminalPage /> },
      { path: "bento", element: <BentoPage /> },
      { path: "riso", element: <RisoPage /> },
      { path: "sketch", element: <SketchPage /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider
      themeStorageKey="cosx-docs-theme"
      chromeStorageKey="cosx-docs-chrome"
      defaultTheme="system"
      defaultChrome="seamless"
    >
      <DialogsProvider>
        <CommandProvider>
          <ActionBarProvider
            categories={{
              view: { label: "View", icon: <DotIcon /> },
              share: { label: "Share", icon: <DotIcon /> },
              create: { label: "Create", icon: <DotIcon /> },
            }}
          >
            <RouterProvider router={router} />
          </ActionBarProvider>
        </CommandProvider>
      </DialogsProvider>
    </ThemeProvider>
  </StrictMode>,
);
