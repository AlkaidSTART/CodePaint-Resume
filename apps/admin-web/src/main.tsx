import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AdminShell } from "./components/layout/AdminShell";
import { DashboardView } from "./components/dashboard/DashboardView";
import { ApplicantsPage } from "./pages/ApplicantsPage";
import { InboxPage } from "./pages/InboxPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { RolesPage } from "./pages/RolesPage";
import { SettingsPage } from "./pages/SettingsPage";
import { TasksPage } from "./pages/TasksPage";
import { TemplatesPage } from "./pages/TemplatesPage";
import { useAdminStore } from "./store/adminStore";
import { useAuthStore } from "./store/authStore";
import "./index.css";

function ProtectedLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  const dashboard = useAdminStore((state) => state.dashboard);
  const loading = useAdminStore((state) => state.loading);
  const filterRole = useAdminStore((state) => state.filterRole);
  const load = useAdminStore((state) => state.load);
  const setFilterRole = useAdminStore((state) => state.setFilterRole);

  useEffect(() => {
    void load();
  }, [load]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const getPageLabel = (pathname: string) => {
    if (pathname.includes("/workspace/inbox")) return "报名收件箱";
    if (pathname.includes("/workspace/applicants")) return "候选人列表";
    if (pathname.includes("/workspace/roles")) return "招募岗位管理";
    if (pathname.includes("/workspace/templates")) return "简历解析模板";
    if (pathname.includes("/workspace/tasks")) return "后台异步队列";
    if (pathname.includes("/workspace/settings")) return "系统设置与权限";
    return "概览看板";
  };

  return (
    <AdminShell pageLabel={getPageLabel(location.pathname)}>
      <Routes>
        <Route
          path="dashboard"
          element={
            <DashboardView
              dashboard={dashboard}
              loading={loading}
              filterRole={filterRole}
              onFilterChange={setFilterRole}
              onRefresh={load}
            />
          }
        />
        <Route path="inbox" element={<InboxPage />} />
        <Route path="applicants" element={<ApplicantsPage />} />
        <Route path="roles" element={<RolesPage />} />
        <Route path="templates" element={<TemplatesPage />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </AdminShell>
  );
}

function RootApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/workspace/*" element={<ProtectedLayout />} />
        <Route path="/" element={<Navigate to="/workspace/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/workspace/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootApp />
  </StrictMode>,
);
