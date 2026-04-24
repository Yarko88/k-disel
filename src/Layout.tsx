import { Link, NavLink, Outlet, useLocation } from "react-router-dom";

export function Layout() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  const section = (id: string, label: string) =>
    isHome ? (
      <a href={`#${id}`} className="text-bone/60 hover:text-amber-burst">
        {label}
      </a>
    ) : (
      <Link to={`/#${id}`} className="text-bone/60 hover:text-amber-burst">
        {label}
      </Link>
    );

  return (
    <div className="relative min-h-dvh">
      <div
        className="pointer-events-none fixed left-0 top-0 z-30 h-full w-10 border-r border-bone/10 bg-void/20 md:w-16"
        aria-hidden
      />
      <div className="scanlines pointer-events-none fixed inset-0 z-[10000] select-none" aria-hidden />
      <div className="noise" />
      <header className="fixed left-0 right-0 top-0 z-50 border-b-2 border-bone/10 bg-void/80 px-4 py-3 font-mono text-[0.65rem] uppercase tracking-[0.25em] text-bone/80 backdrop-blur-md sm:px-6 sm:text-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link to="/" className="shrink-0 text-amber-burst transition hover:text-diesel">
            K·DIESEL
          </Link>
          <nav className="flex max-w-[70%] flex-wrap items-center justify-end gap-x-2 gap-y-1 sm:max-w-none sm:gap-x-4 sm:gap-y-0 md:gap-x-6 lg:gap-x-8">
            {section("about", "Кто мы")}
            {section("services", "Услуги")}
            {section("brands", "Системы")}
            {section("contact", "Контакты")}
            <NavLink
              to="/zakaz-naryad"
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
      <Outlet />
    </div>
  );
}
