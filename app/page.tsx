"use client";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";
import "../styles/home.scss";

export default function Home() {
  useEffect(() => {
      if (typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);

  gsap.to("img", { opacity: 1, delay: 0.1 });

  let iteration = 0;

  const spacing = 0.1;
  const snap = gsap.utils.snap(spacing);
  const cards = gsap.utils.toArray(".cards li") as Element[];
  const seamlessLoop = buildSeamlessLoop(cards, spacing);
  const scrub = gsap.to(seamlessLoop, {
    totalTime: 0,
    duration: 0.5,
    ease: "power3",
    paused: true,
  });

  const wrappingMap = new WeakMap<object, boolean>();

  const trigger = ScrollTrigger.create({
    start: "top top",
    end: "+=5000", // Adjust this value for scroll distance
    scrub: 0.5, // ADD THIS - links scroll position to animation
    pin: ".gallery",
    onUpdate(self: ScrollTrigger) {
      const isWrapping = wrappingMap.get(self) || false;
      if (self.progress === 1 && self.direction > 0 && !isWrapping) {
        wrapForward(self);
      } else if (
        self.progress < 1e-5 &&
        self.direction < 0 &&
        !isWrapping
      ) {
        wrapBackward(self);
      } else {
        scrub.vars.totalTime = snap(
          (iteration + self.progress) * seamlessLoop.duration()
        );
        scrub.invalidate().restart();
        wrappingMap.set(self, false);
      }
    },
  });

    function wrapForward(trigger: ScrollTrigger) {
      iteration++;
      wrappingMap.set(trigger, true);
      trigger.scroll(trigger.start + 1);
    }

    function wrapBackward(trigger: ScrollTrigger) {
      iteration--;
      if (iteration < 0) {
        iteration = 9;
        seamlessLoop.totalTime(
          seamlessLoop.totalTime() + seamlessLoop.duration() * 10
        );
        scrub.pause();
      }
      wrappingMap.set(trigger, true);
      trigger.scroll(trigger.end - 1);
    }

    function scrubTo(totalTime: number) {
      const progress =
        (totalTime - seamlessLoop.duration() * iteration) /
        seamlessLoop.duration();
      if (progress > 1) {
        wrapForward(trigger);
      } else if (progress < 0) {
        wrapBackward(trigger);
      } else {
        trigger.scroll(trigger.start + progress * (trigger.end - trigger.start));
      }
    }

    function buildSeamlessLoop(items: Element[], spacing: number) {
      const overlap = Math.ceil(1 / spacing);
      const startTime = items.length * spacing + 0.5;
      const loopTime = (items.length + overlap) * spacing + 1;
      const rawSequence = gsap.timeline({ paused: true });
      const seamlessLoop = gsap.timeline({
        paused: true,
        repeat: -1,
        onRepeat() {
          if (this._time === this._dur) this._tTime += this._dur - 0.01;
        },
      });
      const l = items.length + overlap * 2;
      let time = 0;
      let i, index, item;

      gsap.set(items, { xPercent: 400, opacity: 0, scale: 0 });

      for (i = 0; i < l; i++) {
        index = i % items.length;
        item = items[index];
        time = i * spacing;
        rawSequence
          .fromTo(
            item,
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              zIndex: 100,
              duration: 0.5,
              yoyo: true,
              repeat: 1,
              ease: "power1.in",
              immediateRender: false,
            },
            time
          )
          .fromTo(
            item,
            { xPercent: 400 },
            { xPercent: -400, duration: 1, ease: "none", immediateRender: false },
            time
          );
        if (i <= items.length) seamlessLoop.add("label" + i, time);
      }

      rawSequence.time(startTime);
      seamlessLoop
        .to(rawSequence, {
          time: loopTime,
          duration: loopTime - startTime,
          ease: "none",
        })
        .fromTo(
          rawSequence,
          { time: overlap * spacing + 1 },
          {
            time: startTime,
            duration: startTime - (overlap * spacing + 1),
            immediateRender: false,
            ease: "none",
          }
        );
      return seamlessLoop;
    }

    // Button event listeners
    const nextBtn = document.querySelector(".next");
    const prevBtn = document.querySelector(".prev");

    // Store handlers so we can remove them properly
    const nextHandler = () => scrubTo(scrub.vars.totalTime + spacing);
    const prevHandler = () => scrubTo(scrub.vars.totalTime - spacing);

    if (nextBtn) nextBtn.addEventListener("click", nextHandler);
    if (prevBtn) prevBtn.addEventListener("click", prevHandler);

    // Cleanup function
    return () => {
      trigger.kill();
      seamlessLoop.kill();
      scrub.kill();
      if (nextBtn) nextBtn.removeEventListener("click", nextHandler);
      if (prevBtn) prevBtn.removeEventListener("click", prevHandler);
    };
  }, []);

  // Note: Next.js recommends using <Image /> from 'next/image' for image optimization.
  // The following uses <img> for demo parity with the original code.
  // Tailwind utility classes are used below; ignore BEM/kebab-case warning.
  return (
    <>
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black flex-col gap-4">
      <div className="gallery">
        <ul className="cards">
          <li>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://assets.codepen.io/16327/portrait-number-1.png" alt="" />
          </li>
          <li>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://assets.codepen.io/16327/portrait-number-2.png" alt="" />
          </li>
          <li>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://assets.codepen.io/16327/portrait-number-3.png" alt="" />
          </li>
          <li>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://assets.codepen.io/16327/portrait-number-4.png" alt="" />
          </li>
          <li>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://assets.codepen.io/16327/portrait-number-5.png" alt="" />
          </li>
          <li>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://assets.codepen.io/16327/portrait-number-1.png" alt="" />
          </li>
          <li>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://assets.codepen.io/16327/portrait-number-2.png" alt="" />
          </li>
          <li>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://assets.codepen.io/16327/portrait-number-3.png" alt="" />
          </li>
          <li>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://assets.codepen.io/16327/portrait-number-4.png" alt="" />
          </li>
          <li>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://assets.codepen.io/16327/portrait-number-5.png" alt="" />
          </li>
        </ul>
        <div className="actions">
          <button className="prev">Prev</button>
          <button className="next">Next</button>
        </div>
      </div>
    </div>

        <div style={{ height: "1500px" }}></div>

    </>

  );
}