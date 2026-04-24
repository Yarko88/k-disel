import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./Layout";
import { HomePage } from "./pages/HomePage";
import { OrderPage } from "./pages/OrderPage";

const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

export function App() {
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/zakaz-naryad" element={<OrderPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
