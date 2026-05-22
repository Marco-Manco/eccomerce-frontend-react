import { useState, useRef, useEffect } from 'react';
import { X, Upload, Trash2, Plus } from 'lucide-react';
import type { Variante } from '../../../shared/types/models';
import {
  useUpdateProductMutation,
  useUpdateVariantMutation,
  useAddVariantMutation,
  useUploadImageMutation,
  useDeleteImageMutation,
  useGetProductDetailQuery,
} from '../adminApi';
import { useGetCategoriesQuery, flattenCategories } from '../categoriesApi';

interface Props {
  productoId: number;
  onClose: () => void;
  onSaved: () => void;
}

export default function EditProductForm({ productoId, onClose, onSaved }: Props) {
  const { data: producto, isLoading } = useGetProductDetailQuery(productoId);

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoriaId, setCategoriaId] = useState(1);
  const [activo, setActivo] = useState(true);

  const [variantes, setVariantes] = useState<(Variante & { _changed: boolean })[]>([]);
  const [newSku, setNewSku] = useState('');
  const [newColor, setNewColor] = useState('');
  const [newTalle, setNewTalle] = useState('');
  const [newPrecio, setNewPrecio] = useState('');
  const [newStock, setNewStock] = useState('');

  // Images: track pending operations
  const [imagesToUpload, setImagesToUpload] = useState<File[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<Set<number>>(new Set());
  const [saving, setSaving] = useState(false);

  const [updateProduct] = useUpdateProductMutation();
  const [updateVariant] = useUpdateVariantMutation();
  const [addVariant] = useAddVariantMutation();
  const [uploadImage] = useUploadImageMutation();
  const [deleteImage] = useDeleteImageMutation();

  const { data: categorias } = useGetCategoriesQuery();
  const cats = categorias ? flattenCategories(categorias) : [];

  const initialized = useRef(false);
  useEffect(() => {
    if (producto && !initialized.current) {
      setNombre(producto.nombre);
      setDescripcion(producto.descripcion || '');
      setActivo(producto.activo);
      setVariantes(producto.variantes.map((v) => ({ ...v, _changed: false })));
      initialized.current = true;
    }
  }, [producto]);

  if (isLoading) return <p className="text-center py-10 text-gray-400">Cargando producto...</p>;
  if (!producto) return <p className="text-center py-10 text-red-500">Producto no encontrado</p>;

  const handleSaveVariant = async (v: Variante & { _changed: boolean }) => {
    if (!v._changed) return;
    await updateVariant({ id: v.id, precio: v.precio, stock: v.stockDisponible, color: v.color || undefined, talle: v.talle || undefined }).unwrap();
    setVariantes((prev) => prev.map((x) => (x.id === v.id ? { ...x, _changed: false } : x)));
  };

  const handleAddVariant = async () => {
    if (!newSku || !newPrecio) return;
    await addVariant({ productoId: producto.id, sku: newSku, color: newColor || undefined, talle: newTalle || undefined, precio: Number(newPrecio), stock: Number(newStock) || 0 }).unwrap();
    setNewSku(''); setNewColor(''); setNewTalle(''); setNewPrecio(''); setNewStock('');
    onSaved();
  };

  const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImagesToUpload((prev) => [...prev, file]);
  };

  const currentImages = producto.imagenes.filter((img) => !imagesToDelete.has(img.id));
  const totalAfter = currentImages.length + imagesToUpload.length;
  const previews = imagesToUpload.map((f) => URL.createObjectURL(f));

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      await updateProduct({ id: producto.id, nombre, descripcion, categoriaId, activo }).unwrap();

      for (const imgId of imagesToDelete) {
        await deleteImage(imgId).unwrap();
      }

      for (const file of imagesToUpload) {
        await uploadImage({ productoId: producto.id, file }).unwrap();
      }

      setImagesToUpload([]);
      setImagesToDelete(new Set());
      onSaved();
    } finally {
      setSaving(false);
    }
  };

  const changeVariant = (id: number, field: string, value: string | number) => {
    setVariantes((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: value, _changed: true } : v))
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 space-y-6">
      <div className="flex justify-between items-center border-b pb-3">
        <h2 className="text-xl font-bold">Editar: {producto.nombre}</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={22} /></button>
      </div>

      {/* INFO DEL PRODUCTO */}
      <section>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Información del producto</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm text-gray-700 font-medium">Nombre</span>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}
              className="mt-1 w-full border rounded px-3 py-2" />
          </label>
          <label className="block">
            <span className="text-sm text-gray-700 font-medium">Categoría</span>
            <select value={categoriaId} onChange={(e) => setCategoriaId(Number(e.target.value))}
              className="mt-1 w-full border rounded px-3 py-2 bg-white">
              {cats.map((c) => (
                <option key={c.id} value={c.id}>
                  {'\u00A0\u00A0'.repeat(c.nivel)}{c.nivel > 0 ? '↳ ' : ''}{c.nombre}
                </option>
              ))}
            </select>
          </label>
          <label className="block md:col-span-2">
            <span className="text-sm text-gray-700 font-medium">Descripción</span>
            <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={3}
              className="mt-1 w-full border rounded px-3 py-2" />
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={activo} onChange={(e) => setActivo(e.target.checked)} />
            <span className="text-sm text-gray-700 font-medium">Producto activo (visible en catálogo)</span>
          </label>
        </div>
      </section>

      <hr />

      {/* VARIANTES */}
      <section>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Variantes</h3>
        <div className="space-y-3">
          {variantes.map((v) => (
            <div key={v.id} className={`grid grid-cols-2 md:grid-cols-6 gap-2 items-end p-3 border rounded-lg ${v._changed ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'}`}>
              <label className="col-span-2 md:col-span-1">
                <span className="text-xs text-gray-400">SKU</span>
                <input type="text" value={v.sku} disabled className="mt-1 w-full border rounded px-2 py-1 bg-gray-50 text-sm text-gray-500" />
              </label>
              <label><span className="text-xs text-gray-400">Color</span>
                <input type="text" value={v.color || ''} onChange={(e) => changeVariant(v.id, 'color', e.target.value)} className="mt-1 w-full border rounded px-2 py-1 text-sm" />
              </label>
              <label><span className="text-xs text-gray-400">Talle</span>
                <input type="text" value={v.talle || ''} onChange={(e) => changeVariant(v.id, 'talle', e.target.value)} className="mt-1 w-full border rounded px-2 py-1 text-sm" />
              </label>
              <label><span className="text-xs text-gray-400">Precio $</span>
                <input type="number" min={0} value={v.precio} onChange={(e) => changeVariant(v.id, 'precio', Number(e.target.value))} className="mt-1 w-full border rounded px-2 py-1 text-sm" />
              </label>
              <label><span className="text-xs text-gray-400">Stock</span>
                <input type="number" min={0} value={v.stockDisponible} onChange={(e) => changeVariant(v.id, 'stockDisponible', Number(e.target.value))} className="mt-1 w-full border rounded px-2 py-1 text-sm" />
              </label>
              <button onClick={() => handleSaveVariant(v)} disabled={!v._changed}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-30 disabled:cursor-not-allowed">
                Guardar
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-6 gap-2 items-end p-3 border-2 border-dashed border-purple-300 rounded-lg">
          <input placeholder="SKU *" value={newSku} onChange={(e) => setNewSku(e.target.value)} className="border rounded px-2 py-1 text-sm" />
          <input placeholder="Color" value={newColor} onChange={(e) => setNewColor(e.target.value)} className="border rounded px-2 py-1 text-sm" />
          <input placeholder="Talle" value={newTalle} onChange={(e) => setNewTalle(e.target.value)} className="border rounded px-2 py-1 text-sm" />
          <input placeholder="Precio *" type="number" min={0} value={newPrecio} onChange={(e) => setNewPrecio(e.target.value)} className="border rounded px-2 py-1 text-sm" />
          <input placeholder="Stock" type="number" min={0} value={newStock} onChange={(e) => setNewStock(e.target.value)} className="border rounded px-2 py-1 text-sm" />
          <button onClick={handleAddVariant}
            className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 flex items-center justify-center gap-1">
            <Plus size={14} /> Agregar
          </button>
        </div>
      </section>

      <hr />

      {/* IMÁGENES */}
      <section>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Imágenes ({totalAfter}/3)
          {imagesToUpload.length > 0 && <span className="text-yellow-600 ml-2">+{imagesToUpload.length} pendientes</span>}
          {imagesToDelete.size > 0 && <span className="text-red-600 ml-2">-{imagesToDelete.size} a eliminar</span>}
        </h3>
        <div className="flex flex-wrap gap-4 mb-4">
          {currentImages.map((img) => (
            <div key={img.id} className="relative w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
              <img src={img.url} alt="" className="w-full h-full object-cover" />
              <button onClick={() => setImagesToDelete((prev) => new Set([...prev, img.id]))}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {previews.map((url, i) => (
            <div key={`new-${i}`} className="relative w-32 h-32 bg-gray-100 rounded-lg overflow-hidden border-2 border-yellow-400">
              <img src={url} alt="" className="w-full h-full object-cover opacity-60" />
              <span className="absolute inset-0 flex items-center justify-center text-xs text-yellow-700 font-bold bg-yellow-50/70">Pendiente</span>
            </div>
          ))}
          {totalAfter < 3 && (
            <label className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 transition">
              <Upload size={20} className="text-gray-400" />
              <span className="text-xs text-gray-400 mt-1">Subir</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleSelectImage} />
            </label>
          )}
        </div>
      </section>

      {/* Footer */}
      <div className="flex justify-end gap-3 pt-3 border-t">
        <button onClick={onClose} className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50">Cerrar</button>
        <button onClick={handleSaveAll} disabled={saving}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50">
          {saving ? 'Guardando...' : 'Guardar todo'}
        </button>
      </div>
    </div>
  );
}
