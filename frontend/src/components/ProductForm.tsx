import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Product } from '../types/product';
import { ProductApi } from '../api/products'; // Assumindo que você criou o products.ts

// 1. Definição do Schema de Validação (Zod)
const productSchema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres.'),
  description: z.string().optional(),
  price: z.preprocess(
    (a) => parseFloat(z.string().min(1).parse(a).replace(',', '.')),
    z.number().min(0.01, 'O preço deve ser maior que zero.')
  ),
  size: z.string().min(1, 'O tamanho é obrigatório.'),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: Product;
  onSuccess: () => void;
  onClose: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSuccess, onClose }) => {
  const isEditing = !!initialData;
  const title = isEditing ? 'Editar Produto' : 'Adicionar Novo Produto';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: isEditing ? {
      name: initialData.name,
      description: initialData.description,
      // O valor do preço precisa ser formatado para o input
      price: initialData.price,
      size: initialData.size,
    } : {
      name: '',
      description: '',
      price: 0,
      size: 'P',
    },
  });

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (isEditing) {
        await ProductApi.updateProduct(initialData.id, data);
      } else {
        await ProductApi.createProduct(data);
      }
      onSuccess();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      alert(isEditing ? 'Erro ao editar produto.' : 'Erro ao criar produto.');
    }
  };

  const commonInputClasses = "mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2";
  const errorTextClasses = "text-red-500 text-sm mt-1";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              type="text"
              id="name"
              {...register('name')}
              className={commonInputClasses}
            />
            {errors.name && <p className={errorTextClasses}>{errors.name.message}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição</label>
            <textarea
              id="description"
              {...register('description')}
              rows={3}
              className={commonInputClasses}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">Preço (R$)</label>
              <input
                type="number"
                step="0.01"
                id="price"
                {...register('price', { valueAsNumber: true })}
                className={commonInputClasses}
              />
              {errors.price && <p className={errorTextClasses}>{errors.price.message}</p>}
            </div>
            <div>
              <label htmlFor="size" className="block text-sm font-medium text-gray-700">Tamanho</label>
              <select
                id="size"
                {...register('size')}
                className={commonInputClasses}
              >
                <option value="P">P</option>
                <option value="M">M</option>
                <option value="G">G</option>
                <option value="GG">GG</option>
              </select>
              {errors.size && <p className={errorTextClasses}>{errors.size.message}</p>}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg text-white font-semibold ${isSubmitting ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;

