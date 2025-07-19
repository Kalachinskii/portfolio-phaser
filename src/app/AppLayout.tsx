import { Outlet } from "react-router-dom";
import { Headers } from "../pages/Layout/Headers";
import { Footer } from "../pages/Layout/Footer";

export function AppLayout() {
  return (
    <>
      <Headers />
      <Outlet />
      <Footer />
    </>
  );
}
