import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Layout } from "./components/Layout";
import { CinematicHome } from "./components/CinematicHome";
import "./index.css";

function App() {
  return (
    <Layout>
      <CinematicHome />
    </Layout>
  );
}

createRoot(document.getElementById("root")!).render(<StrictMode><BrowserRouter><App /></BrowserRouter></StrictMode>);
