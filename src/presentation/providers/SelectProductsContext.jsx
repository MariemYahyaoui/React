import React, { createContext, useState, useContext } from "react";

const SelectedProductsContext = createContext();

export const SelectedProductsProvider = ({ children }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  return (
    <SelectedProductsContext.Provider value={{ selectedProducts, setSelectedProducts }}>
      {children}
    </SelectedProductsContext.Provider>
  );
};

export const useSelectedProducts = () => useContext(SelectedProductsContext);
