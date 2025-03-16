// src/App.js
import React, { useState, useEffect, useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './components/context/AuthContext';
import './styles/styles.css';

// Páginas de Autenticação
import Login from './Pages/auth/Login';
import Register from './Pages/auth/Register';
import ForgotPassword from './Pages/auth/ForgotPassword';
import ResetPassword from './Pages/auth/ResetPassword';

// Dashboard
import Dashboard from './Pages/dashboard/Dashboard';

// Atletas
import AthletesList from './Pages/athletes/AthletesList';
import AthleteDetail from './Pages/athletes/AthleteDetail';
import AddAthlete from './Pages/athletes/AddAthlete';
import EditAthlete from './Pages/athletes/EditAthlete';

// Treinos
import WorkoutSession from './Pages/workouts/WorkoutSession';
import WorkoutsList from './Pages/workouts/WorkoutsList';
import WorkoutDetail from './Pages/workouts/WorkoutDetail';
import CreateWorkout from './Pages/workouts/CreateWorkout';
import EditWorkout from './Pages/workouts/EditWorkout';
import ExerciseLibrary from './Pages/workouts/ExerciseLibrary';

// Nutrição
import NutritionPlans from './Pages/nutrition/NutritionPlans';
import NutritionPlanDetail from './Pages/nutrition/NutritionPlanDetail';
import CreateNutritionPlan from './Pages/nutrition/CreateNutritionPlan';
import MealLibrary from './Pages/nutrition/MealLibrary';

// Agenda
import Calendar from './Pages/calendar/Calendar';
import SessionDetail from './Pages/calendar/SessionDetail';

// Mensagens
import Messages from './Pages/messages/Messages';
import Conversation from './Pages/messages/Conversation';

// Finanças
import Finance from './Pages/finance/Finance';
import Invoices from './Pages/finance/Invoices';
import Subscriptions from './Pages/finance/Subscriptions';

// Análises
import Analytics from './Pages/analytics/Analytics';
import Reports from './Pages/analytics/Reports';

// Configurações
import Settings from './Pages/settings/Settings';
import Profile from './Pages/settings/Profile';
import BusinessSettings from './Pages/settings/BusinessSettings';
import Notifications from './Pages/settings/Notifications';

// Loading Placeholder
const LoadingPlaceholder = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    fontSize: '18px',
    color: '#10B981'
  }}>
    Carregando aplicativo...
  </div>
);

// Rota protegida que verifica autenticação
const ProtectedRoute = ({ children }) => {
  const { token, loading } = useContext(AuthContext);
  
  if (loading) {
    return <LoadingPlaceholder />;
  }
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// AppRoutes - Componente para as rotas, que precisa ter acesso ao contexto
const AppRoutes = () => {
  const { loading: authLoading } = useContext(AuthContext);
  const [appLoading, setAppLoading] = useState(true);
  
  useEffect(() => {
    // Simular carregamento inicial de recursos
    const timer = setTimeout(() => {
      setAppLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (authLoading || appLoading) {
    return <LoadingPlaceholder />;
  }
  
  return (
    <Routes>
      {/* Rotas de Autenticação */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      
      {/* Dashboard */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      {/* Atletas */}
      <Route path="/athletes" element={
        <ProtectedRoute>
          <AthletesList />
        </ProtectedRoute>
      } />
      <Route path="/athletes/:id" element={
        <ProtectedRoute>
          <AthleteDetail />
        </ProtectedRoute>
      } />
      <Route path="/athletes/add" element={
        <ProtectedRoute>
          <AddAthlete />
        </ProtectedRoute>
      } />
      <Route path="/athletes/:id/edit" element={
        <ProtectedRoute>
          <EditAthlete />
        </ProtectedRoute>
      } />
      
      
      {/* Treinos */}
<Route path="/workouts" element={
  <ProtectedRoute>
    <WorkoutsList />
  </ProtectedRoute>
} />
<Route path="/workouts/create" element={
  <ProtectedRoute>
    <CreateWorkout />
  </ProtectedRoute>
} />
<Route path="/workouts/exercises" element={
  <ProtectedRoute>
    <ExerciseLibrary />
  </ProtectedRoute>
} />
<Route path="/workouts/:id/start" element={
  <ProtectedRoute>
    <WorkoutSession />
  </ProtectedRoute>
} />
<Route path="/workouts/:id/edit" element={
  <ProtectedRoute>
    <EditWorkout />
  </ProtectedRoute>
} />
<Route path="/workouts/:id" element={
  <ProtectedRoute>
    <WorkoutDetail />
  </ProtectedRoute>
} />
      
      {/* Nutrição */}
      <Route path="/nutrition" element={
        <ProtectedRoute>
          <NutritionPlans />
        </ProtectedRoute>
      } />
      <Route path="/nutrition/:id" element={
        <ProtectedRoute>
          <NutritionPlanDetail />
        </ProtectedRoute>
      } />
      <Route path="/nutrition/create" element={
        <ProtectedRoute>
          <CreateNutritionPlan />
        </ProtectedRoute>
      } />
      <Route path="/nutrition/meals" element={
        <ProtectedRoute>
          <MealLibrary />
        </ProtectedRoute>
      } />
      
      {/* Agenda */}
      <Route path="/calendar" element={
        <ProtectedRoute>
          <Calendar />
        </ProtectedRoute>
      } />
      <Route path="/calendar/session/:id" element={
        <ProtectedRoute>
          <SessionDetail />
        </ProtectedRoute>
      } />
      
      {/* Mensagens */}
      <Route path="/messages" element={
        <ProtectedRoute>
          <Messages />
        </ProtectedRoute>
      } />
      <Route path="/messages/:id" element={
        <ProtectedRoute>
          <Conversation />
        </ProtectedRoute>
      } />
      
      {/* Finanças */}
      <Route path="/finance" element={
        <ProtectedRoute>
          <Finance />
        </ProtectedRoute>
      } />
      <Route path="/finance/invoices" element={
        <ProtectedRoute>
          <Invoices />
        </ProtectedRoute>
      } />
      <Route path="/finance/subscriptions" element={
        <ProtectedRoute>
          <Subscriptions />
        </ProtectedRoute>
      } />
      
      {/* Análises */}
      <Route path="/analytics" element={
        <ProtectedRoute>
          <Analytics />
        </ProtectedRoute>
      } />
      <Route path="/analytics/reports" element={
        <ProtectedRoute>
          <Reports />
        </ProtectedRoute>
      } />
      
      {/* Configurações */}
      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />
      <Route path="/settings/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="/settings/business" element={
        <ProtectedRoute>
          <BusinessSettings />
        </ProtectedRoute>
      } />
      <Route path="/settings/notifications" element={
        <ProtectedRoute>
          <Notifications />
        </ProtectedRoute>
      } />
      
      {/* Redirecionamentos */}
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

// Componente principal da aplicação
const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;