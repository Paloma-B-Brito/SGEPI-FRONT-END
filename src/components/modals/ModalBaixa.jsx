import { useState, useRef, useEffect } from "react";

const mockEpis = [
  { id: 1, nome: "Capacete de Segurança", tamanhos: ["M", "G"] },
  { id: 2, nome: "Luva de Proteção", tamanhos: ["P", "M", "G"] },
  { id: 3, nome: "Sapato de Segurança", tamanhos: ["40", "42", "44"] },
];

const motivosBaixa = [
  "Vencimento / Validade Expirada",
  "Dano / Quebra no Estoque",
  "Perda / Roubo",
  "Descarte Técnico",
  "Ajuste de Inventário (Balanço)",
  "Devolução de Funcionário", 
];

function ModalBaixa({ onClose }) {
  const [epi, setEpi] = useState("");
  const [tamanho, setTamanho] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [motivo, setMotivo] = useState("");
  const [dataBaixa, setDataBaixa] = useState(new Date().toISOString().split('T')[0]);
  const [observacao, setObservacao] = useState("");

  // --- LÓGICA DA ASSINATURA (CANVAS) ---
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
        // Define resolução interna
        canvas.width = 500;
        canvas.height = 150;
        
        const ctx = canvas.getContext("2d");
        ctx.lineCap = "round";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        contextRef.current = ctx;
    }
  }, []);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const limparAssinatura = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const epiSelecionadoObj = mockEpis.find((e) => e.id === Number(epi));

  function salvarBaixa() {
    if (!epi || !motivo || !quantidade || !dataBaixa) {
        alert("Preencha os campos obrigatórios: EPI, Quantidade, Motivo e Data.");
        return;
    }
    
    if (epiSelecionadoObj?.tamanhos.length > 0 && !tamanho) {
        alert("Selecione o tamanho do EPI.");
        return;
    }

    const assinaturaImagem = canvasRef.current.toDataURL();

    const baixa = {
      id_epi: Number(epi),
      nome_epi: epiSelecionadoObj?.nome,
      tamanho: tamanho || "Único",
      quantidade: Number(quantidade),
      motivo,
      data_baixa: dataBaixa,
      observacao,
      assinatura: assinaturaImagem 
    };

    console.log("Baixa/Devolução Registrada:", baixa);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in flex flex-col max-h-[95vh]">
        
        {/* CABEÇALHO (VERMELHO PARA ALERTA) */}
        <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <span className="bg-red-100 p-2 rounded-lg text-red-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </span>
            <h2 className="text-xl font-bold text-red-800">
              Registrar Devolução / Baixa
            </h2>
          </div>
          <button onClick={onClose} className="text-red-400 hover:text-red-600 transition">✕</button>
        </div>

        {/* CORPO DO FORMULÁRIO - USUÁRIO PREENCHE AQUI */}
        <div className="p-6 overflow-y-auto space-y-4">
            
            {/* Linha 1: EPI e Tamanho */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Selecione o Item</label>
                    <select
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                        value={epi}
                        onChange={(e) => {
                            setEpi(e.target.value);
                            setTamanho("");
                        }}
                    >
                        <option value="">Selecione...</option>
                        {mockEpis.map((e) => (
                            <option key={e.id} value={e.id}>{e.nome}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tamanho</label>
                    <select
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none disabled:bg-gray-100"
                        value={tamanho}
                        onChange={(e) => setTamanho(e.target.value)}
                        disabled={!epiSelecionadoObj}
                    >
                        <option value="">-</option>
                        {epiSelecionadoObj?.tamanhos.map((t) => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                    <input
                        type="number"
                        min="1"
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                        value={quantidade}
                        onChange={(e) => setQuantidade(e.target.value)}
                    />
                </div>
            </div>

            {/* Linha 2: Motivo e Data */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Motivo</label>
                    <select
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                    >
                        <option value="">Selecione o motivo...</option>
                        {motivosBaixa.map((m) => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                    <input
                        type="date"
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                        value={dataBaixa}
                        onChange={(e) => setDataBaixa(e.target.value)}
                    />
                </div>
            </div>

            {/* Observação */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm"
                    rows="2"
                    placeholder="Descreva detalhes..."
                    value={observacao}
                    onChange={(e) => setObservacao(e.target.value)}
                />
            </div>

            {/* --- ÁREA DE ASSINATURA (CANVAS) --- */}
            <div className="border-t border-gray-100 pt-4 mt-2">
                <div className="flex justify-between items-end mb-2">
                    <label className="block text-sm font-bold text-gray-700">
                        Assinatura do Funcionário / Responsável
                    </label>
                    <button 
                        onClick={limparAssinatura} 
                        className="text-xs text-red-500 hover:text-red-700 font-semibold underline cursor-pointer"
                    >
                        Limpar Assinatura
                    </button>
                </div>
                
                <div className="border-2 border-dashed border-red-200 rounded-lg bg-red-50 overflow-hidden cursor-crosshair relative">
                    <canvas
                        ref={canvasRef}
                        onMouseDown={startDrawing}
                        onMouseUp={finishDrawing}
                        onMouseMove={draw}
                        onMouseLeave={finishDrawing}
                        // Eventos de Toque (Mobile/Tablet)
                        onTouchStart={(e) => {
                            e.preventDefault(); 
                            const touch = e.touches[0];
                            const rect = canvasRef.current.getBoundingClientRect();
                            const nativeEvent = { offsetX: touch.clientX - rect.left, offsetY: touch.clientY - rect.top };
                            startDrawing({ nativeEvent });
                        }}
                        onTouchMove={(e) => {
                            e.preventDefault();
                            const touch = e.touches[0];
                            const rect = canvasRef.current.getBoundingClientRect();
                            const nativeEvent = { offsetX: touch.clientX - rect.left, offsetY: touch.clientY - rect.top };
                            draw({ nativeEvent });
                        }}
                        onTouchEnd={finishDrawing}
                        className="w-full h-32 block"
                    />
                    
                    {!isDrawing && (
                        <div className="absolute bottom-2 right-2 text-[10px] text-red-300 pointer-events-none select-none">
                            Assine no espaço pontilhado
                        </div>
                    )}
                </div>
            </div>

        </div>

        {/* RODAPÉ */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition"
          >
            Cancelar
          </button>

          <button
            onClick={salvarBaixa}
            className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 shadow-md transition flex items-center gap-2"
          >
            <span>💾</span> Confirmar
          </button>
        </div>

      </div>
    </div>
  );
}

export default ModalBaixa;