import { useState } from "react";

const mockUsuarios = [
  { id: 1, nome: "Maria Santos (Almoxarifado)" },
  { id: 2, nome: "João Silva (Supervisor)" },
  { id: 3, nome: "Carlos Oliveira (Gerente)" },
];

const mockEpis = [
  { id: 1, nome: "Capacete de Segurança", tamanhos: ["P", "M", "G"] },
  { id: 2, nome: "Luva de Proteção", tamanhos: ["P", "M", "G", "GG"] },
  { id: 3, nome: "Sapato de Segurança", tamanhos: ["38", "40", "42", "44"] },
  { id: 4, nome: "Óculos de Proteção", tamanhos: ["Único"] },
];

const mockEntradasInicial = [
  { id: 101, dataEntrada: "2024-01-15", responsavel: 1, epi: 1, tamanho: "M", quantidade: 50, fornecedor: "3M do Brasil", lote: "L-2024-A", valorUnitario: 45.90 },
  { id: 102, dataEntrada: "2024-01-18", responsavel: 2, epi: 3, tamanho: "42", quantidade: 20, fornecedor: "Bracol", lote: "L-998-B", valorUnitario: 120.00 },
  { id: 103, dataEntrada: "2024-02-01", responsavel: 1, epi: 2, tamanho: "G", quantidade: 100, fornecedor: "Volk", lote: "L-555-C", valorUnitario: 12.50 },
  { id: 104, dataEntrada: "2024-02-05", responsavel: 3, epi: 4, tamanho: "Único", quantidade: 30, fornecedor: "Kalipso", lote: "L-112-D", valorUnitario: 15.00 },
  { id: 105, dataEntrada: "2024-02-10", responsavel: 1, epi: 1, tamanho: "P", quantidade: 10, fornecedor: "3M do Brasil", lote: "L-2024-E", valorUnitario: 45.90 },
  { id: 106, dataEntrada: "2024-02-12", responsavel: 2, epi: 3, tamanho: "40", quantidade: 5, fornecedor: "Bracol", lote: "L-999-F", valorUnitario: 120.00 },
];

function Entradas() {
  const [entradas, setEntradas] = useState(mockEntradasInicial);
  const [modalAberto, setModalAberto] = useState(false);
  const [busca, setBusca] = useState("");

  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 5;

  const [responsavel, setResponsavel] = useState("");
  const [epi, setEpi] = useState("");
  const [tamanho, setTamanho] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [dataEntrada, setDataEntrada] = useState("");
  const [lote, setLote] = useState("");
  const [fornecedor, setFornecedor] = useState("");
  const [valorUnitario, setValorUnitario] = useState("");

  const formatarData = (data) => {
    if (!data) return "--";
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  const formatarMoeda = (valor) => {
    if (!valor) return "R$ 0,00";
    return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  // Filtros
  const entradasFiltradas = entradas.filter((e) => {
    const termo = busca.toLowerCase();
    const nomeEpi = mockEpis.find(item => item.id === e.epi)?.nome.toLowerCase() || "";
    const nomeFornecedor = e.fornecedor.toLowerCase();
    const numeroLote = e.lote.toLowerCase();

    return nomeEpi.includes(termo) || nomeFornecedor.includes(termo) || numeroLote.includes(termo);
  });

  const indexUltimoItem = paginaAtual * itensPorPagina;
  const indexPrimeiroItem = indexUltimoItem - itensPorPagina;
  const entradasVisiveis = entradasFiltradas.slice(indexPrimeiroItem, indexUltimoItem);
  const totalPaginas = Math.ceil(entradasFiltradas.length / itensPorPagina);

  const epiSelecionadoObj = mockEpis.find((e) => e.id === Number(epi));


  function abrirModal() {
    setResponsavel(""); setEpi(""); setTamanho("");
    setQuantidade(""); setDataEntrada(new Date().toISOString().split('T')[0]);
    setLote(""); setFornecedor(""); setValorUnitario("");
    setModalAberto(true);
  }

  function salvarEntrada() {
    if (!responsavel || !epi || !quantidade || !dataEntrada) {
      alert("Preencha os campos obrigatórios!");
      return;
    }

    const novaEntrada = {
      id: Date.now(),
      responsavel: Number(responsavel),
      epi: Number(epi),
      tamanho,
      quantidade: Number(quantidade),
      dataEntrada,
      fornecedor,
      lote,
      valorUnitario: Number(valorUnitario),
    };

    setEntradas((prev) => [novaEntrada, ...prev]); 
    setModalAberto(false);
    setPaginaAtual(1);
  }

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-gray-100 animate-fade-in max-w-full">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-800 flex items-center gap-2">
            📥 Registro de Entradas
          </h2>
          <p className="text-sm text-gray-500">Histórico de compras e reposição de estoque.</p>
        </div>

        <button
          onClick={abrirModal}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-emerald-700 transition flex items-center gap-2 shadow-sm justify-center w-full lg:w-auto"
        >
          <span>➕</span> Nova Entrada
        </button>
      </div>

      {/* BARRA DE BUSCA */}
      <div className="relative mb-6">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">🔍</span>
        <input
          type="text"
          placeholder="Buscar por EPI, Fornecedor ou Lote..."
          value={busca}
          onChange={(e) => {
              setBusca(e.target.value);
              setPaginaAtual(1);
          }}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition text-sm lg:text-base"
        />
      </div>

      {/* --- MODO DESKTOP*/}
      <div className="hidden lg:block overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
            <tr>
              <th className="p-4 font-semibold">Data</th>
              <th className="p-4 font-semibold">EPI / Item</th>
              <th className="p-4 font-semibold text-center">Tam.</th>
              <th className="p-4 font-semibold text-center">Qtd.</th>
              <th className="p-4 font-semibold">Fornecedor / Lote</th>
              <th className="p-4 font-semibold text-right">Valor Un.</th>
              <th className="p-4 font-semibold text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {entradasVisiveis.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-8 text-center text-gray-500">Nenhuma entrada encontrada.</td>
              </tr>
            ) : (
              entradasVisiveis.map((e) => {
                const nomeEpi = mockEpis.find(item => item.id === e.epi)?.nome || "Desconhecido";
                const total = e.quantidade * e.valorUnitario;

                return (
                  <tr key={e.id} className="hover:bg-gray-50 transition">
                    <td className="p-4 text-gray-600 font-mono text-sm">{formatarData(e.dataEntrada)}</td>
                    <td className="p-4 font-medium text-gray-800">{nomeEpi}</td>
                    <td className="p-4 text-center text-gray-600">{e.tamanho || "-"}</td>
                    <td className="p-4 text-center">
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded">
                        +{e.quantidade}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600 text-sm">
                        <div className="font-bold">{e.fornecedor}</div>
                        <div className="text-xs text-gray-400">Lote: {e.lote}</div>
                    </td>
                    <td className="p-4 text-right text-gray-600 font-mono text-sm">{formatarMoeda(e.valorUnitario)}</td>
                    <td className="p-4 text-right text-emerald-700 font-bold font-mono text-sm">{formatarMoeda(total)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* --- MODO MOBILE/TABLET*/}
      <div className="lg:hidden space-y-4">
        {entradasVisiveis.length > 0 ? (
          entradasVisiveis.map((e) => {
            const nomeEpi = mockEpis.find(item => item.id === e.epi)?.nome || "Desconhecido";
            const total = e.quantidade * e.valorUnitario;

            return (
              <div key={e.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm relative">
                
                {/* Data e Quantidade no topo */}
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                        {formatarData(e.dataEntrada)}
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded border border-emerald-200">
                        +{e.quantidade} un
                    </span>
                </div>

                <h3 className="font-bold text-gray-800 text-lg mb-1">{nomeEpi}</h3>
                <p className="text-sm text-gray-600 mb-3">Tamanho: <strong className="text-gray-800">{e.tamanho || "Único"}</strong></p>

                {/* Grid de Detalhes */}
                <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm">
                    <div>
                        <span className="block text-[10px] text-gray-400 font-bold uppercase">Fornecedor</span>
                        <span className="text-gray-700 font-medium truncate block">{e.fornecedor}</span>
                        <span className="text-xs text-gray-400">Lote: {e.lote}</span>
                    </div>
                    <div className="text-right">
                        <span className="block text-[10px] text-gray-400 font-bold uppercase">Total da NF</span>
                        <span className="text-emerald-700 font-bold font-mono">{formatarMoeda(total)}</span>
                    </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            Nenhuma entrada encontrada.
          </div>
        )}
      </div>

      {/* PAGINAÇÃO */}
      {totalPaginas > 1 && (
        <div className="flex justify-between items-center mt-6 px-1">
            <button
                onClick={() => setPaginaAtual(prev => Math.max(prev - 1, 1))}
                disabled={paginaAtual === 1}
                className={`px-4 py-2 rounded text-sm font-bold border ${paginaAtual === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-emerald-700 hover:bg-emerald-50 border-emerald-200'}`}
            >
                ← Anterior
            </button>

            <span className="text-xs lg:text-sm text-gray-600">
                Pág. <b className="text-gray-900">{paginaAtual}</b> de <b>{totalPaginas}</b>
            </span>

            <button
                onClick={() => setPaginaAtual(prev => Math.min(prev + 1, totalPaginas))}
                disabled={paginaAtual === totalPaginas}
                className={`px-4 py-2 rounded text-sm font-bold border ${paginaAtual === totalPaginas ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-emerald-700 hover:bg-emerald-50 border-emerald-200'}`}
            >
                Próxima →
            </button>
        </div>
      )}

      {/* MODAL*/}
      {modalAberto && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
            
            <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center shrink-0">
              <h3 className="text-lg font-bold text-gray-800">📦 Nova Entrada</h3>
              <button onClick={() => setModalAberto(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto">
              
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Selecione o EPI</label>
                <select className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white" value={epi} onChange={(e) => { setEpi(e.target.value); setTamanho(""); }}>
                  <option value="">Selecione...</option>
                  {mockEpis.map((e) => (<option key={e.id} value={e.id}>{e.nome}</option>))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tamanho</label>
                <select className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white disabled:bg-gray-100" value={tamanho} onChange={(e) => setTamanho(e.target.value)} disabled={!epiSelecionadoObj}>
                  <option value="">Selecione...</option>
                  {epiSelecionadoObj?.tamanhos.map((t) => (<option key={t} value={t}>{t}</option>))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                <input type="number" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Ex: 50" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data da Entrada</label>
                <input type="date" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" value={dataEntrada} onChange={(e) => setDataEntrada(e.target.value)} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor Unitário (R$)</label>
                <input type="number" step="0.01" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="0.00" value={valorUnitario} onChange={(e) => setValorUnitario(e.target.value)} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fornecedor</label>
                <input type="text" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Ex: 3M Brasil" value={fornecedor} onChange={(e) => setFornecedor(e.target.value)} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número do Lote</label>
                <input type="text" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Ex: LT-2024" value={lote} onChange={(e) => setLote(e.target.value)} />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Responsável</label>
                <select className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white" value={responsavel} onChange={(e) => setResponsavel(e.target.value)}>
                  <option value="">Selecione o funcionário...</option>
                  {mockUsuarios.map((u) => (<option key={u.id} value={u.id}>{u.nome}</option>))}
                </select>
              </div>

            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t shrink-0">
              <button onClick={() => setModalAberto(false)} className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition">Cancelar</button>
              <button onClick={salvarEntrada} className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 shadow-md transition">Registrar</button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default Entradas;