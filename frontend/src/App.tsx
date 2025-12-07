// frontend/src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import { ProtectedRoute } from './components/ProtectedRoute';

// Importe a tela real de Dashboard para o ADMIN
import ProductDashboard from './pages/ProductDashboard'; 
// Use TesteRotaSegura como a Dashboard de USER
import UserDashboard from './pages/TesteRotaSegura'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Rotas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🆕 Rota Protegida para usuários comuns (Exemplo) */}
        <Route 
          path="/user/dashboard" 
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* 🆕 Rota Protegida para ADMIN (Gestão de Produtos) */}
        <Route 
          path="/admin/products" 
          element={
            // Exige a role 'ADMIN' para acessar o CRUD de produtos
            <ProtectedRoute roleRequired="ADMIN">
              <ProductDashboard /> 
            </ProtectedRoute>
          } 
        />

        <Route path="*" element={<div className="text-center mt-10">Página não encontrada (404)</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
