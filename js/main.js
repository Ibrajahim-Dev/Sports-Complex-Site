/* ---------- Config: change the WhatsApp number here (format 92XXXXXXXXXX) ---------- */
const WA_NUMBER = "923348188872";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const root = document.documentElement;

/* ---------- Basic behaviour (works with or without animations) ---------- */
const burger = $(".burger"), nav = $(".nav");
const yr = $("#yr");
if (yr) yr.textContent = new Date().getFullYear();

/* If anime.js failed to load, make sure nothing stays hidden */
const A = root.classList.contains("anim") && window.anime;
if (!A) root.classList.remove("anim");

burger.onclick = () => {
  const open = nav.classList.toggle("open");
  burger.setAttribute("aria-expanded", open);
  if (A && open) {
    anime({
      targets: $$("a", nav),
      opacity: [0, 1],
      translateX: [-18, 0],
      delay: anime.stagger(60),
      duration: 450,
      easing: "easeOutCubic"
    });
  }
};

const form = $("#bk");
if (form) {
  form.onsubmit = e => {
    e.preventDefault();
    const v = Object.fromEntries(new FormData(form));
    const text = encodeURIComponent(
      `Booking request\nName: ${v.n}\nGame: ${v.g}\nDate: ${v.d}\nTime: ${v.t}\nPlayers: ${v.p}`
    );
    if (A) {
      anime({
        targets: $(".btn", form),
        scale: [1, 0.94, 1],
        duration: 350,
        easing: "easeInOutQuad"
      });
    }
    window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, "_blank");
  };
}

/* ---------- Header: shadow + scroll progress bar (cheap, no anime needed) ---------- */
const hd = $(".hd");
const bar = document.createElement("div");
bar.className = "pg";
bar.setAttribute("aria-hidden", "true");
hd.appendChild(bar);
let ticking = false;
const onScroll = () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const max = root.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(scrollY / max, 1) : 0})`;
    hd.classList.toggle("sc", scrollY > 8);
    ticking = false;
  });
};
addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- Animations (anime.js) ---------- */
if (A) {
  /* 1. Page intro timeline */
  const tl = anime.timeline({ easing: "easeOutExpo", duration: 900 });

  tl.add({ targets: ".hd .logo", opacity: [0, 1], translateY: [-18, 0], duration: 700 })
    .add({
      targets: ".hd .nav>a, .hd .burger",
      opacity: [0, 1],
      translateY: [-18, 0],
      delay: anime.stagger(70),
      duration: 700
    }, "-=500");

  const hero = $(".hero");
  if (hero) {
    tl.add({
      targets: ".hero h1 .ln>span",
      translateY: ["110%", 0],
      delay: anime.stagger(140),
      duration: 1100
    }, "-=400")
    .add({ targets: ".hero .lead", opacity: [0, 1], translateY: [24, 0], duration: 800 }, "-=700")
    .add({
      targets: ".hero .row .btn",
      opacity: [0, 1],
      translateY: [24, 0],
      scale: [0.9, 1],
      delay: anime.stagger(120),
      duration: 800,
      easing: "easeOutBack"
    }, "-=600");

    /* Hero art: court lines draw themselves, balls drop in and bounce, then float */
    const lines = $(".art .cl");
    if (lines) {
      anime.set(".art .cl path", { strokeDashoffset: anime.setDashoffset });
      lines.style.opacity = 1;
      anime({
        targets: ".art .cl path",
        strokeDashoffset: [anime.setDashoffset, 0],
        delay: anime.stagger(250, { start: 400 }),
        duration: 1800,
        easing: "easeInOutSine"
      });
    }
    $$(".art .b").forEach((ball, i) => {
      anime({
        targets: ball,
        opacity: [0, 1],
        translateY: [-650, 0],
        delay: 700 + i * 170,
        duration: 1500,
        easing: "easeOutBounce",
        complete: () => {
          const f = $(".f", ball);
          anime({
            targets: f,
            translateY: [0, anime.random(-18, -10)],
            rotate: [0, anime.random(-14, 14)],
            duration: anime.random(2600, 4200),
            direction: "alternate",
            loop: true,
            easing: "easeInOutSine"
          });
        }
      });
    });

    /* Mouse parallax: each ball moves at its own depth (desktop only) */
    if (matchMedia("(pointer:fine)").matches) {
      hero.addEventListener("mousemove", e => {
        const r = hero.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        $$(".art .b").forEach(b => {
          const d = parseFloat(b.dataset.d) * 14;
          b.style.translate = `${-x * d}px ${-y * d}px`;
        });
      });
      hero.addEventListener("mouseleave", () => $$(".art .b").forEach(b => (b.style.translate = "0 0")));
    }
  } else {
    /* Inner pages: page header */
    tl.add({ targets: ".ph h1", opacity: [0, 1], translateY: [30, 0], duration: 900 }, "-=400")
      .add({ targets: ".ph .lead", opacity: [0, 1], translateY: [20, 0], duration: 800 }, "-=650");
  }

  /* 2. Scroll reveal for everything below the header */
  const REVEAL = [
    ".sec h2", ".card", ".why>div", ".cta .wrap>*", "tbody tr", ".stats>div",
    ".narrow>p", ".narrow>.btn", "img.wide", "form label", "form .btn", ".info>*",
    ".note", ".ft .grid3>div", ".copy"
  ].join(",");
  const items = $$(REVEAL);
  items.forEach(el => el.classList.add("rv"));

  const countUp = el => {
    const b = $("b", el);
    if (!b) return;
    const end = parseInt(b.textContent, 10);
    if (isNaN(end)) return;
    const o = { v: 0 };
    anime({
      targets: o,
      v: end,
      round: 1,
      duration: 1600,
      easing: "easeOutExpo",
      update: () => (b.textContent = o.v)
    });
  };

  const show = els => {
    els.sort((a, b) => (a.compareDocumentPosition(b) & 4 ? -1 : 1));
    const isRow = els[0].matches("tbody tr");
    anime({
      targets: els,
      opacity: [0, 1],
      translateY: isRow ? [0, 0] : [40, 0],
      translateX: isRow ? [-30, 0] : [0, 0],
      delay: anime.stagger(isRow ? 70 : 100),
      duration: 850,
      easing: "easeOutCubic"
    });
    els.filter(e => e.matches(".stats>div")).forEach(countUp);
  };

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(entries => {
      const vis = entries.filter(e => e.isIntersecting).map(e => e.target);
      if (!vis.length) return;
      vis.forEach(el => io.unobserve(el));
      show(vis);
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    items.forEach(el => io.observe(el));
  } else {
    items.forEach(el => (el.style.opacity = 1));
  }

  /* 3. Card icons bounce on hover */
  $$(".card").forEach(card => {
    const ico = $(".ico", card);
    if (!ico) return;
    card.addEventListener("mouseenter", () => {
      anime.remove(ico);
      anime({
        targets: ico,
        rotate: [0, -16, 14, -8, 0],
        scale: [1, 1.3, 1],
        duration: 650,
        easing: "easeInOutQuad"
      });
    });
  });

  /* 4. Floating WhatsApp button: elastic entrance, then a gentle wiggle every few seconds */
  const wa = $(".wa");
  if (wa) {
    anime({
      targets: wa,
      opacity: [0, 1],
      scale: [0, 1],
      delay: 1600,
      duration: 1200,
      easing: "easeOutElastic(1, .6)"
    });
    setInterval(() => {
      if (document.hidden) return;
      anime({
        targets: wa,
        rotate: [0, -14, 12, -8, 6, 0],
        duration: 900,
        easing: "easeInOutSine"
      });
    }, 7000);
  }

  /* 5. Smooth fade-out when moving between pages */
  document.addEventListener("click", e => {
    const a = e.target.closest("a[href]");
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (a.target === "_blank" || a.origin !== location.origin) return;
    if (!/\.html$/.test(a.pathname) || a.pathname === location.pathname) return;
    e.preventDefault();
    anime({
      targets: "main",
      opacity: 0,
      translateY: -12,
      duration: 220,
      easing: "easeInQuad",
      complete: () => (location.href = a.href)
    });
  });
  /* Coming back with the browser Back button: make sure the page is visible again */
  addEventListener("pageshow", e => {
    if (e.persisted) anime.set("main", { opacity: 1, translateY: 0 });
  });
}
