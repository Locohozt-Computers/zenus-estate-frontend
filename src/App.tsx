import React, { Suspense } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { PageLoad } from "components/atoms/Loader";
import { ROUTES } from "app-constants";
import LoginPage from "pages/LoginPage";
import { AuthLayout, DashboardLayout } from "layouts";
import { useSelector } from "react-redux";
import { authSelectors } from "store/reducers/auth/authDocSlice";
import NotFoundPage from "pages/NotFoundPage";

const LazyHomePage = React.lazy(() => import("pages/HomePage"));
const LazyReportEmergencyPage = React.lazy(
  () => import("pages/ReportEmergencyPage")
);
const LazyContactAdminPage = React.lazy(() => import("pages/ContactAdminPage"));
const LazyPrintReceiptPage = React.lazy(() => import("pages/PrintReceiptPage"));
const LazyInstantPayPage = React.lazy(() => import("pages/InstantPayPage"));
const LazyOtherPage = React.lazy(() => import("pages/OtherPage"));
const LazyPlayPage = React.lazy(() => import("pages/PlayPage"));
const LazyWalletPage = React.lazy(() => import("pages/WalletPage"));
const LazySignUpPage = React.lazy(() => import("pages/SignUpPage"));

const PrivateRoute = () => {
  const isAuth = useSelector(authSelectors.isAuth);
  if (isAuth) {
    return (
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    );
  }
  return <Navigate to={ROUTES.login.path} />;
};

const ProtectedRoute = () => {
  const isAuth = useSelector(authSelectors.isAuth);
  if (isAuth) {
    return <Navigate to={ROUTES.home.path} />;
  }

  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
};

function App() {
  return (
    <Suspense fallback={<PageLoad />}>
      <Routes>
        <Route path="/" element={<ProtectedRoute />}>
          <Route path={ROUTES.signUp.path} element={<LazySignUpPage />} />
          <Route path={ROUTES.login.path} element={<LoginPage />} />
          <Route
            path="/"
            element={<Navigate replace to={ROUTES.login.path} />}
          />
        </Route>

        <Route path="/" element={<PrivateRoute />}>
          {process.env.NODE_ENV === "development" && (
            <Route path={ROUTES.playground.path} element={<LazyPlayPage />} />
          )}
          <Route path={ROUTES.home.path} element={<LazyHomePage />} />
          <Route
            path="/"
            element={<Navigate replace to={ROUTES.home.path} />}
          />
          <Route
            path={ROUTES.reportEmergency.path}
            element={<LazyReportEmergencyPage />}
          />
          <Route path={ROUTES.myWallet.path} element={<LazyWalletPage />} />
          <Route
            path={ROUTES.myBills.path}
            element={<Navigate replace to={ROUTES.instantPay.path} />}
          />
          <Route path={ROUTES.myBills.path} element={<Outlet />}>
            <Route
              path={ROUTES.accountStatements.path}
              element={<LazyOtherPage />}
            />
            <Route
              path={ROUTES.instantPay.path}
              element={<LazyInstantPayPage />}
            />
          </Route>
          <Route path={ROUTES.myAccount.path} element={<LazyOtherPage />} />
          <Route
            path={ROUTES.printReceipt.path}
            element={<LazyPrintReceiptPage />}
          />
          <Route path={ROUTES.estateBanks.path} element={<LazyOtherPage />} />
          <Route
            path={ROUTES.contactAdmin.path}
            element={<LazyContactAdminPage />}
          />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
