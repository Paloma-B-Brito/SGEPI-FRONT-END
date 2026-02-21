import { useState } from "react";

function Login({ onLogin }) {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setErro("");

    if (!usuario || !senha) {
      setErro("Por favor, preencha usuário e senha.");
      return;
    }

    setCarregando(true);

    // Simulação de verificação no Banco de Dados
    setTimeout(() => {
      if (senha === "123") {
        const perfil = usuario.toLowerCase() === "admin" ? "admin" : "user";
        
        const dadosUsuario = {
          nome: usuario,
          role: perfil,
        };

        onLogin(dadosUsuario); 

      } else {
        setErro("Senha incorreta (Dica: use 123)");
        setCarregando(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900 p-4">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-[400px] animate-fade-in relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>

        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-blue-100 shadow-sm">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">SGEPI</h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">Gestão Inteligente de EPIs</p>
        </div>

        {erro && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2">
            ⚠️ {erro}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Usuário</label>
            <input
              type="text"
              className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="Digite 'admin' para acesso total"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Senha</label>
            <input
              type="password"
              className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            className={`w-full py-3.5 rounded-xl text-white font-bold text-lg shadow-lg transition transform hover:-translate-y-0.5 
              ${carregando ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 hover:shadow-xl"}`}
          >
            {carregando ? "Verificando..." : "Acessar Sistema"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">&copy; 2026 SGEPI - Controle de Segurança</p>
        </div>

      </div>
    </div>
  );
}

export default Login;