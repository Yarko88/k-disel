import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

type OrderPageProps = {
  mode?: "desktop" | "mobile";
};

export function OrderPage({ mode = "desktop" }: OrderPageProps) {
  const [submitted, setSubmitted] = useState(false);
  const homePath = mode === "mobile" ? "/mobile" : "/desktop";
  const compact = mode === "mobile";

  return (
    <div className="relative min-h-dvh">
      <div className="fixed inset-0 z-0 bg-void">
        <video
          className="h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          src="/order-bg.mp4"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-void/92 via-void/75 to-void/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_20%,rgba(200,255,45,0.06),transparent_55%)]" />
      </div>

      <main
        className={`relative z-10 mx-auto pb-16 pt-24 ${compact ? "max-w-xl px-4" : "max-w-2xl px-4 sm:px-6 md:pt-28"}`}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-6 flex flex-wrap items-end justify-between gap-3"
        >
          <div>
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-diesel/80">
              Документ
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-tight text-amber-burst sm:text-5xl">
              ЗАКАЗ-НАРЯД
            </h1>
          </div>
          <Link
            to={homePath}
            className="border-2 border-bone/25 bg-void/60 px-3 py-2 font-mono text-[0.65rem] uppercase tracking-wider text-bone/70 hover:border-amber-burst/50 hover:text-amber-burst"
          >
            ← На главную
          </Link>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.45 }}
          className={`space-y-4 border-2 border-bone/15 bg-smoke/75 p-5 shadow-[6px_6px_0_0_rgba(0,0,0,0.4)] backdrop-blur-sm ${compact ? "" : "sm:p-7"}`}
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Дата" name="date" type="date" required defaultValue={todayIso()} />
            <Field label="Номер (если есть)" name="orderNo" placeholder="—" />
          </div>
          <Field label="Заказчик / организация" name="client" required placeholder="ФИО или название" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Телефон" name="phone" type="tel" required placeholder="+7 …" />
            <Field label="Email" name="email" type="email" placeholder="необязательно" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Марка / модель ТС" name="vehicle" required placeholder="например, MAN TGX" />
            <Field label="Госномер / VIN" name="vin" placeholder="—" />
          </div>
          <div>
            <label className="mb-1.5 block font-mono text-[0.7rem] uppercase tracking-[0.2em] text-bone/55">
              Описание работ / неисправность
            </label>
            <textarea
              name="description"
              required
              rows={5}
              className="w-full resize-y border-2 border-bone/20 bg-void/80 px-3 py-2 font-mono text-sm text-bone placeholder:text-bone/30 focus:border-amber-burst/60 focus:outline-none"
              placeholder="Что болит, пробег, коды ошибок, что уже делали…"
            />
          </div>
          <div>
            <label className="mb-1.5 block font-mono text-[0.7rem] uppercase tracking-[0.2em] text-bone/55">
              Детали / агрегаты (форсунки, ТНВД, маркировка)
            </label>
            <textarea
              name="parts"
              rows={3}
              className="w-full resize-y border-2 border-bone/20 bg-void/80 px-3 py-2 font-mono text-sm text-bone placeholder:text-bone/30 focus:border-amber-burst/60 focus:outline-none"
              placeholder="Артикулы, фото при визите…"
            />
          </div>
          <p className="font-mono text-xs text-bone/45">
            Отправка пока демонстрационная: подключите backend или почту, когда будет готово.
          </p>
          {submitted ? (
            <p className="border-2 border-diesel/40 bg-void/50 py-3 text-center font-mono text-sm text-diesel">
              Форма «отправлена» (локально). Данные не уходят на сервер.
            </p>
          ) : null}
          <button
            type="submit"
            className="w-full border-2 border-amber-burst bg-amber-burst py-3.5 font-mono text-sm font-bold uppercase tracking-[0.2em] text-void transition hover:bg-amber-burst/90 active:scale-[0.99]"
          >
            Сохранить черновик
          </button>
        </motion.form>
      </main>
    </div>
  );
}

function todayIso() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block font-mono text-[0.7rem] uppercase tracking-[0.2em] text-bone/55">
        {label}
        {required ? <span className="text-amber-burst"> *</span> : null}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full border-2 border-bone/20 bg-void/80 px-3 py-2 font-mono text-sm text-bone placeholder:text-bone/30 focus:border-amber-burst/60 focus:outline-none"
      />
    </div>
  );
}
