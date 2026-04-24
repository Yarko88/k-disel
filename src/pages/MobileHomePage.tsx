import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { SERVICES } from "../data/services";

const CONTACT_TEL = "+79620208822";
const CONTACT_PHONE = "+7 962 020 88 22";
const CONTACT_MAP_URL = "https://yandex.ru/maps/-/CPGirW8j";
const AUTOPLAY_FADEOUT_MS = 20_000;

function MobileSoundButton({
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
      className="fixed bottom-3 right-3 z-[10001] flex items-center gap-1.5 border border-bone/20 bg-void/45 px-2 py-1.5 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-bone/55 backdrop-blur-sm transition hover:border-amber-burst/40 hover:text-amber-burst/90"
      aria-pressed={enabled}
      aria-label={enabled ? "Выключить звук" : "Включить звук"}
    >
      <span className="text-[0.62rem]">{enabled ? "🔊" : "🔇"}</span>
      <span>Звук {enabled ? "ON" : "OFF"}</span>
    </button>
  );
}

function useAudio(soundEnabled: boolean, setSoundEnabled: (v: boolean) => void) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<number | null>(null);

  const clearFade = useCallback(() => {
    if (fadeIntervalRef.current !== null) {
      window.clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
  }, []);

  const startWithFadeout = useCallback(() => {
    const a = ref.current;
    if (!a || !soundEnabled) return;

    a.muted = false;
    a.volume = 0.45;
    void a.play()
      .then(() => {
        const startedAt = performance.now();
        clearFade();
        fadeIntervalRef.current = window.setInterval(() => {
          const progress = Math.min((performance.now() - startedAt) / AUTOPLAY_FADEOUT_MS, 1);
          a.volume = Math.max(0.45 * (1 - progress), 0);
          if (progress >= 1) {
            clearFade();
            a.pause();
            a.currentTime = 0;
            setSoundEnabled(false);
          }
        }, 250);
      })
      .catch(() => {
        // Mobile browsers can require first user interaction.
      });
  }, [clearFade, setSoundEnabled, soundEnabled]);

  useEffect(() => {
    const a = ref.current;
    if (!a) return;
    a.muted = !soundEnabled;
    if (!soundEnabled) {
      a.pause();
      a.currentTime = 0;
    }
  }, [soundEnabled]);

  useEffect(() => {
    const tryAutoplay = () => startWithFadeout();
    tryAutoplay();
    window.addEventListener("pointerdown", tryAutoplay, { once: true });
    window.addEventListener("keydown", tryAutoplay, { once: true });
    return () => {
      clearFade();
      window.removeEventListener("pointerdown", tryAutoplay);
      window.removeEventListener("keydown", tryAutoplay);
    };
  }, [clearFade, startWithFadeout]);

  const toggle = useCallback(() => {
    const a = ref.current;
    if (!a) return;
    clearFade();
    const next = !soundEnabled;
    setSoundEnabled(next);
    a.muted = !next;
    if (next) {
      a.volume = 0.45;
      void a.play().catch(() => {
        // waits for user gesture if blocked
      });
    }
  }, [clearFade, setSoundEnabled, soundEnabled]);

  return { ref, toggle };
}

export function MobileHomePage() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { ref: audioRef, toggle } = useAudio(soundEnabled, setSoundEnabled);

  return (
    <>
      <audio ref={audioRef} src="/ambient.mp3" loop preload="auto" autoPlay />
      <MobileSoundButton enabled={soundEnabled} onToggle={toggle} />

      <main id="top" className="relative z-10 px-4 pb-14 pt-20">
        <section className="relative overflow-hidden border-2 border-bone/15 bg-void/75">
          <video className="h-48 w-full object-cover opacity-65" autoPlay muted loop playsInline src="/hero.mp4" />
          <div className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent" />
          <div className="absolute inset-x-3 bottom-3">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.26em] text-diesel/85">Kozyrev Service</p>
            <h1 className="font-[family-name:var(--font-display)] text-4xl leading-none text-amber-burst">
              K-DIESEL
            </h1>
          </div>
        </section>

        <section id="about" className="mt-6 border-2 border-bone/15 bg-smoke/65 p-4">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-amber-burst">ВТОРОЕ ДЫХАНИЕ</h2>
          <p className="mt-2 font-mono text-sm leading-relaxed text-bone/75">
            Ремонт форсунок и ТНВД Common Rail, адаптация и прописка кодов коррекции, стендовая
            проверка и чистка системы.
          </p>
        </section>

        <section id="services" className="mt-6">
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.3em] text-diesel/85">Услуги</p>
          <h2 className="font-[family-name:var(--font-display)] text-4xl text-amber-burst">ПОЛНЫЙ ЦИКЛ</h2>
          <div className="mt-3 space-y-2">
            {SERVICES.map((service) => (
              <Link
                key={service.slug}
                to={`/mobile/services/${service.slug}`}
                className="block border-2 border-bone/15 bg-void/70 px-3 py-3 font-mono text-sm text-bone/85 transition hover:border-diesel/55"
              >
                <span className="mr-2 text-diesel/60">▸</span>
                {service.title}
              </Link>
            ))}
          </div>
        </section>

        <section id="contact" className="mt-7 border-2 border-amber-burst/35 bg-iron/75 p-4">
          <h2 className="font-[family-name:var(--font-display)] text-3xl leading-none tracking-[0.03em] text-amber-burst">
            НАШ ПРИОРИТЕТ КАЧЕСТВО
          </h2>
          <p className="mt-3 font-mono text-sm text-bone/70">
            Звонок, а дальше визит и беспокоиться больше не о чем.
          </p>
          <div className="mt-4 grid gap-2">
            <a
              href={`tel:${CONTACT_TEL}`}
              className="inline-block border-2 border-amber-burst bg-amber-burst px-4 py-3 text-center font-mono text-sm font-bold uppercase tracking-[0.18em] text-void"
            >
              {CONTACT_PHONE}
            </a>
            <Link
              to="/mobile/zakaz-naryad"
              className="inline-block border-2 border-bone/30 bg-void/70 px-4 py-3 text-center font-mono text-sm font-bold uppercase tracking-[0.18em] text-bone/90"
            >
              Заказ-наряд
            </Link>
            <a
              href={CONTACT_MAP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border border-bone/25 bg-void/55 px-4 py-2.5 text-center font-mono text-xs uppercase tracking-[0.18em] text-bone/70"
            >
              Открыть карту
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
