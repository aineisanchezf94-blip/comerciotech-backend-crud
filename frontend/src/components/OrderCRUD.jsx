import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const OrderCRUD = () => {
  const [orders, setOrders] = useState([]);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    client: '',
    products: [{ product: '', quantity: 1 }],
    status: 'Pendiente',
  });

  const reloadData = async () => {
    setLoading(true);
    try {
      const [ordersRes, clientsRes, productsRes] = await Promise.all([
        api.get('/orders'),
        api.get('/clients'),
        api.get('/products'),
      ]);
      setOrders(ordersRes.data);
      setClients(clientsRes.data);
      setProducts(productsRes.data);
    } catch (error) {
      setMessage('Error al cargar los datos de la orden.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadData();
  }, []);

  const notify = (text) => {
    setMessage(text);
    window.setTimeout(() => setMessage(''), 3000);
  };

  const handleClientChange = (e) => {
    setFormData({ ...formData, client: e.target.value });
  };

  const handleStatusChange = (e) => {
    setFormData({ ...formData, status: e.target.value });
  };

  const handleProductChange = (index, field, value) => {
    const nextProducts = [...formData.products];
    nextProducts[index] = { ...nextProducts[index], [field]: field === 'quantity' ? Number(value) : value };
    setFormData({ ...formData, products: nextProducts });
  };

  const addProductLine = () => {
    setFormData({ ...formData, products: [...formData.products, { product: '', quantity: 1 }] });
  };

  const removeProductLine = (index) => {
    const nextProducts = formData.products.filter((_, i) => i !== index);
    setFormData({ ...formData, products: nextProducts.length ? nextProducts : [{ product: '', quantity: 1 }] });
  };

  const getProductPrice = (productId) => {
    const product = products.find((item) => item._id === productId);
    return product ? product.price : 0;
  };

  const computeTotal = () => {
    return formData.products.reduce((sum, item) => {
      const unit = getProductPrice(item.product);
      return sum + unit * (item.quantity || 0);
    }, 0);
  };

  const startEdit = (order) => {
    setEditId(order._id);
    setFormData({
      client: order.client?._id || order.client,
      status: order.status,
      products: order.products.map((item) => ({
        product: item.product?._id || item.product,
        quantity: item.quantity,
      })),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.client) {
      notify('Selecciona un cliente para la orden.');
      return;
    }

    if (!formData.products.every((item) => item.product && item.quantity > 0)) {
      notify('Agrega al menos un producto con cantidad válida.');
      return;
    }

    const payload = {
      client: formData.client,
      products: formData.products,
      status: formData.status,
      totalAmount: computeTotal(),
    };

    try {
      if (editId) {
        await api.put(`/orders/${editId}`, payload);
        notify('Orden actualizada correctamente.');
      } else {
        await api.post('/orders', payload);
        notify('Orden creada correctamente.');
      }
      setEditId(null);
      setFormData({ client: '', products: [{ product: '', quantity: 1 }], status: 'Pendiente' });
      reloadData();
    } catch (error) {
      notify('Error al guardar la orden.');
      console.error(error);
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm('¿Eliminar esta orden?')) return;
    try {
      await api.delete(`/orders/${id}`);
      notify('Orden eliminada.');
      reloadData();
    } catch (error) {
      notify('Error al eliminar la orden.');
      console.error(error);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const query = searchTerm.toLowerCase();
    const clientName = order.client?.name || '';
    const status = order.status || '';
    return [clientName, status].join(' ').toLowerCase().includes(query);
  });

  return (
    <div className="client-shell">
      <div className="section-header">
        <div>
          <h2>{editId ? 'Editar Orden' : 'Nueva Orden'}</h2>
          <p>Crea pedidos relacionando clientes y productos.</p>
        </div>
        <div className="client-summary">
          <strong>{orders.length}</strong>
          <span>órdenes</span>
        </div>
      </div>

      {message && <div className="message-banner">{message}</div>}

      <form className="client-form" onSubmit={handleSubmit}>
        <label>
          Cliente
          <select value={formData.client} onChange={handleClientChange} required>
            <option value="">Selecciona un cliente</option>
            {clients.map((client) => (
              <option value={client._id} key={client._id}>{client.name}</option>
            ))}
          </select>
        </label>

        <div className="order-products">
          <div className="order-products-header">
            <h3>Productos</h3>
            <button type="button" className="secondary-button" onClick={addProductLine}>
              Agregar producto
            </button>
          </div>

          {formData.products.map((item, index) => (
            <div className="order-product-row" key={`${item.product}-${index}`}>
              <select value={item.product} onChange={(e) => handleProductChange(index, 'product', e.target.value)} required>
                <option value="">Selecciona producto</option>
                {products.map((product) => (
                  <option key={product._id} value={product._id}>{product.name}</option>
                ))}
              </select>
              <input type="number" min="1" value={item.quantity} onChange={(e) => handleProductChange(index, 'quantity', e.target.value)} required />
              <button type="button" className="flat-button danger-button" onClick={() => removeProductLine(index)}>
                Eliminar
              </button>
            </div>
          ))}
        </div>

        <label>
          Estado
          <select value={formData.status} onChange={handleStatusChange}>
            <option value="Pendiente">Pendiente</option>
            <option value="Enviado">Enviado</option>
            <option value="Entregado">Entregado</option>
          </select>
        </label>

        <div className="order-total">Total calculado: ${computeTotal().toFixed(2)}</div>

        <div className="form-actions">
          {editId && (
            <button type="button" className="secondary-button" onClick={() => {
              setEditId(null);
              setFormData({ client: '', products: [{ product: '', quantity: 1 }], status: 'Pendiente' });
            }}>
              Cancelar
            </button>
          )}
          <button type="submit" className="primary-button">
            {editId ? 'Actualizar Orden' : 'Crear Orden'}
          </button>
        </div>
      </form>

      <div className="table-panel">
        <div className="table-toolbar">
          <div>
            <h3>Órdenes</h3>
            <p>Busca por cliente o estado.</p>
          </div>
          <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar órdenes..." />
        </div>

        {loading ? (
          <div className="empty-state">Cargando órdenes...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="empty-state">No hay órdenes para este filtro.</div>
        ) : (
          <table className="client-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Productos</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order.client?.name || '—'}</td>
                  <td>{order.products.map((item) => {
                    const product = products.find((prod) => prod._id === (item.product?._id || item.product));
                    return `${product?.name || 'Producto'} x${item.quantity}`;
                  }).join(', ')}</td>
                  <td>${order.totalAmount.toFixed(2)}</td>
                  <td>{order.status}</td>
                  <td className="actions-cell">
                    <button className="flat-button" type="button" onClick={() => startEdit(order)}>
                      Editar
                    </button>
                    <button className="flat-button danger-button" type="button" onClick={() => deleteOrder(order._id)}>
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

export default OrderCRUD;
