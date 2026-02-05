import { useState } from "react";
import ModalEntrega from "../components/modals/ModalEntrega";

// 1. MEUS DADOS MOCKADOS
const mockFuncionarios = [
  { id: 1, nome: "João Silva", setor: "Produção", matricula: "483920", cargo: "Operador" },
  { id: 2, nome: "Maria Santos", setor: "Segurança", matricula: "739104", cargo: "Técnica" },
  { id: 3, nome: "Carlos Oliveira", setor: "Manutenção", matricula: "102938", cargo: "Eletricista" },
  { id: 4, nome: "Ana Pereira", setor: "Logística", matricula: "998877", cargo: "Auxiliar" },
  { id: 5, nome: "Roberto Costa", setor: "Produção", matricula: "112233", cargo: "Operador" },
  { id: 6, nome: "Fernanda Lima", setor: "RH", matricula: "554433", cargo: "Analista" },
];

const mockEpis = [
  { id: 1, nome: "Capacete de Segurança", ca: "32.145", tamanhos: ["P", "M", "G"] },
  { id: 2, nome: "Luva de Raspa", ca: "15.400", tamanhos: ["P", "M", "G", "GG"] },
  { id: 3, nome: "Sapato de Segurança", ca: "40.222", tamanhos: ["38", "40", "42", "44"] },
];

// Dados iniciais para a tabela não ficar vazia
const mockEntregasInicial = [
  { id: 101, funcionario: 1, dataEntrega: "2024-01-20", assinatura: null, itens: [{ id: "a1", epiNome: "Capacete", tamanho: "M", quantidade: 1 }] },
  { id: 102, funcionario: 2, dataEntrega: "2024-02-15", assinatura: null, itens: [{ id: "a2", epiNome: "Luva de Raspa", tamanho: "P", quantidade: 5 }] },
  { id: 103, funcionario: 3, dataEntrega: "2024-03-10", assinatura: null, itens: [{ id: "a3", epiNome: "Sapato", tamanho: "42", quantidade: 1 }] },
  { id: 104, funcionario: 4, dataEntrega: "2024-03-12", assinatura: null, itens: [{ id: "a4", epiNome: "Capacete", tamanho: "P", quantidade: 1 }] },
  { id: 105, funcionario: 5, dataEntrega: "2024-03-15", assinatura: null, itens: [{ id: "a5", epiNome: "Sapato", tamanho: "40", quantidade: 1 }] },
  { id: 106, funcionario: 1, dataEntrega: "2024-03-18", assinatura: null, itens: [{ id: "a6", epiNome: "Luva de Raspa", tamanho: "G", quantidade: 2 }] },
];

function Entregas() {
  const [entregas, setEntregas] = useState(mockEntregasInicial);
  const [modalAberto, setModalAberto] = useState(false);
  
  // Meus estados para os filtros
  const [busca, setBusca] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  // Configuração da minha paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 5;

  // Minha função pra formatar a data do jeito brasileiro
  const formatarData = (data) => {
    if (!data) return "--";
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  // --- LÓGICA DE FILTRO E PAGINAÇÃO ---
  const entregasFiltradas = entregas.filter((entrega) => {
    const func = mockFuncionarios.find(f => f.id === entrega.funcionario);
    // Se o funcionário não existir no mock (ex: foi deletado), ignoro o registro
    if (!func) return false; 

    // 1. Filtro por Texto
    const termo = busca.toLowerCase();
    const matchTexto = func.nome.toLowerCase().includes(termo) || func.matricula.includes(termo);

    // 2. Filtro por Data
    let matchData = true;
    if (dataInicio) {
        matchData = matchData && entrega.dataEntrega >= dataInicio;
    }
    if (dataFim) {
        matchData = matchData && entrega.dataEntrega <= dataFim;
    }

    return matchTexto && matchData;
  });

  // Calculo o que vai aparecer na página atual
  const indexUltimoItem = paginaAtual * itensPorPagina;
  const indexPrimeiroItem = indexUltimoItem - itensPorPagina;
  const entregasVisiveis = entregasFiltradas.slice(indexPrimeiroItem, indexUltimoItem);
  
  const totalPaginas = Math.ceil(entregasFiltradas.length / itensPorPagina);

  // Função para resetar a paginação ao filtrar
  const aoMudarFiltro = (setter, valor) => {
      setter(valor);
      setPaginaAtual(1);
  };

  // --- FUNÇÃO QUE RECEBE OS DADOS DO MODAL (INTEGRAÇÃO) ---
  const receberNovaEntrega = (novaEntrega) => {
      // O 'novaEntrega' já vem pronto do Modal com itens e assinatura
      setEntregas((prev) => [novaEntrega, ...prev]);
      setPaginaAtual(1); // Volto pro inicio pra ver o que acabei de criar
      // Aqui eu poderia mandar salvar no Backend também
  };

  // --- GERADOR DE RELATÓRIO PDF ---
  const imprimirRelatorioGeral = () => {
    const periodo = dataInicio && dataFim 
        ? `Período: ${formatarData(dataInicio)} até ${formatarData(dataFim)}`
        : "Relatório Geral (Todo o Período)";

    const conteudoHTML = `
      <html>
        <head>
          <title>Relatório de Entregas</title>
          <style>
            body { font-family: sans-serif; padding: 20px; font-size: 12px; }
            h1 { text-align: center; margin-bottom: 5px; }
            p { text-align: center; color: #666; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th { background-color: #eee; text-align: left; padding: 8px; border: 1px solid #999; font-size: 11px; text-transform: uppercase;}
            td { padding: 8px; border: 1px solid #ccc; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .img-assinatura { max-height: 30px; display: block; }
            .total { font-weight: bold; text-align: right; padding-top: 10px; font-size: 14px; }
          </style>
        </head>
        <body>
          <h1>RELATÓRIO DE SAÍDA DE EPIs</h1>
          <p>${periodo}</p>
          
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Colaborador</th>
                <th>Itens Entregues</th>
                <th>Assinatura</th>
              </tr>
            </thead>
            <tbody>
              ${entregasFiltradas.map(ent => {
                const func = mockFuncionarios.find(f => f.id === ent.funcionario);
                const listaItens = ent.itens.map(i => {
                    return `${i.epiNome} (${i.tamanho}) - <b>${i.quantidade}un</b>`;
                }).join('<br/>');
                
                // Se tiver imagem de assinatura, eu mostro, senão mostro "Manual"
                const assinaturaHTML = ent.assinatura 
                    ? `<img src="${ent.assinatura}" class="img-assinatura" />` 
                    : "<span style='color:gray; font-style:italic'>Arquivo Manual</span>";

                return `
                  <tr>
                    <td style="white-space:nowrap">${formatarData(ent.dataEntrega)}</td>
                    <td>${func?.nome}<br/><small style="color:#666">${func?.matricula}</small></td>
                    <td>${listaItens}</td>
                    <td>${assinaturaHTML}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
          <div class="total">Total de Registros: ${entregasFiltradas.length}</div>
          <script>window.print();</script>
        </body>
      </html>
    `;

    const win = window.open('', '', 'width=900,height=600');
    win.document.write(conteudoHTML);
    win.document.close();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 animate-fade-in">

      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">📋 Histórico e Relatórios</h2>
          <p className="text-sm text-gray-500">Consulte, filtre e imprima relatórios de entrega.</p>
        </div>
        <button 
            onClick={() => setModalAberto(true)} 
            className="bg-blue-700 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-800 transition shadow-sm flex items-center gap-2"
        >
          <span>➕</span> Nova Entrega
        </button>
      </div>

      {/* --- ÁREA DE FILTROS --- */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
        <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Filtros do Relatório</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            
            {/* Filtro Nome */}
            <div className="md:col-span-2">
                <label className="text-xs text-gray-500 mb-1 block">Buscar Colaborador</label>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">🔍</span>
                    <input
                        type="text"
                        placeholder="Nome ou Matrícula..."
                        value={busca}
                        onChange={(e) => aoMudarFiltro(setBusca, e.target.value)}
                        className="w-full pl-9 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                </div>
            </div>

            {/* Filtro Data Inicio */}
            <div>
                <label className="text-xs text-gray-500 mb-1 block">De (Data Inicial)</label>
                <input
                    type="date"
                    value={dataInicio}
                    onChange={(e) => aoMudarFiltro(setDataInicio, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
            </div>

            {/* Filtro Data Fim */}
            <div>
                <label className="text-xs text-gray-500 mb-1 block">Até (Data Final)</label>
                <input
                    type="date"
                    value={dataFim}
                    onChange={(e) => aoMudarFiltro(setDataFim, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
            </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200">
            <span className="text-xs text-gray-500">
                Mostrando <b>{entregasFiltradas.length}</b> registros
            </span>
            
            <div className="flex gap-2">
                {(busca || dataInicio || dataFim) && (
                    <button 
                        onClick={() => { setBusca(""); setDataInicio(""); setDataFim(""); setPaginaAtual(1); }}
                        className="text-xs text-red-500 font-bold hover:underline px-3"
                    >
                        Limpar Filtros
                    </button>
                )}
                
                <button 
                    onClick={imprimirRelatorioGeral}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-purple-700 transition shadow-sm text-sm flex items-center gap-2"
                >
                    <span>🖨️</span> Gerar Relatório PDF
                </button>
            </div>
        </div>
      </div>

      {/* TABELA DE DADOS */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
            <tr>
              <th className="p-4 font-semibold">Data</th>
              <th className="p-4 font-semibold">Colaborador</th>
              <th className="p-4 font-semibold">Itens Entregues</th>
              <th className="p-4 font-semibold text-center">Assinatura</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {entregasVisiveis.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-500 italic">
                  Nenhum registro encontrado para os filtros selecionados.
                </td>
              </tr>
            ) : (
              entregasVisiveis.map((e) => {
                const func = mockFuncionarios.find(f => f.id === e.funcionario);
                return (
                  <tr key={e.id} className="hover:bg-gray-50 transition">
                    <td className="p-4 text-gray-600 font-mono text-sm whitespace-nowrap">
                      {formatarData(e.dataEntrega)}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-gray-800">{func?.nome || "Desconhecido"}</div>
                      <div className="text-xs text-gray-500">Mat: {func?.matricula || "--"}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {e.itens.map((i) => {
                          return (
                            <span key={i.id} className="bg-blue-50 text-blue-800 text-xs px-2 py-1 rounded border border-blue-100">
                              {i.epiNome} ({i.tamanho}) <b>x{i.quantidade}</b>
                            </span>
                          )
                        })}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                        {e.assinatura ? (
                            <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded border border-green-200">
                                Digital ✍️
                            </span>
                        ) : (
                            <span className="text-xs text-gray-400 font-bold bg-gray-50 px-2 py-1 rounded border border-gray-200">
                                Manual 📄
                            </span>
                        )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* MINHA PAGINAÇÃO */}
      {totalPaginas > 1 && (
        <div className="flex justify-between items-center mt-4 px-2">
            <button
                onClick={() => setPaginaAtual(prev => Math.max(prev - 1, 1))}
                disabled={paginaAtual === 1}
                className={`px-4 py-2 rounded text-sm font-bold border ${paginaAtual === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-700 hover:bg-blue-50 border-blue-200'}`}
            >
                ← Anterior
            </button>

            <span className="text-sm text-gray-600">
                Página <b className="text-gray-900">{paginaAtual}</b> de <b>{totalPaginas}</b>
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

      {/* AQUI EU CHAMO O MEU MODAL NOVO! */}
      {modalAberto && (
        <ModalEntrega 
            onClose={() => setModalAberto(false)} 
            onSalvar={receberNovaEntrega} 
        />
      )}

    </div>
  );
}

export default Entregas;