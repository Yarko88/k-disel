import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { getServiceBySlug } from "../data/services";

type ServiceDetailPageProps = {
  mode: "desktop" | "mobile";
};

export function ServiceDetailPage({ mode }: ServiceDetailPageProps) {
  const { slug = "" } = useParams();
  const service = getServiceBySlug(slug);
  const basePath = mode === "mobile" ? "/mobile" : "/desktop";
  const compact = mode === "mobile";

  if (!service) {
    return (
      <main className="relative z-10 mx-auto max-w-3xl px-4 pb-16 pt-24 sm:px-8 md:pt-28">
        <div className="border-2 border-bone/15 bg-void/80 p-6 text-center">
          <p className="font-mono text-sm text-bone/70">Услуга не найдена.</p>
          <Link
            to={`${basePath}#services`}
            className="mt-5 inline-block border-2 border-amber-burst bg-amber-burst px-5 py-2 font-mono text-xs font-bold uppercase tracking-[0.2em] text-void"
          >
            К списку услуг
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main
      className={`relative z-10 mx-auto pb-16 pt-24 ${compact ? "max-w-xl px-4" : "max-w-5xl px-5 sm:px-8 md:pt-28"}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex flex-wrap items-center justify-between gap-3"
      >
        <div>
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.28em] text-diesel/70">Операция</p>
          <h1
            className={`font-[family-name:var(--font-display)] text-amber-burst ${compact ? "text-3xl leading-tight" : "text-5xl leading-[0.95]"}`}
          >
            {service.title}
          </h1>
        </div>
        <Link
          to={`${basePath}#services`}
          className="border-2 border-bone/25 bg-void/70 px-4 py-2 font-mono text-[0.63rem] uppercase tracking-[0.2em] text-bone/70 transition hover:border-amber-burst/60 hover:text-amber-burst"
        >
          ← Все услуги
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className={`grid gap-4 ${compact ? "" : "md:grid-cols-3"}`}
      >
        <InfoBlock
          title="Что делаем"
          accent="text-diesel"
          items={service.operation}
          prefix="STEP"
          compact={compact}
        />
        <InfoBlock
          title="Для чего"
          accent="text-amber-burst"
          items={service.purpose}
          prefix="GOAL"
          compact={compact}
        />
        <InfoBlock
          title="Подводные камни"
          accent="text-rust"
          items={service.pitfalls}
          prefix="RISK"
          compact={compact}
        />
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="mt-7 border-2 border-bone/15 bg-smoke/70 p-4 sm:p-5"
      >
        <h2 className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-diesel/80">
          Схема прохождения
        </h2>
        <ol className="mt-4 grid gap-2 font-mono text-sm text-bone/80">
          <li className="border border-bone/15 bg-void/65 p-3">01 — Приемка и фиксация исходных симптомов.</li>
          <li className="border border-bone/15 bg-void/65 p-3">02 — Диагностика и дефектовка по операции.</li>
          <li className="border border-bone/15 bg-void/65 p-3">03 — Ремонт / настройка / адаптация по регламенту.</li>
          <li className="border border-bone/15 bg-void/65 p-3">04 — Контрольный тест и выдача результата клиенту.</li>
        </ol>
      </motion.section>
    </main>
  );
}

function InfoBlock({
  title,
  accent,
  items,
  prefix,
  compact,
}: {
  title: string;
  accent: string;
  items: string[];
  prefix: string;
  compact: boolean;
}) {
  return (
    <article className="border-2 border-bone/15 bg-smoke/60 p-4">
      <h2 className={`font-mono text-[0.68rem] uppercase tracking-[0.24em] ${accent}`}>{title}</h2>
      <ul className={`mt-4 space-y-2 font-mono ${compact ? "text-sm" : "text-[0.95rem]"} text-bone/80`}>
        {items.map((item, idx) => (
          <li key={`${prefix}-${idx}`} className="border border-bone/15 bg-void/65 p-3 leading-relaxed">
            <span className="mr-2 text-diesel/60">{prefix}-{String(idx + 1).padStart(2, "0")}</span>
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}
