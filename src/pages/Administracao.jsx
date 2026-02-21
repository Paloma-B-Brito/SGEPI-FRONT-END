import { useState, useEffect } from "react";
import { api } from "../services/api";

const mockDepartamentosInicial = [
  { id: 1, nome: "Produção", cor: "bg-blue-100 text-blue-700 border-blue-200" },
  { id: 2, nome: "Logística", cor: "bg-orange-100 text-orange-700 border-orange-200" },
  { id: 3, nome: "Segurança do Trabalho", cor: "bg-green-100 text-green-700 border-green-200" },
];

const mockCargosInicial = [
  { id: 1, nome: "Almoxarife", idDepto: 2 },
  { id: 2, nome: "Técnico de Segurança", idDepto: 3 },
  { id: 3, nome: "Operador de Máquinas", idDepto: 1 },
];

function Administracao() {
  const [abaAtiva, setAbaAtiva] = useState("fornecedores");
  const [fornecedores, setFornecedores] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [carregando, setCarregando] = useState(false);

  const [novoForn, setNovoForn] = useState({ nome: "", cnpj: "", contato: "" });
  const [novoDepto, setNovoDepto] = useState("");
  const [novoCargo, setNovoCargo] = useState({ nome: "", idDepto: "" });

  const carregarDadosAdm = async () => {
    try {
      const resForn = await api.get("/fornecedores");
      setFornecedores(resForn);
    } catch (erro) {
      setFornecedores([]);
    }

    try {
      const resDept = await api.get("/departamentos");
      setDepartamentos(resDept);
    } catch (erro) {
      setDepartamentos(mockDepartamentosInicial);
    }

    try {
      const resCargos = await api.get("/cargos");
      setCargos(resCargos);
    } catch (erro) {
      setCargos(mockCargosInicial);
    }
  };

  useEffect(() => {
    carregarDadosAdm();
  }, []);

  const adicionarFornecedor = async () => {
    if (!novoForn.nome || !novoForn.cnpj) return alert("Preencha Nome e CNPJ!");
    setCarregando(true);
    
    try {
      await api.post("/fornecedor", novoForn);
      const item = { id: Date.now(), ...novoForn };
      setFornecedores([item, ...fornecedores]);
      setNovoForn({ nome: "", cnpj: "", contato: "" });
    } catch (erro) {
      const item = { id: Date.now(), ...novoForn };
      setFornecedores([item, ...fornecedores]);
      setNovoForn({ nome: "", cnpj: "", contato: "" });
    } finally {
      setCarregando(false);
    }
  };

  const adicionarDepartamento = async () => {
    if (!novoDepto) return alert("Digite o nome do departamento!");
    setCarregando(true);
    
    const payload = { nome: novoDepto, cor: "bg-gray-100 text-gray-700 border-gray-200" };

    try {
      await api.post("/departamento", payload);
      const item = { id: Date.now(), ...payload }; 
      setDepartamentos([item, ...departamentos]);
      setNovoDepto("");
    } catch (erro) {
      const item = { id: Date.now(), ...payload }; 
      setDepartamentos([item, ...departamentos]);
      setNovoDepto("");
    } finally {
      setCarregando(false);
    }
  };

  const adicionarCargo = async () => {
    if (!novoCargo.nome || !novoCargo.idDepto) return alert("Preencha o nome e selecione o departamento!");
    setCarregando(true);
    
    const payload = { nome: novoCargo.nome, idDepto: Number(novoCargo.idDepto) };

    try {
      await api.post("/cargo", payload);
      const item = { id: Date.now(), ...payload };
      setCargos([item, ...cargos]);
      setNovoCargo({ nome: "", idDepto: "" });
    } catch (erro) {
      const item = { id: Date.now(), ...payload };
      setCargos([item, ...cargos]);
      setNovoCargo({ nome: "", idDepto: "" });
    } finally {
      setCarregando(false);
    }
  };

  const removerItem = async (id, setter, lista, endpoint) => {
    if (window.confirm("Tem certeza que deseja excluir este item?")) {
      try {
        await api.delete(`/${endpoint}/${id}`);
        setter(lista.filter(item => item.id !== id));
      } catch (erro) {
        setter(lista.filter(item => item.id !== id));
      }
    }
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-gray-100 animate-fade-in max-w-full">
      
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          ⚙️ Painel Administrativo
        </h2>
        <p className="text-sm text-gray-500">Gerencie tabelas auxiliares e cadastros base do sistema.</p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4 mb-6">
        <button 
          onClick={() => setAbaAtiva("fornecedores")}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition ${abaAtiva === "fornecedores" ? "bg-slate-800 text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
        >
          🏭 Fornecedores
        </button>
        <button 
          onClick={() => setAbaAtiva("departamentos")}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition ${abaAtiva === "departamentos" ? "bg-slate-800 text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
        >
          🏢 Departamentos
        </button>
        <button 
          onClick={() => setAbaAtiva("cargos")}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition ${abaAtiva === "cargos" ? "bg-slate-800 text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
        >
          💼 Cargos & Funções
        </button>
      </div>

      {abaAtiva === "fornecedores" && (
        <div className="animate-fade-in">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
            <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">Novo Fornecedor</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
              <div className="md:col-span-2">
                <label className="text-xs text-slate-500 mb-1 block">Razão Social / Nome</label>
                <input className="w-full p-2 border rounded focus:ring-2 focus:ring-slate-500 outline-none text-sm" 
                  value={novoForn.nome} onChange={e => setNovoForn({...novoForn, nome: e.target.value})} placeholder="Ex: Empresa X Ltda" />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">CNPJ</label>
                <input className="w-full p-2 border rounded focus:ring-2 focus:ring-slate-500 outline-none text-sm" 
                  value={novoForn.cnpj} onChange={e => setNovoForn({...novoForn, cnpj: e.target.value})} placeholder="00.000.000/0000-00" />
              </div>
              <div>
                <button onClick={adicionarFornecedor} disabled={carregando} className="w-full bg-emerald-600 text-white font-bold py-2 rounded hover:bg-emerald-700 transition text-sm">
                  {carregando ? "..." : "+ Cadastrar"}
                </button>
              </div>
            </div>
            <div className="mt-3">
                <label className="text-xs text-slate-500 mb-1 block">Email / Contato</label>
                <input className="w-full p-2 border rounded focus:ring-2 focus:ring-slate-500 outline-none text-sm" 
                  value={novoForn.contato} onChange={e => setNovoForn({...novoForn, contato: e.target.value})} placeholder="contato@empresa.com" />
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-100 text-slate-600 font-bold uppercase">
                <tr>
                  <th className="p-3">Empresa</th>
                  <th className="p-3">CNPJ</th>
                  <th className="p-3">Contato</th>
                  <th className="p-3 text-center">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fornecedores.length === 0 ? (
                  <tr><td colSpan="4" className="p-4 text-center text-gray-400 italic">Nenhum fornecedor registado.</td></tr>
                ) : (
                  fornecedores.map(f => (
                    <tr key={f.id} className="hover:bg-slate-50">
                      <td className="p-3 font-medium text-slate-800">{f.nome}</td>
                      <td className="p-3 text-slate-500 font-mono text-xs">{f.cnpj}</td>
                      <td className="p-3 text-slate-500">{f.contato}</td>
                      <td className="p-3 text-center">
                        <button onClick={() => removerItem(f.id, setFornecedores, fornecedores, 'fornecedor')} className="text-red-500 hover:text-red-700 font-bold text-xs underline">Excluir</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {abaAtiva === "departamentos" && (
        <div className="animate-fade-in">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6 flex flex-col md:flex-row gap-3 items-end">
            <div className="flex-1 w-full">
              <label className="text-xs text-slate-500 mb-1 block">Nome do Departamento</label>
              <input className="w-full p-2 border rounded focus:ring-2 focus:ring-slate-500 outline-none text-sm" 
                value={novoDepto} onChange={e => setNovoDepto(e.target.value)} placeholder="Ex: Produção" />
            </div>
            <button onClick={adicionarDepartamento} disabled={carregando} className="w-full md:w-auto px-6 bg-emerald-600 text-white font-bold py-2 rounded hover:bg-emerald-700 transition text-sm">
              + Adicionar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {departamentos.map(d => (
              <div key={d.id} className="flex justify-between items-center p-3 border rounded-lg bg-white shadow-sm hover:shadow-md transition">
                <span className={`px-2 py-1 rounded text-xs font-bold ${d.cor}`}>{d.nome}</span>
                <button onClick={() => removerItem(d.id, setDepartamentos, departamentos, 'departamento')} className="text-gray-300 hover:text-red-500 transition">✕</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {abaAtiva === "cargos" && (
        <div className="animate-fade-in">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
            <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">Novo Cargo</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Departamento Vinculado</label>
                <select className="w-full p-2 border rounded focus:ring-2 focus:ring-slate-500 outline-none text-sm bg-white"
                  value={novoCargo.idDepto} onChange={e => setNovoCargo({...novoCargo, idDepto: e.target.value})}>
                  <option value="">Selecione...</option>
                  {departamentos.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Nome do Cargo</label>
                <input className="w-full p-2 border rounded focus:ring-2 focus:ring-slate-500 outline-none text-sm" 
                  value={novoCargo.nome} onChange={e => setNovoCargo({...novoCargo, nome: e.target.value})} placeholder="Ex: Operador" />
              </div>
              <div>
                <button onClick={adicionarCargo} disabled={carregando} className="w-full bg-emerald-600 text-white font-bold py-2 rounded hover:bg-emerald-700 transition text-sm">
                  + Salvar Cargo
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-100 text-slate-600 font-bold uppercase">
                <tr>
                  <th className="p-3">Cargo</th>
                  <th className="p-3">Departamento</th>
                  <th className="p-3 text-center">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cargos.map(c => {
                  const dept = departamentos.find(d => d.id === c.idDepto);
                  return (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="p-3 font-medium text-slate-800">{c.nome}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${dept?.cor || 'bg-gray-100 text-gray-500'}`}>
                          {dept?.nome || "Sem Depto"}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button onClick={() => removerItem(c.id, setCargos, cargos, 'cargo')} className="text-red-500 hover:text-red-700 font-bold text-xs underline">Excluir</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}

export default Administracao;