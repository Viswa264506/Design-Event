import { Routes, Route } from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import InstructionsPage from "../pages/InstructionsPage";
import ChallengePage from "../pages/ChallengePage";
import ResultPage from "../pages/ResultPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/instructions" element={<InstructionsPage />} />
      <Route path="/challenge" element={<ChallengePage />} />
      <Route path="/result" element={<ResultPage />} />
    </Routes>
  );
};

export default AppRoutes;