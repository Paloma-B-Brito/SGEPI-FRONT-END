import { useState } from "react";

const mockEstoqueCompleto = [
  {
    id: 1, 
    nome: "Capacete de Segurança",
    descricao: "Tamanho M | Fab: MSA | CA: 34.123", 
    preco: 45.50,
    lote: "LOTE-001",
    quantidade: 120,
    validade: "2025-12-01",
    dataChegada: "2024-01-15",
    status: 1, 
    categoria: 1 
  },
  {
    id: 2,
    nome: "Sapato de Segurança",
    descricao: "Tamanho 42 | Fab: Bracol | CA: 15.432",
    preco: 89.90,
    lote: "LOTE-002",
    quantidade: 35,
    validade: "2025-05-01",
    dataChegada: "2024-02-10",
    status: 1,
    categoria: 2 
  },
  {
    id: 3,
    nome: "Luva de Proteção",
    descricao: "Tamanho P | Fab: Danny | CA: 40.100",
    preco: 15.00,
    lote: "LOTE-003",
    quantidade: 5,
    validade: "2026-01-01",
    dataChegada: "2024-03-20",
    status: 2, 
    categoria: 3
  }
];

function Estoque() {
  const [epis, setEpis] = useState(mockEstoqueCompleto);
  const [busca, setBusca] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 5;
  const [modalAberto, setModalAberto] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    preco: "",
    lote: "",
    quantidade: "",
    validade: "",
    dataChegada: "",
    status: "1",
    categoria: "1"
  });

  const formatarValidade = (dataString) => {
    if (!dataString) return "--";
    const [ano, mes, dia] = dataString.substring(0, 10).split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const formatarPreco = (valor) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  const getStatusColor = (qtd) => {
    if (qtd === 0) return "bg-red-100 text-red-700 border-red-200";
    if (qtd <= 20) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-green-100 text-green-700 border-green-200";
  };

  const listaFiltrada = epis.filter((epi) => {
    const termo = busca.toLowerCase();
    return (
        epi.nome.toLowerCase().includes(termo) || 
        epi.descricao.toLowerCase().includes(termo) ||
        epi.lote.toLowerCase().includes(termo)
    );
  });

  const indexUltimoItem = paginaAtual * itensPorPagina;
  const indexPrimeiroItem = indexUltimoItem - itensPorPagina;
  const itensVisiveis = listaFiltrada.slice(indexPrimeiroItem, indexUltimoItem);
  const totalPaginas = Math.ceil(listaFiltrada.length / itensPorPagina);
  const salvarProduto = () => {
    const novoProduto = {
        id: Date.now(),
        ...form,
        preco: parseFloat(form.preco),
        quantidade: parseInt(form.quantidade),
        status: parseInt(form.status),
        categoria: parseInt(form.categoria)
    };
    
    setEpis([novoProduto, ...epis]);
    setModalAberto(false);
    setForm({ nome: "", descricao: "", preco: "", lote: "", quantidade: "", validade: "", dataChegada: "", status: "1", categoria: "1" });
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-gray-100 max-w-full relative">

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-800 flex items-center gap-2">
            📦 Controle de Estoque
          </h2>
          <p className="text-sm text-gray-500">Gerencie seus produtos, lotes e validades.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <button
            onClick={() => setModalAberto(true)}
            className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm w-full sm:w-auto"
          >
            + Novo Produto
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Buscar por nome, lote ou descrição (CA, Tamanho)..."
            value={busca}
            onChange={(e) => {
                setBusca(e.target.value);
                setPaginaAtual(1);
            }}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm lg:text-base"
          />
        </div>
      </div>

      <div className="hidden lg:block overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
            <tr>
              <th className="p-4 font-semibold">Produto</th>
              <th className="p-4 font-semibold">Descrição / CA</th>
              <th className="p-4 font-semibold text-center">Lote</th>
              <th className="p-4 font-semibold text-center">Preço</th>
              <th className="p-4 font-semibold text-center">Qtd.</th>
              <th className="p-4 font-semibold text-center">Validade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {itensVisiveis.length > 0 ? (
              itensVisiveis.map((epi) => (
                  <tr key={epi.id} className="hover:bg-gray-50 transition duration-150">
                    <td className="p-4 font-medium text-gray-800">{epi.nome}</td>
                    <td className="p-4 text-gray-600 text-sm">{epi.descricao}</td>
                    <td className="p-4 text-center text-gray-500 font-mono text-xs">{epi.lote}</td>
                    <td className="p-4 text-center text-gray-600 text-sm">{formatarPreco(epi.preco)}</td>
                    <td className="p-4 text-center">
                        <span className={`px-2 py-1 rounded font-bold border ${getStatusColor(epi.quantidade)}`}>
                            {epi.quantidade}
                        </span>
                    </td>
                    <td className="p-4 text-center text-gray-500 text-sm">{formatarValidade(epi.validade)}</td>
                  </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500">Nenhum produto encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden space-y-4">
        {itensVisiveis.length > 0 ? (
          itensVisiveis.map((epi) => (
              <div key={epi.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm relative">
                <div className="absolute top-4 right-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold border ${getStatusColor(epi.quantidade)}`}>
                        Qtd: {epi.quantidade}
                    </span>
                </div>
                <h3 className="font-bold text-gray-800 text-lg mb-1">{epi.nome}</h3>
                <p className="text-xs text-gray-500 mb-3">{epi.descricao}</p>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 border-t pt-2">
                    <div><span className="font-semibold text-gray-400 text-xs">Lote:</span> {epi.lote}</div>
                    <div><span className="font-semibold text-gray-400 text-xs">Validade:</span> {formatarValidade(epi.validade)}</div>
                    <div><span className="font-semibold text-gray-400 text-xs">Preço:</span> {formatarPreco(epi.preco)}</div>
                </div>
              </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            Nenhum produto encontrado.
          </div>
        )}
      </div>

      {totalPaginas > 1 && (
        <div className="flex justify-between items-center mt-6 px-1">
            <button
                onClick={() => setPaginaAtual(prev => Math.max(prev - 1, 1))}
                disabled={paginaAtual === 1}
                className={`px-4 py-2 rounded text-sm font-bold border ${paginaAtual === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-700 hover:bg-blue-50 border-blue-200'}`}
            >
                ← Anterior
            </button>
            <span className="text-xs lg:text-sm text-gray-600">
                Pág. <b className="text-gray-900">{paginaAtual}</b> de <b>{totalPaginas}</b>
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

      {modalAberto && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-gray-800">Novo Produto</h3>
                    <button onClick={() => setModalAberto(false)} className="text-gray-400 hover:text-red-500 font-bold">✕</button>
                </div>
                
                <div className="p-4 overflow-y-auto space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Nome do Produto</label>
                            <input type="text" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} className="w-full p-2 border rounded focus:ring-2 outline-none mt-1" placeholder="Ex: Capacete Classe B"/>
                        </div>
                        
                        <div className="md:col-span-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Descrição (Tamanho, CA, Fabricante)</label>
                            <input type="text" value={form.descricao} onChange={e => setForm({...form, descricao: e.target.value})} className="w-full p-2 border rounded focus:ring-2 outline-none mt-1" placeholder="Ex: Tamanho M | Fab: MSA | CA: 12345"/>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Preço (R$)</label>
                            <input type="number" step="0.01" value={form.preco} onChange={e => setForm({...form, preco: e.target.value})} className="w-full p-2 border rounded focus:ring-2 outline-none mt-1" placeholder="0.00"/>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Lote</label>
                            <input type="text" value={form.lote} onChange={e => setForm({...form, lote: e.target.value})} className="w-full p-2 border rounded focus:ring-2 outline-none mt-1" placeholder="Ex: L123"/>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Quantidade Inicial</label>
                            <input type="number" value={form.quantidade} onChange={e => setForm({...form, quantidade: e.target.value})} className="w-full p-2 border rounded focus:ring-2 outline-none mt-1" placeholder="0"/>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Categoria (ID)</label>
                            <select value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})} className="w-full p-2 border rounded focus:ring-2 outline-none mt-1 bg-white">
                                <option value="1">1 - EPI de Cabeça</option>
                                <option value="2">2 - EPI de Membros</option>
                                <option value="3">3 - Proteção em Altura</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Data de Validade</label>
                            <input type="date" value={form.validade} onChange={e => setForm({...form, validade: e.target.value})} className="w-full p-2 border rounded focus:ring-2 outline-none mt-1"/>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Data de Chegada</label>
                            <input type="date" value={form.dataChegada} onChange={e => setForm({...form, dataChegada: e.target.value})} className="w-full p-2 border rounded focus:ring-2 outline-none mt-1"/>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
                    <button onClick={() => setModalAberto(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded font-medium transition">Cancelar</button>
                    <button onClick={salvarProduto} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-bold transition">Salvar Produto</button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}

export default Estoque;