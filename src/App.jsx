import { AppRoutes } from "./components/routes/AppRoutes";
import { AppProvider } from "./components/ui/AppProvider";
import "./App.css";

export const App = () => {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
};
