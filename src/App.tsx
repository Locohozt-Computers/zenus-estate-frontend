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
const LazyDashboardPage = React.lazy(() => import("pages/DashboardPage"));
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
const LazyPaymentSuccessPage = React.lazy(
  () => import("pages/PaymentSuccessPage")
);
const LazyDemandNoticePaymentSuccessPage = React.lazy(
  () => import("pages/DemandNoticePaymentSuccessPage")
);
const LazyElectricityPaymentSuccessPage = React.lazy(
  () => import("pages/ElectricityPaymentSuccessPage")
);
const LazyVisitorsPage = React.lazy(() => import("pages/VisitorsPage"));
const LazyMyBillsHubPage = React.lazy(() => import("pages/MyBillsHubPage"));
const LazyCommunityDuesPage = React.lazy(
  () => import("pages/CommunityDuesPage")
);
const LazyUtilitiesPage = React.lazy(() => import("pages/UtilitiesPage"));
const LazyPowerTokenQuotaPage = React.lazy(
  () => import("pages/PowerTokenQuotaPage")
);
const LazyPowerTokenBuyPage = React.lazy(
  () => import("pages/PowerTokenBuyPage")
);
const LazyReportIssuePage = React.lazy(() => import("pages/ReportIssuePage"));
const LazyTicketDetailPage = React.lazy(
  () => import("pages/ReportIssuePage/TicketDetailPage")
);
const LazyPollsPage = React.lazy(() => import("pages/PollsPage"));
const LazyPollDetailPage = React.lazy(
  () => import("pages/PollsPage/PollDetailPage")
);

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
          <Route path={ROUTES.dashboard.path} element={<LazyDashboardPage />} />
          <Route
            path="/"
            element={<Navigate replace to={ROUTES.home.path} />}
          />
          <Route
            path={ROUTES.reportEmergency.path}
            element={<LazyReportEmergencyPage />}
          />
          <Route path={ROUTES.myWallet.path} element={<LazyWalletPage />} />
          <Route path={ROUTES.myBills.path} element={<Outlet />}>
            <Route index element={<LazyMyBillsHubPage />} />
            <Route
              path={ROUTES.accountStatements.path}
              element={<LazyAccountStatementPage />}
            />
            <Route
              path={ROUTES.instantPay.path}
              element={<LazyInstantPayPage />}
            />
            <Route
              path={ROUTES.communityDues.path}
              element={<LazyCommunityDuesPage />}
            />
            <Route
              path={ROUTES.utilities.path}
              element={<LazyUtilitiesPage />}
            />
            <Route
              path={ROUTES.powerTokenQuota.path}
              element={<LazyPowerTokenQuotaPage />}
            />
            <Route
              path={ROUTES.powerTokenBuy.path}
              element={<LazyPowerTokenBuyPage />}
            />
          </Route>
          <Route path={ROUTES.visitors.path} element={<LazyVisitorsPage />} />
          <Route path={ROUTES.reportIssue.path} element={<Outlet />}>
            <Route index element={<LazyReportIssuePage />} />
            <Route
              path={ROUTES.reportIssueDetail.path}
              element={<LazyTicketDetailPage />}
            />
          </Route>
          <Route path={ROUTES.polls.path} element={<Outlet />}>
            <Route index element={<LazyPollsPage />} />
            <Route
              path={ROUTES.pollDetail.path}
              element={<LazyPollDetailPage />}
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
          <Route
            path={ROUTES.paymentSuccess.path}
            element={<LazyPaymentSuccessPage />}
          />
          <Route
            path={ROUTES.demandNoticePaymentSuccess.path}
            element={<LazyDemandNoticePaymentSuccessPage />}
          />
          <Route
            path={ROUTES.electricityPaymentSuccess.path}
            element={<LazyElectricityPaymentSuccessPage />}
          />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
