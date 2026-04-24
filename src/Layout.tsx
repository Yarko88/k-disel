import { useCallback, useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";

const AUTOPLAY_FADEOUT_MS = 20_000;
const MUSIC_START_VOLUME = 0.5;

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
      className="fixed bottom-3 right-3 z-[10001] flex items-center gap-1.5 border border-bone/20 bg-void/45 px-2 py-1.5 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-bone/55 backdrop-blur-sm transition hover:border-amber-burst/40 hover:text-amber-burst/90 sm:bottom-4 sm:right-4"
      aria-pressed={enabled}
      aria-label={enabled ? "Выключить звук" : "Включить звук"}
    >
      <span className="text-[0.62rem]">{enabled ? "🔊" : "🔇"}</span>
      <span>Звук {enabled ? "ON" : "OFF"}</span>
    </button>
  );
}

function ConsentModal({
  open,
  onAccept,
  onCancel,
}: {
  open: boolean;
  onAccept: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[10020] flex items-center justify-center bg-void/85 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md border-2 border-bone/20 bg-iron p-5 shadow-[6px_6px_0_0_rgba(0,0,0,0.45)] sm:p-6">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-amber-burst">COOKIE / SOUND</h2>
        <p className="mt-3 font-mono text-sm leading-relaxed text-bone/70">
          Используем технические cookies для работы сайта. Разрешить звук при входе?
        </p>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onAccept}
            className="border-2 border-amber-burst bg-amber-burst px-3 py-2 font-mono text-xs font-bold uppercase tracking-[0.18em] text-void"
          >
            OK
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="border-2 border-bone/30 bg-void px-3 py-2 font-mono text-xs font-bold uppercase tracking-[0.18em] text-bone/80"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}

type LayoutProps = {
  mode: "desktop" | "mobile";
};

export function Layout({ mode }: LayoutProps) {
  const { pathname } = useLocation();
  const rootPath = mode === "mobile" ? "/mobile" : "/desktop";
  const compact = mode === "mobile";
  const isHome = pathname === rootPath || pathname === `${rootPath}/`;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<number | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showConsent, setShowConsent] = useState(false);

  const clearFade = useCallback(() => {
    if (fadeIntervalRef.current !== null) {
      window.clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
  }, []);

  const stopPlayback = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    clearFade();
    audio.pause();
    audio.currentTime = 0;
    audio.volume = MUSIC_START_VOLUME;
    setSoundEnabled(false);
  }, [clearFade]);

  const startPlaybackWithFade = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return false;

    clearFade();
    audio.muted = false;
    audio.volume = MUSIC_START_VOLUME;

    try {
      await audio.play();
      setSoundEnabled(true);
      const startAt = performance.now();
      fadeIntervalRef.current = window.setInterval(() => {
        const progress = Math.min((performance.now() - startAt) / AUTOPLAY_FADEOUT_MS, 1);
        audio.volume = Math.max(MUSIC_START_VOLUME * (1 - progress), 0);

        if (progress >= 1) {
          clearFade();
          audio.pause();
          audio.currentTime = 0;
          setSoundEnabled(false);
        }
      }, 250);
      return true;
    } catch {
      return false;
    }
  }, [clearFade]);

  useEffect(() => {
    let alive = true;
    void startPlaybackWithFade().then((started) => {
      if (!started && alive) {
        setShowConsent(true);
      }
    });

    return () => {
      alive = false;
      clearFade();
    };
  }, [clearFade, startPlaybackWithFade]);

  const handleToggleSound = useCallback(() => {
    if (soundEnabled) {
      stopPlayback();
      return;
    }
    void startPlaybackWithFade();
  }, [soundEnabled, startPlaybackWithFade, stopPlayback]);

  const handleConsentAccept = useCallback(() => {
    setShowConsent(false);
    void startPlaybackWithFade();
  }, [startPlaybackWithFade]);

  const handleConsentCancel = useCallback(() => {
    setShowConsent(false);
    stopPlayback();
  }, [stopPlayback]);

  const section = (id: string, label: string) =>
    isHome ? (
      <a href={`#${id}`} className="text-bone/60 hover:text-amber-burst">
        {label}
      </a>
    ) : (
      <Link to={`${rootPath}#${id}`} className="text-bone/60 hover:text-amber-burst">
        {label}
      </Link>
    );

  return (
    <div className="relative min-h-dvh">
      <audio ref={audioRef} src="/ambient.mp3" loop preload="auto" autoPlay />
      {compact ? null : (
        <div
          className="pointer-events-none fixed left-0 top-0 z-30 h-full w-10 border-r border-bone/10 bg-void/20 md:w-16"
          aria-hidden
        />
      )}
      <div className="scanlines pointer-events-none fixed inset-0 z-[10000] select-none" aria-hidden />
      <div className="noise" />
      <header
        className={`fixed left-0 right-0 top-0 z-50 border-b-2 border-bone/10 bg-void/80 px-4 py-3 font-mono uppercase text-bone/80 backdrop-blur-md ${compact ? "text-[0.58rem] tracking-[0.2em]" : "text-[0.65rem] tracking-[0.25em] sm:px-6 sm:text-xs"}`}
      >
        <div className={`mx-auto flex items-center justify-between gap-4 ${compact ? "max-w-xl" : "max-w-7xl"}`}>
          <Link to={rootPath} className="shrink-0 text-amber-burst transition hover:text-diesel">
            K·DIESEL
          </Link>
          <nav
            className={`flex flex-wrap items-center justify-end ${compact ? "max-w-[72%] gap-x-2 gap-y-1" : "max-w-[70%] gap-x-2 gap-y-1 sm:max-w-none sm:gap-x-4 sm:gap-y-0 md:gap-x-6 lg:gap-x-8"}`}
          >
            {section("about", compact ? "О нас" : "Кто мы")}
            {section("services", "Услуги")}
            {compact ? null : section("brands", "Системы")}
            {section("contact", "Контакты")}
            <NavLink
              to={`${rootPath}/zakaz-naryad`}
              className={({ isActive }) =>
                isActive
                  ? "text-amber-burst underline decoration-2 underline-offset-4"
                  : "text-bone/60 hover:text-amber-burst"
              }
            >
              Заказ-наряд
            </NavLink>
          </nav>
        </div>
      </header>
      <SoundButton enabled={soundEnabled} onToggle={handleToggleSound} />
      <ConsentModal open={showConsent} onAccept={handleConsentAccept} onCancel={handleConsentCancel} />
      <Outlet />
    </div>
  );
}
