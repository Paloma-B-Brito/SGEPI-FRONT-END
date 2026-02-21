import { useState, useEffect } from "react";
import { api } from "../../services/api";

const mockFuncionarios = [
  { id: 1, nome: "João Silva", cargo: "Almoxarife", matricula: "483920" },
  { id: 2, nome: "Maria Santos", cargo: "Gerente", matricula: "739104" },
  { id: 3, nome: "Carlos Oliveira", cargo: "Supervisor", matricula: "102938" },
  { id: 4, nome: "Ana Pereira", cargo: "Auxiliar Logístico", matricula: "998877" },
];

const mockFornecedores = [
  { id: 1, nome: "3M do Brasil Ltda", cnpj: "45.985.371/0001-08", contato: "vendas@3m.com" },
  { id: 2, nome: "Bracol Calçados de Segurança", cnpj: "12.345.678/0001-90", contato: "comercial@bracol.com.br" },
  { id: 3, nome: "Volk do Brasil", cnpj: "98.765.432/0001-10", contato: "sac@volk.com" },
  { id: 4, nome: "Danny EPIs", cnpj: "11.222.333/0001-44", contato: "contato@danny.com.br" },
  { id: 5, nome: "Promat Indústria", cnpj: "55.666.777/0001-99", contato: "vendas@promat.com" },
];

const mockEpis = [
  { id: 1, nome: "Capacete de Segurança", ca: "32.145", tamanhos: ["P", "M", "G"] },
  { id: 2, nome: "Luva de Raspa", ca: "15.400", tamanhos: ["P", "M", "G", "GG"] },
  { id: 3, nome: "Sapato de Segurança", ca: "40.222", tamanhos: ["38", "40", "42", "44"] },
  { id: 4, nome: "Óculos de Proteção", ca: "11.200", tamanhos: ["Único"] },
  { id: 5, nome: "Protetor Auricular", ca: "19.100", tamanhos: ["Único"] },
];

function ModalEntrada({ onClose }) {
  const [notaFiscal, setNotaFiscal] = useState("");
  const [dataEntrada, setDataEntrada] = useState(new Date().toISOString().split('T')[0]);
  
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState(null); 
  const [buscaFornecedor, setBuscaFornecedor] = useState(""); 
  
  const [responsavelSelecionado, setResponsavelSelecionado] = useState(null);
  const [buscaResponsavel, setBuscaResponsavel] = useState("");

  const [itensEntrada, setItensEntrada] = useState([]);

  const [epiId, setEpiId] = useState("");
  const [tamanhoTemp, setTamanhoTemp] = useState("");
  const [qtdTemp, setQtdTemp] = useState(1);
  const [precoTemp, setPrecoTemp] = useState("");
  const [validadeTemp, setValidadeTemp] = useState("");

  const epiSelecionadoObj = mockEpis.find((e) => e.id === Number(epiId));

  const fornecedoresFiltrados = mockFornecedores.filter((f) => 
    f.nome.toLowerCase().includes(buscaFornecedor.toLowerCase()) ||
    f.cnpj.includes(buscaFornecedor)
  );

  const responsaveisFiltrados = mockFuncionarios.filter((f) => 
    f.nome.toLowerCase().includes(buscaResponsavel.toLowerCase()) ||
    f.matricula.includes(buscaResponsavel)
  );

  const valorTotalNota = itensEntrada.reduce((acc, item) => acc + (item.quantidade * item.preco), 0);

  function adicionarItem() {
    if (!epiId || !qtdTemp || !precoTemp) {
        alert("Atenção: Preencha o EPI, a quantidade e o valor unitário.");
        return;
    }

    if (epiSelecionadoObj?.tamanhos.length > 0 && !tamanhoTemp) {
        alert("Atenção: É necessário selecionar o tamanho do EPI.");
        return;
    }

    const novoItem = {
      id: Date.now(), 
      epiId: epiId,
      epiNome: epiSelecionadoObj.nome,
      ca: epiSelecionadoObj.ca,
      tamanho: tamanhoTemp || "Único",
      quantidade: Number(qtdTemp),
      preco: Number(precoTemp),
      validade: validadeTemp || "N/A",
      totalItem: Number(qtdTemp) * Number(precoTemp)
    };

    setItensEntrada([...itensEntrada, novoItem]);
    
    setEpiId("");
    setTamanhoTemp("");
    setQtdTemp(1);
    setPrecoTemp("");
    setValidadeTemp("");
  }

  function removerItem(id) {
    if(window.confirm("Deseja remover este item da lista?")) {
        setItensEntrada(itensEntrada.filter(i => i.id !== id));
    }
  }

  const salvarEntrada = async () => {
    if (!fornecedorSelecionado) {
      alert("Erro: Você deve selecionar um Fornecedor da lista.");
      return;
    }
    if (!responsavelSelecionado) {
      alert("Erro: Informe quem recebeu a mercadoria.");
      return;
    }
    if (!notaFiscal) {
      alert("Erro: Digite o número da Nota Fiscal.");
      return;
    }
    if (itensEntrada.length === 0) {
      alert("Erro: A lista de itens está vazia.");
      return;
    }

    const entradaFinal = {
      id_entrada: Date.now(),
      data_registro: new Date(),
      data_nota: dataEntrada,
      numero_nota: notaFiscal,
      id_fornecedor: fornecedorSelecionado.id,
      nome_fornecedor: fornecedorSelecionado.nome,
      id_responsavel: responsavelSelecionado.id,
      itens: itensEntrada,
      valor_total: valorTotalNota
    };

    try {
      await api.post("/entrada", entradaFinal);
      alert(`Sucesso! Entrada da NF ${notaFiscal} registrada.`);
      onClose();
    } catch (erro) {
      alert(`Simulação: Entrada da NF ${notaFiscal} registrada localmente.`);
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 bg-opacity-60 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden animate-fade-in flex flex-col max-h-[95vh] border border-slate-200">
        
        <div className="bg-emerald-600 px-6 py-4 flex justify-between items-center shadow-md z-10">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg text-white">
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
                <h2 className="text-xl font-bold text-white leading-tight">
                Entrada de Nota Fiscal
                </h2>
                <p className="text-emerald-100 text-xs">Registro de estoque por fornecedor único</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-emerald-100 hover:text-white hover:bg-emerald-700 p-2 rounded-full transition"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-50 p-6 space-y-6">

            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b pb-2">
                    1. Dados da Nota Fiscal
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    
                    <div className="md:col-span-6">
                        <label className="block text-sm font-bold text-slate-700 mb-1">
                            Fornecedor (Emissor da Nota) <span className="text-red-500">*</span>
                        </label>
                        
                        {fornecedorSelecionado ? (
                            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-emerald-900">{fornecedorSelecionado.nome}</p>
                                    <p className="text-xs text-emerald-600">CNPJ: {fornecedorSelecionado.cnpj}</p>
                                </div>
                                <button 
                                    onClick={() => {
                                        setFornecedorSelecionado(null);
                                        setBuscaFornecedor("");
                                    }}
                                    className="text-xs text-red-500 hover:text-red-700 font-medium underline px-2"
                                >
                                    Trocar
                                </button>
                            </div>
                        ) : (
                            <div className="relative">
                                <input 
                                    type="text"
                                    placeholder="Digite o nome ou CNPJ..."
                                    className="w-full pl-3 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm transition"
                                    value={buscaFornecedor}
                                    onChange={(e) => setBuscaFornecedor(e.target.value)}
                                />
                                {buscaFornecedor.length > 0 && (
                                    <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                                        {fornecedoresFiltrados.length === 0 ? (
                                            <div className="p-3 text-sm text-slate-400 italic">Nenhum fornecedor encontrado.</div>
                                        ) : (
                                            fornecedoresFiltrados.map((f) => (
                                                <div 
                                                    key={f.id}
                                                    onClick={() => {
                                                        setFornecedorSelecionado(f);
                                                        setBuscaFornecedor(""); 
                                                    }}
                                                    className="p-3 hover:bg-emerald-50 cursor-pointer border-b border-slate-50 last:border-0"
                                                >
                                                    <p className="text-sm font-bold text-slate-700">{f.nome}</p>
                                                    <p className="text-xs text-slate-500">CNPJ: {f.cnpj}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="md:col-span-3">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nº Nota Fiscal</label>
                        <input 
                            type="text" 
                            className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                            placeholder="Ex: 000.456"
                            value={notaFiscal}
                            onChange={(e) => setNotaFiscal(e.target.value)}
                        />
                    </div>
                    <div className="md:col-span-3">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Data Emissão</label>
                        <input 
                            type="date" 
                            className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm text-slate-600"
                            value={dataEntrada}
                            onChange={(e) => setDataEntrada(e.target.value)}
                        />
                    </div>
                </div>

                <div className="mt-4">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Responsável pelo Recebimento</label>
                    {responsavelSelecionado ? (
                        <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-lg border border-slate-200 w-fit">
                            <span className="text-sm font-semibold text-slate-700">👤 {responsavelSelecionado.nome}</span>
                            <button onClick={() => setResponsavelSelecionado(null)} className="text-slate-400 hover:text-red-500">✕</button>
                        </div>
                    ) : (
                        <div className="relative">
                            <input 
                                type="text"
                                placeholder="Quem recebeu? (Busque por nome)"
                                className="w-full md:w-1/2 p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                                value={buscaResponsavel}
                                onChange={(e) => setBuscaResponsavel(e.target.value)}
                            />
                            {buscaResponsavel.length > 0 && (
                                <div className="absolute z-10 w-full md:w-1/2 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                                    {responsaveisFiltrados.map((f) => (
                                        <div 
                                            key={f.id}
                                            onClick={() => {
                                                setResponsavelSelecionado(f);
                                                setBuscaResponsavel("");
                                            }}
                                            className="p-2.5 hover:bg-slate-50 cursor-pointer text-sm text-slate-700"
                                        >
                                            {f.nome} <span className="text-xs text-slate-400">({f.cargo})</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm relative">
                {!fornecedorSelecionado && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-lg">
                        <span className="bg-slate-800 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                            ⚠️ Selecione o Fornecedor primeiro
                        </span>
                    </div>
                )}

                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b pb-2 flex justify-between">
                    2. Itens da Nota
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-slate-50 p-4 rounded-lg border border-slate-100">
                    
                    <div className="md:col-span-4">
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1">Produto / EPI</label>
                        <select 
                            className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-emerald-600 outline-none text-sm"
                            value={epiId}
                            onChange={(e) => {
                                setEpiId(e.target.value);
                                setTamanhoTemp(""); 
                            }}
                        >
                            <option value="">Selecione o item...</option>
                            {mockEpis.map(epi => (
                                <option key={epi.id} value={epi.id}>{epi.nome}</option>
                            ))}
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1">Tamanho</label>
                        <select 
                            className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-emerald-600 outline-none text-sm disabled:bg-slate-200"
                            value={tamanhoTemp}
                            onChange={(e) => setTamanhoTemp(e.target.value)}
                            disabled={!epiSelecionadoObj}
                        >
                            <option value="">-</option>
                            {epiSelecionadoObj?.tamanhos.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1">Qtd.</label>
                        <input 
                            type="number" 
                            min="1"
                            className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-emerald-600 outline-none text-sm"
                            value={qtdTemp}
                            onChange={(e) => setQtdTemp(e.target.value)}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1">Valor Unit. (R$)</label>
                        <input 
                            type="number" 
                            step="0.01"
                            className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-emerald-600 outline-none text-sm"
                            placeholder="0.00"
                            value={precoTemp}
                            onChange={(e) => setPrecoTemp(e.target.value)}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <button 
                            onClick={adicionarItem}
                            className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded shadow-md transition flex items-center justify-center gap-1 text-sm"
                        >
                            <span>+</span> Incluir
                        </button>
                    </div>
                    
                    <div className="md:col-span-3 mt-2 md:mt-0">
                         <label className="text-xs font-bold text-slate-400 uppercase mb-1">Validade (Lote)</label>
                         <input 
                            type="date" 
                            className="w-full p-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-emerald-600 outline-none"
                            value={validadeTemp}
                            onChange={(e) => setValidadeTemp(e.target.value)}
                         />
                    </div>
                </div>

                <div className="mt-6">
                    <div className="overflow-x-auto border border-slate-200 rounded-lg">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-100 text-slate-600 font-semibold uppercase text-xs">
                                <tr>
                                    <th className="p-3 pl-4">Item</th>
                                    <th className="p-3 text-center">Tam.</th>
                                    <th className="p-3 text-center">Qtd.</th>
                                    <th className="p-3 text-right">Unitário</th>
                                    <th className="p-3 text-right">Total</th>
                                    <th className="p-3 text-center">Ação</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {itensEntrada.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="p-8 text-center text-slate-400 italic bg-white">
                                            Nenhum item adicionado à nota ainda.
                                        </td>
                                    </tr>
                                ) : (
                                    itensEntrada.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50 transition bg-white">
                                            <td className="p-3">
                                                <span className="font-medium text-slate-800">{item.epiNome}</span>
                                                <span className="block text-xs text-slate-400">CA: {item.ca} | Val: {item.validade}</span>
                                            </td>
                                            <td className="p-3 text-center text-slate-600">{item.tamanho}</td>
                                            <td className="p-3 text-center font-bold text-slate-700">{item.quantidade}</td>
                                            <td className="p-3 text-right text-slate-600">
                                                {item.preco.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}
                                            </td>
                                            <td className="p-3 text-right font-bold text-emerald-600">
                                                {item.totalItem.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}
                                            </td>
                                            <td className="p-3 text-center">
                                                <button 
                                                    onClick={() => removerItem(item.id)}
                                                    className="text-red-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition"
                                                    title="Remover item"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                            {itensEntrada.length > 0 && (
                                <tfoot className="bg-slate-50 border-t-2 border-slate-200">
                                    <tr>
                                        <td colSpan="4" className="p-3 text-right font-bold text-slate-600 uppercase text-xs tracking-wider">
                                            Total da Nota Fiscal:
                                        </td>
                                        <td className="p-3 text-right font-black text-lg text-emerald-700">
                                            {valorTotalNota.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}
                                        </td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>
                </div>
            </div>

        </div>

        <div className="bg-white px-6 py-4 flex justify-between items-center border-t border-slate-200">
            <div className="text-xs text-slate-400">
                * Campos obrigatórios para controle de estoque
            </div>
            <div className="flex gap-3">
                <button 
                    onClick={onClose} 
                    className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-lg transition"
                >
                    Cancelar
                </button>
                <button 
                    onClick={salvarEntrada} 
                    className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition flex items-center gap-2 transform active:scale-95"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Finalizar Entrada
                </button>
            </div>
        </div>

      </div>
    </div>
  );
}

export default ModalEntrada;