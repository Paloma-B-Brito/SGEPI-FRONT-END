import { useState } from "react";

const mockEstoqueCompleto = [
  {
    id: "CAP-001",
    nome: "Capacete de Segurança",
    tamanhoAtual: "M",
    variacoes: {
      P: { quantidade: 8, fabricante: "Pedro", validade: "2024-10-01", ca: "34.123" },
      M: { quantidade: 120, fabricante: "Daniel", validade: "2025-12-01", ca: "34.123" },
      G: { quantidade: 15, fabricante: "MSA", validade: "2024-06-01", ca: "29.987" },
    },
  },
  {
    id: "SAP-002",
    nome: "Sapato de Segurança",
    tamanhoAtual: "42",
    variacoes: {
      "40": { quantidade: 5, fabricante: "Bracol", validade: "2024-08-01", ca: "15.432" },
      "42": { quantidade: 35, fabricante: "Bracol", validade: "2025-05-01", ca: "15.432" },
      "44": { quantidade: 12, fabricante: "Marluvas", validade: "2024-11-01", ca: "18.555" },
    },
  },
  {
    id: "LUV-003",
    nome: "Luva de Proteção",
    tamanhoAtual: "M",
    variacoes: {
      P: { quantidade: 50, fabricante: "Danny", validade: "2026-01-01", ca: "40.100" },
      M: { quantidade: 18, fabricante: "Danny", validade: "2025-09-01", ca: "40.100" },
      G: { quantidade: 6, fabricante: "Volk", validade: "2024-12-01", ca: "38.200" },
    },
  },
  {
    id: "OCU-004",
    nome: "Óculos de Proteção",
    tamanhoAtual: "Único",
    variacoes: {
      Único: { quantidade: 22, fabricante: "Kalipso", validade: "2026-03-01", ca: "11.222" },
    },
  },
  {
    id: "PRO-005",
    nome: "Protetor Auricular",
    tamanhoAtual: "Único",
    variacoes: {
      Único: { quantidade: 0, fabricante: "Rickman", validade: "2024-07-01", ca: "19.888" },
    },
  },
  {
    id: "CIN-006",
    nome: "Cinto Paraquedista",
    tamanhoAtual: "G",
    variacoes: {
      G: { quantidade: 3, fabricante: "Hercules", validade: "2027-01-01", ca: "10.101" },
    },
  },
];

function Estoque() {
  const [epis, setEpis] = useState(mockEstoqueCompleto);
  const [busca, setBusca] = useState("");
  const [filtrar, setFiltrar] = useState(false);

  // Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 5;

  // --- FUNÇÕES AUXILIARES ---
  const formatarValidade = (dataString) => {
    if (!dataString) return "--";
    const [ano, mes, dia] = dataString.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const getStatusColor = (qtd) => {
    if (qtd === 0) return "bg-red-100 text-red-700 border-red-200";
    if (qtd <= 20) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-green-100 text-green-700 border-green-200";
  };

  const getStatusTexto = (qtd) => {
    if (qtd === 0) return "ESGOTADO";
    if (qtd <= 20) return "BAIXO";
    return "OK";
  };

  function trocarTamanho(epiId, novoTamanho) {
    setEpis((prev) =>
      prev.map((epi) =>
        epi.id === epiId ? { ...epi, tamanhoAtual: novoTamanho } : epi
      )
    );
  }

  // --- LÓGICA DE FILTRO E PAGINAÇÃO ---
  const listaFiltrada = epis.filter((epi) => {
    const termo = busca.toLowerCase();
    const dadosAtuais = epi.variacoes[epi.tamanhoAtual];
    
    const matchNome = epi.nome.toLowerCase().includes(termo);
    const matchTamanho = epi.tamanhoAtual.toLowerCase().includes(termo);
    const matchFabricante = dadosAtuais.fabricante.toLowerCase().includes(termo);
    const matchCA = dadosAtuais.ca.includes(termo); 

    return matchNome || matchTamanho || matchFabricante || matchCA;
  });

  const indexUltimoItem = paginaAtual * itensPorPagina;
  const indexPrimeiroItem = indexUltimoItem - itensPorPagina;
  const itensVisiveis = listaFiltrada.slice(indexPrimeiroItem, indexUltimoItem);
  const totalPaginas = Math.ceil(listaFiltrada.length / itensPorPagina);

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-gray-100 max-w-full">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
            📦 Controle de Estoque
          </h2>
          <p className="text-sm text-gray-500">Gerencie tamanhos, CAs e validades.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <button
            onClick={() => {
              setBusca("");
              setPaginaAtual(1);
            }}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition w-full sm:w-auto"
          >
            Limpar Filtros
          </button>
        </div>
      </div>

      {/* BARRA DE BUSCA */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Buscar por nome, CA ou fabricante..."
            value={busca}
            onChange={(e) => {
                setBusca(e.target.value);
                setPaginaAtual(1);
            }}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm md:text-base"
          />
        </div>
      </div>

      {/* --- VISUALIZAÇÃO DESKTOP (TABELA) --- */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
            <tr>
              <th className="p-4 font-semibold">Item / EPI</th>
              <th className="p-4 font-semibold">CA</th>
              <th className="p-4 font-semibold text-center">Tamanho</th>
              <th className="p-4 font-semibold">Fabricante</th>
              <th className="p-4 font-semibold text-center">Qtd.</th>
              <th className="p-4 font-semibold text-center">Validade</th>
              <th className="p-4 font-semibold text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {itensVisiveis.length > 0 ? (
              itensVisiveis.map((epi) => {
                const dados = epi.variacoes[epi.tamanhoAtual];
                return (
                  <tr key={epi.id} className="hover:bg-gray-50 transition duration-150">
                    <td className="p-4 font-medium text-gray-800">{epi.nome}</td>
                    <td className="p-4 text-gray-600 font-mono text-sm">
                        <span className="bg-gray-100 px-2 py-1 rounded border border-gray-200 text-xs font-bold text-gray-700">
                            {dados.ca}
                        </span>
                    </td>
                    <td className="p-4 text-center">
                      {Object.keys(epi.variacoes).length > 1 ? (
                        <select
                          value={epi.tamanhoAtual}
                          onChange={(e) => trocarTamanho(epi.id, e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer"
                        >
                          {Object.keys(epi.variacoes).map((tam) => (
                            <option key={tam} value={tam}>{tam}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-gray-600 font-medium bg-gray-50 px-2 py-1 rounded border">{epi.tamanhoAtual}</span>
                      )}
                    </td>
                    <td className="p-4 text-gray-600 text-sm">{dados.fabricante}</td>
                    <td className="p-4 text-center font-bold text-gray-800">{dados.quantidade}</td>
                    <td className="p-4 text-center text-gray-500 text-sm">{formatarValidade(dados.validade)}</td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-bold border ${getStatusColor(dados.quantidade)}`}>
                        {getStatusTexto(dados.quantidade)}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="p-8 text-center text-gray-500">Nenhum item encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- VISUALIZAÇÃO MOBILE (CARDS) --- */}
      <div className="md:hidden space-y-4">
        {itensVisiveis.length > 0 ? (
          itensVisiveis.map((epi) => {
            const dados = epi.variacoes[epi.tamanhoAtual];
            return (
              <div key={epi.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm relative">
                
                {/* Status no topo direito */}
                <div className="absolute top-4 right-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold border ${getStatusColor(dados.quantidade)}`}>
                        {getStatusTexto(dados.quantidade)}
                    </span>
                </div>

                <h3 className="font-bold text-gray-800 text-lg mb-1">{epi.nome}</h3>
                
                <div className="flex items-center gap-2 mb-3">
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono text-gray-600 border border-gray-200">
                        CA: {dados.ca}
                    </span>
                    <span className="text-xs text-gray-400">|</span>
                    <span className="text-xs text-gray-500 truncate max-w-[150px]">{dados.fabricante}</span>
                </div>

                {/* Grid de informações internas */}
                <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div>
                        <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Tamanho</label>
                        {Object.keys(epi.variacoes).length > 1 ? (
                            <select
                                value={epi.tamanhoAtual}
                                onChange={(e) => trocarTamanho(epi.id, e.target.value)}
                                className="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-white"
                            >
                                {Object.keys(epi.variacoes).map((tam) => (
                                    <option key={tam} value={tam}>{tam}</option>
                                ))}
                            </select>
                        ) : (
                            <span className="font-medium text-sm text-gray-700">{epi.tamanhoAtual}</span>
                        )}
                    </div>

                    <div className="text-right">
                        <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Quantidade</label>
                        <span className="text-lg font-bold text-gray-800">{dados.quantidade} <small className="text-xs font-normal text-gray-500">un</small></span>
                    </div>
                </div>

                <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
                    <span>Validade: <strong>{formatarValidade(dados.validade)}</strong></span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            Nenhum item encontrado.
          </div>
        )}
      </div>

      {/* BARRA DE PAGINAÇÃO */}
      {totalPaginas > 1 && (
        <div className="flex justify-between items-center mt-6 px-1">
            <button
                onClick={() => setPaginaAtual(prev => Math.max(prev - 1, 1))}
                disabled={paginaAtual === 1}
                className={`px-4 py-2 rounded text-sm font-bold border ${paginaAtual === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-700 hover:bg-blue-50 border-blue-200'}`}
            >
                ← Anterior
            </button>

            <span className="text-xs md:text-sm text-gray-600">
                Pág. <b className="text-gray-900">{paginaAtual}</b> de <b>{totalPaginas}</b>
            </span>

            <button
                onClick={() => setPaginaAtual(prev => Math.min(prev + 1, totalPaginas))}
                disabled={paginaAtual === totalPaginas}
                className={`px-4 py-2 rounded text-sm font-bold border ${paginaAtual === totalPaginas ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-700 hover:bg-blue-50 border-blue-200'}`}
            >
                Próxima →
            </button>
        </div>
      )}

    </div>
  );
}

export default Estoque;