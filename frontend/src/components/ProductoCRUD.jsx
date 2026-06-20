import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const ProductoCRUD = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', stock: '' });
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const reloadProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      setMessage('No se pudieron cargar los productos.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadProducts();
  }, []);

  const notify = (text) => {
    setMessage(text);
    window.setTimeout(() => setMessage(''), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: Number(formData.price) || 0,
      stock: Number(formData.stock) || 0,
    };

    try {
      if (editId) {
        await api.put(`/products/${editId}`, payload);
        notify('Producto actualizado correctamente.');
        setEditId(null);
      } else {
        await api.post('/products', payload);
        notify('Producto creado correctamente.');
      }
      setFormData({ name: '', description: '', price: '', stock: '' });
      reloadProducts();
    } catch (error) {
      notify('Error al guardar el producto.');
      console.error(error);
    }
  };

  const startEdit = (product) => {
    setEditId(product._id);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price?.toString() || '',
      stock: product.stock?.toString() || '',
    });
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return;

    try {
      await api.delete(`/products/${id}`);
      notify('Producto eliminado.');
      reloadProducts();
    } catch (error) {
      notify('Error al eliminar el producto.');
      console.error(error);
    }
  };

  const filteredProducts = products.filter((product) => {
    const terms = searchTerm.toLowerCase();
    return [product.name, product.description].join(' ').toLowerCase().includes(terms);
  });

  return (
    <div className="client-shell">
      <div className="section-header">
        <div>
          <h2>{editId ? 'Editar Producto' : 'Nuevo Producto'}</h2>
          <p>Registra el nombre, precio y stock de tus artículos.</p>
        </div>
        <div className="client-summary">
          <strong>{products.length}</strong>
          <span>productos</span>
        </div>
      </div>

      {message && <div className="message-banner">{message}</div>}

      <form className="client-form" onSubmit={handleSubmit}>
        <label>
          Nombre
          <input name="name" value={formData.name} onChange={handleChange} required placeholder="Ej. Auriculares Bluetooth" />
        </label>
        <label>
          Descripción
          <input name="description" value={formData.description} onChange={handleChange} placeholder="Ej. Negro con cancelación de ruido" />
        </label>
        <label>
          Precio
          <input name="price" value={formData.price} onChange={handleChange} required type="number" step="0.01" placeholder="Ej. 79.90" />
        </label>
        <label>
          Stock
          <input name="stock" value={formData.stock} onChange={handleChange} required type="number" placeholder="Ej. 35" />
        </label>

        <div className="form-actions">
          {editId && (
            <button type="button" className="secondary-button" onClick={() => {
              setEditId(null);
              setFormData({ name: '', description: '', price: '', stock: '' });
            }}>
              Cancelar
            </button>
          )}
          <button type="submit" className="primary-button">
            {editId ? 'Actualizar Producto' : 'Agregar Producto'}
          </button>
        </div>
      </form>

      <div className="table-panel">
        <div className="table-toolbar">
          <div>
            <h3>Productos</h3>
            <p>Filtra por nombre o descripción.</p>
          </div>
          <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar productos..." />
        </div>

        {loading ? (
          <div className="empty-state">Cargando productos...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state">No se encontraron productos.</div>
        ) : (
          <table className="client-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>{product.description || '—'}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>{product.stock}</td>
                  <td className="actions-cell">
                    <button className="flat-button" type="button" onClick={() => startEdit(product)}>
                      Editar
                    </button>
                    <button className="flat-button danger-button" type="button" onClick={() => deleteProduct(product._id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ProductoCRUD;
