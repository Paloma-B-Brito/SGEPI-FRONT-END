import { useState, useEffect } from "react";
import ModalNovoEpi from "../components/modals/ModalNovoEpi";

function Estoque() {
  // meus estados principais
  const [epis, setEpis] = useState([]);
  const [busca, setBusca] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [modalAberto, setModalAberto] = useState(false);
  
  const itensPorPagina = 5;

  // puxando os produtos do banco de dados (go)
  const carregarProdutos = async () => {
    try {
      const resposta = await fetch("http://localhost:8080/api/produtos");
      if (resposta.ok) {
        const dados = await resposta.json();
        setEpis(dados);
      }
    } catch (erro) {
      console.error("Servidor fora do ar ou erro na requisição:", erro);
    }
  };

  // carrega a lista assim que eu abrir a tela
  useEffect(() => {
    carregarProdutos();
  }, []);

  // formatações visuais
  const formatarValidade = (dataString) => {
    if (!dataString) return "--";
    const [ano, mes, dia] = dataString.substring(0, 10).split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const formatarPreco = (valor) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0);
  };

  const getStatusColor = (qtd) => {
    if (qtd === 0) return "bg-red-100 text-red-700 border-red-200";
    if (qtd <= 20) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-green-100 text-green-700 border-green-200";
  };

  // filtros e paginação da tabela
  const listaFiltrada = epis.filter((epi) => {
    const termo = busca.toLowerCase();
    return (
        (epi.nome && epi.nome.toLowerCase().includes(termo)) || 
        (epi.lote && epi.lote.toLowerCase().includes(termo)) ||
        (epi.descricao && epi.descricao.toLowerCase().includes(termo))
    );
  });

  const indexUltimoItem = paginaAtual * itensPorPagina;
  const indexPrimeiroItem = indexUltimoItem - itensPorPagina;
  const itensVisiveis = listaFiltrada.slice(indexPrimeiroItem, indexUltimoItem);
  const totalPaginas = Math.ceil(listaFiltrada.length / itensPorPagina);

  // renderização da página
  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-gray-100 max-w-full relative">
      
      {/* cabeçalho e botão novo */}
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

      {/* barra de pesquisa */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Buscar por nome, lote ou descrição..."
            value={busca}
            onChange={(e) => {
                setBusca(e.target.value);
                setPaginaAtual(1);
            }}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm lg:text-base"
          />
        </div>
      </div>

      {/* tabela para telas grandes */}
      <div className="hidden lg:block overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
            <tr>
              <th className="p-4 font-semibold">Produto</th>
              <th className="p-4 font-semibold">Categoria / Status</th>
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
                    <td className="p-4 text-gray-600 text-sm">
                      {epi.categoria?.nome || epi.categoria} <br/>
                      <span className="text-xs text-gray-400">{epi.status?.nome || epi.status}</span>
                    </td>
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
                <td colSpan="6" className="p-8 text-center text-gray-500">Nenhum produto cadastrado no banco de dados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* cards para celular */}
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
                <p className="text-xs text-gray-500 mb-3">{epi.categoria?.nome || epi.categoria}</p>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 border-t pt-2">
                    <div><span className="font-semibold text-gray-400 text-xs">Lote:</span> {epi.lote}</div>
                    <div><span className="font-semibold text-gray-400 text-xs">Validade:</span> {formatarValidade(epi.validade)}</div>
                    <div><span className="font-semibold text-gray-400 text-xs">Preço:</span> {formatarPreco(epi.preco)}</div>
                </div>
              </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            Nenhum produto cadastrado.
          </div>
        )}
      </div>

      {/* controle de páginas */}
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

      {/* renderiza o modal se estiver aberto */}
      {modalAberto && (
        <ModalNovoEpi 
          onClose={() => setModalAberto(false)} 
          onSalvar={() => {
            setModalAberto(false);
            carregarProdutos(); // recarrega a tabela depois de salvar
          }} 
        />
      )}

    </div>
  );
}

export default Estoque;