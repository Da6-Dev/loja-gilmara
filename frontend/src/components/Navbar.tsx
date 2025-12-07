import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// --- ÍCONES SVG ---
const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
);

const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
    </svg>
);

const BagIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </svg>
);

const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
);

const DashboardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
    </svg>
);

const Navbar = () => {
    const { isAuthenticated, logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Verifica se o usuário é ADMIN
    const isAdmin = user?.role === 'ADMIN';

    // Estilo para link ativo vs inativo
    const getLinkClass = (path: string) =>
        location.pathname === path
            ? "flex items-center gap-2 text-pink-600 font-semibold bg-pink-50 px-3 py-2 rounded-lg transition-colors"
            : "flex items-center gap-2 text-gray-500 font-medium hover:text-pink-600 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors";

    return (
        <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">

                    {/* LADO ESQUERDO: Logo e Menu Principal */}
                    <div className="flex items-center gap-8">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="bg-pink-500 p-1.5 rounded-lg group-hover:bg-pink-600 transition-colors">
                                <span className="text-white"><BagIcon /></span>
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent hidden sm:block">
                                Loja Gilmara
                            </span>
                        </Link>

                        {/* LINKS DE NAVEGAÇÃO (Recuperados!) */}
                        <div className="hidden md:flex items-center space-x-2">
                            <Link to="/" className={getLinkClass('/')}>
                                <HomeIcon />
                                Início
                            </Link>

                            {/* Botão Dashboard (Só aparece para ADMIN) */}
                            {isAuthenticated && isAdmin && (
                                <Link to="/dashboard" className={getLinkClass('/dashboard')}>
                                    <DashboardIcon />
                                    Dashboard
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* LADO DIREITO: Usuário e Ações */}
                    <div className="flex items-center gap-4">
                        {isAuthenticated ? (
                            // SE ESTIVER LOGADO
                            <>
                                <div className="hidden md:flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                                    <UserIcon />
                                    <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                                    {isAdmin && (
                                        <span className="ml-2 text-xs font-bold text-pink-600 bg-pink-100 px-2 py-0.5 rounded-md uppercase border border-pink-200">
                                            Admin
                                        </span>
                                    )}
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Sair"
                                >
                                    <LogoutIcon />
                                    <span className="hidden sm:inline">Sair</span>
                                </button>
                            </>
                        ) : (
                            // SE NÃO ESTIVER LOGADO
                            <div className="flex gap-3">
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
                                >
                                    Entrar
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-4 py-2 text-sm font-medium text-white bg-pink-500 hover:bg-pink-600 rounded-lg shadow-sm shadow-pink-200 transition-all active:scale-95"
                                >
                                    Criar Conta
                                </Link>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;