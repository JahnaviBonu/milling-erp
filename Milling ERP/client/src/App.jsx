import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Layout from './components/layout/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Batches from './pages/Batches.jsx';
import Procurement from './pages/Procurement.jsx';
import QualityControl from './pages/QualityControl.jsx';
import Reports from './pages/Reports.jsx';
import Settings from './pages/Settings.jsx';
import Login from './pages/Login.jsx';

function PrivateRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Layout>{children}</Layout>;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/batches"
            element={
              <PrivateRoute>
                <Batches />
              </PrivateRoute>
            }
          />
          <Route
            path="/procurement"
            element={
              <PrivateRoute>
                <Procurement />
              </PrivateRoute>
            }
          />
          <Route
            path="/quality"
            element={
              <PrivateRoute>
                <QualityControl />
              </PrivateRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <PrivateRoute>
                <Reports />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute adminOnly>
                <Settings />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
