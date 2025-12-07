import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute'; // Importe a proteção
import Login from './pages/Login';
import Register from './pages/Register';
import HomePage from './pages/HomePage';
import ProductDashboard from './pages/ProductDashboard'; // Importe o Dashboard
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          {/* A Navbar foi movida para dentro das páginas específicas ou mantida aqui se quiser global. 
              Como as páginas Home e Dashboard já estão chamando <Navbar />, vou remover daqui para não duplicar.
              Se preferir uma Navbar fixa global, remova <Navbar/> de dentro de HomePage.tsx e ProductDashboard.tsx e deixe aqui.
              Vou deixar aqui para garantir que apareça em rotas como Login/Register se desejar, ou você pode remover.
              
              Para evitar duplicação com o código anterior da HomePage que já tem Navbar, 
              vamos remover daqui e deixar cada página controlar sua Navbar, ou o contrário.
              
              Vou optar por REMOVER daqui e garantir que HomePage e Dashboard tenham a sua.
          */}

          <div className="flex-grow">
            <Routes>
              {/* Rota Pública */}
              <Route path="/" element={<HomePage />} />

              {/* Rotas de Auth */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* ROTA PROTEGIDA DE DASHBOARD (Restaurada) */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute roleRequired="ADMIN">
                    <ProductDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;