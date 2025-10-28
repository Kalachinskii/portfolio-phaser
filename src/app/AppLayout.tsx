import { Outlet } from "react-router-dom";
import { Headers } from "../pages/Layout/Headers";
import { Footer } from "../pages/Layout/Footer";
import { Controls } from "../companents/controls/Controls";
import { Status } from "../companents/status/Status";
import styles from "./Home.module.css";
import heroImage from "../assets/hero.png";

export function AppLayout() {
  return (
    <>
      <Headers />
      <div className={styles.container}>
        <img className={styles.img} src={heroImage} alt="hero img" />
        <Status />
        <Outlet />
        <Controls />
      </div>
      <Footer />
    </>
  );
}
