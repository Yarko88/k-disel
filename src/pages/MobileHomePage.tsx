import { Link } from "react-router-dom";
import { SERVICES } from "../data/services";

const CONTACT_TEL = "+79620208822";
const CONTACT_PHONE = "+7 962 020 88 22";
const CONTACT_MAP_URL = "https://yandex.ru/maps/-/CPGirW8j";
export function MobileHomePage() {
  return (
    <>
      <main id="top" className="relative z-10 px-4 pb-14 pt-20">
        <section className="relative overflow-hidden border-2 border-bone/15 bg-void/75">
          <video className="h-48 w-full object-contain opacity-65" autoPlay muted loop playsInline src="/hero.mp4" />
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
