import { createContext, useState } from 'react';

export const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

  return (
    <LoaderContext.Provider value={{ loading, startLoading, stopLoading }}>
      {children}
    </LoaderContext.Provider>
  );
};
