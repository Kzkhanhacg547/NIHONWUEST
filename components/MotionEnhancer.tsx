"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Progressive enhancement: content stays visible if JS or animation loading fails. */
export function MotionEnhancer() {
  const pathname = usePathname();
  useEffect(() => {
    let disposed = false;
    let cleanup: (() => void) | undefined;
    // Load only animation code after hydration; sourced from the supplied GSAP ZIP.
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")])
      .then(([{ gsap }, { ScrollTrigger }]) => {
        if (disposed) return;
        gsap.registerPlugin(ScrollTrigger);
        const mm = gsap.matchMedia();
        mm.add("(prefers-reduced-motion: no-preference)", () => {
          const main = document.getElementById("main");
          if (!main) return;
          const ctx = gsap.context(() => {
            // Hero intro: small stagger, transform/opacity only. No layout animation.
            gsap.from("[data-intro]", {
              y: 24,
              opacity: 0,
              duration: 0.85,
              stagger: 0.085,
              ease: "power3.out",
              clearProps: "transform,opacity",
            });
            gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
              gsap.from(el, {
                y: 22,
                opacity: 0,
                duration: 0.7,
                ease: "power2.out",
                clearProps: "transform,opacity",
                scrollTrigger: { trigger: el, start: "top 94%", once: true },
              });
            });
          }, main);
          return () => ctx.revert();
        });
        mm.add(
          "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
          () => {
            const listeners: Array<() => void> = [];
            // Keep parallax modest; never pin or intercept native scrolling.
            const ctx = gsap.context(() => {
              gsap.utils
                .toArray<HTMLElement>("[data-parallax]")
                .forEach((el) =>
                  gsap.to(el, {
                    y: 28,
                    ease: "none",
                    scrollTrigger: {
                      trigger: el,
                      start: "top top",
                      end: "bottom top",
                      scrub: 1,
                    },
                  }),
                );
              document
                .querySelectorAll<HTMLElement>("[data-magnetic], [data-tilt]")
                .forEach((el) => {
                  const magnetic = el.hasAttribute("data-magnetic");
                  const move = (event: PointerEvent) => {
                    const r = el.getBoundingClientRect();
                    const x = (event.clientX - r.left) / r.width - 0.5;
                    const y = (event.clientY - r.top) / r.height - 0.5;
                    gsap.to(
                      el,
                      magnetic
                        ? {
                            x: x * 7,
                            y: y * 7,
                            duration: 0.25,
                            overwrite: "auto",
                          }
                        : {
                            rotationX: -y * 3,
                            rotationY: x * 3,
                            transformPerspective: 900,
                            duration: 0.35,
                            overwrite: "auto",
                          },
                    );
                  };
                  const leave = () =>
                    gsap.to(el, {
                      x: 0,
                      y: 0,
                      rotationX: 0,
                      rotationY: 0,
                      duration: 0.55,
                      ease: "back.out(1.6)",
                      overwrite: "auto",
                      clearProps: "transform",
                    });
                  el.addEventListener("pointermove", move);
                  el.addEventListener("pointerleave", leave);
                  listeners.push(() => {
                    el.removeEventListener("pointermove", move);
                    el.removeEventListener("pointerleave", leave);
                    gsap.killTweensOf(el);
                    gsap.set(el, { clearProps: "transform" });
                  });
                });
            });
            return () => {
              listeners.forEach((fn) => fn());
              ctx.revert();
            };
          },
        );
        cleanup = () => mm.revert(); // Includes route changes, unmount, Strict Mode and preference changes.
        ScrollTrigger.refresh();
      })
      .catch(() => {
        /* Animation is optional; the application remains usable. */
      });
    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [pathname]);
  return null;
}
