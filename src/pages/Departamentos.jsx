import React, { useMemo, useState } from "react";

function Departamentos() {
  const [departamentos, setDepartamentos] = useState([
    {
      id: 1,
      nome: "Logística",
      descricao: "Responsável por entregas e movimentação de estoque.",
      funcoes: [
        { id: 101, nome: "Separador", descricao: "Separação de pedidos." },
        { id: 102, nome: "Motorista", descricao: "Entrega de mercadorias." },
      ],
    },
    {
      id: 2,
      nome: "Estoque",
      descricao: "Controle de entrada, saída e organização de produtos.",
      funcoes: [
        { id: 201, nome: "Estoquista", descricao: "Organização e conferência." },
      ],
    },
  ]);

  const [formDepartamento, setFormDepartamento] = useState({
    nome: "",
    descricao: "",
  });

  const [formFuncao, setFormFuncao] = useState({
    departamentoId: "",
    nome: "",
    descricao: "",
  });

  const totalFuncoes = useMemo(() => {
    return departamentos.reduce((acc, dep) => acc + dep.funcoes.length, 0);
  }, [departamentos]);

  function adicionarDepartamento(e) {
    e.preventDefault();

    const nome = formDepartamento.nome.trim();
    const descricao = formDepartamento.descricao.trim();

    if (!nome) {
      alert("Informe o nome do departamento.");
      return;
    }

    const nomeJaExiste = departamentos.some(
      (d) => d.nome.toLowerCase() === nome.toLowerCase()
    );

    if (nomeJaExiste) {
      alert("Já existe um departamento com esse nome.");
      return;
    }

    const novoDepartamento = {
      id: Date.now(),
      nome,
      descricao,
      funcoes: [],
    };

    setDepartamentos((prev) => [...prev, novoDepartamento]);
    setFormDepartamento({ nome: "", descricao: "" });

    // Se for o primeiro departamento da lista, já deixa selecionado no form de função
    setFormFuncao((prev) => ({
      ...prev,
      departamentoId: prev.departamentoId || String(novoDepartamento.id),
    }));
  }

  function adicionarFuncao(e) {
    e.preventDefault();

    const departamentoId = Number(formFuncao.departamentoId);
    const nome = formFuncao.nome.trim();
    const descricao = formFuncao.descricao.trim();

    if (!departamentoId) {
      alert("Selecione um departamento.");
      return;
    }

    if (!nome) {
      alert("Informe o nome da função.");
      return;
    }

    setDepartamentos((prev) =>
      prev.map((dep) => {
        if (dep.id !== departamentoId) return dep;

        const funcaoDuplicada = dep.funcoes.some(
          (f) => f.nome.toLowerCase() === nome.toLowerCase()
        );

        if (funcaoDuplicada) {
          alert("Essa função já existe nesse departamento.");
          return dep;
        }

        return {
          ...dep,
          funcoes: [
            ...dep.funcoes,
            {
              id: Date.now(),
              nome,
              descricao,
            },
          ],
        };
      })
    );

    setFormFuncao((prev) => ({
      ...prev,
      nome: "",
      descricao: "",
    }));
  }

  function excluirDepartamento(id) {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este departamento e todas as funções dele?"
    );
    if (!confirmar) return;

    setDepartamentos((prev) => prev.filter((dep) => dep.id !== id));

    setFormFuncao((prev) => {
      if (Number(prev.departamentoId) === id) {
        return { ...prev, departamentoId: "" };
      }
      return prev;
    });
  }

  function excluirFuncao(departamentoId, funcaoId) {
    setDepartamentos((prev) =>
      prev.map((dep) => {
        if (dep.id !== departamentoId) return dep;
        return {
          ...dep,
          funcoes: dep.funcoes.filter((f) => f.id !== funcaoId),
        };
      })
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho da página */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-800">
              Departamentos
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Cadastre departamentos e organize as funções de cada setor.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 min-w-[130px]">
              <p className="text-xs text-slate-500">Departamentos</p>
              <p className="text-lg font-bold text-slate-800">
                {departamentos.length}
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 min-w-[130px]">
              <p className="text-xs text-slate-500">Funções</p>
              <p className="text-lg font-bold text-slate-800">{totalFuncoes}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulários */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Form departamento */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 md:p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Adicionar departamento
          </h3>

          <form onSubmit={adicionarDepartamento} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nome do departamento
              </label>
              <input
                type="text"
                value={formDepartamento.nome}
                onChange={(e) =>
                  setFormDepartamento((prev) => ({
                    ...prev,
                    nome: e.target.value,
                  }))
                }
                placeholder="Ex.: Compras"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Descrição (opcional)
              </label>
              <textarea
                rows={3}
                value={formDepartamento.descricao}
                onChange={(e) =>
                  setFormDepartamento((prev) => ({
                    ...prev,
                    descricao: e.target.value,
                  }))
                }
                placeholder="Descreva a responsabilidade do setor..."
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none resize-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition"
            >
              <span>Salvar departamento</span>
            </button>
          </form>
        </div>

        {/* Form função */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 md:p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Adicionar função
          </h3>

          <form onSubmit={adicionarFuncao} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Departamento
              </label>
              <select
                value={formFuncao.departamentoId}
                onChange={(e) =>
                  setFormFuncao((prev) => ({
                    ...prev,
                    departamentoId: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white"
              >
                <option value="">Selecione...</option>
                {departamentos.map((dep) => (
                  <option key={dep.id} value={dep.id}>
                    {dep.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nome da função
              </label>
              <input
                type="text"
                value={formFuncao.nome}
                onChange={(e) =>
                  setFormFuncao((prev) => ({
                    ...prev,
                    nome: e.target.value,
                  }))
                }
                placeholder="Ex.: Analista de Compras"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Descrição (opcional)
              </label>
              <textarea
                rows={3}
                value={formFuncao.descricao}
                onChange={(e) =>
                  setFormFuncao((prev) => ({
                    ...prev,
                    descricao: e.target.value,
                  }))
                }
                placeholder="Descreva as atividades da função..."
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none resize-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2.5 rounded-lg font-medium transition"
            >
              <span>Salvar função</span>
            </button>
          </form>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">
            Lista de departamentos
          </h3>
        </div>

        {departamentos.length === 0 ? (
          <div className="border border-dashed border-slate-300 rounded-xl p-8 text-center text-slate-500">
            Nenhum departamento cadastrado.
          </div>
        ) : (
          <div className="space-y-4">
            {departamentos.map((dep) => (
              <div
                key={dep.id}
                className="border border-slate-200 rounded-xl p-4 md:p-5"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                  <div>
                    <h4 className="text-base md:text-lg font-semibold text-slate-800">
                      {dep.nome}
                    </h4>
                    <p className="text-sm text-slate-500 mt-1">
                      {dep.descricao || "Sem descrição."}
                    </p>
                  </div>

                  <button
                    onClick={() => excluirDepartamento(dep.id)}
                    className="self-start text-sm px-3 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition"
                  >
                    Excluir departamento
                  </button>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-slate-700">
                      Funções ({dep.funcoes.length})
                    </p>
                  </div>

                  {dep.funcoes.length === 0 ? (
                    <div className="text-sm text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                      Nenhuma função cadastrada neste departamento.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {dep.funcoes.map((funcao) => (
                        <div
                          key={funcao.id}
                          className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-3"
                        >
                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              {funcao.nome}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {funcao.descricao || "Sem descrição."}
                            </p>
                          </div>

                          <button
                            onClick={() => excluirFuncao(dep.id, funcao.id)}
                            className="self-start md:self-center text-xs px-3 py-1.5 rounded-md border border-red-200 text-red-600 hover:bg-red-50 transition"
                          >
                            Excluir função
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Departamentos;