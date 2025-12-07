import { useState, useEffect } from 'react';
import { ProductApi } from '../api/products'; // Assumindo que você criou o products.ts
import { Product } from '../types/product';   // Assumindo que você criou o product.ts
import ProductForm from '../components/ProductForm'; // Novo import

// Componente simples para reutilizar o botão
const Button = ({ children, className = '', ...props }) => (
  <button
    className={`px-4 py-2 rounded-lg font-semibold ${className}`}
    {...props}
  >
    {children}
  </button>
);

const ProductDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🆕 ESTADOS PARA O MODAL
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // NOTE: Em um projeto real, 'getProducts' deve incluir o JWT para autenticação/autorização
      const data = await ProductApi.getProducts();
      setProducts(data);
      setError(null);
    } catch (e) {
      setError('Erro ao carregar produtos. Verifique a autenticação e o backend.');
      console.error('API Error:', e);
    } finally {
      setLoading(false);
    }
  };

  // 🆕 FUNÇÕES DE CONTROLE DO MODAL
  const handleAdd = () => {
    setSelectedProduct(undefined); // Modo de Criação (sem dados iniciais)
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product); // Modo de Edição (com dados do produto)
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(undefined); // Limpa o produto selecionado
  };

  const handleSuccess = () => {
    handleCloseModal();
    fetchProducts(); // Recarrega a lista após sucesso
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este produto? Esta ação é irreversível.')) {
      try {
        setLoading(true);
        await ProductApi.deleteProduct(id);
        fetchProducts(); // Recarrega a lista
      } catch (e) {
        setError('Erro ao excluir produto. Verifique a autenticação e o console.');
        setLoading(false);
      }
    }
  };

  if (loading && products.length === 0) return <div className="text-center p-8 text-xl text-gray-500">Carregando produtos...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard de Produtos</h1>
        <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white">
          + Adicionar Novo Produto
        </Button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-lg">{error}</div>}

      {/* Tabela de Produtos (Classes Tailwind) */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tamanho</th>
              <th className="px-6 py-3">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap truncate max-w-xs text-sm text-gray-500">{product.description || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">R$ {product.price.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.size}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <Button
                    onClick={() => handleEdit(product)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs"
                  >
                    Editar
                  </Button>
                  <Button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs"
                  >
                    Excluir
                  </Button>
                </td>
              </tr>
            ))}
            {products.length === 0 && !loading && (
                <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">Nenhum produto encontrado.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🆕 Renderização Condicional do Modal */}
      {isModalOpen && (
        <ProductForm 
          initialData={selectedProduct} // Passa os dados do produto (undefined para criação)
          onClose={handleCloseModal} 
          onSuccess={handleSuccess} 
        />
      )}
    </div>
  );
};

export default ProductDashboard;
