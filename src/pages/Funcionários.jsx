import { useState, useEffect } from "react";

// mock de dados (enquanto o go não tem as tabelas de dept, cargo e funcionario)
const mockDepartamentos = [
  { id: 1, nome: "Produção", cor: "bg-blue-100 text-blue-700 border-blue-200" },
  { id: 2, nome: "Segurança do Trabalho", cor: "bg-green-100 text-green-700 border-green-200" },
  { id: 3, nome: "Administrativo / RH", cor: "bg-purple-100 text-purple-700 border-purple-200" },
  { id: 4, nome: "Logística", cor: "bg-orange-100 text-orange-700 border-orange-200" },
];

const mockFuncoes = [
  { id: 1, nome: "Operador de Máquinas", idDepartamento: 1 },
  { id: 2, nome: "Auxiliar de Produção", idDepartamento: 1 },
  { id: 3, nome: "Supervisor de Turno", idDepartamento: 1 },
  { id: 4, nome: "Técnico de Segurança", idDepartamento: 2 },
  { id: 5, nome: "Engenheiro de Segurança", idDepartamento: 2 },
  { id: 6, nome: "Analista de RH", idDepartamento: 3 },
  { id: 7, nome: "Auxiliar Administrativo", idDepartamento: 3 },
  { id: 8, nome: "Conferente", idDepartamento: 4 },
];

const mockFuncionariosInicial = [
  { id: 1, nome: "João Silva", matricula: "4839201", departamento: mockDepartamentos[0], funcao: mockFuncoes[0] },
  { id: 2, nome: "Maria Santos", matricula: "7391046", departamento: mockDepartamentos[1], funcao: mockFuncoes[3] },
];

// gerador automático de matrícula
function gerarMatricula() {
  return Math.floor(1000000 + Math.random() * 9000000).toString();
}

function Funcionarios() {
  // meus estados principais
  const [funcionarios, setFuncionarios] = useState(mockFuncionariosInicial);
  const [busca, setBusca] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 5;

  // estados do modal
  const [modalAberto, setModalAberto] = useState(false);
  const [funcSelecionado, setFuncSelecionado] = useState(null);
  const [formNome, setFormNome] = useState("");
  const [formDepartamento, setFormDepartamento] = useState("");
  const [formFuncao, setFormFuncao] = useState("");
  const [carregando, setCarregando] = useState(false);

  // puxar do banco de dados (preparado para a rota futura)
  const carregarFuncionarios = async () => {
    try {
      // TODO: alterar a url quando o backend de funcionarios existir
      const resposta = await fetch("http://localhost:8080/api/funcionarios");
      if (resposta.ok) {
        const dados = await resposta.json();
        setFuncionarios(dados);
      }
    } catch (erro) {
      console.log("Backend não tem funcionários ainda. A usar dados falsos (mock).");
    }
  };

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  // lógica de filtro e paginação da tabela
  const listaFiltrada = funcionarios.filter((f) =>
    f.nome.toLowerCase().includes(busca.toLowerCase()) || f.matricula.includes(busca)
  );
  const funcionariosOrdenados = listaFiltrada.sort((a, b) => a.nome.localeCompare(b.nome));
  const indexUltimoItem = paginaAtual * itensPorPagina;
  const indexPrimeiroItem = indexUltimoItem - itensPorPagina;
  const funcionariosVisiveis = funcionariosOrdenados.slice(indexPrimeiroItem, indexUltimoItem);
  const totalPaginas = Math.ceil(funcionariosOrdenados.length / itensPorPagina);

  // filtro dinâmico de funções (só mostra os cargos do departamento escolhido)
  const funcoesDisponiveis = mockFuncoes.filter((f) => f.idDepartamento === Number(formDepartamento));

  // relatório de impressão 
  const imprimirListaColaboradores = () => {
    const dataEmissao = new Date().toLocaleDateString('pt-BR');
    const totalColaboradores = funcionariosOrdenados.length;
    const conteudoHTML = `
      <html>
        <head>
          <title>Relatório de Colaboradores</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #333; -webkit-print-color-adjust: exact; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #1e40af; padding-bottom: 20px; margin-bottom: 30px; }
            .header-info h1 { margin: 0; color: #1e40af; font-size: 24px; text-transform: uppercase; letter-spacing: -0.5px; }
            .header-info p { margin: 5px 0 0; color: #64748b; font-size: 14px; }
            .meta-box { text-align: right; font-size: 12px; color: #475569; }
            .meta-box strong { display: block; font-size: 18px; color: #1e40af; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 13px; }
            th { background-color: #f1f5f9; color: #334155; text-align: left; padding: 12px 16px; border-bottom: 2px solid #cbd5e1; font-weight: 700; text-transform: uppercase; font-size: 11px; }
            td { padding: 12px 16px; border-bottom: 1px solid #e2e8f0; vertical-align: middle; }
            tr:nth-child(even) { background-color: #f8fafc; }
            .matricula { font-family: 'Courier New', monospace; font-weight: bold; color: #475569; }
            .nome { font-weight: 600; color: #0f172a; }
            .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 10px; font-weight: 700; text-transform: uppercase; background-color: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }
            .footer { margin-top: 50px; display: flex; justify-content: space-between; page-break-inside: avoid; }
            .assinatura-box { width: 40%; border-top: 1px solid #94a3b8; padding-top: 10px; text-align: center; font-size: 12px; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="header-info"><h1>Quadro de Colaboradores</h1><p>Relatório de Pessoal Ativo - SGEPI</p></div>
            <div class="meta-box">Emissão: ${dataEmissao}<br>Total: <strong>${totalColaboradores}</strong></div>
          </div>
          <table>
            <thead><tr><th style="width: 15%">Matrícula</th><th style="width: 35%">Nome</th><th style="width: 25%">Departamento</th><th style="width: 25%">Função</th></tr></thead>
            <tbody>
              ${funcionariosOrdenados.map(f => `<tr><td class="matricula">${f.matricula}</td><td class="nome">${f.nome}</td><td><span class="badge">${f.departamento.nome}</span></td><td>${f.funcao.nome}</td></tr>`).join('')}
            </tbody>
          </table>
          <div class="footer"><div class="assinatura-box">Gerente de Recursos Humanos</div><div class="assinatura-box">Responsável pelo Setor</div></div>
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `;
    const win = window.open('', '', 'width=900,height=600');
    win.document.write(conteudoHTML);
    win.document.close();
  };

  // ações do modal
  const abrirNovo = () => {
    setFuncSelecionado(null);
    setFormNome("");
    setFormDepartamento("");
    setFormFuncao("");
    setModalAberto(true);
  };

  const abrirEdicao = (func) => {
    setFuncSelecionado(func);
    setFormNome(func.nome);
    setFormDepartamento(func.departamento.id);
    setFormFuncao(func.funcao.id);
    setModalAberto(true);
  };

  // salvar no banco de dados (rota preparada)
  const salvarFuncionario = async () => {
    if (!formNome || !formDepartamento || !formFuncao) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    setCarregando(true);
    const depObj = mockDepartamentos.find((d) => d.id === Number(formDepartamento));
    const funcObj = mockFuncoes.find((f) => f.id === Number(formFuncao));
    
    // estrutura que o backend provavelmente vai esperar
    const pacoteDados = {
      nome: formNome,
      departamento_id: Number(formDepartamento),
      funcao_id: Number(formFuncao)
    };

    try {
      // TODO: ativar este fetch quando o Go tiver a rota de POST /api/funcionario
      /*
      const metodo = funcSelecionado ? "PUT" : "POST";
      const url = funcSelecionado ? `http://localhost:8080/api/funcionario/${funcSelecionado.id}` : "http://localhost:8080/api/funcionario";
      
      const resposta = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pacoteDados)
      });
      if (!resposta.ok) throw new Error("Erro no backend");
      */

      // simulação local enquanto não há backend:
      if (funcSelecionado) {
        setFuncionarios((prev) => prev.map((f) => f.id === funcSelecionado.id ? { ...f, nome: formNome, departamento: depObj, funcao: funcObj } : f));
      } else {
        const novoFunc = { id: Date.now(), nome: formNome, matricula: gerarMatricula(), departamento: depObj, funcao: funcObj };
        setFuncionarios((prev) => [...prev, novoFunc]);
      }
      setModalAberto(false);
    } catch (erro) {
      alert("Erro ao guardar. Verifica a conexão com o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  const excluirFuncionario = (id) => {
    if (window.confirm("Tens a certeza que desejas excluir este funcionário?")) {
      // TODO: adicionar fetch DELETE quando o backend estiver pronto
      setFuncionarios((prev) => prev.filter((f) => f.id !== id));
    }
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-gray-100 animate-fade-in max-w-full">
      
      {/* cabeçalho da página */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-800 flex items-center gap-2">👥 Colaboradores</h2>
          <p className="text-sm text-gray-500">Gerencie a equipe e suas atribuições.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
            <button onClick={imprimirListaColaboradores} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-200 transition shadow-sm border border-gray-300 flex items-center gap-2 justify-center w-full sm:w-auto">
                <span>🖨️</span> Imprimir
            </button>
            <button onClick={abrirNovo} className="bg-blue-700 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-800 transition flex items-center gap-2 shadow-sm justify-center w-full sm:w-auto">
                <span>➕</span> Cadastrar
            </button>
        </div>
      </div>

      {/* barra de busca */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Buscar por nome ou matrícula..."
            value={busca}
            onChange={(e) => { setBusca(e.target.value); setPaginaAtual(1); }}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-sm lg:text-base"
          />
        </div>
      </div>

      {/* tabela de funcionários no desktop */}
      <div className="hidden lg:block overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
            <tr>
              <th className="p-4 font-semibold">Matrícula</th>
              <th className="p-4 font-semibold">Nome</th>
              <th className="p-4 font-semibold">Departamento</th>
              <th className="p-4 font-semibold">Função</th>
              <th className="p-4 font-semibold text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {funcionariosVisiveis.length > 0 ? (
              funcionariosVisiveis.map((func) => (
                <tr key={func.id} className="hover:bg-gray-50 transition">
                  <td className="p-4 font-mono text-gray-600">{func.matricula}</td>
                  <td className="p-4 font-medium text-gray-800">{func.nome}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold border ${func.departamento.cor}`}>{func.departamento.nome}</span>
                  </td>
                  <td className="p-4 text-gray-600">{func.funcao.nome}</td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-4">
                      <button onClick={() => abrirEdicao(func)} className="text-blue-600 hover:text-blue-800 font-medium text-sm transition">✏️ Editar</button>
                      <button onClick={() => excluirFuncionario(func.id)} className="text-red-500 hover:text-red-700 font-medium text-sm transition">🗑️ Excluir</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="p-8 text-center text-gray-500">Nenhum funcionário encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* cards no mobile */}
      <div className="lg:hidden space-y-4">
        {funcionariosVisiveis.length > 0 ? (
          funcionariosVisiveis.map((func) => (
            <div key={func.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm relative">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="font-bold text-gray-800 text-lg">{func.nome}</h3>
                        <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">Mat: {func.matricula}</span>
                    </div>
                </div>
                <div className="space-y-2 mt-3">
                    <div><span className={`inline-block px-2 py-1 rounded text-[10px] font-bold border ${func.departamento.cor}`}>{func.departamento.nome}</span></div>
                    <div className="text-sm text-gray-600 flex items-center gap-1"><span className="font-semibold text-gray-400 text-xs uppercase">Cargo:</span>{func.funcao.nome}</div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-gray-100">
                    <button onClick={() => abrirEdicao(func)} className="flex items-center justify-center gap-2 py-2 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm font-bold">✏️ Editar</button>
                    <button onClick={() => excluirFuncionario(func.id)} className="flex items-center justify-center gap-2 py-2 text-red-700 bg-red-50 hover:bg-red-100 rounded-lg text-sm font-bold">🗑️ Excluir</button>
                </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">Nenhum funcionário encontrado.</div>
        )}
      </div>

      {/* paginação */}
      {totalPaginas > 1 && (
        <div className="flex justify-between items-center mt-6 px-1">
            <button onClick={() => setPaginaAtual(prev => Math.max(prev - 1, 1))} disabled={paginaAtual === 1} className={`px-4 py-2 rounded text-sm font-bold border ${paginaAtual === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-blue-700 border-blue-200'}`}>← Anterior</button>
            <span className="text-xs lg:text-sm text-gray-600">Pág. <b className="text-gray-900">{paginaAtual}</b> de <b>{totalPaginas}</b></span>
            <button onClick={() => setPaginaAtual(prev => Math.min(prev + 1, totalPaginas))} disabled={paginaAtual === totalPaginas} className={`px-4 py-2 rounded text-sm font-bold border ${paginaAtual === totalPaginas ? 'bg-gray-100 text-gray-400' : 'bg-white text-blue-700 border-blue-200'}`}>Próxima →</button>
        </div>
      )}

      {/* modal de cadastro/edição */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center shrink-0">
              <h3 className="text-lg font-bold text-gray-800">{funcSelecionado ? "✏️ Editar Colaborador" : "➕ Novo Colaborador"}</h3>
              <button onClick={() => setModalAberto(false)} className="text-gray-400 hover:text-gray-600 font-bold text-xl">✕</button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                <input className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: João da Silva" value={formNome} onChange={(e) => setFormNome(e.target.value)} />
              </div>

              {funcSelecionado && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Matrícula</label>
                  <input className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed" value={funcSelecionado.matricula} disabled />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                <select className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" value={formDepartamento} onChange={(e) => { setFormDepartamento(e.target.value); setFormFuncao(""); }}>
                  <option value="">Selecione...</option>
                  {mockDepartamentos.map((d) => <option key={d.id} value={d.id}>{d.nome}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Função / Cargo</label>
                <select className={`w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white ${!formDepartamento ? 'bg-gray-50 cursor-not-allowed' : ''}`} value={formFuncao} onChange={(e) => setFormFuncao(e.target.value)} disabled={!formDepartamento}>
                  <option value="">{!formDepartamento ? "Selecione o departamento primeiro" : "Selecione a função"}</option>
                  {funcoesDisponiveis.map((f) => <option key={f.id} value={f.id}>{f.nome}</option>)}
                </select>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 shrink-0 border-t">
              <button onClick={() => setModalAberto(false)} disabled={carregando} className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition">Cancelar</button>
              <button onClick={salvarFuncionario} disabled={carregando} className={`px-4 py-2 text-white font-bold rounded-lg shadow-md transition ${carregando ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}>
                {carregando ? "A guardar..." : "Salvar Dados"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Funcionarios;