// frontend/src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login'; 
import Register from './pages/Register'; // Adicionado Register
import ProductDashboard from './pages/ProductDashboard';
import HomePage from './pages/HomePage'; // Renomeado de TesteRotaSegura
import { ProtectedRoute } from './components/ProtectedRoute'; // Importa o componente de proteção

function App() {
  // A função para verificar se o usuário está logado
  const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };

  return (
    <BrowserRouter>
      <Routes>
        
        {/* Rotas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Rota Raiz: Redireciona usuários logados para a home, e visitantes para o login */}
        <Route path="/" element={isAuthenticated() ? <Navigate to="/home" /> : <Navigate to="/login" />} />
        
        {/*
          Página Inicial (/home)
          Acessível por qualquer usuário logado (USER ou ADMIN), pois 'roleRequired' não é especificado.
        */}
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } 
        />
        
        {/*
          Dashboard de Produtos (/dashboard)
          Acessível SOMENTE por usuários com a role ADMIN, através da prop roleRequired.
        */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute roleRequired="ADMIN">
              <ProductDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Rota Curinga: Redireciona para a raiz para processar a autenticação */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
