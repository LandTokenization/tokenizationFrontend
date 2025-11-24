import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router";
import { ToastProvider } from "./context/ToastContext";
import { ToastNotification } from "./components/ToastNotification";
import AnimatedBackground from "./components/AnimatedBackground";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AnimatedBackground />
        <div className="relative z-10">
          <AppRouter />
        </div>
        <ToastNotification />
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
