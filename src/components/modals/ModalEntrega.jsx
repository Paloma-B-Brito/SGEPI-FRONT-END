import { useState } from "react";

// MOCK DATA 
const mockFuncionarios = [
  { id: 1, nome: "João Silva", cargo: "Operador", matricula: "483920" },
  { id: 2, nome: "Maria Santos", cargo: "Técnica", matricula: "739104" },
  { id: 3, nome: "Carlos Oliveira", cargo: "Supervisor", matricula: "102938" },
  { id: 4, nome: "Ana Pereira", cargo: "Engenheira", matricula: "564738" },
  { id: 5, nome: "Roberto Costa", cargo: "Auxiliar", matricula: "998877" },
];

const mockEpis = [
  { id: 1, nome: "Capacete de Segurança", tamanhos: ["P", "M", "G"] },
  { id: 2, nome: "Luva de Raspa", tamanhos: ["P", "M", "G", "GG"] },
  { id: 3, nome: "Sapato de Segurança", tamanhos: ["38", "40", "42", "44"] },
  { id: 4, nome: "Óculos de Proteção", tamanhos: ["Único"] },
  { id: 5, nome: "Protetor Auricular", tamanhos: ["Único"] },
];

function ModalEntrega({ onClose }) {
  // DADOS GERAIS DA ENTREGA
  const [funcionario, setFuncionario] = useState("");
  const [buscaFuncionario, setBuscaFuncionario] = useState(""); 
  const [dataEntrega, setDataEntrega] = useState(new Date().toISOString().split('T')[0]);
  
  // LISTA DE ITENS A ENTREGAR
  const [itensParaEntregar, setItensParaEntregar] = useState([]);

  // CAMPOS TEMPORÁRIOS
  const [epiTemp, setEpiTemp] = useState("");
  const [tamanhoTemp, setTamanhoTemp] = useState("");
  const [qtdTemp, setQtdTemp] = useState(1);

  const epiSelecionadoObj = mockEpis.find((e) => e.id === Number(epiTemp));

  // Lógica de Filtro
  const funcionariosFiltrados = mockFuncionarios.filter((f) => 
    f.nome.toLowerCase().includes(buscaFuncionario.toLowerCase()) ||
    f.matricula.includes(buscaFuncionario)
  );

  function adicionarItem() {
    if (!epiTemp || !qtdTemp) return;

    if (epiSelecionadoObj?.tamanhos.length > 0 && !tamanhoTemp) {
        alert("Selecione o tamanho.");
        return;
    }

    const novoItem = {
      id: Date.now(),
      epiNome: epiSelecionadoObj.nome,
      tamanho: tamanhoTemp || "Único",
      quantidade: Number(qtdTemp)
    };

    setItensParaEntregar([...itensParaEntregar, novoItem]);
    setEpiTemp("");
    setTamanhoTemp("");
    setQtdTemp(1);
  }

  function removerItem(id) {
    setItensParaEntregar(itensParaEntregar.filter(i => i.id !== id));
  }

  function salvarEntrega() {
    if (!funcionario || itensParaEntregar.length === 0) {
      alert("Selecione o funcionário e adicione pelo menos um EPI.");
      return;
    }

    const funcSelecionado = mockFuncionarios.find(f => f.id === Number(funcionario));

    const entregaFinal = {
      id_funcionario: Number(funcionario),
      nome_funcionario: funcSelecionado?.nome,
      matricula: funcSelecionado?.matricula,
      data: dataEntrega,
      itens: itensParaEntregar,
      assinatura: "Assinatura Digital Capturada"
    };

    console.log("Entrega Realizada:", entregaFinal);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
        
        {/* CABEÇALHO */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="bg-blue-100 p-2 rounded-lg text-blue-700">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
            </span>
            <h2 className="text-xl font-bold text-slate-800">
              Nova Entrega
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">✕</button>
        </div>

        {/* CORPO DO FORMULÁRIO */}
        <div className="p-6 overflow-y-auto space-y-6">

            {/* SEÇÃO 1: QUEM E QUANDO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* COLUNA DO FUNCIONÁRIO */}
                <div className="flex flex-col gap-2">
                    <label className="block text-sm font-medium text-slate-700">Buscar Colaborador</label>
                    
                    {/* Campo de Busca */}
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                           🔍
                        </span>
                        <input 
                            type="text"
                            placeholder="Digite nome ou matrícula..."
                            className="w-full pl-9 p-2 border border-slate-300 rounded-t-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm bg-slate-50 transition"
                            value={buscaFuncionario}
                            onChange={(e) => setBuscaFuncionario(e.target.value)}
                        />
                    </div>

                    {/* LISTA CUSTOMIZADA  */}
                    <div className="w-full border border-slate-300 rounded-b-lg -mt-3 bg-white max-h-32 overflow-y-auto border-t-0">
                        {funcionariosFiltrados.length === 0 ? (
                             <div className="p-3 text-sm text-gray-400 text-center italic">
                                Nenhum funcionário encontrado
                             </div>
                        ) : (
                            funcionariosFiltrados.map((f) => {
                                const isSelected = Number(funcionario) === f.id;
                                return (
                                    <div 
                                        key={f.id} 
                                        onClick={() => setFuncionario(f.id)}
                                        className={`
                                            p-2 text-sm cursor-pointer border-b border-gray-50 last:border-0 transition-colors
                                            ${isSelected 
                                                ? "bg-blue-100 text-blue-800 font-medium" // Estilo do Selecionado
                                                : "text-slate-600 hover:bg-blue-50" // Estilo Normal + Hover
                                            }
                                        `}
                                    >
                                        <span className="font-mono text-xs text-slate-400 mr-2">[{f.matricula}]</span>
                                        {f.nome} <span className="text-xs text-slate-400">- {f.cargo}</span>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {funcionario && (
                        <p className="text-xs text-blue-700 font-bold text-right flex items-center justify-end gap-1">
                           <span className="bg-blue-100 text-blue-700 rounded-full w-4 h-4 flex items-center justify-center text-[10px]">✓</span> 
                           Colaborador selecionado
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Data da Entrega</label>
                    <input
                        type="date"
                        className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-slate-700"
                        value={dataEntrega}
                        onChange={(e) => setDataEntrega(e.target.value)}
                    />
                </div>
            </div>

            <hr className="border-slate-100" />

            {/* SEÇÃO 2: ADICIONAR ITENS */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                    🛠️ Adicionar Materiais
                </h3>
                
                <div className="flex flex-col md:flex-row gap-3 items-end">
                    <div className="flex-1 w-full">
                        <label className="text-xs text-slate-500 mb-1 block uppercase font-bold">Item / EPI</label>
                        <select
                            className="w-full p-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                            value={epiTemp}
                            onChange={(e) => {
                                setEpiTemp(e.target.value);
                                setTamanhoTemp("");
                            }}
                        >
                            <option value="">Selecione...</option>
                            {mockEpis.map((e) => (
                                <option key={e.id} value={e.id}>{e.nome}</option>
                            ))}
                        </select>
                    </div>

                    <div className="w-full md:w-24">
                        <label className="text-xs text-slate-500 mb-1 block uppercase font-bold">Tam.</label>
                        <select
                            className="w-full p-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-600 outline-none disabled:bg-slate-100"
                            value={tamanhoTemp}
                            onChange={(e) => setTamanhoTemp(e.target.value)}
                            disabled={!epiSelecionadoObj}
                        >
                            <option value="">-</option>
                            {epiSelecionadoObj?.tamanhos.map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>

                    <div className="w-full md:w-20">
                        <label className="text-xs text-slate-500 mb-1 block uppercase font-bold">Qtd.</label>
                        <input
                            type="number"
                            min="1"
                            className="w-full p-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                            value={qtdTemp}
                            onChange={(e) => setQtdTemp(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={adicionarItem}
                        className="w-full md:w-auto px-4 py-2 bg-blue-700 text-white font-bold rounded hover:bg-blue-800 transition shadow-sm text-sm border border-blue-800"
                    >
                        + Adicionar
                    </button>
                </div>
            </div>

            {/* LISTA DE ITENS */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    Resumo da Entrega ({itensParaEntregar.length})
                </label>
                
                {itensParaEntregar.length > 0 ? (
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-600 font-semibold">
                                <tr>
                                    <th className="p-3 pl-4">Item</th>
                                    <th className="p-3 text-center">Tam.</th>
                                    <th className="p-3 text-center">Qtd.</th>
                                    <th className="p-3 text-right pr-4">Ação</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {itensParaEntregar.map((item) => (
                                    <tr key={item.id}>
                                        <td className="p-3 pl-4 text-slate-700">{item.epiNome}</td>
                                        <td className="p-3 text-center text-slate-500">{item.tamanho}</td>
                                        <td className="p-3 text-center font-bold text-slate-800">{item.quantidade}</td>
                                        <td className="p-3 text-right pr-4">
                                            <button 
                                                onClick={() => removerItem(item.id)}
                                                className="text-red-500 hover:text-red-700 font-bold text-xs bg-red-50 px-2 py-1 rounded hover:bg-red-100 transition"
                                            >
                                                Remover
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-6 bg-slate-50 border border-dashed border-slate-300 rounded-lg text-slate-400 text-sm">
                        Nenhum item adicionado à lista.
                    </div>
                )}
            </div>

            {/* ÁREA DE ASSINATURA */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                    Assinatura do Colaborador
                </label>
                <div className="border-2 border-dashed border-slate-300 h-24 rounded-lg bg-slate-50 flex flex-col items-center justify-center text-slate-400 hover:bg-white hover:border-blue-400 transition cursor-pointer group">
                    <svg className="w-8 h-8 mb-1 group-hover:text-blue-500 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <span className="text-xs group-hover:text-blue-600 transition">Clique para assinar digitalmente</span>
                </div>
            </div>

        </div>

        {/* RODAPÉ */}
        <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition"
          >
            Cancelar
          </button>
          <button
            onClick={salvarEntrega}
            className="px-6 py-2 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-800 shadow-md transition flex items-center gap-2"
          >
            <span>💾</span> Confirmar Entrega
          </button>
        </div>

      </div>
    </div>
  );
}

export default ModalEntrega;