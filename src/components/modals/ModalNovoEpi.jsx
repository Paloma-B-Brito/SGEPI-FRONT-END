import { useState } from "react";
import { api } from "../../services/api";

const tiposProtecaoDisponiveis = [
  { id: 1, nome: "Proteção da Cabeça" },
  { id: 2, nome: "Proteção Auditiva" },
  { id: 3, nome: "Proteção Respiratória" },
  { id: 4, nome: "Proteção Visual" },
  { id: 5, nome: "Proteção de Mãos" },
  { id: 6, nome: "Proteção de Pés" },
  { id: 7, nome: "Proteção contra Quedas" },
];

function ModalNovoEpi({ onClose, onSalvar }) {
  const [nome, setNome] = useState("");
  const [idTipoProtecao, setIdTipoProtecao] = useState("");
  const [fabricante, setFabricante] = useState("");
  const [ca, setCa] = useState("");
  const [descricao, setDescricao] = useState("");
  const [validadeCA, setValidadeCA] = useState("");
  const [alertaMinimo, setAlertaMinimo] = useState("");
  const [carregando, setCarregando] = useState(false);

  const salvarEpi = async () => {
    if (!nome.trim() || !idTipoProtecao) {
      alert("Preencha os campos obrigatórios.");
      return;
    }

    const novoEpi = {
      nome: nome.trim(),
      idTipoProtecao: Number(idTipoProtecao),
      fabricante: fabricante.trim() || null,
      CA: ca.trim() || null,
      descricao: descricao.trim() || null,
      validade_CA: validadeCA ? `${validadeCA}T00:00:00Z` : null,
      alerta_minimo: alertaMinimo !== "" ? Number(alertaMinimo) : 0,
    };

    setCarregando(true);

    try {
      await api.post("/epi", novoEpi);
      if (onSalvar) onSalvar();
      onClose();
    } catch (erro) {
      try {
        await api.post("/epis", novoEpi);
        if (onSalvar) onSalvar();
        onClose();
      } catch (erro2) {
        alert("Não foi possível salvar o EPI no servidor.");
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <span className="bg-slate-200 p-2 rounded-lg text-slate-700">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </span>

            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Cadastrar Novo EPI
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Cadastro base conforme a tabela <b>epi</b>.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 font-bold text-xl transition"
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Identificação do EPI
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do EPI <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="Ex: Bota de Segurança"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Proteção <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
                  value={idTipoProtecao}
                  onChange={(e) => setIdTipoProtecao(e.target.value)}
                >
                  <option value="">Selecione...</option>
                  {tiposProtecaoDisponiveis.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fabricante
                </label>
                <input
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="Ex: Bracol"
                  value={fabricante}
                  onChange={(e) => setFabricante(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CA
                </label>
                <input
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="Ex: 15432"
                  value={ca}
                  onChange={(e) => setCa(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alerta mínimo
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="Ex: 10"
                  value={alertaMinimo}
                  onChange={(e) => setAlertaMinimo(e.target.value)}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  rows={3}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
                  placeholder="Descreva o EPI, finalidade ou observações importantes..."
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Controle do Certificado
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Validade do CA
                </label>
                <input
                  type="date"
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={validadeCA}
                  onChange={(e) => setValidadeCA(e.target.value)}
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Esta data será salva no campo <b>validade_CA</b>.
                </p>
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
            onClick={salvarEpi}
            disabled={carregando}
            className={`px-6 py-2 text-white font-bold rounded-lg shadow-md transition flex items-center gap-2 ${
              carregando ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            <span>{carregando ? "⏳" : "💾"}</span>
            {carregando ? "Salvando..." : "Salvar EPI"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalNovoEpi;