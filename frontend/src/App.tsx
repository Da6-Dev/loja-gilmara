import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login'; // Verifique se o caminho do seu Login está correto
import ProductDashboard from './pages/ProductDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota raiz: Se não estiver logado, mostra Login */}
        <Route path="/" element={<Login />} />
        
        {/* Rota de Login explícita */}
        <Route path="/login" element={<Login />} />

        {/* AQUI ESTÁ A CORREÇÃO: Definindo a rota do Dashboard */}
        <Route path="/dashboard" element={<ProductDashboard />} />

        {/* Rota Curinga: Se o usuário digitar algo que não existe, volta para o Login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;