import React, { Suspense } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import { Loader } from "components/atoms/Loader";
import { ROUTES } from "app-constants";
import HomePage from "pages/HomePage";
import { AuthLayout, DashboardLayout } from "layouts";

const LazyLoginPage = React.lazy(() => import("pages/LoginPage"));
const LazyOtherPage = React.lazy(() => import("pages/OtherPage"));

const PrivateRoute = () => {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

const ProtectedRoute = () => {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
};

function App() {
  return (
    <Suspense fallback={<Loader open />}>
      <Routes>
        <Route index element={<HomePage />} />
        <Route element={<ProtectedRoute />}>
          <Route path={ROUTES.login.fullPath} element={<LazyLoginPage />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path={ROUTES.other.path} element={<LazyOtherPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
