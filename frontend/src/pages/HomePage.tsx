import { useState, useEffect, useMemo } from 'react';
import { ProductApi } from '../api/products';
import type { Product } from '../types/product';
import ProductForm from '../components/ProductForm';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar'; // <--- O Import da Navbar está aqui!

// --- ÍCONES SVG ---
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
  </svg>
);
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </svg>
);
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);
const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.232-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
  </svg>
);

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const ProductModal = ({ product, onClose, instagramLink }: { product: Product; onClose: () => void; instagramLink: string }) => {
  const [activeImage, setActiveImage] = useState(product.imageUrls?.[0] || '');

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full hover:bg-gray-100 md:hidden">
          <CloseIcon />
        </button>

        <div className="w-full md:w-1/2 bg-gray-100 p-6 flex flex-col items-center">
          <div className="flex-1 w-full flex items-center justify-center mb-4 relative">
            {activeImage ? (
              <img src={activeImage} alt={product.name} className="max-h-[400px] w-auto object-contain drop-shadow-lg transition-all duration-300" />
            ) : (
              <span className="text-gray-400">Sem imagem</span>
            )}
          </div>
          {product.imageUrls && product.imageUrls.length > 1 && (
            <div className="flex gap-2 overflow-x-auto py-2 px-1 w-full justify-center">
              {product.imageUrls.map((url, index) => (
                <button key={index} onClick={() => setActiveImage(url)} className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${activeImage === url ? 'border-pink-500 shadow-md scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="w-full md:w-1/2 p-8 flex flex-col overflow-y-auto">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-pink-600 mb-1 tracking-wide uppercase">Novo na Loja</p>
              <h2 className="text-3xl font-bold text-gray-900 leading-tight">{product.name}</h2>
            </div>
            <button onClick={onClose} className="hidden md:block p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <CloseIcon />
            </button>
          </div>
          <div className="mt-4">
            <span className="text-4xl font-bold text-gray-900">{formatCurrency(Number(product.price))}</span>
            <span className="ml-2 text-sm text-gray-500 font-medium">à vista</span>
          </div>
          <div className="mt-6 flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Tamanho disponível:</span>
            <span className="inline-flex items-center justify-center px-3 py-1 rounded-md border border-gray-300 bg-gray-50 text-sm font-bold text-gray-800">
              {product.size}
            </span>
          </div>
          <div className="mt-6 border-t border-gray-100 pt-6">
            <h3 className="text-sm font-medium text-gray-900">Descrição</h3>
            <p className="mt-2 text-gray-600 leading-relaxed text-sm">
              {product.description || 'Nenhuma descrição detalhada disponível.'}
            </p>
          </div>
          <div className="mt-auto pt-8">
            <a href={instagramLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:opacity-95 transition-all">
              <InstagramIcon />
              Quero Comprar
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function HomePage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Estados para CRUD (apenas Admin)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | undefined>(undefined);

  const INSTAGRAM_LINK = "https://www.instagram.com/_gilmarastore?igsh=MXFianZtZHFuMGI2Mg%3D%3D";

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await ProductApi.getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [products, searchTerm]);

  // Ações de Admin
  const handleEdit = (product: Product) => {
    setProductToEdit(product);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir?')) {
      await ProductApi.deleteProduct(id);
      loadProducts();
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setProductToEdit(undefined);
    loadProducts();
  };

  return (
    <div className={`min-h-screen bg-gray-50 font-sans selection:bg-pink-100 selection:text-pink-600 ${selectedProduct || isFormOpen ? 'overflow-hidden h-screen' : ''}`}>
      <Navbar /> {/* <--- Navbar está aqui! */}

      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 opacity-90" />
        <div className="relative max-w-7xl mx-auto py-20 px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-md">
            Loja Gilmara
          </h1>
          <p className="text-lg text-pink-100 mb-8 max-w-2xl mx-auto">
            Encontre o estilo perfeito para você.
          </p>
          <div className="relative w-full max-w-md mx-auto group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <SearchIcon />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-3 rounded-full bg-white/95 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-pink-300 shadow-xl transition-all"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-600"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm">
            <p className="text-gray-500">Nenhum produto encontrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer relative"
                onClick={() => setSelectedProduct(product)}
              >
                {/* BOTÕES DE ADMIN (Aparecem no hover se for admin) */}
                {isAdmin && (
                  <div className="absolute top-2 right-2 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-1 rounded-lg shadow-sm backdrop-blur-sm">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleEdit(product); }}
                      className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md"
                      title="Editar"
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(product.id); }}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-md"
                      title="Excluir"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                )}

                <div className="relative block aspect-[4/5] bg-gray-100 overflow-hidden">
                  {product.imageUrls && product.imageUrls.length > 0 ? (
                    <img
                      src={product.imageUrls[0]}
                      alt={product.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-300 text-sm">Sem imagem</div>
                  )}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm text-sm font-bold text-gray-900">
                    {formatCurrency(Number(product.price))}
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <div className="block mb-2">
                    <h3 className="text-base font-semibold text-gray-800 line-clamp-1 hover:text-pink-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 h-10">
                      {product.description || 'Produto exclusivo.'}
                    </p>
                  </div>
                  <div className="mt-auto pt-4">
                    <button className="w-full py-2 px-4 rounded-lg bg-pink-50 text-pink-600 text-sm font-semibold hover:bg-pink-100 transition-colors">
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Botão Flutuante de Adicionar (Só Admin) */}
      {isAdmin && (
        <button
          onClick={() => { setProductToEdit(undefined); setIsFormOpen(true); }}
          className="fixed bottom-8 right-8 bg-pink-600 hover:bg-pink-700 text-white p-4 rounded-full shadow-lg transition-all z-40 hover:scale-110 active:scale-95"
          title="Adicionar Produto"
        >
          <PlusIcon />
        </button>
      )}

      {/* Modais */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          instagramLink={INSTAGRAM_LINK}
        />
      )}

      {isFormOpen && (
        <ProductForm
          initialData={productToEdit}
          onClose={() => setIsFormOpen(false)}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}