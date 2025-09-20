import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./presentation/pages/HomePage/HomePage.jsx";
import SearchPage from "./presentation/pages/SearchPage/SearchPage.jsx";
import ComparisonPage from "./presentation/pages/ComparisonPage/ComparisonPage.jsx";
import LoginPage from "./presentation/pages/AuthPage/LoginPage.jsx";
import PrivateRoute from "./presentation/pages/PrivateRoute.jsx";
import { SelectedProductsProvider } from './presentation/providers/SelectProductsContext.jsx';
import { seedMockData } from './data/mockseed';

seedMockData();

function App() {
  return (
    <SelectedProductsProvider>
      <Router>
        <Routes>
          {/* Default route redirects to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes */}
          <Route path="/home" element={<PrivateRoute><HomePage /></PrivateRoute>} />
          <Route path="/search" element={<PrivateRoute><SearchPage /></PrivateRoute>} />
          <Route path="/compare" element={<PrivateRoute><ComparisonPage /></PrivateRoute>} />
        </Routes>
      </Router>
    </SelectedProductsProvider>
  );
}

export default App;
