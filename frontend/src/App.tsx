import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/TesteRotaSegura';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota padrão redireciona para login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Rotas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rotas Protegidas */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        {/* Rota para páginas não encontradas */}
        <Route path="*" element={<div className="text-center mt-10">Página não encontrada (404)</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;