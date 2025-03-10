import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

console.log("Main entry point loaded");

createRoot(document.getElementById("root")!).render(<App />);