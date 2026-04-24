import { BrowserRouter, Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import { Layout } from "./Layout";
import { HomePage } from "./pages/HomePage";
import { MobileHomePage } from "./pages/MobileHomePage";
import { OrderPage } from "./pages/OrderPage";
import { ServiceDetailPage } from "./pages/ServiceDetailPage";

const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

function isMobileClient() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  const mobileUA = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|Mobile/i.test(ua);
  const narrowViewport = typeof window !== "undefined" && window.matchMedia("(max-width: 900px)").matches;
  return mobileUA || narrowViewport;
}

function EntryRedirect() {
  const { hash } = useLocation();
  const target = isMobileClient() ? "/mobile" : "/desktop";
  return <Navigate to={`${target}${hash}`} replace />;
}

function OrderRedirect() {
  const target = isMobileClient() ? "/mobile/zakaz-naryad" : "/desktop/zakaz-naryad";
  return <Navigate to={target} replace />;
}

function ServiceRedirect() {
  const { slug = "" } = useParams();
  const base = isMobileClient() ? "/mobile" : "/desktop";
  return <Navigate to={`${base}/services/${slug}`} replace />;
}

export function App() {
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<EntryRedirect />} />
        <Route path="/zakaz-naryad" element={<OrderRedirect />} />
        <Route path="/services/:slug" element={<ServiceRedirect />} />

        <Route element={<Layout mode="desktop" />}>
          <Route path="/desktop" element={<HomePage />} />
          <Route path="/desktop/zakaz-naryad" element={<OrderPage mode="desktop" />} />
          <Route path="/desktop/services/:slug" element={<ServiceDetailPage mode="desktop" />} />
        </Route>

        <Route element={<Layout mode="mobile" />}>
          <Route path="/mobile" element={<MobileHomePage />} />
          <Route path="/mobile/zakaz-naryad" element={<OrderPage mode="mobile" />} />
          <Route path="/mobile/services/:slug" element={<ServiceDetailPage mode="mobile" />} />
        </Route>

        <Route path="*" element={<EntryRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}
