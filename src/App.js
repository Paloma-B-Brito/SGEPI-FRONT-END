import { useState } from "react";
import Login from "./pages/Login";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Estoque from "./pages/Estoque";
import Entradas from "./pages/Entradas";
import Entregas from "./pages/Entregas";
import Devolucoes from "./pages/Devoluções";
import Funcionarios from "./pages/Funcionários";
import Fornecedores from "./pages/Fornecedores";
import Administracao from "./pages/Administracao";

function App() {
  const [usuario, setUsuario] = useState(null); 
  const [paginaAtual, setPaginaAtual] = useState("Dashboard");

  if (!usuario) {
    return <Login onLogin={setUsuario} />;
  }

  const renderizarPagina = () => {
    switch (paginaAtual) {
      case "Dashboard":
        return <Dashboard usuarioLogado={usuario} />; 
      case "Estoque":
        return <Estoque />;
      case "Entradas":
        return <Entradas />;
      case "Entregas":
        return <Entregas />;
      case "Devoluções":
        return <Devolucoes />;
      case "Funcionários":
        return <Funcionarios usuarioLogado={usuario} />;
      case "Fornecedores":
        return <Fornecedores />;
      case "Administracao":
        return <Administracao />;
      default:
        return <Dashboard usuarioLogado={usuario} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Header 
        paginaAtual={paginaAtual} 
        setPagina={setPaginaAtual} 
        onLogout={() => setUsuario(null)} 
        usuario={usuario} 
      />
      
      <main className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        {renderizarPagina()}
      </main>
    </div>
  );
}

export default App;