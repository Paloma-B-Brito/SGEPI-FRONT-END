import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "../../services/api";

const mockFuncionarios = [
  { id: 1, nome: "João Silva", matricula: "483920" },
  { id: 2, nome: "Maria Santos", matricula: "739104" },
  { id: 3, nome: "Carlos Oliveira", matricula: "102938" },
  { id: 4, nome: "Ana Pereira", matricula: "554433" },
];

const mockEpis = [
  { id: 1, nome: "Capacete de Segurança" },
  { id: 2, nome: "Sapato de Segurança" },
  { id: 3, nome: "Luva de Proteção" },
  { id: 4, nome: "Protetor Auricular" },
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

const mockMotivos = [
  { id: 1, nome: "Vencimento / Validade Expirada" },
  { id: 2, nome: "Dano / Quebra Acidental" },
  { id: 3, nome: "Perda / Roubo" },
  { id: 4, nome: "Descarte Técnico" },
  { id: 5, nome: "Ajuste de Inventário (Balanço)" },
  { id: 6, nome: "Desligamento / Demissão" },
  { id: 7, nome: "Desgaste Natural" },
  { id: 8, nome: "Devolução de Funcionário" },
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
      // tenta próxima
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

function normalizarMotivo(item) {
  return {
    id: Number(item?.id ?? 0),
    nome: item?.nome ?? "",
  };
}

function gerarTokenValidacao() {
  try {
    return crypto.randomUUID();
  } catch (erro) {
    return `token-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  }
}

function ModalBaixa({ onClose, onSalvar }) {
  const [funcionarios, setFuncionarios] = useState([]);
  const [epis, setEpis] = useState([]);
  const [tamanhos, setTamanhos] = useState([]);
  const [motivos, setMotivos] = useState([]);

  const [idFuncionario, setIdFuncionario] = useState("");
  const [buscaFuncionario, setBuscaFuncionario] = useState("");

  const [idEpi, setIdEpi] = useState("");
  const [idTamanho, setIdTamanho] = useState("");
  const [quantidadeADevolver, setQuantidadeADevolver] = useState(1);
  const [idMotivo, setIdMotivo] = useState("");
  const [dataDevolucao, setDataDevolucao] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [observacao, setObservacao] = useState("");

  const [houveTroca, setHouveTroca] = useState(false);
  const [idEpiNovo, setIdEpiNovo] = useState("");
  const [idTamanhoNovo, setIdTamanhoNovo] = useState("");
  const [quantidadeNova, setQuantidadeNova] = useState(1);

  const [carregando, setCarregando] = useState(false);

  const canvasRef = useRef(null);
  const canvasWrapperRef = useRef(null);
  const contextRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [assinaturaVazia, setAssinaturaVazia] = useState(true);

  useEffect(() => {
    let ativo = true;

    async function carregarDados() {
      const [listaFuncionarios, listaEpis, listaTamanhos, listaMotivos] =
        await Promise.all([
          buscarPrimeiraLista(["/funcionarios"], mockFuncionarios),
          buscarPrimeiraLista(["/epis", "/epi", "/produtos"], mockEpis),
          buscarPrimeiraLista(["/tamanhos", "/tamanho"], mockTamanhos),
          buscarPrimeiraLista(
            ["/motivos-devolucao", "/motivo-devolucao", "/motivos_baixa", "/motivos"],
            mockMotivos
          ),
        ]);

      if (!ativo) return;

      setFuncionarios(listaFuncionarios.map(normalizarFuncionario));
      setEpis(listaEpis.map(normalizarEpi));
      setTamanhos(listaTamanhos.map(normalizarTamanho));
      setMotivos(listaMotivos.map(normalizarMotivo));
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
      ctx.strokeStyle = "#7f1d1d";
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

  const funcionarioSelecionado = useMemo(() => {
    return funcionarios.find((f) => Number(f.id) === Number(idFuncionario)) || null;
  }, [funcionarios, idFuncionario]);

  const epiSelecionado = useMemo(() => {
    return epis.find((e) => Number(e.id) === Number(idEpi)) || null;
  }, [epis, idEpi]);

  const tamanhoSelecionado = useMemo(() => {
    return tamanhos.find((t) => Number(t.id) === Number(idTamanho)) || null;
  }, [tamanhos, idTamanho]);

  const epiNovoSelecionado = useMemo(() => {
    return epis.find((e) => Number(e.id) === Number(idEpiNovo)) || null;
  }, [epis, idEpiNovo]);

  const tamanhoNovoSelecionado = useMemo(() => {
    return tamanhos.find((t) => Number(t.id) === Number(idTamanhoNovo)) || null;
  }, [tamanhos, idTamanhoNovo]);

  const motivoSelecionado = useMemo(() => {
    return motivos.find((m) => Number(m.id) === Number(idMotivo)) || null;
  }, [motivos, idMotivo]);

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
    ctx.strokeStyle = "#7f1d1d";
    ctx.lineWidth = 2.2;

    setAssinaturaVazia(true);
  }

  const salvarBaixa = async () => {
    if (!idFuncionario || !idEpi || !idMotivo || !dataDevolucao || !idTamanho) {
      alert("Preencha os campos obrigatórios.");
      return;
    }

    const qtdDevolvida = Number(quantidadeADevolver);
    if (Number.isNaN(qtdDevolvida) || qtdDevolvida <= 0) {
      alert("Informe uma quantidade válida para devolução.");
      return;
    }

    if (houveTroca) {
      if (!idEpiNovo || !idTamanhoNovo) {
        alert("Preencha os dados do novo EPI da troca.");
        return;
      }

      const qtdNovaValida = Number(quantidadeNova);
      if (Number.isNaN(qtdNovaValida) || qtdNovaValida <= 0) {
        alert("Informe uma quantidade válida para o novo EPI.");
        return;
      }
    }

    if (assinaturaVazia) {
      alert("Peça para o responsável assinar antes de confirmar.");
      return;
    }

    setCarregando(true);

    const assinaturaImagem = canvasRef.current.toDataURL("image/png");
    const tokenValidacao = gerarTokenValidacao();

    const devolucaoFinal = {
      id: Date.now(),

      idFuncionario: Number(idFuncionario),
      idEpi: Number(idEpi),
      idMotivo: Number(idMotivo),
      data_devolucao: dataDevolucao,
      idTamanho: Number(idTamanho),
      quantidadeADevolver: Number(quantidadeADevolver),
      idEpiNovo: houveTroca ? Number(idEpiNovo) : null,
      idTamanhoNovo: houveTroca ? Number(idTamanhoNovo) : null,
      quantidadeNova: houveTroca ? Number(quantidadeNova) : null,
      assinatura_digital: assinaturaImagem,
      token_validacao: tokenValidacao,
      observacao: observacao || null,

      funcionario: Number(idFuncionario),
      epi: Number(idEpi),
      motivo: motivoSelecionado?.nome || "",
      data: dataDevolucao,
      tamanho: tamanhoSelecionado?.tamanho || "-",
      assinatura: assinaturaImagem,
      troca: houveTroca
        ? {
            novoEpi: Number(idEpiNovo),
            novoTamanho: tamanhoNovoSelecionado?.tamanho || "-",
            novaQuantidade: Number(quantidadeNova),
          }
        : null,
      nome_funcionario: funcionarioSelecionado?.nome || "",
      nome_epi: epiSelecionado?.nome || "",
      nome_epi_novo: epiNovoSelecionado?.nome || "",
    };

    let salvouNoServidor = false;

    try {
      await api.post("/devolucao", devolucaoFinal);
      salvouNoServidor = true;
    } catch (erro) {
      try {
        await api.post("/devolucoes", devolucaoFinal);
        salvouNoServidor = true;
      } catch (erro2) {
        try {
          await api.post("/baixa", devolucaoFinal);
          salvouNoServidor = true;
        } catch (erro3) {
          salvouNoServidor = false;
        }
      }
    }

    if (onSalvar) {
      onSalvar(devolucaoFinal);
    }

    if (!salvouNoServidor) {
      alert("Não foi possível salvar no servidor. O registro foi mantido localmente nesta sessão.");
    }

    onClose();
    setCarregando(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden animate-fade-in flex flex-col max-h-[95vh]">
        <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <span className="bg-red-100 p-2 rounded-lg text-red-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </span>

            <div>
              <h2 className="text-xl font-bold text-red-800">
                Registrar Devolução / Baixa
              </h2>
              <p className="text-xs text-red-600 mt-0.5">
                Devolução vinculada ao funcionário, motivo e assinatura.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-red-400 hover:text-red-600 transition text-xl font-bold"
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Funcionário
              </label>

              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  🔍
                </span>

                <input
                  type="text"
                  placeholder="Buscar nome ou matrícula..."
                  className="w-full pl-9 p-2.5 border border-slate-300 rounded-t-lg focus:ring-2 focus:ring-red-500 outline-none text-sm bg-slate-50"
                  value={buscaFuncionario}
                  onChange={(e) => setBuscaFuncionario(e.target.value)}
                />
              </div>

              <div className="w-full border border-slate-300 rounded-b-lg -mt-2 bg-white max-h-40 overflow-y-auto border-t-0">
                {funcionariosFiltrados.length === 0 ? (
                  <div className="p-3 text-sm text-gray-400 text-center italic">
                    Nenhum funcionário encontrado
                  </div>
                ) : (
                  funcionariosFiltrados.map((f) => {
                    const selecionado = Number(idFuncionario) === Number(f.id);

                    return (
                      <button
                        type="button"
                        key={f.id}
                        onClick={() => setIdFuncionario(f.id)}
                        className={`w-full text-left p-2.5 border-b border-gray-50 last:border-0 transition-colors ${
                          selecionado
                            ? "bg-red-100 text-red-800 font-medium"
                            : "text-slate-600 hover:bg-red-50"
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
                <div className="mt-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                  Selecionado: <b>{funcionarioSelecionado.nome}</b> — Mat.{" "}
                  {funcionarioSelecionado.matricula}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item devolvido
              </label>
              <select
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none bg-white"
                value={idEpi}
                onChange={(e) => setIdEpi(e.target.value)}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tamanho
              </label>
              <select
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none bg-white"
                value={idTamanho}
                onChange={(e) => setIdTamanho(e.target.value)}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantidade devolvida
              </label>
              <input
                type="number"
                min="1"
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                value={quantidadeADevolver}
                onChange={(e) => setQuantidadeADevolver(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data da devolução
              </label>
              <input
                type="date"
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                value={dataDevolucao}
                onChange={(e) => setDataDevolucao(e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Motivo
              </label>
              <select
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none bg-white"
                value={idMotivo}
                onChange={(e) => setIdMotivo(e.target.value)}
              >
                <option value="">Selecione o motivo...</option>
                {motivos.map((motivo) => (
                  <option key={motivo.id} value={motivo.id}>
                    {motivo.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={houveTroca}
                onChange={(e) => {
                  const marcado = e.target.checked;
                  setHouveTroca(marcado);

                  if (!marcado) {
                    setIdEpiNovo("");
                    setIdTamanhoNovo("");
                    setQuantidadeNova(1);
                  }
                }}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              Houve troca por um novo EPI?
            </label>
          </div>

          {houveTroca && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 space-y-4">
              <h3 className="text-sm font-bold text-red-700">
                Dados do novo EPI entregue na troca
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Novo EPI
                  </label>
                  <select
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none bg-white"
                    value={idEpiNovo}
                    onChange={(e) => setIdEpiNovo(e.target.value)}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Novo tamanho
                  </label>
                  <select
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none bg-white"
                    value={idTamanhoNovo}
                    onChange={(e) => setIdTamanhoNovo(e.target.value)}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantidade nova
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                    value={quantidadeNova}
                    onChange={(e) => setQuantidadeNova(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observações
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm resize-none"
              rows="3"
              placeholder="Descreva detalhes da devolução, avaria, troca ou observações gerais..."
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
            />
          </div>

          <div className="border-t border-gray-100 pt-4 mt-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <div>
                <label className="block text-sm font-bold text-gray-700">
                  Assinatura do funcionário / responsável
                </label>
                <p className="text-xs text-slate-400 mt-0.5">
                  Assinatura digital para validar a devolução.
                </p>
              </div>

              <button
                type="button"
                onClick={limparAssinatura}
                className="text-xs text-red-500 hover:text-red-700 font-semibold underline cursor-pointer self-start sm:self-auto"
              >
                Limpar assinatura
              </button>
            </div>

            <div className="rounded-xl border border-red-200 bg-red-50 p-3">
              <div
                ref={canvasWrapperRef}
                className="relative rounded-lg border-2 border-dashed border-red-200 bg-white overflow-hidden"
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
                    <div className="text-center text-red-300">
                      <div className="text-3xl mb-2">✍️</div>
                      <div className="text-sm font-medium">
                        Assine aqui
                      </div>
                      <div className="text-xs mt-1">
                        Use mouse, dedo ou caneta
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                <span>Assinatura digital da devolução</span>
                <span>{assinaturaVazia ? "Assinatura pendente" : "Assinatura capturada"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t shrink-0">
          <button
            onClick={onClose}
            disabled={carregando}
            className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition"
          >
            Cancelar
          </button>

          <button
            onClick={salvarBaixa}
            disabled={carregando}
            className={`px-4 py-2 text-white font-bold rounded-lg shadow-md transition flex items-center gap-2 ${
              carregando ? "bg-red-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
            }`}
          >
            <span>{carregando ? "⏳" : "💾"}</span>
            {carregando ? "Confirmando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalBaixa;