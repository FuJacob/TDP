import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/layouts/Layout";
import TenderData from "../features/tender-data/TenderData";
import {AiSearchTender} from "../features/tdp-lg/pages/AiTenderSearch";
import CaMain from "../features/tdp-ca/ca-main";
import BmMain from "../features/tdp-bm/bm-main";
import ForgotResetPassword from "../auth/pages/ForgotResetPassword";
import Login from "../auth/pages/login";
import SignUp from "../auth/pages/SignUp";
import {SearchTender} from "../features/tdp-lg/pages/TenderSearch";
const AppRoutes = () => {
  return (
    <Routes>
    {/* Redirect root to /tenderdata */}
    <Route path="/" element={<Navigate to="/tenderdata" />} />

    {/* All pages under Layout */}
    <Route path="/" element={<Layout />}>
      <Route path="tenderdata" element={<TenderData />} />
      <Route path="login" element={<Login />} />
      <Route path="forgot-reset-password" element={<ForgotResetPassword />} />
      <Route path="forgot-reset-password/:token" element={<ForgotResetPassword />} />
      <Route path="signup" element={<SignUp />} />

      {/* TDP-LG Feature Routes */}
      <Route path="lg" element={<Navigate to="/lg/search-tender" />} />
      <Route path="lg/search-tender" element={<SearchTender />} />
      <Route path="lg/ai-search-tender" element={<AiSearchTender />} />

      {/* Other Feature Routes */}
      <Route path="ca" element={<CaMain />} />
      <Route path="bm" element={<BmMain />} />
    </Route>
  </Routes>
  );
};

export default AppRoutes;
