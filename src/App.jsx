import { AppRoutes } from "./components/routes/AppRoutes";
import { AppProvider } from "./components/providers/AppProvider";
import { Notifications } from "./components/Notifications/Notifications";
import "./App.css";

export const App = () => {
  return (
    <AppProvider>
      <Notifications />
      <AppRoutes />
    </AppProvider>
  );
};
