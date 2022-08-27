import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { Loader } from "components/atoms/Loader";
import { ROUTES } from "app-constants";
import HomePage from "pages/HomePage";

const LazyLoginPage = React.lazy(() => import("pages/LoginPage"));
const LazyOtherPage = React.lazy(() => import("pages/OtherPage"));

function App() {
  return (
    <Suspense fallback={<Loader open />}>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path={ROUTES.login.fullPath} element={<LazyLoginPage />} />
        <Route path={ROUTES.other.path} element={<LazyOtherPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
