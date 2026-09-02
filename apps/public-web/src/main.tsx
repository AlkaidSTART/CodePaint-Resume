import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Layout } from "./components/Layout";
import { VideoHero } from "./components/VideoHero";
import "./index.css";

function App() {
  return (
    <Layout>
      <VideoHero />
    </Layout>
  );
}

createRoot(document.getElementById("root")!).render(<StrictMode><BrowserRouter><App /></BrowserRouter></StrictMode>);
