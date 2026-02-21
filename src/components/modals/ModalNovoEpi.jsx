import { useState } from "react";

const categoriasDisponiveis = [
  { id: 1, nome: "Proteção da Cabeça (Capacetes/Toucas)" },
  { id: 2, nome: "Proteção Auditiva (Protetores/Abafadores)" },
  { id: 3, nome: "Proteção Respiratória (Máscaras/Filtros)" },
  { id: 4, nome: "Proteção Visual (Óculos/Viseiras)" },
  { id: 5, nome: "Proteção de Mãos (Luvas)" },
  { id: 6, nome: "Proteção de Pés (Botinas/Sapatos)" },
  { id: 7, nome: "Proteção contra Quedas (Cintos)" },
];

const statusDisponiveis = [
  { id: 1, nome: "Ativo / Em Estoque" },
  { id: 2, nome: "Estoque Baixo" },
  { id: 3, nome: "Esgotado" },
];

function ModalNovoEpi({ onClose, onSalvar }) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [lote, setLote] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [validade, setValidade] = useState("");
  const [dataChegada, setDataChegada] = useState("");
  const [categoria, setCategoria] = useState("");
  const [status, setStatus] = useState("1"); 

  function salvarEpi() {
    if (!nome || !quantidade || !categoria || !preco) {
      alert("Por favor, preencha os campos obrigatórios (*).");
      return;
    }
    const novoProduto = {
      nome: nome,
      descricao: descricao,
      preco: parseFloat(preco),
      lote: lote,
      quantidade: parseInt(quantidade),
      validade: validade,
      status: parseInt(status),
      categoria: parseInt(categoria),
      dataChegada: dataChegada,
    };

    console.log("Pacote pronto para o Go:", novoProduto);
    if(onSalvar) {
        onSalvar(novoProduto);
    }
    
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <span className="bg-slate-200 p-2 rounded-lg text-slate-700">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </span>
            <h2 className="text-xl font-bold text-slate-800">
              Cadastrar Novo Produto (EPI)
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 font-bold text-xl transition">✕</button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
            <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Identificação</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto <span className="text-red-500">*</span></label>
                        <input
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                            placeholder="Ex: Bota de Segurança de Couro"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />
                    </div>
                    
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição (Tamanho, Fabricante, CA)</label>
                        <textarea
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                            rows="2"
                            placeholder="Ex: Tamanho 42 | Fabricante: Bracol | CA: 15432"
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Categoria <span className="text-red-500">*</span></label>
                        <select
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
                            value={categoria}
                            onChange={(e) => setCategoria(e.target.value)}
                        >
                            <option value="">Selecione...</option>
                            {categoriasDisponiveis.map((c) => (
                                <option key={c.id} value={c.id}>{c.nome}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            {statusDisponiveis.map((s) => (
                                <option key={s.id} value={s.id}>{s.nome}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Controle e Valores</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Lote</label>
                        <input
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                            placeholder="Ex: LOTE-2026A"
                            value={lote}
                            onChange={(e) => setLote(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade <span className="text-red-500">*</span></label>
                        <input
                            type="number"
                            min="0"
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                            placeholder="0"
                            value={quantidade}
                            onChange={(e) => setQuantidade(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Preço Unit. (R$) <span className="text-red-500">*</span></label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                            placeholder="0.00"
                            value={preco}
                            onChange={(e) => setPreco(e.target.value)}
                        />
                    </div>

                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Data de Chegada</label>
                        <input
                            type="date"
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                            value={dataChegada}
                            onChange={(e) => setDataChegada(e.target.value)}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Validade do Produto / CA</label>
                        <input
                            type="date"
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                            value={validade}
                            onChange={(e) => setValidade(e.target.value)}
                        />
                    </div>
                </div>
            </div>

        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition"
          >
            Cancelar
          </button>
          <button
            onClick={salvarEpi}
            className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md transition flex items-center gap-2"
          >
            <span>💾</span> Salvar Produto
          </button>
        </div>

      </div>
    </div>
  );
}

export default ModalNovoEpi;