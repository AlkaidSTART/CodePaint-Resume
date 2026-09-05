import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { LookingFor } from "./components/home/LookingFor";
import "./index.css";
function App() { return (<LookingFor />); }
createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);
