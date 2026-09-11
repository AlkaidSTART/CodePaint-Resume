import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AdminShell } from "./components/layout/AdminShell";
import { DashboardView } from "./components/dashboard/DashboardView";
import { useAdminStore } from "./store/adminStore";
import "./index.css";

function App() {
  const dashboard = useAdminStore((state) => state.dashboard);
  const loading = useAdminStore((state) => state.loading);
  const filterRole = useAdminStore((state) => state.filterRole);
  const load = useAdminStore((state) => state.load);
  const setFilterRole = useAdminStore((state) => state.setFilterRole);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <AdminShell>
      <DashboardView
        dashboard={dashboard}
        loading={loading}
        filterRole={filterRole}
        onFilterChange={setFilterRole}
        onRefresh={load}
      />
    </AdminShell>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
