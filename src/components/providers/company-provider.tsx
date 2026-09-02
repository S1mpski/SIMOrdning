'use client';

import { createContext, useContext } from 'react';

type Company = {
  id: string;
  name: string | null;
};

const CompanyContext = createContext<Company | null>(null);

export function CompanyProvider({
  company,
  children,
}: {
  company: Company;
  children: React.ReactNode;
}) {
  return (
    <CompanyContext.Provider value={company}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const company = useContext(CompanyContext);

  if (!company) {
    throw new Error('useCompany måste användas inom CompanyProvider');
  }

  return company;
}
