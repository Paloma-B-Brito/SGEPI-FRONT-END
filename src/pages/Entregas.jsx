import { useState } from "react";

// 1. DADOS MOCKADOS 
const mockFuncionarios = [
  { id: 1, nome: "João Silva", setor: "Produção", matricula: "483920" },
  { id: 2, nome: "Maria Santos", setor: "Segurança", matricula: "739104" },
  { id: 3, nome: "Carlos Oliveira", setor: "Manutenção", matricula: "102938" },
];

const mockEpis = [
  { id: 1, nome: "Capacete de Segurança", tamanhos: ["P", "M", "G"] },
  { id: 2, nome: "Luva de Raspa", tamanhos: ["P", "M", "G", "GG"] },
  { id: 3, nome: "Sapato de Segurança", tamanhos: ["38", "40", "42", "44"] },
  { id: 4, nome: "Óculos de Proteção", tamanhos: ["Único"] },
];

const mockEntregasInicial = [
  {
    id: 101,
    funcionario: 1, // João
    dataEntrega: "2024-01-20",
    assinatura: "Assinado digitalmente via Tablet",
    itens: [
      { id: "abc-1", epi: 1, tamanho: "M", quantidade: 1 },
      { id: "abc-2", epi: 2, tamanho: "G", quantidade: 2 },
    ]
  }
];

function Entregas() {
  const [entregas, setEntregas] = useState(mockEntregasInicial);
  const [modalAberto, setModalAberto] = useState(false);

  // 2. STATE PARA A BARRA DE BUSCA
  const [busca, setBusca] = useState("");

  // States do Modal 
  const [funcionario, setFuncionario] = useState("");
  const [dataEntrega, setDataEntrega] = useState("");
  const [assinatura, setAssinatura] = useState("");
  const [itens, setItens] = useState([]);
  const [epi, setEpi] = useState("");
  const [tamanho, setTamanho] = useState("");
  const [quantidade, setQuantidade] = useState(1);

  // Helpers
  const formatarData = (data) => {
    if (!data) return "--";
    return new Date(data).toLocaleDateString("pt-BR", { timeZone: "UTC" });
  };

  // 3. LÓGICA DE FILTRO (NOME OU MATRÍCULA)
  const entregasFiltradas = entregas.filter((entrega) => {
    // Encontra o funcionário dono desta entrega
    const func = mockFuncionarios.find(f => f.id === entrega.funcionario);

    // Se por algum motivo o funcionário não existir nos dados, não mostra
    if (!func) return false;

    const termo = busca.toLowerCase();

    // Verifica se o termo digitado está no Nome OU na Matrícula
    return (
      func.nome.toLowerCase().includes(termo) ||
      func.matricula.includes(termo)
    );
  });

  // --- Funções do Modal  ---
  function abrirModal() {
    setFuncionario("");
    setDataEntrega(new Date().toISOString().split('T')[0]);
    setAssinatura("");
    setItens([]);
    setEpi("");
    setTamanho("");
    setQuantidade(1);
    setModalAberto(true);
  }

  function adicionarItem() {
    if (!epi || !quantidade) { alert("Selecione um EPI e a quantidade."); return; }
    const epiObj = mockEpis.find(e => e.id === Number(epi));
    if (epiObj?.tamanhos.length > 0 && !tamanho) { alert("Selecione o tamanho."); return; }

    setItens((prev) => [...prev, {
      id: crypto.randomUUID(),
      epi: Number(epi),
      tamanho: tamanho || "Único",
      quantidade: Number(quantidade),
    }]);
    setEpi(""); setTamanho(""); setQuantidade(1);
  }

  function removerItem(id) {
    setItens((prev) => prev.filter((i) => i.id !== id));
  }

  function salvarEntrega() {
    if (!funcionario || !dataEntrega || itens.length === 0) {
      alert("Preencha o funcionário e adicione itens.");
      return;
    }
    const novaEntrega = {
      id: Date.now(),
      funcionario: Number(funcionario),
      dataEntrega,
      assinatura: assinatura || "Manual",
      itens,
    };
    setEntregas((prev) => [novaEntrega, ...prev]);
    setModalAberto(false);
  }

  const epiSelecionadoObj = mockEpis.find((e) => e.id === Number(epi));

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">

      {/* CABEÇALHO DA PÁGINA */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            📋 Histórico de Entregas
          </h2>
          <p className="text-sm text-gray-500">Registre a saída de materiais para os colaboradores.</p>
        </div>

        <button
          onClick={abrirModal}
          className="bg-blue-700 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-800 transition flex items-center gap-2 shadow-sm"
        >
          <span>➕</span> Nova Entrega
        </button>
      </div>

      {/* 4. BARRA DE BUSCA */}
      <div className="relative mb-6">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
          🔍
        </span>
        <input
          type="text"
          placeholder="Buscar por nome ou matrícula (Ex: 483920)..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
        />
      </div>

      {/* TABELA DE ENTREGAS REALIZADAS */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
            <tr>
              <th className="p-4 font-semibold">Data</th>
              <th className="p-4 font-semibold">Colaborador</th>
              <th className="p-4 font-semibold">Itens Entregues</th>
              <th className="p-4 font-semibold text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {entregasFiltradas.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-500">
                  {busca ? "Nenhuma entrega encontrada para essa busca." : "Nenhuma entrega registrada."}
                </td>
              </tr>
            ) : (
              entregasFiltradas.map((e) => {
                const func = mockFuncionarios.find(f => f.id === e.funcionario);
                const funcNome = func ? func.nome : "Desconhecido";
                // Mostra a matrícula abaixo do nome
                const funcMatricula = func ? func.matricula : "---";

                return (
                  <tr key={e.id} className="hover:bg-gray-50 transition">
                    <td className="p-4 text-gray-600 font-mono text-sm">
                      {formatarData(e.dataEntrega)}
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-800">{funcNome}</div>
                      <div className="text-xs text-gray-500">Mat: {funcMatricula}</div>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {e.itens.map((i) => {
                          const epiNome = mockEpis.find(ep => ep.id === i.epi)?.nome;
                          return (
                            <span key={i.id} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded border border-blue-100">
                              {epiNome} ({i.tamanho}) <span className="font-bold">x{i.quantidade}</span>
                            </span>
                          )
                        })}
                      </div>
                    </td>

                    <td className="p-4 text-center">
                      <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        CONCLUÍDO
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in">

            <div className="bg-blue-50 px-6 py-4 border-b border-blue-100 flex justify-between items-center sticky top-0">
              <h3 className="text-lg font-bold text-blue-800">👷 Nova Entrega</h3>
              <button onClick={() => setModalAberto(false)} className="text-blue-400 hover:text-blue-600">✕</button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Colaborador</label>
                  <select
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={funcionario}
                    onChange={(e) => setFuncionario(e.target.value)}
                  >
                    <option value="">Selecione...</option>
                    {mockFuncionarios.map((f) => (
                      <option key={f.id} value={f.id}>{f.nome} (Mat: {f.matricula})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                  <input type="date" className="w-full p-2.5 border" value={dataEntrega} onChange={(e) => setDataEntrega(e.target.value)} />
                </div>
              </div>

              <hr className="border-gray-100" />

              <div className="bg-gray-50 p-4 rounded-lg border">
                <h4 className="text-sm font-bold text-gray-700 mb-3">🛠️ Adicionar Itens</h4>
                <div className="flex flex-col md:flex-row gap-3 items-end">
                  <div className="flex-1 w-full">
                    <label className="text-xs mb-1 block">EPI</label>
                    <select className="w-full p-2 border rounded text-sm" value={epi} onChange={(e) => { setEpi(e.target.value); setTamanho(""); }}>
                      <option value="">Selecione...</option>
                      {mockEpis.map((e) => (<option key={e.id} value={e.id}>{e.nome}</option>))}
                    </select>
                  </div>
                  <div className="w-full md:w-24">
                    <label className="text-xs mb-1 block">Tam.</label>
                    <select className="w-full p-2 border rounded text-sm" value={tamanho} onChange={(e) => setTamanho(e.target.value)} disabled={!epiSelecionadoObj}>
                      <option value="">-</option>
                      {epiSelecionadoObj?.tamanhos.map((t) => (<option key={t}>{t}</option>))}
                    </select>
                  </div>
                  <div className="w-full md:w-20">
                    <label className="text-xs mb-1 block">Qtd.</label>
                    <input type="number" min="1" className="w-full p-2 border rounded text-sm" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />
                  </div>
                  <button onClick={adicionarItem} className="px-4 py-2 bg-blue-700 text-white font-bold rounded text-sm">+ Add</button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Itens ({itens.length})</label>
                {itens.length > 0 && (
                  <ul className="border rounded divide-y">
                    {itens.map((i) => (
                      <li key={i.id} className="p-2 flex justify-between items-center text-sm">
                        <span>{mockEpis.find(e => e.id === i.epi)?.nome} ({i.tamanho}) - <b>{i.quantidade} un</b></span>
                        <button onClick={() => removerItem(i.id)} className="text-red-500 font-bold">Remover</button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t sticky bottom-0">
                <button onClick={() => setModalAberto(false)} className="px-4 py-2 bg-gray-200 rounded text-gray-700">Cancelar</button>
                <button onClick={salvarEntrega} className="px-6 py-2 bg-blue-700 text-white rounded font-bold">Salvar Entrega</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Entregas;