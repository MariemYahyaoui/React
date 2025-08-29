import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./presentation/pages/HomePage/HomePage";
import SearchPage from "./presentation/pages/SearchPage/SearchPage";
import ComparisonPage from "./presentation/pages/ComparisonPage/ComparisonPage";
import { SelectedProductsProvider } from './presentation/providers/SelectProductsContext';
import { seedMockData } from './data/mockseed';

seedMockData(); // seed products for immediate testing

function App() {
  return (
    <SelectedProductsProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/compare" element={<ComparisonPage />} />
        </Routes>
      </Router>
    </SelectedProductsProvider>
  );
}

export default App;
