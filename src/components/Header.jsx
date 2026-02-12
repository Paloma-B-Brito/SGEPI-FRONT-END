import React, { useState } from 'react';

function Header({ paginaAtual, setPagina, onLogout }) {
  const [menuAberto, setMenuAberto] = useState(false);

  function Botao({ label, icone, nomePagina, isMobile = false }) {
    const ativo = paginaAtual === nomePagina;
    return (
      <button
        onClick={() => {
          setPagina(nomePagina);
          if (isMobile) setMenuAberto(false);
        }}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all text-sm whitespace-nowrap
          ${isMobile ? "w-full" : ""} 
          ${ativo 
            ? "bg-white text-blue-900 shadow-lg scale-105" 
            : "text-blue-100 hover:bg-white/10 hover:text-white"
          }
        `}
      >
        {icone}
        <span>{label}</span>
      </button>
    );
  }

  const navItems = [
    { label: "Dashboard", nome: "Dashboard", icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
    { label: "Estoque", nome: "Estoque", icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> },
    { label: "Funcionários", nome: "Funcionários", icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg> },
    { label: "Entradas", nome: "Entradas", icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg> },
    { label: "Entregas", nome: "Entregas", icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> },
    { label: "Devoluções", nome: "Devoluções", icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg> },
  ];

  return (
    <header className="bg-gradient-to-r from-slate-900 to-blue-900 text-white shadow-xl sticky top-0 z-50">
      <div className="flex flex-col px-6 py-3">
        
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
               <svg className="w-6 h-6 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">SGEPI</h1>
              <p className="text-[10px] text-blue-300 uppercase tracking-widest font-semibold">Gestão de Estoque</p>
            </div>
          </div>

          <button 
            onClick={() => setMenuAberto(!menuAberto)}
            className="lg:hidden p-2 text-blue-100 hover:text-white focus:outline-none"
          >
            {menuAberto ? (
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          <nav className="hidden lg:flex gap-2">
            {navItems.map((item) => (
              <Botao 
                key={item.nome}
                label={item.label}
                nomePagina={item.nome}
                icone={item.icon}
              />
            ))}
          </nav>

          <button 
            onClick={onLogout} 
            className="hidden lg:flex items-center gap-2 bg-red-500/10 hover:bg-red-600 hover:text-white text-red-200 border border-red-500/30 px-4 py-2 rounded-lg font-medium transition text-sm whitespace-nowrap"
            title="Sair do Sistema"
          >
            <span>Sair</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>

        {/* Menu Mobile */}
        {menuAberto && (
          <nav className="lg:hidden mt-4 flex flex-col gap-2 pb-4 animate-fade-in-down border-t border-white/10 pt-4">
            {navItems.map((item) => (
              <Botao 
                key={item.nome}
                label={item.label}
                nomePagina={item.nome}
                icone={item.icon}
                isMobile={true}
              />
            ))}
            <hr className="border-white/10 my-1" />
            <button 
              onClick={onLogout} 
              className="flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all text-sm w-full text-red-200 hover:bg-red-600 hover:text-white"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Sair do Sistema</span>
            </button>
          </nav>
        )}

      </div>
    </header>
  );
}

export default Header;