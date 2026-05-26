import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// "On this page" sticky right-side ToC, like shadcn / Stripe / MDN.
// Scans the rendered .docs-main subtree for h2/h3, auto-assigns ids
// (slugified from text content), uses IntersectionObserver to track
// which section is currently in view, and renders a sticky column
// with active highlight. No per-page wiring — the component does
// everything off the rendered DOM.

interface Heading {
  id: string;
  level: 2 | 3;
  text: string;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function DocsOnThisPage() {
  const { pathname } = useLocation();
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Extract headings after route change. RAF gives the new route's
  // tree a frame to mount; without it we'd query the previous page.
  useEffect(() => {
    let cancelled = false;
    const raf = requestAnimationFrame(() => {
      if (cancelled) return;
      const main = document.querySelector(".docs-main");
      if (!main) {
        setHeadings([]);
        return;
      }
      const nodes = Array.from(main.querySelectorAll("h2, h3")) as HTMLElement[];
      const seen = new Set<string>();
      const out: Heading[] = [];
      for (const n of nodes) {
        const text = (n.textContent ?? "").trim();
        if (!text) continue;
        let id = n.id;
        if (!id) {
          const base = slugify(text);
          id = base;
          let i = 1;
          while (seen.has(id)) {
            id = `${base}-${i++}`;
          }
          n.id = id;
        }
        seen.add(id);
        out.push({
          id,
          level: n.tagName === "H2" ? 2 : 3,
          text,
        });
      }
      setHeadings(out);
      setActiveId(out[0]?.id ?? null);
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [pathname]);

  // Scroll spy. Trigger zone is the top 30% of the viewport — a
  // heading becomes "active" as it scrolls under the top 80 px and
  // remains active until the next heading takes over.
  useEffect(() => {
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the heading closest to (but past) the trigger line.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top,
          );
        if (visible.length > 0 && visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        // Triggers when a heading is between 80 px from top and
        // 30 % from the bottom — produces the "active becomes active
        // as you scroll under it" feel.
        rootMargin: "-80px 0px -70% 0px",
        threshold: 0,
      },
    );
    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  const onClickAnchor = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <aside className="docs-toc" aria-label="On this page">
      <div className="docs-toc__heading">On this page</div>
      <ul className="docs-toc__list">
        {headings.map((h) => (
          <li
            key={h.id}
            className={`docs-toc__item docs-toc__item--lvl${h.level}`}
            data-active={activeId === h.id ? "true" : undefined}
          >
            <a
              href={`#${h.id}`}
              onClick={(e) => onClickAnchor(e, h.id)}
              className="docs-toc__link"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
