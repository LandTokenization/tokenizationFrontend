import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router";
import { ToastProvider } from "./context/ToastContext";
import { ToastNotification } from "./components/ToastNotification";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AppRouter />
        <ToastNotification />
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
