import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ScrollProgress } from "../components/ScrollProgress";

const BRANDS = ["BOSCH", "DENSO", "DELPHI", "Siemens/Continental", "VDO"];

const SERVICES = [
  "Ремонт дизельных систем Common Rail",
  "Компьютерная диагностика двигателя",
  "Инструментальная диагностика двигателя",
  "Снятие и установка топливной аппаратуры",
  "Ремонт насосов Common Rail",
  "Ремонт пьезо-форсунок (Piezo)",
  "Адаптация насоса / форсунок",
  "Прописка кода коррекции форсунки в ECU",
  "Полная чистка топливной системы",
];

const CONTACT_TEL = "+79620208822";
const CONTACT_PHONE = "+7 962 020 88 22";
const CONTACT_MAP_URL = "https://yandex.ru/maps/-/CPGirW8j";

const viewOpts = { once: true, margin: "-8% 0px" as const, amount: 0.15 as const };
const fadeUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: viewOpts,
};

const listContainer = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const listItem = {
  hidden: { opacity: 0, y: 22, skewY: 1.5 as const },
  show: { opacity: 1, y: 0, skewY: 0, transition: { type: "spring" as const, stiffness: 120, damping: 20 } },
};

function SoundButton({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="fixed bottom-4 right-4 z-[10001] flex items-center gap-2 border border-bone/25 bg-void/55 px-3 py-2 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-bone/65 backdrop-blur-sm transition hover:border-amber-burst/50 hover:text-amber-burst sm:bottom-6 sm:right-6"
      aria-pressed={enabled}
      aria-label={enabled ? "Выключить звук" : "Включить звук"}
    >
      <span className="text-xs">{enabled ? "🔊" : "🔇"}</span>
      <span>
        Звук {enabled ? "ON" : "OFF"}
      </span>
    </button>
  );
}

function useAudio(soundEnabled: boolean, setSoundEnabled: (v: boolean) => void) {
  const ref = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const a = ref.current;
    if (!a) return;
    a.muted = !soundEnabled;
    a.volume = 0.5;
  }, [soundEnabled]);

  useEffect(() => {
    const a = ref.current;
    if (!a) return;

    const tryPlay = () => {
      a.volume = 0.5;
      a.muted = !soundEnabled;
      void a.play().catch(() => {
        /* Browser can block autoplay with sound until first user interaction */
      });
    };

    tryPlay();
    window.addEventListener("pointerdown", tryPlay, { once: true });
    window.addEventListener("keydown", tryPlay, { once: true });

    return () => {
      window.removeEventListener("pointerdown", tryPlay);
      window.removeEventListener("keydown", tryPlay);
    };
  }, []);

  const toggle = useCallback(() => {
    const a = ref.current;
    if (!a) return;
    const next = !soundEnabled;
    setSoundEnabled(next);
    a.muted = !next;
    if (next && a.paused) {
      void a.play().catch(() => {
        /* If blocked, next user interaction will retry via listener above */
      });
    }
  }, [setSoundEnabled, soundEnabled]);

  return { ref, toggle };
}

function VideoHero() {
  return (
    <div className="relative h-dvh min-h-[520px] w-full overflow-hidden">
      <div className="absolute inset-0 z-0 bg-void">
        <video
          className="h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          src="/hero.mp4"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-void/80 via-void/30 to-void" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(200,255,45,0.12),transparent_60%)] mix-blend-color" />
      </div>
      <div className="absolute inset-0 z-[1] flex flex-col items-start justify-end px-5 pb-16 sm:px-10 md:pb-20 md:pl-12">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-2 max-w-2xl font-mono text-[0.7rem] uppercase tracking-[0.35em] text-diesel/90 sm:text-xs"
        >
          Сервисный центр
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 28, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100, damping: 18 }}
          className="font-[family-name:var(--font-display)] text-6xl leading-[0.9] tracking-tight text-bone sm:text-7xl md:text-8xl md:leading-[0.88] lg:text-[5.5rem] glow-amber"
        >
          K-DIESEL
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-2 max-w-xl font-mono text-sm leading-relaxed text-bone/75 sm:text-base"
        >
          <span className="text-amber-burst/95">Kozyrev Service</span> — ремонт топливной
          аппаратуры <span className="text-bone/95">Common Rail</span> для грузовиков и легковых.
        </motion.p>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.75, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 h-1 w-32 origin-left bg-amber-burst"
        />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95 }}
          className="mt-8"
        >
          <Link
            to="/zakaz-naryad"
            className="inline-block border-2 border-diesel/80 bg-void/70 px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-diesel backdrop-blur-sm transition hover:border-amber-burst hover:text-amber-burst"
          >
            Заказ-наряд →
          </Link>
        </motion.div>
      </div>
      <div
        className="absolute bottom-0 left-0 right-0 z-[2] h-8 bg-gradient-to-t from-void to-transparent"
        aria-hidden
      />
    </div>
  );
}

function Ticker() {
  const long = " • ОБЩИЙ РЕМОНТ • IMA, ISA, C3i, C2i • BOSCH · DELPHI · DENSO · PIEZO";
  const s = (BRANDS.join("  ·  ") + long).repeat(4);
  return (
    <div className="border-y-2 border-bone/10 bg-iron/90 py-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-amber-burst/90 sm:text-xs">
      <div className="flex w-[200%] animate-marquee-slow">
        <span className="inline-block w-1/2 shrink-0 pl-2">{s}</span>
        <span className="inline-block w-1/2 shrink-0 pl-2" aria-hidden>
          {s}
        </span>
      </div>
    </div>
  );
}

function ParallaxBlock({ r }: { r: RefObject<HTMLElement | null> }) {
  const { scrollYProgress } = useScroll({ target: r, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);
  return (
    <motion.div
      className="select-none text-[7rem] font-[family-name:var(--font-display)] leading-none text-bone/[0.04] sm:text-[9rem] md:text-[12rem] lg:text-[15rem]"
      style={{ y }}
    >
      CR
    </motion.div>
  );
}

function CtaBlock() {
  return (
    <section
      className="border-t-2 border-amber-burst/30 bg-iron/80 py-20 md:py-28"
      id="contact"
    >
      <div className="mx-auto max-w-5xl px-5 text-center sm:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ type: "spring" }}
          viewport={viewOpts}
          className="font-[family-name:var(--font-display)] text-4xl tracking-tight text-amber-burst sm:text-5xl md:text-6xl"
        >
          НАШ ПРИОРИТЕТ КАЧЕСТВО
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          viewport={viewOpts}
          className="mt-4 font-mono text-bone/65"
        >
          Звонок и визит — дальше разберём насос, форсунки и схему борта полностью.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewOpts}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <motion.a
            href={`tel:${CONTACT_TEL}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-block border-2 border-amber-burst bg-amber-burst px-10 py-4 font-mono text-sm font-bold uppercase tracking-widest text-void"
          >
            {CONTACT_PHONE}
          </motion.a>
          <Link
            to="/zakaz-naryad"
            className="inline-block border-2 border-bone/30 bg-void/60 px-8 py-4 font-mono text-sm font-bold uppercase tracking-widest text-bone/90 backdrop-blur-sm transition hover:border-diesel/60 hover:text-diesel"
          >
            Заказ-наряд
          </Link>
        </motion.div>
        <p className="mt-3 font-mono text-xs text-bone/55">
          Адрес в Яндекс Картах:{" "}
          <a
            href={CONTACT_MAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-burst underline underline-offset-4 hover:text-diesel"
          >
            Открыть карту
          </a>
        </p>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewOpts}
          className="mx-auto mt-6 max-w-md overflow-hidden border-2 border-bone/20 bg-void/70"
        >
          <iframe
            title="Карта проезда K-Diesel"
            src={CONTACT_MAP_URL}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-52 w-full"
          />
        </motion.div>
      </div>
    </section>
  );
}

export function HomePage() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { ref: audioRef, toggle: toggleSound } = useAudio(soundEnabled, setSoundEnabled);
  const aboutRef = useRef<HTMLElement | null>(null);

  return (
    <>
      <audio ref={audioRef} src="/ambient.mp3" loop preload="auto" autoPlay />
      <ScrollProgress />
      <SoundButton enabled={soundEnabled} onToggle={toggleSound} />
      <main id="top">
        <VideoHero />
        <Ticker />
        <section
          id="about"
          ref={aboutRef}
          className="relative overflow-hidden border-b-2 border-bone/8 bg-void py-20 md:py-28"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_80px,rgba(255,255,255,0.04)_80px,rgba(255,255,255,0.04)_81px),repeating-linear-gradient(90deg,transparent,transparent_80px,rgba(255,255,255,0.04)_80px,rgba(255,255,255,0.04)_81px)]"
            aria-hidden
          />
          <div
            className="absolute right-2 top-16 hidden w-auto overflow-hidden md:block"
            aria-hidden
          >
            <ParallaxBlock r={aboutRef} />
          </div>
          <div className="relative z-10 mx-auto max-w-3xl px-5 sm:px-8">
            <motion.h2
              {...fadeUp}
              transition={{ type: "spring" }}
              className="font-[family-name:var(--font-display)] text-3xl text-bone/95 sm:text-4xl md:text-5xl"
            >
              СИСТЕМЕ — <span className="text-amber-burst">ВТОРОЕ ДЫХАНИЕ</span>
            </motion.h2>
            <motion.p
              {...fadeUp}
              transition={{ delay: 0.1 }}
              className="mt-6 font-mono text-sm leading-relaxed text-bone/75 sm:text-base"
            >
              <strong className="text-bone/90">K-Diesel (Kozyrev Service)</strong> — диагностика и
              ремонт форсунок и ТНВД Common Rail: {BRANDS.join(", ")} и др. Коды коррекции:{" "}
              <span className="whitespace-nowrap">BOSCH (IMA, ISA)</span>,{" "}
              <span className="whitespace-nowrap">DELPHI Euro5 (C3i, C2i)</span> — электромагнитные
              и пьезо. Ультразвуковая чистка, стенд, уникальное восстановление распылителей и
              клапанов; иначе — новая или донорская деталь.
            </motion.p>
          </div>
        </section>
        <section
          id="brands"
          className="border-b-2 border-bone/8 bg-gradient-to-b from-void to-iron py-12 md:py-16"
        >
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <h3 className="mb-6 font-mono text-[0.7rem] uppercase tracking-[0.3em] text-amber-burst/80">
              Системы и поставщики
            </h3>
            <ul className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {BRANDS.map((b) => (
                <motion.li
                  key={b}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewOpts}
                  className="border-2 border-bone/20 bg-void/80 py-3 text-center text-2xl font-[family-name:var(--font-display)] tracking-tight text-bone/90 animate-border-tick"
                >
                  {b}
                </motion.li>
              ))}
            </ul>
          </div>
        </section>
        <section id="services" className="relative border-b-2 border-bone/8 bg-iron py-20 md:py-24">
          <div className="mx-auto max-w-4xl px-5 sm:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ type: "spring" }}
              viewport={viewOpts}
              className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-diesel/90"
            >
              Услуги
            </motion.h2>
            <motion.h3
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, type: "spring" }}
              viewport={viewOpts}
              className="font-[family-name:var(--font-display)] text-4xl text-amber-burst"
            >
              ПОЛНЫЙ ЦИКЛ
            </motion.h3>
            <motion.ul
              className="mt-10 space-y-2.5"
              initial="hidden"
              whileInView="show"
              viewport={viewOpts}
              variants={listContainer}
            >
              {SERVICES.map((s) => (
                <motion.li
                  key={s}
                  className="group border-2 border-bone/10 bg-smoke/60 py-3 pl-2 pr-4 font-mono text-sm text-bone/90 [clip-path:polygon(0_0,100%_0,100%_calc(100%-8px),calc(100%-8px)_100%,0_100%)] transition hover:border-diesel/50 hover:shadow-[4px_4px_0_0_rgba(200,255,45,0.12)] md:text-[0.9rem]"
                  variants={listItem}
                >
                  <span className="mr-2 text-diesel/50 transition group-hover:text-amber-burst">
                    ▸
                  </span>
                  {s}
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </section>
        <CtaBlock />
        <footer className="bg-void py-8 font-mono text-[0.7rem] text-bone/40">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 sm:flex-row sm:px-8">
            <p>© {new Date().getFullYear()} K-Diesel / Kozyrev Service</p>
            <p className="text-center sm:text-right">Common Rail — с нами предсказуемо.</p>
          </div>
        </footer>
      </main>
    </>
  );
}
