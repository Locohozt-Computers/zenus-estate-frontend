import React, { Suspense } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { PageLoad } from "components/atoms/Loader";
import { ROUTES } from "app-constants";
import LoginPage from "pages/LoginPage";
import { AuthLayout, DashboardLayout } from "layouts";
import { useSelector } from "react-redux";
import { authSelectors } from "store/reducers/auth/authDocSlice";
import NotFoundPage from "pages/NotFoundPage";
import ContactAdminPage from "pages/ContactAdminPage";

const LazyHomePage = React.lazy(() => import("pages/HomePage"));
const LazyReportEmergencyPage = React.lazy(
  () => import("pages/ReportEmergencyPage")
);
const LazyPrintReceiptPage = React.lazy(() => import("pages/PrintReceiptPage"));
const LazyInstantPayPage = React.lazy(() => import("pages/InstantPayPage"));
const LazyMyAccountPage = React.lazy(() => import("pages/MyAccountPage"));
const LazyPlayPage = React.lazy(() => import("pages/PlayPage"));
const LazyWalletPage = React.lazy(() => import("pages/WalletPage"));
const LazySignUpPage = React.lazy(() => import("pages/SignUpPage"));
const LazyEstateBanksPage = React.lazy(() => import("pages/EstateBanksPage"));
const LazyAccountStatementPage = React.lazy(
  () => import("pages/AccountStatementPage")
);
const LazyForgetPassword = React.lazy(() => import("pages/ForgetPasswordPage"));
const LazyResetPassword = React.lazy(() => import("pages/ResetPasswordPage"));

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
            path={ROUTES.forgetPassword.path}
            element={<LazyForgetPassword />}
          />
          <Route
            path={ROUTES.resetPassword.path}
            element={<LazyResetPassword />}
          />
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
              element={<LazyAccountStatementPage />}
            />
            <Route
              path={ROUTES.instantPay.path}
              element={<LazyInstantPayPage />}
            />
          </Route>
          <Route path={ROUTES.myAccount.path} element={<LazyMyAccountPage />} />
          <Route
            path={ROUTES.printReceipt.path}
            element={<LazyPrintReceiptPage />}
          />
          <Route
            path={ROUTES.estateBanks.path}
            element={<LazyEstateBanksPage />}
          />
          <Route
            path={ROUTES.contactAdmin.path}
            element={<ContactAdminPage />}
          />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
