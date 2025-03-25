import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/layouts/Layout";
import TenderData from "../features/tdp-lg/pages/TenderData";
import {AiSearchTender} from "../features/tdp-lg/pages/AiTenderSearch";
import CaMain from "../features/tdp-ca/pages/ca-main";
import BmMain from "../features/tdp-bm/pages/bm-main";
import KbMain from "../features/tdp-kb/pages/kb-main";
import ForgotResetPassword from "../auth/pages/ForgotResetPassword";
import Login from "../auth/pages/login";
import SignUp from "../auth/pages/SignUp";
import {SearchTender} from "../features/tdp-lg/pages/TenderSearch"
// "../features/tdp-lg/pages/TenderSearch";
import TenderDetails from "../features/tdp-tm/components/SubmittedTenderDetails";
import TenderDashboard from "../features/tdp-tm/pages/TenderDashboard";
import BidStatusUpdates from '../features/tdp-tm/pages/BidStatusUpdates';
import MyBids from "../features/tdp-tm/pages/MyBids";
const AppRoutes = () => {
  return (
    <Routes>
    {/* Redirect root to /tenderdata */}
    <Route path="/" element={<Navigate to="lg/search-tender" />} />

    {/* All pages under Layout */}
    <Route path="/" element={<Layout />}>
      
      <Route path="login" element={<Login />} />
      <Route path="forgot-reset-password" element={<ForgotResetPassword />} />
      <Route path="forgot-reset-password/:token" element={<ForgotResetPassword />} />
      <Route path="signup" element={<SignUp />} />

      {/* TDP-LG Feature Routes */}
      <Route path="lg" element={<Navigate to="/lg/search-tender" />} />
      <Route path="lg/search-tender" element={<SearchTender />} />
      <Route path="lg/tenderdata" element={<TenderData />} />
      <Route path="lg/ai-search-tender" element={<AiSearchTender />} />

      {/* TDP-TM Feature Routes */}
      <Route path="tm/my_bids" element={<MyBids />} />
      <Route path="tm/my_tenders" element={<TenderDashboard />} />
      <Route path="/bidupdates" element={<BidStatusUpdates />} />
      <Route path="tender/:subId" element={<TenderDetails />} />

      {/* Other Feature Routes */}
      <Route path="ca/camain" element={<CaMain />} />
      <Route path="bm/bmmain" element={<BmMain />} />
      <Route path="kb/kbmain" element={<KbMain />} />
    </Route>
  </Routes>
  );
};

export default AppRoutes;
