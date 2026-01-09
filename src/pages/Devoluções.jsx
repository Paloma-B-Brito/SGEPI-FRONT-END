import { useState } from "react";

// 1. DADOS MOCKADOS
const mockFuncionarios = [
  { id: 1, nome: "João Silva", setor: "Produção", matricula: "483920" },
  { id: 2, nome: "Maria Santos", setor: "Segurança", matricula: "739104" },
  { id: 3, nome: "Carlos Oliveira", setor: "Logística", matricula: "102938" },
];

const mockEpis = [
  { id: 1, nome: "Capacete de Segurança", tamanhos: ["P", "M", "G"] },
  { id: 2, nome: "Sapato de Segurança", tamanhos: ["38", "40", "42", "44"] },
  { id: 3, nome: "Luva de Proteção", tamanhos: ["P", "M", "G"] },
  { id: 4, nome: "Protetor Auricular", tamanhos: ["Único"] },
];

const mockMotivos = [
  "Desgaste Natural",
  "Dano / Quebra Acidental",
  "Vencimento do CA ou Validade",
  "Tamanho Inadequado",
  "Desligamento / Demissão",
  "Mudança de Setor",
];

const mockDevolucoesInicial = [
  {
    id: 101,
    funcionario: 1, // João
    epi: 1, // Capacete
    tamanho: "M",
    quantidade: 1,
    motivo: "Desgaste Natural",
    data: "2024-01-22",
    troca: {
      novoEpi: 1,
      novoTamanho: "M",
      novaQuantidade: 1
    }
  },
  {
    id: 102,
    funcionario: 2, // Maria
    epi: 3, // Luva
    tamanho: "P",
    quantidade: 1,
    motivo: "Desligamento / Demissão",
    data: "2024-01-25",
    troca: null // Apenas devolveu
  }
];

function Devolucoes() {
  const [devolucoes, setDevolucoes] = useState(mockDevolucoesInicial);
  const [modalAberto, setModalAberto] = useState(false);

  // States do Formulário - DEVOLUÇÃO
  const [formFuncionario, setFormFuncionario] = useState("");
  const [buscaFuncionario, setBuscaFuncionario] = useState(""); 
  const [formEpi, setFormEpi] = useState("");
  const [formTamanho, setFormTamanho] = useState("");
  const [formQuantidade, setFormQuantidade] = useState(1);
  const [formMotivo, setFormMotivo] = useState("");
  const [formData, setFormData] = useState("");
  
  // States do Formulário - TROCA
  const [houveTroca, setHouveTroca] = useState(false);
  const [novoEpi, setNovoEpi] = useState("");
  const [novoTamanho, setNovoTamanho] = useState("");
  const [novaQuantidade, setNovaQuantidade] = useState(1);

  // Helpers
  const formatarData = (data) => {
    if (!data) return "--";
    return new Date(data).toLocaleDateString("pt-BR", { timeZone: "UTC" });
  };

  const epiSelecionadoObj = mockEpis.find((e) => e.id === Number(formEpi));
  const novoEpiSelecionadoObj = mockEpis.find((e) => e.id === Number(novoEpi));

  // Lógica de Filtro
  const funcionariosFiltrados = mockFuncionarios.filter((f) => 
    f.nome.toLowerCase().includes(buscaFuncionario.toLowerCase()) ||
    f.matricula.includes(buscaFuncionario)
  );

  function abrirModal() {
    setFormFuncionario("");
    setBuscaFuncionario(""); 
    setFormEpi("");
    setFormTamanho("");
    setFormQuantidade(1);
    setFormMotivo("");
    setFormData(new Date().toISOString().split('T')[0]);
    
    // Reseta parte da troca
    setHouveTroca(false);
    setNovoEpi("");
    setNovoTamanho("");
    setNovaQuantidade(1);
    
    setModalAberto(true);
  }

  function salvarDevolucao() {
    if (!formFuncionario || !formEpi || !formMotivo || !formData) {
      alert("Preencha todos os campos obrigatórios da devolução.");
      return;
    }

    if (houveTroca && (!novoEpi || !novaQuantidade)) {
      alert("Se houve troca, selecione o novo EPI e a quantidade.");
      return;
    }

    const novaDevolucao = {
      id: Date.now(),
      funcionario: Number(formFuncionario),
      epi: Number(formEpi),
      tamanho: formTamanho || "Único",
      quantidade: Number(formQuantidade),
      motivo: formMotivo,
      data: formData,
      troca: houveTroca
        ? {
            novoEpi: Number(novoEpi),
            novoTamanho: novoTamanho || "Único",
            novaQuantidade: Number(novaQuantidade),
          }
        : null,
    };

    setDevolucoes((prev) => [novaDevolucao, ...prev]);
    setModalAberto(false);
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            🔄 Devoluções e Trocas
          </h2>
          <p className="text-sm text-gray-500">Registre devoluções por defeito, vencimento ou desligamento.</p>
        </div>

        <button
          onClick={abrirModal}
          className="bg-red-700 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-800 transition flex items-center gap-2 shadow-sm"
        >
          <span>➕</span> Registrar Devolução
        </button>
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
              <th className="p-4 font-semibold text-center">Houve Troca?</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {devolucoes.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">
                  Nenhuma devolução registrada.
                </td>
              </tr>
            ) : (
              devolucoes.map((d) => {
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
            
            {/* CABEÇALHO DO MODAL */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <span className="bg-red-50 p-1.5 rounded-lg text-red-700 border border-red-100">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </span>
                <h3 className="text-lg font-bold text-gray-800">Registrar Devolução</h3>
              </div>
              <button onClick={() => setModalAberto(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="p-6 space-y-6">
              
              {/* BLOCO 1: DADOS DA DEVOLUÇÃO */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* LISTA CUSTOMIZADA DE FUNCIONÁRIO */}
                <div className="md:col-span-2 flex flex-col gap-1">
                  <label className="block text-sm font-bold text-gray-700">Buscar Funcionário</label>
                  
                  {/* Input de Pesquisa */}
                  <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          🔍
                      </span>
                      <input 
                          type="text"
                          placeholder="Digite matrícula ou nome..."
                          className="w-full pl-9 p-2 border border-gray-300 rounded-t-lg focus:ring-2 focus:ring-red-500 outline-none text-sm bg-gray-50"
                          value={buscaFuncionario}
                          onChange={(e) => setBuscaFuncionario(e.target.value)}
                      />
                  </div>

                  {/* LISTA CUSTOMIZADA */}
                  <div className="w-full border border-gray-300 rounded-b-lg -mt-1 bg-white max-h-32 overflow-y-auto border-t-0">
                    {funcionariosFiltrados.length === 0 ? (
                        <div className="p-2 text-xs text-gray-400 text-center italic">Nenhum funcionário encontrado</div>
                    ) : (
                        funcionariosFiltrados.map((f) => {
                            const isSelected = Number(formFuncionario) === f.id;
                            return (
                                <div 
                                    key={f.id} 
                                    onClick={() => setFormFuncionario(f.id)}
                                    className={`
                                        p-2 text-sm cursor-pointer border-b border-gray-100 last:border-0 transition-colors
                                        ${isSelected 
                                            ? "bg-red-50 text-red-800 font-medium border-l-4 border-red-700" 
                                            : "text-gray-600 hover:bg-gray-50"
                                        }
                                    `}
                                >
                                    <span className="font-mono text-xs text-gray-400 mr-2">[{f.matricula}]</span>
                                    {f.nome} <span className="text-xs text-gray-400">- {f.setor}</span>
                                </div>
                            );
                        })
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">EPI Devolvido</label>
                  <select 
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                    value={formEpi}
                    onChange={(e) => {
                      setFormEpi(e.target.value);
                      setFormTamanho("");
                    }}
                  >
                    <option value="">Selecione...</option>
                    {mockEpis.map((e) => (
                      <option key={e.id} value={e.id}>{e.nome}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Tamanho</label>
                  <select 
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none bg-white disabled:bg-gray-100"
                    value={formTamanho}
                    onChange={(e) => setFormTamanho(e.target.value)}
                    disabled={!epiSelecionadoObj}
                  >
                    <option value="">-</option>
                    {epiSelecionadoObj?.tamanhos.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Quantidade</label>
                  <input 
                    type="number"
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                    value={formQuantidade}
                    onChange={(e) => setFormQuantidade(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Data</label>
                  <input 
                    type="date"
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                    value={formData}
                    onChange={(e) => setFormData(e.target.value)}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Motivo da Devolução</label>
                  <select 
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                    value={formMotivo}
                    onChange={(e) => setFormMotivo(e.target.value)}
                  >
                    <option value="">Selecione o motivo...</option>
                    {mockMotivos.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* DIVISÓRIA E CHECKBOX TROCA */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <input 
                  type="checkbox" 
                  id="checkTroca"
                  className="w-5 h-5 text-red-700 rounded focus:ring-red-600 border-gray-300"
                  checked={houveTroca}
                  onChange={(e) => setHouveTroca(e.target.checked)}
                />
                <label htmlFor="checkTroca" className="font-bold text-gray-800 cursor-pointer select-none">
                  Realizar troca imediata (Entregar novo EPI)
                </label>
              </div>

              {/* BLOCO 2: DADOS DA TROCA */}
              {houveTroca && (
                <div className="bg-gray-100 p-4 rounded-lg border border-gray-300 animate-fade-in">
                  <h4 className="text-gray-800 font-bold mb-3 text-sm flex items-center gap-2">
                    🔄 Dados do Novo EPI
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-600 mb-1">Novo Item</label>
                      <select 
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 outline-none text-sm"
                        value={novoEpi}
                        onChange={(e) => {
                          setNovoEpi(e.target.value);
                          setNovoTamanho("");
                        }}
                      >
                        <option value="">Igual ao anterior</option>
                        {mockEpis.map((e) => (
                          <option key={e.id} value={e.id}>{e.nome}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Tamanho</label>
                      <select 
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 outline-none text-sm bg-white"
                        value={novoTamanho}
                        onChange={(e) => setNovoTamanho(e.target.value)}
                        disabled={!novoEpiSelecionadoObj && !novoEpi}
                      >
                        <option value="">-</option>
                        {(novoEpiSelecionadoObj || epiSelecionadoObj)?.tamanhos.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Qtd.</label>
                      <input 
                        type="number"
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 outline-none text-sm"
                        value={novaQuantidade}
                        onChange={(e) => setNovaQuantidade(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* RODAPÉ */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 sticky bottom-0 border-t border-gray-200">
              <button onClick={() => setModalAberto(false)} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-200 rounded-lg transition">
                Cancelar
              </button>
              <button onClick={salvarDevolucao} className="px-6 py-2 bg-red-700 text-white font-bold rounded-lg hover:bg-red-800 shadow-md transition">
                Confirmar
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default Devolucoes;