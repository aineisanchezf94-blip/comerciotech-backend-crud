import React, { useState, useEffect } from 'react';
import ClienteCRUD from './components/ClienteCRUD';
import ProductoCRUD from './components/ProductoCRUD';
import OrderCRUD from './components/OrderCRUD';
import api from './api/axios';
import './App.css';

const formatCLP = (value) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(value);
};

function App() {
  const [vistaActual, setVistaActual] = useState('dashboard');
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargarDatosStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const [resClientes, resProductos, resOrdenes] = await Promise.all([
        api.get('/clients'),
        api.get('/products'),
        api.get('/orders')
      ]);
      setClientes(resClientes.data);
      setProductos(resProductos.data);
      setOrdenes(resOrdenes.data);
    } catch (err) {
      console.error('Error al cargar estadísticas:', err);
      setError('No se pudieron obtener datos frescos de MongoDB.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatosStats();
  }, [vistaActual]); // Recargar datos siempre que cambie la vista actual para asegurar datos frescos

  // Cálculos en tiempo real
  const totalVentas = ordenes.reduce((acc, order) => acc + (order.totalAmount || 0), 0);
  const totalClientes = clientes.length;
  const totalProductos = productos.length;
  const totalOrdenes = ordenes.length;

  const ordenesPendientes = ordenes.filter(o => o.status === 'Pendiente').length;
  const ordenesEnviadas = ordenes.filter(o => o.status === 'Enviado').length;
  const ordenesEntregadas = ordenes.filter(o => o.status === 'Entregado').length;

  const productosStockCritico = productos.filter(p => (p.stock || 0) < 5);

  // Obtener las últimas 5 órdenes recientes
  const ordenesRecientes = [...ordenes]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="app-shell">
      {/* Orbes de fondo decorativos */}
      <div className="background-orbs">
        <div className="orbe orbe-1"></div>
        <div className="orbe orbe-2"></div>
        <div className="orbe orbe-3"></div>
      </div>

      <aside className="sidebar">
        <div className="sidebar-brand">
          <span>📊</span> ComercioTech
        </div>

        <nav className="sidebar-nav">
          <button
            className={vistaActual === 'dashboard' ? 'sidebar-button active' : 'sidebar-button'}
            onClick={() => setVistaActual('dashboard')}
          >
            <span>📊</span> Dashboard
          </button>
          <button
            className={vistaActual === 'clientes' ? 'sidebar-button active' : 'sidebar-button'}
            onClick={() => setVistaActual('clientes')}
          >
            <span>👥</span> Clientes
          </button>
          <button
            className={vistaActual === 'productos' ? 'sidebar-button active' : 'sidebar-button'}
            onClick={() => setVistaActual('productos')}
          >
            <span>📦</span> Productos
          </button>
          <button
            className={vistaActual === 'ordenes' ? 'sidebar-button active' : 'sidebar-button'}
            onClick={() => setVistaActual('ordenes')}
          >
            <span>🧾</span> Órdenes
          </button>
        </nav>

        <div className="sidebar-footer">

        </div>
      </aside>

      <div className="main-content">
        <header className="page-header">
          <div>
            <h1>
              {vistaActual === 'dashboard' && 'Panel de Control Principal'}
              {vistaActual === 'clientes' && 'Gestión de Clientes'}
              {vistaActual === 'productos' && 'Gestión de Productos'}
              {vistaActual === 'ordenes' && 'Gestión de Órdenes'}
            </h1>
            <p>
              {vistaActual === 'dashboard' && 'Visualiza el rendimiento de tu negocio con estadísticas e información en tiempo real directamente de tu base de datos.'}
              {vistaActual === 'clientes' && 'Administra la información de contacto y ubicaciones de tus clientes de manera centralizada.'}
              {vistaActual === 'productos' && 'Monitorea el inventario, actualiza existencias y define los precios de venta de tus artículos.'}
              {vistaActual === 'ordenes' && 'Gestiona los pedidos de compra, asigna productos, calcula totales y despacha despachos.'}
            </p>
          </div>
          <div className="status-chip">
            <span style={{ color: '#10b981' }}>●</span> MongoDB Conectado
          </div>
        </header>

        <main className="page-body">
          {error && <div className="message-banner" style={{ marginBottom: '24px' }}>⚠️ {error}</div>}

          {vistaActual === 'dashboard' && (
            <>
              {loading && <div className="message-banner" style={{ marginBottom: '24px' }}>Cargando métricas en vivo...</div>}

              <section className="dashboard-grid">
                <article className="dashboard-card" style={{ '--card-accent': '#10b981' }}>
                  <h3>Ventas Totales</h3>
                  <div className="stat-value">{formatCLP(totalVentas)}</div>
                  <p>Facturación total por órdenes registradas.</p>
                  <div className="card-footer">
                    <span className="badge success">En vivo</span>
                    <button className="card-action-btn" onClick={() => setVistaActual('ordenes')}>
                      Ver transacciones →
                    </button>
                  </div>
                </article>

                <article className="dashboard-card" style={{ '--card-accent': '#6366f1' }}>
                  <h3>Clientes</h3>
                  <div className="stat-value">{totalClientes}</div>
                  <p>Clientes activos registrados en la base de datos.</p>
                  <div className="card-footer">
                    <span className="badge primary">Clientes</span>
                    <button className="card-action-btn" onClick={() => setVistaActual('clientes')}>
                      Gestionar clientes →
                    </button>
                  </div>
                </article>

                <article className="dashboard-card" style={{ '--card-accent': '#06b6d4' }}>
                  <h3>Productos</h3>
                  <div className="stat-value">{totalProductos}</div>
                  <p>Artículos disponibles en el catálogo activo.</p>
                  <div className="card-footer">
                    <span className="badge primary">Inventario</span>
                    <button className="card-action-btn" onClick={() => setVistaActual('productos')}>
                      Ver catálogo →
                    </button>
                  </div>
                </article>

                <article className="dashboard-card" style={{ '--card-accent': '#f59e0b' }}>
                  <h3>Órdenes</h3>
                  <div className="stat-value">{totalOrdenes}</div>
                  <p>Flujo completo de pedidos y compras.</p>
                  <div className="card-footer">
                    <span className="badge warning">Pedidos</span>
                    <button className="card-action-btn" onClick={() => setVistaActual('ordenes')}>
                      Crear orden →
                    </button>
                  </div>
                </article>
              </section>

              <div className="dashboard-row">
                <section className="recent-orders-card">
                  <div className="table-toolbar" style={{ marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                    <h3 style={{ margin: 0 }}>Últimas Órdenes</h3>
                    <button className="secondary-button" style={{ padding: '8px 16px', fontSize: '12px' }} onClick={cargarDatosStats}>
                      🔄 Recargar
                    </button>
                  </div>
                  {ordenesRecientes.length === 0 ? (
                    <div className="empty-state" style={{ padding: '30px 0' }}>No hay órdenes recientes registradas.</div>
                  ) : (
                    <table className="client-table" style={{ minWidth: 'auto' }}>
                      <thead>
                        <tr>
                          <th>Cliente</th>
                          <th>Total</th>
                          <th>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ordenesRecientes.map((order) => (
                          <tr key={order._id}>
                            <td>{order.client?.name || 'Cliente Eliminado'}</td>
                            <td>{formatCLP(order.totalAmount)}</td>
                            <td>
                              <span className={`status-badge ${order.status?.toLowerCase() || 'pendiente'}`}>
                                {order.status || 'Pendiente'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </section>

                <section className="quick-stats-card">
                  <h3 style={{ margin: '0 0 8px', fontSize: '18px', color: 'white' }}>Resumen del Negocio</h3>
                  <div className="quick-stat-item">
                    <span className="quick-stat-label">Pedidos Pendientes</span>
                    <span className="quick-stat-value">{ordenesPendientes}</span>
                  </div>
                  <div className="quick-stat-item">
                    <span className="quick-stat-label">Pedidos Enviados</span>
                    <span className="quick-stat-value">{ordenesEnviadas}</span>
                  </div>
                  <div className="quick-stat-item">
                    <span className="quick-stat-label">Pedidos Entregados</span>
                    <span className="quick-stat-value success">{ordenesEntregadas}</span>
                  </div>
                  <div className="quick-stat-item">
                    <span className="quick-stat-label">Stock Crítico (&lt; 5 unid.)</span>
                    <span className={`quick-stat-value ${productosStockCritico.length > 0 ? 'danger' : 'success'}`}>
                      {productosStockCritico.length} prod.
                    </span>
                  </div>
                </section>
              </div>
            </>
          )}

          {vistaActual === 'clientes' && (
            <section className="clients-panel">
              <ClienteCRUD />
            </section>
          )}

          {vistaActual === 'productos' && (
            <section className="clients-panel">
              <ProductoCRUD />
            </section>
          )}

          {vistaActual === 'ordenes' && (
            <section className="clients-panel">
              <OrderCRUD />
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
