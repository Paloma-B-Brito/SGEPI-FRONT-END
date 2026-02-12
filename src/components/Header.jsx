import React, { useState, useEffect } from 'react';

function Header({ paginaAtual, setPagina, onLogout }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const [larguraTela, setLarguraTela] = useState(window.innerWidth);

  // Monitora o tamanho da tela em tempo real
  useEffect(() => {
    const handleResize = () => setLarguraTela(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="bg-slate-900 text-white shadow-xl sticky top-0 z-50">
      
      {/* --- ÁREA DE DIAGNÓSTICO (Remova depois) --- */}
      <div className="bg-yellow-400 text-black text-xs p-2 text-center font-bold">
        LARGURA DETECTADA: {larguraTela}px
        <br/>
        (Se for maior que 768px no celular, a tag viewport está falhando)
      </div>
      {/* ------------------------------------------- */}

      <div className="flex flex-col px-6 py-3">
        <div className="flex justify-between items-center w-full">
          
          {/* LOGO */}
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold">SGEPI</h1>
          </div>

          {/* BOTÃO DE TESTE - SEM REGRAS DE ESCONDER */}
          <button 
            onClick={() => setMenuAberto(!menuAberto)}
            style={{ display: 'block' }} // Força bruta para aparecer
            className="p-3 bg-red-600 text-white font-bold border-2 border-white rounded"
          >
            MENU {menuAberto ? 'ABERTO' : 'FECHADO'}
          </button>

        </div>

        {/* MENU */}
        {menuAberto && (
          <div className="bg-gray-800 p-4 mt-2 rounded border border-gray-600">
            <p className="text-center text-gray-300">Menu de Teste Aberto</p>
            <button onClick={onLogout} className="mt-4 w-full bg-red-500 py-2 rounded">Sair</button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;