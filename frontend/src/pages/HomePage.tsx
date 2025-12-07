import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();
  
  // Recupera os dados do usuário salvos no login
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : { name: 'Usuário' };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
    
    // Adicionado um botão para ir para o Dashboard
  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };
  
return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-800">Loja Gilmara - Home</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Olá, {user.name}</span>
              <button 
                onClick={handleGoToDashboard}
                className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg font-medium"
              >
                Ir para Dashboard
              </button>
              <button 
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex flex-col items-center justify-center">
            <p className="text-gray-500 text-lg mb-4">
              Bem-vindo à **Página Inicial**! 🏡
              <br />
              Essa rota está disponível para **todos os usuários logados** (USER e ADMIN).
            </p>
            <p className="text-gray-500 text-sm">
              Seu ID: {user.id}
              <br />
              Seu Papel: **{user.role}**
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
