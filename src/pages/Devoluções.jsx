import { useState } from "react";
import ModalBaixa from "../components/modals/ModalBaixa";

const mockFuncionarios = [
  { id: 1, nome: "João Silva", setor: "Produção", matricula: "483920" },
  { id: 2, nome: "Maria Santos", setor: "Segurança", matricula: "739104" },
  { id: 3, nome: "Carlos Oliveira", setor: "Logística", matricula: "102938" },
  { id: 4, nome: "Ana Pereira", setor: "RH", matricula: "554433" },
];

const mockEpis = [
  { id: 1, nome: "Capacete de Segurança", tamanhos: ["P", "M", "G"] },
  { id: 2, nome: "Sapato de Segurança", tamanhos: ["38", "40", "42", "44"] },
  { id: 3, nome: "Luva de Proteção", tamanhos: ["P", "M", "G"] },
  { id: 4, nome: "Protetor Auricular", tamanhos: ["Único"] },
];

const mockDevolucoesInicial = [
  { id: 101, funcionario: 1, epi: 1, tamanho: "M", quantidade: 1, motivo: "Desgaste Natural", data: "2024-01-22", assinatura: null, troca: { novoEpi: 1, novoTamanho: "M", novaQuantidade: 1 } },
  { id: 102, funcionario: 2, epi: 3, tamanho: "P", quantidade: 1, motivo: "Desligamento / Demissão", data: "2024-01-25", assinatura: null, troca: null },
  { id: 103, funcionario: 3, epi: 2, tamanho: "42", quantidade: 1, motivo: "Dano / Quebra Acidental", data: "2024-02-10", assinatura: null, troca: { novoEpi: 2, novoTamanho: "42", novaQuantidade: 1 } },
];

function Devolucoes() {
  const [devolucoes, setDevolucoes] = useState(mockDevolucoesInicial);
  const [modalAberto, setModalAberto] = useState(false);
  const [busca, setBusca] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 5;
  const formatarData = (data) => {
    if (!data) return "--";
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  // --- LÓGICA DE FILTRO E PAGINAÇÃO ---
  const devolucoesFiltradas = devolucoes.filter((d) => {
    const func = mockFuncionarios.find(f => f.id === d.funcionario);
    const termo = busca.toLowerCase();
    
    const matchFuncionario = func?.nome.toLowerCase().includes(termo) || func?.matricula.includes(termo);
    const matchMotivo = d.motivo.toLowerCase().includes(termo);
    
    return matchFuncionario || matchMotivo;
  });

  const indexUltimoItem = paginaAtual * itensPorPagina;
  const indexPrimeiroItem = indexUltimoItem - itensPorPagina;
  const devolucoesVisiveis = devolucoesFiltradas.slice(indexPrimeiroItem, indexUltimoItem);
  const totalPaginas = Math.ceil(devolucoesFiltradas.length / itensPorPagina);

  const imprimirRelatorioDevolucoes = () => {
    const conteudo = `
      <html>
        <head>
          <title>Relatório de Devoluções de EPI</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #b91c1c; padding-bottom: 20px; margin-bottom: 30px; }
            .header h1 { margin: 0; color: #b91c1c; font-size: 24px; text-transform: uppercase; }
            .header .meta { text-align: right; font-size: 12px; color: #666; }
            
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { background-color: #f3f4f6; color: #1f2937; text-align: left; padding: 12px; border-bottom: 2px solid #e5e7eb; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
            td { padding: 12px; border-bottom: 1px solid #e5e7eb; font-size: 13px; vertical-align: middle; }
            tr:nth-child(even) { background-color: #f9fafb; }
            
            .badge { padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 11px; }
            .badge-sim { background-color: #dcfce7; color: #166534; }
            .badge-nao { background-color: #f3f4f6; color: #4b5563; }
            
            .footer { margin-top: 50px; display: flex; justify-content: space-between; page-break-inside: avoid; }
            .assinatura-box { width: 45%; text-align: center; border-top: 1px solid #000; padding-top: 10px; font-size: 12px; margin-top: 40px; }
            
            @media print {
              .no-print { display: none; }
              body { -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1>Relatório de Devoluções</h1>
              <p style="margin: 5px 0 0; font-size: 14px;">Controle de Estoque e Segurança do Trabalho</p>
            </div>
            <div class="meta">
              <p>Data de Emissão: ${new Date().toLocaleDateString('pt-BR')}</p>
              <p>Total de Registros: ${devolucoesFiltradas.length}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Colaborador</th>
                <th>Item Devolvido</th>
                <th>Motivo</th>
                <th>Houve Troca?</th>
              </tr>
            </thead>
            <tbody>
              ${devolucoesFiltradas.map(d => {
                const func = mockFuncionarios.find(f => f.id === d.funcionario);
                const epi = mockEpis.find(e => e.id === d.epi);
                const trocaClass = d.troca ? 'badge-sim' : 'badge-nao';
                const trocaTexto = d.troca ? 'SIM' : 'NÃO';
                
                return `
                  <tr>
                    <td>${formatarData(d.data)}</td>
                    <td><b>${func?.nome}</b><br/><span style="color:#666; font-size:11px;">Mat: ${func?.matricula}</span></td>
                    <td>${epi?.nome} (${d.tamanho}) - <b>${d.quantidade} un</b></td>
                    <td>${d.motivo}</td>
                    <td><span class="badge ${trocaClass}">${trocaTexto}</span></td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>

          <div class="footer">
            <div class="assinatura-box">
              Responsável pelo Almoxarifado
            </div>
            <div class="assinatura-box">
              Técnico de Segurança do Trabalho
            </div>
          </div>
          
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;

    const win = window.open('', '', 'width=900,height=600');
    win.document.write(conteudo);
    win.document.close();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 animate-fade-in">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            🔄 Devoluções e Trocas
          </h2>
          <p className="text-sm text-gray-500">Registre devoluções por defeito, vencimento ou desligamento.</p>
        </div>

        <div className="flex gap-2">
            <button 
                onClick={imprimirRelatorioDevolucoes}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-200 transition shadow-sm border border-gray-300 flex items-center gap-2"
            >
                <span>🖨️</span> Relatório
            </button>
            <button
                onClick={() => setModalAberto(true)}
                className="bg-red-700 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-800 transition flex items-center gap-2 shadow-sm"
            >
                <span>➕</span> Registrar Devolução
            </button>
        </div>
      </div>

      {/* BARRA DE BUSCA */}
      <div className="relative mb-6">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">🔍</span>
        <input
          type="text"
          placeholder="Buscar por funcionário ou motivo..."
          value={busca}
          onChange={(e) => {
              setBusca(e.target.value);
              setPaginaAtual(1);
          }}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition"
        />
      </div>

      {/* TABELA */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
            <tr>
              <th className="p-4 font-semibold">Data</th>
              <th className="p-4 font-semibold">Funcionário</th>
              <th className="p-4 font-semibold">Item Devolvido</th>
              <th className="p-4 font-semibold">Motivo</th>
              <th className="p-4 font-semibold text-center">Troca?</th>
              <th className="p-4 font-semibold text-center">Assinatura</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {devolucoesVisiveis.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500">
                  Nenhuma devolução encontrada.
                </td>
              </tr>
            ) : (
              devolucoesVisiveis.map((d) => {
                const func = mockFuncionarios.find(f => f.id === d.funcionario);
                const funcNome = func ? func.nome : "Desconhecido";
                const epiNome = mockEpis.find(e => e.id === d.epi)?.nome;
                
                return (
                  <tr key={d.id} className="hover:bg-gray-50 transition">
                    <td className="p-4 text-gray-600 font-mono text-sm">{formatarData(d.data)}</td>
                    <td className="p-4 font-medium text-gray-800">
                        {funcNome}
                        {func && <span className="block text-xs text-gray-400">Mat: {func.matricula}</span>}
                    </td>
                    <td className="p-4 text-gray-700">
                      {epiNome} <span className="text-gray-400 text-xs">({d.tamanho})</span>
                    </td>
                    <td className="p-4 text-sm">
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded border border-gray-200 text-xs font-semibold">
                        {d.motivo}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {d.troca ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold border border-green-200">
                          ✅ SIM
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-bold border border-gray-200">
                          ❌ NÃO
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                        {d.assinatura ? (
                            <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded border border-green-200" title="Assinado Digitalmente">
                                ✍️ OK
                            </span>
                        ) : (
                            <span className="text-xs text-gray-400">-</span>
                        )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* BARRA DE PAGINAÇÃO */}
      {totalPaginas > 1 && (
        <div className="flex justify-between items-center mt-4 px-2">
            <button
                onClick={() => setPaginaAtual(prev => Math.max(prev - 1, 1))}
                disabled={paginaAtual === 1}
                className={`px-4 py-2 rounded text-sm font-bold border ${paginaAtual === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-red-700 hover:bg-red-50 border-red-200'}`}
            >
                ← Anterior
            </button>

            <span className="text-sm text-gray-600">
                Página <b className="text-gray-900">{paginaAtual}</b> de <b>{totalPaginas}</b>
            </span>

            <button
                onClick={() => setPaginaAtual(prev => Math.min(prev + 1, totalPaginas))}
                disabled={paginaAtual === totalPaginas}
                className={`px-4 py-2 rounded text-sm font-bold border ${paginaAtual === totalPaginas ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-red-700 hover:bg-red-50 border-red-200'}`}
            >
                Próxima →
            </button>
        </div>
      )}

      {modalAberto && (
        <ModalBaixa 
            onClose={() => setModalAberto(false)} 
        />
      )}

    </div>
  );
}

export default Devolucoes;