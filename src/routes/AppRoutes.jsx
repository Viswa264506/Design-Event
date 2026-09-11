import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../services/AuthContext";
import ProtectedRoute from "./ProtectedRoute";

// Participant pages

import LoginPage from "../pages/participant/LoginPage";
import InstructionsPage from "../pages/participant/InstructionsPage";
import ChallengePage from "../pages/participant/ChallengePage";
import ResultPage from "../pages/participant/ResultPage";

// Admin pages
import AdminLoginPage from "../pages/admin/AdminLoginPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";

const AppRoutes = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Participant Routes */}
        <Route path="/" element={<LoginPage />} />
        
        <Route 
          path="/instructions" 
          element={
            <ProtectedRoute stage="instructions">
              <InstructionsPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/challenge" 
          element={
            <ProtectedRoute stage="challenge">
              <ChallengePage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/result" 
          element={
            <ProtectedRoute stage="result">
              <ResultPage />
            </ProtectedRoute>
          } 
        />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute admin={true}>
              <AdminDashboardPage />
            </ProtectedRoute>
          } 
        />

        {/* Fallback redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default AppRoutes;