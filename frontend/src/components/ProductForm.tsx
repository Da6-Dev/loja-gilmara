// frontend/src/components/ProductForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Product } from '../types/product';
import { ProductApi } from '../api/products';

// 1. Schema Base (Usado para Criação)
const productSchema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres.'),
  description: z.string().optional(),
  price: z.preprocess(
    (val) => {
      if (typeof val === 'string') return parseFloat(val.replace(',', '.'));
      return Number(val);
    },
    z.number({ invalid_type_error: "Informe um preço válido" }).min(0.01, 'O preço deve ser maior que zero.')
  ),
  size: z.string().min(1, 'O tamanho é obrigatório.'),
  // Campo de arquivo (obrigatório para criação)
  file: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, 'A imagem é obrigatória.'),
});

// 2. Schema de Edição (Usado para Edição)
const productSchemaEdit = productSchema.extend({
  // Na edição, o campo de arquivo é opcional, pois o usuário pode não querer alterá-lo
  file: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, 'A imagem é obrigatória.')
    .optional(),
});

// Tipagem para os dados do formulário (incluindo FileList)
type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: Product;
  onSuccess: () => void;
  onClose: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSuccess, onClose }) => {
  const isEditing = !!initialData;
  const title = isEditing ? 'Editar Produto' : 'Adicionar Novo Produto';

  // Define qual schema usar (criação ou edição)
  const usedSchema = isEditing ? productSchemaEdit : productSchema;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    // Resolve o schema dinamicamente
    resolver: zodResolver(usedSchema as any), 
    defaultValues: isEditing ? {
      name: initialData.name,
      description: initialData.description,
      price: initialData.price,
      size: initialData.size,
    } : {
      name: '',
      description: '',
      price: 0,
      size: 'P',
      // 'file' não é inicializado, é controlado pelo input file
    },
  });

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (isEditing && initialData) {
        // --- Lógica de Edição ---

        // Se uma imagem foi selecionada, o backend atual não suporta PATCH multipart.
        if (data.file && data.file.length > 0) {
            alert('Aviso: A troca de imagem na edição não está implementada via PATCH. Apenas campos de texto serão enviados.');
        }
        
        // Remove o campo 'file' antes de enviar o JSON para o PATCH
        const { file, ...updateData } = data;
        await ProductApi.updateProduct(initialData.id, updateData as Partial<Product>);
        
      } else {
        // --- Lógica de Criação (ENVIANDO FormData) ---
        const formData = new FormData();
        
        // Anexa os campos de texto/número
        formData.append('name', data.name);
        formData.append('description', data.description || '');
        // Garante que preço e tamanho sejam strings para o FormData
        formData.append('price', String(data.price)); 
        formData.append('size', data.size);
        
        // Anexa o arquivo (o backend espera o campo 'file')
        if (data.file && data.file[0]) {
            formData.append('file', data.file[0]);
        }
        
        await ProductApi.createProduct(formData);
      }
      onSuccess(); // Fecha o modal e atualiza a lista
    } catch (error) {
      console.error('Erro ao salvar:', error);
      // Inclui a mensagem de erro da API para o usuário
      alert(`Erro ao salvar produto. Detalhes: ${error.message || 'Verifique o log do console.'}`);
    }
  };

  const commonInputClasses = "mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2";
  const errorTextClasses = "text-red-500 text-sm mt-1";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>
        {/* Não é necessário encType="multipart/form-data" com handleSubmit, mas não é um erro */}
        <form onSubmit={handleSubmit(onSubmit)}> 
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
            <input type="text" id="name" {...register('name')} className={commonInputClasses} />
            {errors.name && <p className={errorTextClasses}>{errors.name.message}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição</label>
            <textarea id="description" {...register('description')} rows={3} className={commonInputClasses} />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">Preço (R$)</label>
              <input 
                type="number" 
                step="0.01" 
                id="price" 
                {...register('price')} 
                className={commonInputClasses} 
              />
              {errors.price && <p className={errorTextClasses}>{errors.price.message}</p>}
            </div>
            <div>
              <label htmlFor="size" className="block text-sm font-medium text-gray-700">Tamanho</label>
              <select id="size" {...register('size')} className={commonInputClasses}>
                <option value="P">P</option>
                <option value="M">M</option>
                <option value="G">G</option>
                <option value="GG">GG</option>
              </select>
              {errors.size && <p className={errorTextClasses}>{errors.size.message}</p>}
            </div>
          </div>

          {/* NOVO CAMPO DE UPLOAD */}
          <div className="mb-6">
            <label htmlFor="file" className="block text-sm font-medium text-gray-700">
              Imagem do Produto {isEditing ? '(Opcional para edição)' : '*'}
            </label>
            <input 
              type="file" 
              id="file" 
              {...register('file')} 
              className={`${commonInputClasses} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100`}
            />
            {/* Exibe o erro de validação (se a imagem for obrigatória na criação e estiver faltando) */}
            {errors.file && <p className={errorTextClasses}>{errors.file.message}</p>}
          </div>

          <div className="flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300" disabled={isSubmitting}>Cancelar</button>
            <button type="submit" className={`px-4 py-2 rounded-lg text-white font-semibold ${isSubmitting ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`} disabled={isSubmitting}>{isSubmitting ? 'Salvando...' : 'Salvar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
