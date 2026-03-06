import { useMemo, useState } from "react";
import { api } from "../../services/api";

const mockTiposProtecao = [
  { id: 1, nome: "Proteção da Cabeça" },
  { id: 2, nome: "Proteção Auditiva" },
  { id: 3, nome: "Proteção Respiratória" },
  { id: 4, nome: "Proteção Visual" },
  { id: 5, nome: "Proteção de Mãos" },
  { id: 6, nome: "Proteção de Pés" },
  { id: 7, nome: "Proteção contra Quedas" },
];

const mockEpis = [
  {
    id: 1,
    nome: "Capacete de Segurança Aba Frontal",
    fabricante: "3M do Brasil",
    CA: "12345",
    descricao: "Capacete para proteção da cabeça em ambiente industrial.",
    validade_CA: "2028-10-15",
    idTipoProtecao: 1,
    alerta_minimo: 10,
  },
  {
    id: 2,
    nome: "Luva de Raspa Cano Longo",
    fabricante: "Volk do Brasil",
    CA: "67890",
    descricao: "Luva de proteção para trabalhos com abrasão e calor.",
    validade_CA: "2023-05-20",
    idTipoProtecao: 5,
    alerta_minimo: 20,
  },
  {
    id: 3,
    nome: "Máscara Respiratória PFF2",
    fabricante: "Delta Plus",
    CA: "54321",
    descricao: "Máscara para proteção respiratória.",
    validade_CA: "2025-12-01",
    idTipoProtecao: 3,
    alerta_minimo: 15,
  },
  {
    id: 4,
    nome: "Botina de Segurança Couro",
    fabricante: "Marluvas",
    CA: "98765",
    descricao: "Botina de segurança para proteção dos pés.",
    validade_CA: "2026-03-10",
    idTipoProtecao: 6,
    alerta_minimo: 8,
  },
  {
    id: 5,
    nome: "Óculos de Proteção Incolor",
    fabricante: "Kalipso",
    CA: "11223",
    descricao: "Óculos para proteção visual contra partículas.",
    validade_CA: "2027-01-30",
    idTipoProtecao: 4,
    alerta_minimo: 12,
  },
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
      // tenta próxima rota
    }
  }
  return fallback;
}

function normalizarEpi(item) {
  return {
    id: Number(item?.id ?? 0),
    nome: item?.nome ?? "",
    fabricante: item?.fabricante ?? "",
    CA: item?.CA ?? item?.ca ?? "",
    descricao: item?.descricao ?? "",
    validade_CA: item?.validade_CA ?? item?.validadeCA ?? item?.validade_ca ?? "",
    idTipoProtecao: Number(
      item?.idTipoProtecao ??
        item?.tipo_protecao_id ??
        item?.tipoProtecaoId ??
        item?.idTipo ??
        0
    ),
    alerta_minimo: Number(item?.alerta_minimo ?? item?.alertaMinimo ?? 0),
  };
}

function ModalBusca({ onClose }) {
  const [termo, setTermo] = useState("");
  const [resultados, setResultados] = useState([]);
  const [jaBuscou, setJaBuscou] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const tiposMap = useMemo(() => {
    return mockTiposProtecao.reduce((acc, tipo) => {
      acc[tipo.id] = tipo.nome;
      return acc;
    }, {});
  }, []);

  const formatarData = (data) => {
    if (!data) return "-";
    const dt = new Date(data);
    if (Number.isNaN(dt.getTime())) return "-";
    return dt.toLocaleDateString("pt-BR", { timeZone: "UTC" });
  };

  const isVencido = (dataValidade) => {
    if (!dataValidade) return false;

    const hoje = new Date();
    const validade = new Date(dataValidade);

    hoje.setHours(0, 0, 0, 0);
    validade.setHours(0, 0, 0, 0);

    return hoje > validade;
  };

  const buscar = async (e) => {
    if (e) e.preventDefault();

    if (!termo.trim()) {
      setResultados([]);
      setJaBuscou(false);
      return;
    }

    setCarregando(true);

    const dados = await buscarPrimeiraLista(
      ["/epis", "/epi", "/produtos"],
      mockEpis
    );

    const listaNormalizada = dados.map(normalizarEpi);
    const termoLower = termo.toLowerCase().trim();

    const filtrados = listaNormalizada.filter((item) => {
      return (
        (item.nome || "").toLowerCase().includes(termoLower) ||
        String(item.CA || "").toLowerCase().includes(termoLower) ||
        (item.fabricante || "").toLowerCase().includes(termoLower) ||
        (item.descricao || "").toLowerCase().includes(termoLower) ||
        (tiposMap[item.idTipoProtecao] || "").toLowerCase().includes(termoLower)
      );
    });

    setResultados(filtrados);
    setJaBuscou(true);
    setCarregando(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
        <div className="bg-yellow-50 px-6 py-4 border-b border-yellow-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="bg-yellow-100 p-2 rounded-lg text-yellow-700">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>

            <div>
              <h2 className="text-xl font-bold text-yellow-800">
                Consultar EPI / CA
              </h2>
              <p className="text-xs text-yellow-700 mt-0.5">
                Pesquisa por nome, fabricante, CA, descrição ou tipo de proteção
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-yellow-600 hover:text-yellow-800 transition text-xl font-bold"
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form onSubmit={buscar} className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                🔍
              </span>

              <input
                type="text"
                placeholder="Digite nome, fabricante, número do CA ou descrição..."
                value={termo}
                onChange={(e) => setTermo(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none transition"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={carregando}
              className={`text-white px-6 rounded-lg font-bold shadow-sm transition ${
                carregando
                  ? "bg-yellow-400 cursor-not-allowed"
                  : "bg-yellow-500 hover:bg-yellow-600"
              }`}
            >
              {carregando ? "..." : "Buscar"}
            </button>
          </form>

          <div className="space-y-3">
            {resultados.length > 0 ? (
              resultados.map((item) => {
                const vencido = isVencido(item.validade_CA);
                const tipoProtecao = tiposMap[item.idTipoProtecao] || "Sem tipo";

                return (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition bg-gray-50 group"
                  >
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 mb-3">
                      <div className="min-w-0">
                        <h3 className="font-bold text-gray-800 text-lg leading-tight">
                          {item.nome}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {item.fabricante || "Fabricante não informado"}
                        </p>
                        <p className="text-xs text-slate-500 mt-2">
                          <span className="font-semibold">Tipo:</span> {tipoProtecao}
                        </p>
                      </div>

                      <div className="text-left md:text-right shrink-0">
                        <span className="block text-xs text-gray-500 uppercase font-bold">
                          CA
                        </span>
                        <span className="inline-block text-xl font-mono font-bold text-gray-700 bg-white px-3 py-1 rounded border">
                          {item.CA || "-"}
                        </span>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 mb-3">
                      <p className="text-sm text-slate-600">
                        {item.descricao || "Sem descrição cadastrada."}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-t pt-3 mt-2">
                      <div className="text-sm">
                        <span className="text-gray-500 mr-2">Validade do CA:</span>
                        <span
                          className={`font-semibold ${
                            vencido ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          {formatarData(item.validade_CA)}
                        </span>
                      </div>

                      {vencido ? (
                        <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded">
                          ⛔ VENCIDO
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">
                          ✅ VÁLIDO
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-400">
                {jaBuscou ? (
                  <>
                    <p className="text-4xl mb-2">😕</p>
                    <p>Nenhum EPI encontrado com esse termo.</p>
                  </>
                ) : (
                  <>
                    <p className="text-4xl mb-2">🔎</p>
                    <p>Digite o nome do EPI, fabricante, CA ou descrição para pesquisar.</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition"
          >
            Fechar Janela
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalBusca;