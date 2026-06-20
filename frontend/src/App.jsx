import React, { useState } from 'react';
import ClienteCRUD from './components/ClienteCRUD';
import ProductoCRUD from './components/ProductoCRUD';
import OrderCRUD from './components/OrderCRUD';
import './App.css';

function App() {
  const [vistaActual, setVistaActual] = useState('dashboard');

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand"> ComercioTech</div>

        <nav className="sidebar-nav">
          <button className={vistaActual === 'dashboard' ? 'sidebar-button active' : 'sidebar-button'} onClick={() => setVistaActual('dashboard')}>
            📊 Dashboard
          </button>
          <button className={vistaActual === 'clientes' ? 'sidebar-button active' : 'sidebar-button'} onClick={() => setVistaActual('clientes')}>
            👥 Clientes
          </button>
          <button className={vistaActual === 'productos' ? 'sidebar-button active' : 'sidebar-button'} onClick={() => setVistaActual('productos')}>
            📦 Productos
          </button>
          <button className={vistaActual === 'ordenes' ? 'sidebar-button active' : 'sidebar-button'} onClick={() => setVistaActual('ordenes')}>
            🧾 Órdenes
          </button>
        </nav>

        <div className="sidebar-footer">Versión 1.0 · CRUD completo</div>
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
              {vistaActual === 'dashboard' && 'Revisa tus recursos y navega entre clientes, productos y pedidos.'}
              {vistaActual === 'clientes' && 'Gestiona tus clientes: crea, edita y elimina registros fácilmente.'}
              {vistaActual === 'productos' && 'Administra productos con stock y precios actualizados.'}
              {vistaActual === 'ordenes' && 'Crea y administra órdenes con clientes, productos y estado de envío.'}
            </p>
          </div>
          <div className="status-chip">🟢 Conectado a MongoDB</div>
        </header>

        <main className="page-body">
          {vistaActual === 'dashboard' && (
            <section className="dashboard-grid">
              <article className="dashboard-card">
                <h3>Clientes</h3>
                <p>Registra tus clientes y mantenlos siempre disponibles para pedidos.</p>
              </article>
              <article className="dashboard-card">
                <h3>Productos</h3>
                <p>Administra el catálogo con precios y stock para tu tienda.</p>
              </article>
              <article className="dashboard-card">
                <h3>Órdenes</h3>
                <p>Controla el flujo de ventas, consulta estados y elimina pedidos cuando sea necesario.</p>
              </article>
            </section>
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

