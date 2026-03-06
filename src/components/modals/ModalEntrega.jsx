import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "../../services/api";

const mockFuncionarios = [
  { id: 1, nome: "João Silva", matricula: "483920" },
  { id: 2, nome: "Maria Santos", matricula: "739104" },
  { id: 3, nome: "Carlos Oliveira", matricula: "102938" },
  { id: 4, nome: "Ana Pereira", matricula: "564738" },
  { id: 5, nome: "Roberto Costa", matricula: "998877" },
];

const mockEpis = [
  { id: 1, nome: "Capacete de Segurança" },
  { id: 2, nome: "Luva de Raspa" },
  { id: 3, nome: "Sapato de Segurança" },
  { id: 4, nome: "Óculos de Proteção" },
  { id: 5, nome: "Protetor Auricular" },
];

const mockTamanhos = [
  { id: 1, tamanho: "P" },
  { id: 2, tamanho: "M" },
  { id: 3, tamanho: "G" },
  { id: 4, tamanho: "GG" },
  { id: 5, tamanho: "38" },
  { id: 6, tamanho: "40" },
  { id: 7, tamanho: "42" },
  { id: 8, tamanho: "44" },
  { id: 9, tamanho: "Único" },
];

function extrairLista(resp, fallback = []) {
  const dados = resp?.data ?? resp ?? fallback;
  return Array.isArray(dados) ? dados : fallback;
}

async function buscarPrimeiraLista(rotas, fallback = []) {
  for (const rota of rotas) {
    try {
      const resp = await api.get(rota);
      const lista = extrairLista(resp, fallback);
      if (Array.isArray(lista)) return lista;
    } catch (erro) {
      // tenta a próxima rota
    }
  }
  return fallback;
}

function normalizarFuncionario(item) {
  return {
    id: Number(item?.id ?? 0),
    nome: item?.nome ?? "",
    matricula: String(item?.matricula ?? ""),
  };
}

function normalizarEpi(item) {
  return {
    id: Number(item?.id ?? 0),
    nome: item?.nome ?? "",
  };
}

function normalizarTamanho(item) {
  return {
    id: Number(item?.id ?? 0),
    tamanho: String(item?.tamanho ?? ""),
  };
}

function gerarTokenValidacao() {
  try {
    return crypto.randomUUID();
  } catch (erro) {
    return `token-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  }
}

function ModalEntrega({ onClose, onSalvar }) {
  const [funcionarios, setFuncionarios] = useState([]);
  const [epis, setEpis] = useState([]);
  const [tamanhos, setTamanhos] = useState([]);

  const [funcionario, setFuncionario] = useState("");
  const [buscaFuncionario, setBuscaFuncionario] = useState("");
  const [dataEntrega, setDataEntrega] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [itensParaEntregar, setItensParaEntregar] = useState([]);
  const [idEpiTemp, setIdEpiTemp] = useState("");
  const [idTamanhoTemp, setIdTamanhoTemp] = useState("");
  const [qtdTemp, setQtdTemp] = useState(1);

  const [carregando, setCarregando] = useState(false);

  const canvasRef = useRef(null);
  const canvasWrapperRef = useRef(null);
  const contextRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [assinaturaVazia, setAssinaturaVazia] = useState(true);

  useEffect(() => {
    let ativo = true;

    async function carregarDados() {
      const [listaFuncionarios, listaEpis, listaTamanhos] = await Promise.all([
        buscarPrimeiraLista(["/funcionarios"], mockFuncionarios),
        buscarPrimeiraLista(["/epis", "/epi", "/produtos"], mockEpis),
        buscarPrimeiraLista(["/tamanhos", "/tamanho"], mockTamanhos),
      ]);

      if (!ativo) return;

      setFuncionarios(listaFuncionarios.map(normalizarFuncionario));
      setEpis(listaEpis.map(normalizarEpi));
      setTamanhos(listaTamanhos.map(normalizarTamanho));
    }

    carregarDados();

    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    function configurarCanvas() {
      const canvas = canvasRef.current;
      const wrapper = canvasWrapperRef.current;
      if (!canvas || !wrapper) return;

      const ratio = window.devicePixelRatio || 1;
      const largura = Math.max(wrapper.clientWidth, 300);
      const altura = 180;

      canvas.width = largura * ratio;
      canvas.height = altura * ratio;
      canvas.style.width = `${largura}px`;
      canvas.style.height = `${altura}px`;

      const ctx = canvas.getContext("2d");
      ctx.scale(ratio, ratio);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "#0f172a";
      ctx.lineWidth = 2.2;
      contextRef.current = ctx;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, largura, altura);

      setAssinaturaVazia(true);
    }

    configurarCanvas();
    window.addEventListener("resize", configurarCanvas);

    return () => {
      window.removeEventListener("resize", configurarCanvas);
    };
  }, []);

  const funcionarioSelecionado = useMemo(() => {
    return funcionarios.find((f) => Number(f.id) === Number(funcionario)) || null;
  }, [funcionarios, funcionario]);

  const funcionariosFiltrados = useMemo(() => {
    const termo = buscaFuncionario.toLowerCase().trim();

    if (!termo) return funcionarios;

    return funcionarios.filter((f) => {
      return (
        (f.nome || "").toLowerCase().includes(termo) ||
        String(f.matricula || "").includes(termo)
      );
    });
  }, [funcionarios, buscaFuncionario]);

  const epiSelecionadoObj = useMemo(() => {
    return epis.find((e) => Number(e.id) === Number(idEpiTemp)) || null;
  }, [epis, idEpiTemp]);

  const tamanhoSelecionadoObj = useMemo(() => {
    return tamanhos.find((t) => Number(t.id) === Number(idTamanhoTemp)) || null;
  }, [tamanhos, idTamanhoTemp]);

  function getCoordenadas(event) {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  function startDrawing(event) {
    const ponto = getCoordenadas(event);
    if (!ponto || !contextRef.current) return;

    contextRef.current.beginPath();
    contextRef.current.moveTo(ponto.x, ponto.y);
    setIsDrawing(true);
  }

  function draw(event) {
    if (!isDrawing || !contextRef.current) return;

    const ponto = getCoordenadas(event);
    if (!ponto) return;

    contextRef.current.lineTo(ponto.x, ponto.y);
    contextRef.current.stroke();
    setAssinaturaVazia(false);
  }

  function finishDrawing() {
    if (!contextRef.current) return;
    contextRef.current.closePath();
    setIsDrawing(false);
  }

  function limparAssinatura() {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.restore();

    const largura = canvas.clientWidth;
    const altura = canvas.clientHeight;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, largura, altura);

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 2.2;

    setAssinaturaVazia(true);
  }

  function adicionarItem() {
    if (!idEpiTemp || !idTamanhoTemp || !qtdTemp) {
      alert("Selecione o EPI, o tamanho e a quantidade.");
      return;
    }

    const quantidade = Number(qtdTemp);
    if (Number.isNaN(quantidade) || quantidade <= 0) {
      alert("Informe uma quantidade válida.");
      return;
    }

    const novoItem = {
      id: Date.now() + Math.random(),
      idEpi: Number(idEpiTemp),
      idTamanho: Number(idTamanhoTemp),
      quantidade,
      epiNome: epiSelecionadoObj?.nome || "EPI",
      tamanhoNome: tamanhoSelecionadoObj?.tamanho || "-",
    };

    setItensParaEntregar((prev) => [...prev, novoItem]);
    setIdEpiTemp("");
    setIdTamanhoTemp("");
    setQtdTemp(1);
  }

  function removerItem(id) {
    setItensParaEntregar((prev) => prev.filter((item) => item.id !== id));
  }

  function salvarEntrega() {
    if (!funcionario) {
      alert("Selecione o funcionário.");
      return;
    }

    if (itensParaEntregar.length === 0) {
      alert("Adicione pelo menos um item para entrega.");
      return;
    }

    if (assinaturaVazia) {
      alert("Peça para o colaborador assinar antes de confirmar.");
      return;
    }

    const assinaturaImagem = canvasRef.current.toDataURL("image/png");
    const tokenValidacao = gerarTokenValidacao();

    const entregaFinal = {
      id: Date.now(),

      idFuncionario: Number(funcionario),
      data_entrega: dataEntrega,
      assinatura_digital: assinaturaImagem,
      token_validacao: tokenValidacao,

      itens: itensParaEntregar.map((item) => ({
        id: item.id,
        idEpi: item.idEpi,
        idTamanho: item.idTamanho,
        quantidade: item.quantidade,
        epiNome: item.epiNome,
        tamanhoNome: item.tamanhoNome,
      })),

      funcionario: Number(funcionario),
      nome_funcionario: funcionarioSelecionado?.nome || "",
      dataEntrega: dataEntrega,
      assinatura: assinaturaImagem,
    };

    if (onSalvar) {
      onSalvar(entregaFinal);
    }

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <span className="bg-blue-100 p-2 rounded-lg text-blue-700">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </span>

            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Nova Entrega com Assinatura
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Entrega com funcionário, itens e assinatura digital.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition text-xl font-bold"
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-medium text-slate-700">
                Colaborador
              </label>

              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  🔍
                </span>

                <input
                  type="text"
                  placeholder="Buscar nome ou matrícula..."
                  className="w-full pl-9 p-2.5 border border-slate-300 rounded-t-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm bg-slate-50"
                  value={buscaFuncionario}
                  onChange={(e) => setBuscaFuncionario(e.target.value)}
                />
              </div>

              <div className="w-full border border-slate-300 rounded-b-lg -mt-2 bg-white max-h-40 overflow-y-auto border-t-0">
                {funcionariosFiltrados.length === 0 ? (
                  <div className="p-3 text-sm text-gray-400 text-center italic">
                    Nenhum colaborador encontrado
                  </div>
                ) : (
                  funcionariosFiltrados.map((f) => {
                    const isSelected = Number(funcionario) === Number(f.id);

                    return (
                      <button
                        type="button"
                        key={f.id}
                        onClick={() => setFuncionario(f.id)}
                        className={`w-full text-left p-2.5 border-b border-gray-50 last:border-0 transition-colors ${
                          isSelected
                            ? "bg-blue-100 text-blue-800 font-medium"
                            : "text-slate-600 hover:bg-blue-50"
                        }`}
                      >
                        <span className="font-mono text-xs text-slate-400 mr-2">
                          [{f.matricula}]
                        </span>
                        {f.nome}
                      </button>
                    );
                  })
                )}
              </div>

              {funcionarioSelecionado && (
                <div className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                  Selecionado: <b>{funcionarioSelecionado.nome}</b> — Mat.{" "}
                  {funcionarioSelecionado.matricula}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Data da Entrega
              </label>
              <input
                type="date"
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-slate-700"
                value={dataEntrega}
                onChange={(e) => setDataEntrega(e.target.value)}
              />
            </div>
          </div>

          <hr className="border-slate-100" />

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h3 className="text-sm font-bold text-slate-700 mb-3">
              🛠️ Adicionar itens à entrega
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_100px_auto] gap-3 items-end">
              <div>
                <label className="text-xs text-slate-500 mb-1 block uppercase font-bold">
                  EPI
                </label>
                <select
                  className="w-full p-2.5 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-600 outline-none bg-white"
                  value={idEpiTemp}
                  onChange={(e) => setIdEpiTemp(e.target.value)}
                >
                  <option value="">Selecione...</option>
                  {epis.map((epi) => (
                    <option key={epi.id} value={epi.id}>
                      {epi.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-500 mb-1 block uppercase font-bold">
                  Tamanho
                </label>
                <select
                  className="w-full p-2.5 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-600 outline-none bg-white"
                  value={idTamanhoTemp}
                  onChange={(e) => setIdTamanhoTemp(e.target.value)}
                >
                  <option value="">Selecione...</option>
                  {tamanhos.map((tamanho) => (
                    <option key={tamanho.id} value={tamanho.id}>
                      {tamanho.tamanho}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-500 mb-1 block uppercase font-bold">
                  Qtd.
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full p-2.5 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                  value={qtdTemp}
                  onChange={(e) => setQtdTemp(e.target.value)}
                />
              </div>

              <button
                type="button"
                onClick={adicionarItem}
                className="w-full md:w-auto px-4 py-2.5 bg-blue-700 text-white font-bold rounded hover:bg-blue-800 transition text-sm"
              >
                + Adicionar
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Itens na entrega ({itensParaEntregar.length})
            </label>

            {itensParaEntregar.length > 0 ? (
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-600 font-semibold">
                    <tr>
                      <th className="p-3 pl-4">Item</th>
                      <th className="p-3 text-center">Tam.</th>
                      <th className="p-3 text-center">Qtd.</th>
                      <th className="p-3 text-right pr-4">Ação</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 bg-white">
                    {itensParaEntregar.map((item) => (
                      <tr key={item.id}>
                        <td className="p-3 pl-4 text-slate-700">{item.epiNome}</td>
                        <td className="p-3 text-center text-slate-500">
                          {item.tamanhoNome}
                        </td>
                        <td className="p-3 text-center font-bold text-slate-800">
                          {item.quantidade}
                        </td>
                        <td className="p-3 text-right pr-4">
                          <button
                            type="button"
                            onClick={() => removerItem(item.id)}
                            className="text-red-500 hover:text-red-700 font-bold text-xs"
                          >
                            Remover
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-6 bg-slate-50 border border-dashed border-slate-300 rounded-lg text-slate-400 text-sm">
                Nenhum item adicionado.
              </div>
            )}
          </div>

          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Assinatura digital do colaborador
                </label>
                <p className="text-xs text-slate-400 mt-0.5">
                  Peça para o colaborador assinar no campo abaixo.
                </p>
              </div>

              <button
                type="button"
                onClick={limparAssinatura}
                className="text-xs text-red-500 hover:underline cursor-pointer self-start sm:self-auto"
              >
                Limpar assinatura
              </button>
            </div>

            <div className="rounded-xl border border-slate-300 bg-slate-50 p-3">
              <div
                ref={canvasWrapperRef}
                className="relative rounded-lg border-2 border-dashed border-slate-300 bg-white overflow-hidden"
              >
                <canvas
                  ref={canvasRef}
                  onPointerDown={startDrawing}
                  onPointerMove={draw}
                  onPointerUp={finishDrawing}
                  onPointerLeave={finishDrawing}
                  className="w-full h-[180px] block cursor-crosshair touch-none"
                />

                {assinaturaVazia && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center text-slate-300">
                      <div className="text-3xl mb-2">✍️</div>
                      <div className="text-sm font-medium">
                        Assine aqui
                      </div>
                      <div className="text-xs mt-1">
                        Use o mouse, dedo ou caneta
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                <span>Área destinada à assinatura do colaborador</span>
                <span>{assinaturaVazia ? "Assinatura pendente" : "Assinatura capturada"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-200 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition"
          >
            Cancelar
          </button>

          <button
            onClick={salvarEntrega}
            disabled={carregando}
            className="px-6 py-2 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-800 shadow-md transition flex items-center gap-2 disabled:opacity-60"
          >
            <span>💾</span> Confirmar Entrega
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalEntrega;