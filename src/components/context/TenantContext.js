// src/components/context/TenantContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';

const TenantContext = createContext();

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    // Return default values if context not available (prevents errors)
    return {
      tenant: {
        business_name: 'Performance Unit',
        app_name: 'Performance Unit',
        primary_color: '#10B981',
        secondary_color: '#059669'
      },
      loading: false,
      updateBranding: () => {}
    };
  }
  return context;
};

export const TenantProvider = ({ children }) => {
  const [tenant, setTenant] = useState({
    id: 1,
    subdomain: 'demo',
    business_name: 'Demo Personal Trainer',
    app_name: 'Demo Fitness App',
    primary_color: '#10B981',
    secondary_color: '#059669',
    logo_url: null
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Para já, usar apenas dados demo para evitar erros
    // Mais tarde conectamos à API
    applyBranding(tenant);
  }, [tenant]);

  const applyBranding = (tenantData) => {
    try {
      // Update document title
      document.title = tenantData.app_name || tenantData.business_name;
      
      // Apply CSS custom properties for colors
      document.documentElement.style.setProperty('--primary-color', tenantData.primary_color);
      document.documentElement.style.setProperty('--secondary-color', tenantData.secondary_color);
      
      console.log('Branding applied:', tenantData.app_name, tenantData.primary_color);
    } catch (error) {
      console.warn('Failed to apply branding:', error);
    }
  };

  const updateBranding = (newBranding) => {
    const updatedTenant = { ...tenant, ...newBranding };
    setTenant(updatedTenant);
    applyBranding(updatedTenant);
  };

  const value = {
    tenant,
    loading,
    updateBranding
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};