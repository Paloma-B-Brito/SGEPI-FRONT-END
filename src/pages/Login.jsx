import { useState } from "react";

function Login({ onLogin }) {
  const [tipoLogin, setTipoLogin] = useState("user"); 
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const handleLogin = (e) => {
    e.preventDefault();
    setErro("");

    if (!senha) {
      setErro("Por favor, digite a senha.");
      return;
    }

    setCarregando(true);
    setTimeout(() => {
      if (senha === "123") {
        const dadosUsuario = {
          nome: tipoLogin === "admin" ? "Administrador" : "Colaborador",
          role: tipoLogin,
        };

        onLogin(dadosUsuario); 
      } else {
        setErro("Senha incorreta.");
        setCarregando(false);
      }
    }, 800);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 p-4 
      ${tipoLogin === "admin" ? "bg-slate-900" : "bg-gradient-to-br from-blue-700 to-blue-900"}`}>
      
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-[380px] animate-fade-in relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-full h-2 transition-colors 
          ${tipoLogin === "admin" ? "bg-slate-500" : "bg-blue-400"}`}></div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">SGEPI</h1>
          <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mt-1">Acesso ao Sistema</p>
        </div>
        <div className="flex bg-gray-100 p-1.5 rounded-xl mb-8 border border-gray-200">
          <button 
            type="button"
            onClick={() => { setTipoLogin("user"); setErro(""); }}
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all
              ${tipoLogin === "user" ? "bg-white text-blue-600 shadow-md" : "text-gray-400 hover:text-gray-500"}`}
          >
            👤 Colaborador
          </button>
          <button 
            type="button"
            onClick={() => { setTipoLogin("admin"); setErro(""); }}
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all
              ${tipoLogin === "admin" ? "bg-slate-800 text-white shadow-md" : "text-gray-400 hover:text-gray-500"}`}
          >
            🔑 Admin
          </button>
        </div>

        {erro && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100 flex items-center gap-2 font-medium">
            ⚠️ {erro}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Senha de Acesso</label>
            <input
              type="password"
              className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-center text-xl tracking-widest"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transition transform hover:-translate-y-0.5
              ${carregando ? "bg-gray-400 cursor-not-allowed" : 
                tipoLogin === "admin" ? "bg-slate-800 hover:bg-slate-700" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-10 text-center border-t pt-4">
          <p className="text-[10px] text-gray-300 font-bold uppercase">SGEPI - Gestão de Estoque © 2026</p>
        </div>

      </div>
    </div>
  );
}

export default Login;