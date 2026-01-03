import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

try {
  console.log("🚀 Starting React app...");
  const root = createRoot(rootElement);
  root.render(<App />);
  console.log("✅ React app rendered successfully");
} catch (error) {
  console.error("❌ Error rendering app:", error);
  rootElement.style.backgroundColor = "#f6f1eb";
  rootElement.style.color = "#144652";
  rootElement.style.padding = "50px";
  rootElement.style.fontFamily = "Arial, sans-serif";
  rootElement.innerHTML = `
    <h1 style="color: red; font-size: 24px;">❌ Erreur de chargement</h1>
    <p style="font-size: 16px; margin-top: 20px;">Une erreur s'est produite lors du chargement de l'application.</p>
    <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; margin-top: 20px; overflow: auto;">${error instanceof Error ? error.message + "\n\n" + error.stack : String(error)}</pre>
    <p style="margin-top: 20px;">Vérifiez la console du navigateur (F12) pour plus de détails.</p>
  `;
}
