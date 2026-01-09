import { useState } from "react";

import ModalNovoEpi from "../components/modals/ModalNovoEpi";
import ModalEntrada from "../components/modals/ModalEntrada";
import ModalEntrega from "../components/modals/ModalEntrega";
import ModalBaixa from "../components/modals/ModalBaixa";
import ModalBusca from "../components/modals/ModalBusca";

function Dashboard() {
  const [modalAberto, setModalAberto] = useState(null);

  // Função para fechar qualquer modal
  const fecharModal = () => setModalAberto(null);

  return (
    <div className="animate-fade-in pb-20 md:pb-0"> {/* Padding bottom no mobile para não colar no fim */}
      
      {/* 1. ÁREA DE BOAS-VINDAS */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 mb-6 md:mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
            Olá, <span className="text-blue-600">Gestor</span> 👋
          </h2>
          <p className="text-sm md:text-base text-gray-500 mt-1">
            Aqui está o resumo do seu estoque hoje.
          </p>
        </div>
        
        {/* Status só aparece em telas médias pra cima (Tablet/PC) */}
        <div className="hidden md:block text-right">
            <p className="text-xs font-bold text-gray-400 uppercase">Status do Sistema</p>
            <div className="flex items-center gap-2 justify-end">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-sm font-semibold text-gray-700">Operacional</span>
            </div>
        </div>
      </div>

      {/* 2. CARDS DE RESUMO (KPIs) */}
      {/* Mobile: 2 colunas (grid-cols-2) | PC: 4 colunas (md:grid-cols-4) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-10">
        
        {/* Card 1 */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h3 className="text-gray-500 text-[10px] md:text-sm font-bold uppercase truncate">Total de Itens</h3>
            <span className="p-1.5 md:p-2 bg-blue-50 text-blue-600 rounded-lg text-xs md:text-base">📦</span>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-gray-800">1.240</p>
          <p className="text-[10px] md:text-xs text-green-600 mt-1 md:mt-2 font-medium">⬆ +12% mês</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h3 className="text-gray-500 text-[10px] md:text-sm font-bold uppercase truncate">Entregas Hoje</h3>
            <span className="p-1.5 md:p-2 bg-purple-50 text-purple-600 rounded-lg text-xs md:text-base">🚀</span>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-gray-800">18</p>
          <p className="text-[10px] md:text-xs text-gray-400 mt-1 md:mt-2">Atendimentos</p>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h3 className="text-gray-500 text-[10px] md:text-sm font-bold uppercase truncate">Alertas</h3>
            <span className="p-1.5 md:p-2 bg-orange-50 text-orange-600 rounded-lg text-xs md:text-base">⚠️</span>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-gray-800">5</p>
          <p className="text-[10px] md:text-xs text-orange-600 mt-1 md:mt-2 font-bold">Estoque baixo</p>
        </div>

         {/* Card 4 */}
         <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h3 className="text-gray-500 text-[10px] md:text-sm font-bold uppercase truncate">Valor Total</h3>
            <span className="p-1.5 md:p-2 bg-green-50 text-green-600 rounded-lg text-xs md:text-base">💲</span>
          </div>
          <p className="text-xl md:text-3xl font-bold text-gray-800">R$ 45k</p>
          <p className="text-[10px] md:text-xs text-gray-400 mt-1 md:mt-2">Estimado</p>
        </div>

      </div>

      {/* 3. AÇÕES RÁPIDAS */}
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        ⚡ Ações Rápidas
      </h3>

      {/* Grid responsivo: 1 coluna no mobile, 2 no tablet, 3 no PC */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Botão 1: Cadastrar */}
        <button
          onClick={() => setModalAberto("novo-epi")}
          className="group flex items-center justify-between p-4 md:p-5 bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex flex-col items-start text-left">
            <span className="font-bold text-base md:text-lg">Cadastrar Novo EPI</span>
            <span className="text-xs text-slate-300 group-hover:text-white transition">Adicionar item ao catálogo</span>
          </div>
          <div className="bg-white/10 p-2 md:p-3 rounded-lg group-hover:bg-white/20 transition">
             <span className="text-xl md:text-2xl">📝</span>
          </div>
        </button>

        {/* Botão 2: Entrada */}
        <button
          onClick={() => setModalAberto("entrada")}
          className="group flex items-center justify-between p-4 md:p-5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
           <div className="flex flex-col items-start text-left">
            <span className="font-bold text-base md:text-lg">Registrar Entrada</span>
            <span className="text-xs text-emerald-100 group-hover:text-white transition">Repor estoque / Compras</span>
          </div>
          <div className="bg-white/10 p-2 md:p-3 rounded-lg group-hover:bg-white/20 transition">
             <span className="text-xl md:text-2xl">➕</span>
          </div>
        </button>

        {/* Botão 3: Entrega */}
        <button
          onClick={() => setModalAberto("entrega")}
          className="group flex items-center justify-between p-4 md:p-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
           <div className="flex flex-col items-start text-left">
            <span className="font-bold text-base md:text-lg">Realizar Entrega</span>
            <span className="text-xs text-blue-100 group-hover:text-white transition">Entregar para funcionário</span>
          </div>
          <div className="bg-white/10 p-2 md:p-3 rounded-lg group-hover:bg-white/20 transition">
             <span className="text-xl md:text-2xl">👷</span>
          </div>
        </button>

        {/* Botão 4: Baixa */}
        <button
          onClick={() => setModalAberto("baixa")}
          className="group flex items-center justify-between p-4 md:p-5 bg-gradient-to-r from-rose-600 to-rose-700 text-white rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
           <div className="flex flex-col items-start text-left">
            <span className="font-bold text-base md:text-lg">Baixa / Perda</span>
            <span className="text-xs text-rose-100 group-hover:text-white transition">Registrar dano ou descarte</span>
          </div>
          <div className="bg-white/10 p-2 md:p-3 rounded-lg group-hover:bg-white/20 transition">
             <span className="text-xl md:text-2xl">📉</span>
          </div>
        </button>

        {/* Botão 5: Buscar (Adapta-se para ocupar 2 colunas no tablet/PC, mas 1 no mobile) */}
        <button
          onClick={() => setModalAberto("busca")}
          className="sm:col-span-2 lg:col-span-2 group flex items-center justify-center gap-3 p-4 md:p-5 bg-white border-2 border-dashed border-gray-300 text-gray-600 rounded-xl hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
        >
          <span className="text-xl md:text-2xl">🔍</span>
          <div className="flex flex-col items-start text-left">
            <span className="font-bold text-base md:text-lg">Consultar Estoque Rápido</span>
            <span className="text-xs text-gray-400 group-hover:text-blue-400 transition">Pesquisar por CA, Nome ou Fabricante</span>
          </div>
        </button>

      </div>

      {/* MODAIS */}
      {modalAberto === "novo-epi" && <ModalNovoEpi onClose={fecharModal} />}
      {modalAberto === "entrada" && <ModalEntrada onClose={fecharModal} />}
      {modalAberto === "entrega" && <ModalEntrega onClose={fecharModal} />}
      {modalAberto === "baixa" && <ModalBaixa onClose={fecharModal} />}
      {modalAberto === "busca" && <ModalBusca onClose={fecharModal} />}

    </div>
  );
}

export default Dashboard;