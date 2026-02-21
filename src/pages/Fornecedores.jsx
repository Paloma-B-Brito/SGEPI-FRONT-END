import { useState, useEffect } from "react";
import { api } from "../services/api";

const mockFornecedores = [
  { id: 1, nome: "3M do Brasil Ltda", cnpj: "45.985.371/0001-08", contato: "vendas@3m.com", telefone: "(19) 3838-7000", cidade: "Sumaré - SP" },
  { id: 2, nome: "Bracol Calçados", cnpj: "12.345.678/0001-90", contato: "comercial@bracol.com", telefone: "(14) 3404-1000", cidade: "Lins - SP" }
];

const validarCNPJ = (cnpj) => {
  cnpj = cnpj.replace(/[^\d]+/g, '');
  if (cnpj === '' || cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;

  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  let digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  
  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  if (resultado != digitos.charAt(0)) return false;

  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  return resultado == digitos.charAt(1);
};

function Fornecedores() {
  const [fornecedores, setFornecedores] = useState([]);
  const [busca, setBusca] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 5;
  const [modalAberto, setModalAberto] = useState(false);
  const [fornSelecionado, setFornSelecionado] = useState(null);
  const [form, setForm] = useState({ nome: "", cnpj: "", contato: "", telefone: "", cidade: "" });
  const [carregando, setCarregando] = useState(false);

  const carregarFornecedores = async () => {
    try {
      const dados = await api.get("/fornecedores");
      setFornecedores(dados);
    } catch (erro) {
      console.log("Backend não tem a rota de fornecedores ainda. A usar dados falsos (mock).");
      setFornecedores(mockFornecedores);
    }
  };

  useEffect(() => {
    carregarFornecedores();
  }, []);

  const formatarCNPJ = (valor) => {
    return valor.replace(/\D/g, '').replace(/^(\d{2})(\d)/, '$1.$2').replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3').replace(/\.(\d{3})(\d)/, '.$1/$2').replace(/(\d{4})(\d)/, '$1-$2').substring(0, 18);
  };

  const formatarTelefone = (valor) => {
    return valor.replace(/\D/g, '').replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{4,5})(\d{4})$/, '$1-$2').substring(0, 15);
  };

  const listaFiltrada = fornecedores.filter((f) => f.nome.toLowerCase().includes(busca.toLowerCase()) || f.cnpj.includes(busca));
  const listaOrdenada = [...listaFiltrada].sort((a, b) => a.nome.localeCompare(b.nome));
  const indexUltimoItem = paginaAtual * itensPorPagina;
  const indexPrimeiroItem = indexUltimoItem - itensPorPagina;
  const fornecedoresVisiveis = listaOrdenada.slice(indexPrimeiroItem, indexUltimoItem);
  const totalPaginas = Math.ceil(listaOrdenada.length / itensPorPagina);
  const abrirNovo = () => {
    setFornSelecionado(null);
    setForm({ nome: "", cnpj: "", contato: "", telefone: "", cidade: "" });
    setModalAberto(true);
  };

  const abrirEdicao = (forn) => {
    setFornSelecionado(forn);
    setForm({ nome: forn.nome, cnpj: forn.cnpj, contato: forn.contato, telefone: forn.telefone, cidade: forn.cidade });
    setModalAberto(true);
  };
  const salvarFornecedor = async () => {
    if (!form.nome || !form.cnpj) {
      alert("Nome e CNPJ são obrigatórios!");
      return;
    }

    if (!validarCNPJ(form.cnpj)) {
      alert("⚠️ CNPJ Inválido! Verifica os números digitados.");
      return;
    }

    setCarregando(true);

    try {
      if (fornSelecionado) {
        setFornecedores(prev => prev.map(f => f.id === fornSelecionado.id ? { ...f, ...form } : f));
      } else {
        setFornecedores([{ id: Date.now(), ...form }, ...fornecedores]);
      }
      
      setModalAberto(false);
    } catch (erro) {
      alert("Erro ao guardar. Verifica a conexão com o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  const excluirFornecedor = async (id) => {
    if (window.confirm("Tens a certeza que desejas excluir este fornecedor?")) {
      try {
        // await api.delete(`/fornecedor/${id}`); // Descomentar quando o backend estiver pronto
        setFornecedores(prev => prev.filter(f => f.id !== id)); // Simulação local
      } catch (error) {
        alert("Erro ao tentar excluir.");
      }
    }
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-gray-100 max-w-full relative">
      
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-800 flex items-center gap-2">
            🏭 Fornecedores
          </h2>
          <p className="text-sm text-gray-500">Gere as empresas parceiras e emissores de NF.</p>
        </div>
        <button 
          onClick={abrirNovo}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 transition flex items-center gap-2 shadow-sm w-full lg:w-auto justify-center"
        >
          <span>➕</span> Novo Fornecedor
        </button>
      </div>

      <div className="relative mb-6">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">🔍</span>
        <input
          type="text"
          placeholder="Buscar por Razão Social ou CNPJ..."
          value={busca}
          onChange={(e) => { setBusca(e.target.value); setPaginaAtual(1); }}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm lg:text-base"
        />
      </div>

      <div className="hidden lg:block overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
            <tr>
              <th className="p-4 font-semibold">Empresa</th>
              <th className="p-4 font-semibold">CNPJ</th>
              <th className="p-4 font-semibold">Contato / Email</th>
              <th className="p-4 font-semibold">Telefone</th>
              <th className="p-4 font-semibold">Cidade</th>
              <th className="p-4 font-semibold text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {fornecedoresVisiveis.length === 0 ? (
              <tr><td colSpan="6" className="p-8 text-center text-gray-500">Nenhum fornecedor encontrado.</td></tr>
            ) : (
              fornecedoresVisiveis.map((f) => (
                <tr key={f.id} className="hover:bg-gray-50 transition">
                  <td className="p-4 font-medium text-gray-800">{f.nome}</td>
                  <td className="p-4 text-gray-600 font-mono text-xs">{f.cnpj}</td>
                  <td className="p-4 text-gray-600 text-sm">{f.contato}</td>
                  <td className="p-4 text-gray-600 text-sm">{f.telefone}</td>
                  <td className="p-4 text-gray-600 text-sm">{f.cidade}</td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-3">
                      <button onClick={() => abrirEdicao(f)} className="text-indigo-600 hover:text-indigo-800 font-bold text-xs">EDITAR</button>
                      <button onClick={() => excluirFornecedor(f.id)} className="text-red-500 hover:text-red-700 font-bold text-xs">EXCLUIR</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden space-y-4">
        {fornecedoresVisiveis.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">Nenhum fornecedor encontrado.</div>
        ) : (
          fornecedoresVisiveis.map((f) => (
            <div key={f.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm relative">
                <div className="mb-3">
                    <h3 className="font-bold text-gray-800 text-lg leading-tight">{f.nome}</h3>
                    <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200 mt-1 inline-block">CNPJ: {f.cnpj}</span>
                </div>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2"><span>📧</span> {f.contato}</div>
                    <div className="flex items-center gap-2"><span>📞</span> {f.telefone}</div>
                    <div className="flex items-center gap-2"><span>📍</span> {f.cidade}</div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                    <button onClick={() => abrirEdicao(f)} className="py-2 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-sm font-bold">✏️ Editar</button>
                    <button onClick={() => excluirFornecedor(f.id)} className="py-2 text-red-700 bg-red-50 hover:bg-red-100 rounded-lg text-sm font-bold">🗑️ Excluir</button>
                </div>
            </div>
          ))
        )}
      </div>

      {totalPaginas > 1 && (
        <div className="flex justify-between items-center mt-6 px-1">
            <button onClick={() => setPaginaAtual(prev => Math.max(prev - 1, 1))} disabled={paginaAtual === 1} className={`px-4 py-2 rounded text-sm font-bold border ${paginaAtual === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-indigo-700 border-indigo-200'}`}>← Anterior</button>
            <span className="text-xs lg:text-sm text-gray-600">Pág. <b className="text-gray-900">{paginaAtual}</b> de <b>{totalPaginas}</b></span>
            <button onClick={() => setPaginaAtual(prev => Math.min(prev + 1, totalPaginas))} disabled={paginaAtual === totalPaginas} className={`px-4 py-2 rounded text-sm font-bold border ${paginaAtual === totalPaginas ? 'bg-gray-100 text-gray-400' : 'bg-white text-indigo-700 border-indigo-200'}`}>Próxima →</button>
        </div>
      )}

      {modalAberto && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center shrink-0">
              <h3 className="text-lg font-bold text-gray-800">{fornSelecionado ? "✏️ Editar Fornecedor" : "➕ Novo Fornecedor"}</h3>
              <button onClick={() => setModalAberto(false)} className="text-gray-400 hover:text-gray-600 font-bold text-xl">✕</button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Razão Social / Nome Fantasia <span className="text-red-500">*</span></label>
                <input className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Ex: Empresa X Ltda" value={form.nome} onChange={(e) => setForm({...form, nome: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ <span className="text-red-500">*</span></label>
                <input className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="00.000.000/0000-00" value={form.cnpj} onChange={(e) => setForm({...form, cnpj: formatarCNPJ(e.target.value)})} maxLength={18} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                    <input className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="(00) 0000-0000" value={form.telefone} onChange={(e) => setForm({...form, telefone: formatarTelefone(e.target.value)})} maxLength={15} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cidade/Estado</label>
                    <input className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Ex: São Paulo - SP" value={form.cidade} onChange={(e) => setForm({...form, cidade: e.target.value})} />
                  </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail de Contato</label>
                <input className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="contato@empresa.com" value={form.contato} onChange={(e) => setForm({...form, contato: e.target.value})} />
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 shrink-0 border-t">
              <button onClick={() => setModalAberto(false)} disabled={carregando} className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition">Cancelar</button>
              <button onClick={salvarFornecedor} disabled={carregando} className={`px-4 py-2 text-white font-bold rounded-lg shadow-md transition ${carregando ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                {carregando ? "A guardar..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Fornecedores;