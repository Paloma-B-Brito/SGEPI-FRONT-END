import { useState } from "react";

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
  { id: 3, nome: "Carlos Ferreira", matricula: "1029384", departamento: mockDepartamentos[2], funcao: mockFuncoes[5] },
  { id: 4, nome: "Ana Paula", matricula: "5544332", departamento: mockDepartamentos[3], funcao: mockFuncoes[7] },
  { id: 5, nome: "Roberto Costa", matricula: "9988776", departamento: mockDepartamentos[0], funcao: mockFuncoes[1] },
  { id: 6, nome: "Fernanda Lima", matricula: "1122334", departamento: mockDepartamentos[2], funcao: mockFuncoes[6] },
];

// Funçãozinha para gerar matrícula aleatória
function gerarMatricula() {
  return Math.floor(1000000 + Math.random() * 9000000).toString();
}

function Funcionarios() {
  const [funcionarios, setFuncionarios] = useState(mockFuncionariosInicial);
  const [busca, setBusca] = useState("");
  
  // Meus estados para paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 5; // Vou mostrar 5 por vez

  // States do Modal
  const [modalAberto, setModalAberto] = useState(false);
  const [funcSelecionado, setFuncSelecionado] = useState(null);

  // States do Formulário
  const [formNome, setFormNome] = useState("");
  const [formDepartamento, setFormDepartamento] = useState("");
  const [formFuncao, setFormFuncao] = useState("");

  // --- LÓGICA DE FILTRO E PAGINAÇÃO ---
  
  // Primeiro filtro a lista toda
  const funcionariosFiltrados = funcionarios.filter((f) =>
    f.nome.toLowerCase().includes(busca.toLowerCase()) ||
    f.matricula.includes(busca)
  );

  // Depois calculo quais itens aparecem na página atual
  const indexUltimoItem = paginaAtual * itensPorPagina;
  const indexPrimeiroItem = indexUltimoItem - itensPorPagina;
  const funcionariosVisiveis = funcionariosFiltrados.slice(indexPrimeiroItem, indexUltimoItem);

  const totalPaginas = Math.ceil(funcionariosFiltrados.length / itensPorPagina);

  // Filtra as funções baseado no departamento selecionado no Select
  const funcoesDisponiveis = mockFuncoes.filter(
    (f) => f.idDepartamento === Number(formDepartamento)
  );

  // --- FUNÇÕES DO SISTEMA ---

  const imprimirListaColaboradores = () => {
    const dataEmissao = new Date().toLocaleDateString('pt-BR');
    const totalColaboradores = funcionariosFiltrados.length;

    const conteudoHTML = `
      <html>
        <head>
          <title>Relatório de Colaboradores</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
            
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #333; -webkit-print-color-adjust: exact; }
            
            /* Cabeçalho */
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #1e40af; padding-bottom: 20px; margin-bottom: 30px; }
            .header-info h1 { margin: 0; color: #1e40af; font-size: 24px; text-transform: uppercase; letter-spacing: -0.5px; }
            .header-info p { margin: 5px 0 0; color: #64748b; font-size: 14px; }
            .meta-box { text-align: right; font-size: 12px; color: #475569; }
            .meta-box strong { display: block; font-size: 18px; color: #1e40af; }

            /* Tabela */
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 13px; }
            th { background-color: #f1f5f9; color: #334155; text-align: left; padding: 12px 16px; border-bottom: 2px solid #cbd5e1; font-weight: 700; text-transform: uppercase; font-size: 11px; }
            td { padding: 12px 16px; border-bottom: 1px solid #e2e8f0; vertical-align: middle; }
            tr:nth-child(even) { background-color: #f8fafc; } /* Zebrado */
            
            /* Estilos Específicos */
            .matricula { font-family: 'Courier New', monospace; font-weight: bold; color: #475569; }
            .nome { font-weight: 600; color: #0f172a; }
            
            /* Badge de Departamento */
            .badge { 
              display: inline-block; padding: 4px 8px; border-radius: 4px; 
              font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;
              background-color: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd;
            }

            /* Rodapé */
            .footer { margin-top: 50px; display: flex; justify-content: space-between; page-break-inside: avoid; }
            .assinatura-box { width: 40%; border-top: 1px solid #94a3b8; padding-top: 10px; text-align: center; font-size: 12px; color: #64748b; }

            @media print {
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          
          <div class="header">
            <div class="header-info">
              <h1>Quadro de Colaboradores</h1>
              <p>Relatório de Pessoal Ativo - SGEPI</p>
            </div>
            <div class="meta-box">
              Emissão: ${dataEmissao}<br>
              Total de Registros: <strong>${totalColaboradores}</strong>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 15%">Matrícula</th>
                <th style="width: 35%">Nome do Colaborador</th>
                <th style="width: 25%">Departamento</th>
                <th style="width: 25%">Cargo / Função</th>
              </tr>
            </thead>
            <tbody>
              ${funcionariosFiltrados.map(f => `
                <tr>
                  <td class="matricula">${f.matricula}</td>
                  <td class="nome">${f.nome}</td>
                  <td><span class="badge">${f.departamento.nome}</span></td>
                  <td>${f.funcao.nome}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer">
            <div class="assinatura-box">
              Gerente de Recursos Humanos
            </div>
            <div class="assinatura-box">
              Responsável pelo Setor
            </div>
          </div>

          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;

    const win = window.open('', '', 'width=900,height=600');
    win.document.write(conteudoHTML);
    win.document.close();
  };

  function abrirNovo() {
    setFuncSelecionado(null);
    setFormNome("");
    setFormDepartamento("");
    setFormFuncao("");
    setModalAberto(true);
  }

  function abrirEdicao(func) {
    setFuncSelecionado(func);
    setFormNome(func.nome);
    setFormDepartamento(func.departamento.id);
    setFormFuncao(func.funcao.id);
    setModalAberto(true);
  }

  function salvarFuncionario() {
    if (!formNome || !formDepartamento || !formFuncao) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const depObj = mockDepartamentos.find((d) => d.id === Number(formDepartamento));
    const funcObj = mockFuncoes.find((f) => f.id === Number(formFuncao));

    if (funcSelecionado) {
      setFuncionarios((prev) =>
        prev.map((f) =>
          f.id === funcSelecionado.id
            ? { ...f, nome: formNome, departamento: depObj, funcao: funcObj }
            : f
        )
      );
    } else {
      const novoFunc = {
        id: Date.now(),
        nome: formNome,
        matricula: gerarMatricula(),
        departamento: depObj,
        funcao: funcObj,
      };
      setFuncionarios((prev) => [...prev, novoFunc]);
      setPaginaAtual(Math.ceil((funcionarios.length + 1) / itensPorPagina)); // Vai pra última página ver o novo
    }
    setModalAberto(false);
  }

  function excluirFuncionario(id) {
    if (window.confirm("Tem certeza que deseja excluir este funcionário?")) {
      setFuncionarios((prev) => prev.filter((f) => f.id !== id));
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 animate-fade-in">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            👥 Colaboradores
          </h2>
          <p className="text-sm text-gray-500">Gerencie a equipe e suas atribuições.</p>
        </div>

        <div className="flex gap-2">
            <button
                onClick={imprimirListaColaboradores}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-200 transition shadow-sm border border-gray-300 flex items-center gap-2"
            >
                <span>🖨️</span> Imprimir Lista
            </button>
            <button
                onClick={abrirNovo}
                className="bg-blue-700 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-800 transition flex items-center gap-2 shadow-sm"
            >
                <span>➕</span> Cadastrar
            </button>
        </div>
      </div>

      {/* BARRA DE BUSCA */}
      <div className="relative mb-6">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">🔍</span>
        <input
          type="text"
          placeholder="Buscar por nome ou matrícula..."
          value={busca}
          onChange={(e) => {
              setBusca(e.target.value);
              setPaginaAtual(1); // Se buscar, volta pra página 1
          }}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
        />
      </div>

      {/* TABELA */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
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
                    <span className={`px-2 py-1 rounded text-xs font-bold border ${func.departamento.cor}`}>
                      {func.departamento.nome}
                    </span>
                  </td>
                  
                  <td className="p-4 text-gray-600">{func.funcao.nome}</td>
                  
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-4">
                      <button
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm transition"
                        onClick={() => abrirEdicao(func)}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700 font-medium text-sm transition"
                        onClick={() => excluirFuncionario(func.id)}
                      >
                        🗑️ Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">
                  Nenhum funcionário encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINAÇÃO (Só aparece se tiver mais de uma página) */}
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

      {/* MODAL */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
            
            {/* Cabeçalho do Modal */}
            <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">
                {funcSelecionado ? "✏️ Editar Colaborador" : "➕ Novo Colaborador"}
              </h3>
              <button onClick={() => setModalAberto(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>

            {/* Corpo do Modal */}
            <div className="p-6 space-y-4">
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                <input
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Ex: João da Silva"
                  value={formNome}
                  onChange={(e) => setFormNome(e.target.value)}
                />
              </div>

              {funcSelecionado && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Matrícula</label>
                  <input
                    className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                    value={funcSelecionado.matricula}
                    disabled
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                <select
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  value={formDepartamento}
                  onChange={(e) => {
                    setFormDepartamento(e.target.value);
                    setFormFuncao(""); // Reseta a função se mudar o departamento
                  }}
                >
                  <option value="">Selecione um departamento</option>
                  {mockDepartamentos.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Função / Cargo</label>
                <select
                  className={`w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white ${!formDepartamento ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                  value={formFuncao}
                  onChange={(e) => setFormFuncao(e.target.value)}
                  disabled={!formDepartamento}
                >
                  <option value="">
                    {!formDepartamento ? "Selecione o departamento primeiro" : "Selecione uma função"}
                  </option>
                  {funcoesDisponiveis.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.nome}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* Rodapé do Modal */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setModalAberto(false)}
                className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                onClick={salvarFuncionario}
                className="px-4 py-2 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-800 shadow-md transition"
              >
                Salvar Dados
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default Funcionarios;