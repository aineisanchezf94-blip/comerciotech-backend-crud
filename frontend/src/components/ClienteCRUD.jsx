import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const ClienteCRUD = () => {
  const [clientes, setClientes] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const obtenerClientes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/clients');
      setClientes(res.data);
    } catch (err) {
      setMessage('No se pudieron cargar los clientes. Revisa tu backend.');
      console.error('Error al traer clientes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerClientes();
  }, []);

  const mostrarMensaje = (texto) => {
    setMessage(texto);
    window.setTimeout(() => setMessage(''), 3500);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/clients/${editId}`, formData);
        mostrarMensaje('Cliente actualizado correctamente.');
        setEditId(null);
      } else {
        await api.post('/clients', formData);
        mostrarMensaje('Cliente guardado en MongoDB.');
      }
      setFormData({ name: '', email: '', phone: '', address: '' });
      obtenerClientes();
    } catch (err) {
      const errorText = err.response?.data?.error || 'Error al guardar el cliente.';
      mostrarMensaje(errorText);
      console.error('Error al guardar cliente:', err);
    }
  };

  const iniciarEdicion = (cliente) => {
    setEditId(cliente._id);
    setFormData({
      name: cliente.name,
      email: cliente.email,
      phone: cliente.phone || '',
      address: cliente.address || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const eliminarCliente = async (id) => {
    if (!window.confirm('¿Seguro que quieres eliminar este cliente?')) {
      return;
    }

    try {
      await api.delete(`/clients/${id}`);
      mostrarMensaje('Cliente eliminado de la base de datos.');
      obtenerClientes();
    } catch (err) {
      mostrarMensaje('Error al eliminar el cliente.');
      console.error('Error al eliminar:', err);
    }
  };

  const clientesFiltrados = clientes.filter((cliente) => {
    const texto = searchTerm.toLowerCase();
    return [cliente.name, cliente.email, cliente.phone, cliente.address]
      .join(' ')
      .toLowerCase()
      .includes(texto);
  });

  return (
    <div className="client-shell">
      <div className="section-header">
        <div>
          <h2>{editId ? 'Editar Cliente' : 'Registrar Nuevo Cliente'}</h2>
          <p>Completa los datos para crear o actualizar un cliente en la colección.</p>
        </div>
        <div className="client-summary">
          <strong>{clientes.length}</strong>
          <span>clientes registrados</span>
        </div>
      </div>

      {message && <div className="message-banner">{message}</div>}

      <form className="client-form" onSubmit={handleSubmit}>
        <label>
          Nombre completo
          <input name="name" value={formData.name} onChange={handleChange} required placeholder="Ej. Diego Pérez" />
        </label>
        <label>
          Correo electrónico
          <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Ej. diego@ejemplo.com" />
        </label>
        <label>
          Teléfono
          <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Ej. 555-123-4567" />
        </label>
        <label>
          Dirección
          <input name="address" value={formData.address} onChange={handleChange} placeholder="Ej. Calle Falsa 123" />
        </label>

        <div className="form-actions">
          {editId && (
            <button type="button" className="secondary-button" onClick={() => { setEditId(null); setFormData({ name: '', email: '', phone: '', address: '' }); }}>
              Cancelar
            </button>
          )}
          <button type="submit" className="primary-button">
            {editId ? 'Actualizar Cliente' : 'Guardar Cliente'}
          </button>
        </div>
      </form>

      <div className="table-panel">
        <div className="table-toolbar">
          <div>
            <h3>Clientes</h3>
            <p>Busca clientes por nombre, correo, teléfono o dirección.</p>
          </div>
          <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar clientes..." />
        </div>

        {loading ? (
          <div className="empty-state">Cargando clientes...</div>
        ) : clientesFiltrados.length === 0 ? (
          <div className="empty-state">No se encuentran clientes con ese filtro.</div>
        ) : (
          <table className="client-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Dirección</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientesFiltrados.map((cliente) => (
                <tr key={cliente._id}>
                  <td>{cliente.name}</td>
                  <td>{cliente.email}</td>
                  <td>{cliente.phone || '—'}</td>
                  <td>{cliente.address || '—'}</td>
                  <td className="actions-cell">
                    <button className="flat-button" onClick={() => iniciarEdicion(cliente)} type="button">Editar</button>
                    <button className="flat-button danger-button" onClick={() => eliminarCliente(cliente._id)} type="button">Eliminar</button>
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

export default ClienteCRUD;
