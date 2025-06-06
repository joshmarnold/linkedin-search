import { createRoot } from "react-dom/client";

import App from "./App.jsx";

import "./index.css";
import "@radix-ui/themes/styles.css";

createRoot(document.getElementById("root")).render(<App />);
