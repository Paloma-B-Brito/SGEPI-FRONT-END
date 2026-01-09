import { useState } from "react";

// MOCK DATA (Funcionários que podem receber a mercadoria)
const mockFuncionarios = [
  { id: 1, nome: "João Silva", cargo: "Almoxarife", matricula: "483920" },
  { id: 2, nome: "Maria Santos", cargo: "Gerente", matricula: "739104" },
  { id: 3, nome: "Carlos Oliveira", cargo: "Supervisor", matricula: "102938" },
];

const mockEpis = [
  { id: 1, nome: "Capacete de Segurança", tamanhos: ["P", "M", "G"] },
  { id: 2, nome: "Luva de Raspa", tamanhos: ["P", "M", "G", "GG"] },
  { id: 3, nome: "Sapato de Segurança", tamanhos: ["38", "40", "42", "44"] },
  { id: 4, nome: "Óculos de Proteção", tamanhos: ["Único"] },
  { id: 5, nome: "Protetor Auricular", tamanhos: ["Único"] },
];

function ModalEntrada({ onClose }) {
  // --- DADOS GERAIS DA NOTA / ENTRADA ---
  const [responsavel, setResponsavel] = useState("");
  const [buscaResponsavel, setBuscaResponsavel] = useState(""); // Busca da lista customizada
  const [fornecedor, setFornecedor] = useState("");
  const [notaFiscal, setNotaFiscal] = useState("");
  const [dataEntrada, setDataEntrada] = useState(new Date().toISOString().split('T')[0]);

  // --- LISTA DE ITENS DA NOTA ---
  const [itensEntrada, setItensEntrada] = useState([]);

  // --- CAMPOS DO ITEM ATUAL ---
  const [epiTemp, setEpiTemp] = useState("");
  const [tamanhoTemp, setTamanhoTemp] = useState("");
  const [qtdTemp, setQtdTemp] = useState(1);
  const [precoTemp, setPrecoTemp] = useState("");
  const [validadeTemp, setValidadeTemp] = useState("");

  const epiSelecionadoObj = mockEpis.find((e) => e.id === Number(epiTemp));

  // Filtro da Lista de Responsáveis
  const responsaveisFiltrados = mockFuncionarios.filter((f) => 
    f.nome.toLowerCase().includes(buscaResponsavel.toLowerCase()) ||
    f.matricula.includes(buscaResponsavel)
  );

  function adicionarItem() {
    if (!epiTemp || !qtdTemp || !precoTemp) {
        alert("Preencha o EPI, quantidade e valor unitário.");
        return;
    }

    if (epiSelecionadoObj?.tamanhos.length > 0 && !tamanhoTemp) {
        alert("Selecione o tamanho do EPI.");
        return;
    }

    const novoItem = {
      id: Date.now(),
      epiNome: epiSelecionadoObj.nome,
      tamanho: tamanhoTemp || "Único",
      quantidade: Number(qtdTemp),
      preco: Number(precoTemp),
      validade: validadeTemp || "N/A"
    };

    setItensEntrada([...itensEntrada, novoItem]);
    
    // Resetar campos do item
    setEpiTemp("");
    setTamanhoTemp("");
    setQtdTemp(1);
    setPrecoTemp("");
    setValidadeTemp("");
  }

  function removerItem(id) {
    setItensEntrada(itensEntrada.filter(i => i.id !== id));
  }

  function salvarEntrada() {
    if (!responsavel || !fornecedor || itensEntrada.length === 0) {
      alert("Preencha o responsável, fornecedor e adicione itens.");
      return;
    }

    const entradaFinal = {
      responsavel,
      fornecedor,
      notaFiscal,
      data: dataEntrada,
      itens: itensEntrada
    };

    console.log("Entrada Registrada:", entradaFinal);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden animate-fade-in flex flex-col max-h-[95vh]">
        
        {/* CABEÇALHO*/}
        <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-100 p-2 rounded-lg text-emerald-700">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </span>
            <h2 className="text-xl font-bold text-emerald-900">
              Registrar Entrada (Nota Fiscal)
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">✕</button>
        </div>

        {/* CORPO SCROLLÁVEL */}
        <div className="p-6 overflow-y-auto space-y-6">

            {/* SEÇÃO 1: DADOS DA NOTA */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* RESPONSÁVEL PELA ENTRADA */}
                <div className="md:col-span-1 flex flex-col gap-1">
                    <label className="block text-sm font-medium text-slate-700">Recebido Por</label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">🔍</span>
                        <input 
                            type="text"
                            placeholder="Buscar nome..."
                            className="w-full pl-9 p-2 border border-slate-300 rounded-t-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-slate-50 transition"
                            value={buscaResponsavel}
                            onChange={(e) => setBuscaResponsavel(e.target.value)}
                        />
                    </div>
                    <div className="w-full border border-slate-300 rounded-b-lg -mt-1 bg-white max-h-32 overflow-y-auto border-t-0">
                        {responsaveisFiltrados.length === 0 ? (
                             <div className="p-2 text-xs text-gray-400 text-center italic">Não encontrado</div>
                        ) : (
                            responsaveisFiltrados.map((f) => {
                                const isSelected = Number(responsavel) === f.id;
                                return (
                                    <div 
                                        key={f.id} 
                                        onClick={() => setResponsavel(f.id)}
                                        className={`
                                            p-2 text-sm cursor-pointer border-b border-gray-50 last:border-0 transition-colors
                                            ${isSelected 
                                                ? "bg-emerald-100 text-emerald-800 font-medium" 
                                                : "text-slate-600 hover:bg-emerald-50"
                                            }
                                        `}
                                    >
                                        {f.nome}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Fornecedor</label>
                        <input 
                            className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                            placeholder="Ex: 3M do Brasil"
                            value={fornecedor}
                            onChange={(e) => setFornecedor(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nº Nota Fiscal</label>
                        <input 
                            className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                            placeholder="000.000"
                            value={notaFiscal}
                            onChange={(e) => setNotaFiscal(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <hr className="border-slate-100" />

            {/* SEÇÃO 2: ADICIONAR ITEM */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                    📦 Adicionar Itens da Nota
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
                    
                    {/* EPI */}
                    <div className="md:col-span-2">
                        <label className="text-xs text-slate-500 mb-1 block font-bold">Item</label>
                        <select
                            className="w-full p-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-emerald-600 outline-none"
                            value={epiTemp}
                            onChange={(e) => {
                                setEpiTemp(e.target.value);
                                setTamanhoTemp("");
                            }}
                        >
                            <option value="">Selecione...</option>
                            {mockEpis.map((e) => (<option key={e.id} value={e.id}>{e.nome}</option>))}
                        </select>
                    </div>

                    {/* Tamanho */}
                    <div>
                        <label className="text-xs text-slate-500 mb-1 block font-bold">Tam.</label>
                        <select
                            className="w-full p-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-emerald-600 outline-none disabled:bg-slate-100"
                            value={tamanhoTemp}
                            onChange={(e) => setTamanhoTemp(e.target.value)}
                            disabled={!epiSelecionadoObj}
                        >
                            <option value="">-</option>
                            {epiSelecionadoObj?.tamanhos.map((t) => (<option key={t} value={t}>{t}</option>))}
                        </select>
                    </div>

                    {/* Qtd e Preço */}
                    <div>
                        <label className="text-xs text-slate-500 mb-1 block font-bold">Qtd.</label>
                        <input type="number" className="w-full p-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-emerald-600 outline-none" 
                            value={qtdTemp} onChange={(e) => setQtdTemp(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-xs text-slate-500 mb-1 block font-bold">R$ Unit.</label>
                        <input type="number" className="w-full p-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-emerald-600 outline-none" 
                            placeholder="0.00" value={precoTemp} onChange={(e) => setPrecoTemp(e.target.value)} />
                    </div>

                    {/* Botão Add */}
                    <div>
                        <button
                            onClick={adicionarItem}
                            className="w-full px-3 py-2 bg-emerald-600 text-white font-bold rounded hover:bg-emerald-700 transition shadow-sm text-sm border border-emerald-800"
                        >
                            + Incluir
                        </button>
                    </div>
                </div>
                
                {/* Campo extra de validade */}
                <div className="mt-3 w-1/3">
                     <label className="text-xs text-slate-500 mb-1 block font-bold">Validade (Lote)</label>
                     <input type="date" className="w-full p-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-emerald-600 outline-none"
                        value={validadeTemp} onChange={(e) => setValidadeTemp(e.target.value)} />
                </div>
            </div>

            {/* TABELA DE ITENS */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    Itens na Nota ({itensEntrada.length})
                </label>
                
                <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-600 font-semibold">
                            <tr>
                                <th className="p-3 pl-4">Item</th>
                                <th className="p-3">Tam.</th>
                                <th className="p-3">Validade</th>
                                <th className="p-3 text-right">Qtd.</th>
                                <th className="p-3 text-right">Valor</th>
                                <th className="p-3 text-right">Ação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {itensEntrada.length === 0 ? (
                                <tr><td colSpan="6" className="p-6 text-center text-slate-400 italic">Nenhum item lançado.</td></tr>
                            ) : (
                                itensEntrada.map((item) => (
                                    <tr key={item.id}>
                                        <td className="p-3 pl-4 text-slate-700 font-medium">{item.epiNome}</td>
                                        <td className="p-3 text-slate-500">{item.tamanho}</td>
                                        <td className="p-3 text-slate-500 text-xs">{item.validade}</td>
                                        <td className="p-3 text-right font-bold text-slate-700">{item.quantidade}</td>
                                        <td className="p-3 text-right text-emerald-600">R$ {item.preco}</td>
                                        <td className="p-3 text-right">
                                            <button onClick={() => removerItem(item.id)} className="text-red-500 hover:text-red-700 font-bold text-xs">
                                                Excluir
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>

        {/* RODAPÉ */}
        <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-200">
          <button onClick={onClose} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition">
            Cancelar
          </button>
          <button onClick={salvarEntrada} className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 shadow-md transition flex items-center gap-2">
            <span>✅</span> Finalizar Entrada
          </button>
        </div>

      </div>
    </div>
  );
}

export default ModalEntrada;