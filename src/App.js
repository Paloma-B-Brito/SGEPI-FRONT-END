import { useState } from "react";
import Login from "./pages/Login";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Estoque from "./pages/Estoque";
import Funcionarios from "./pages/Funcionários"; 
import Entradas from "./pages/Entradas";
import Entregas from "./pages/Entregas";
import Devolucoes from "./pages/Devoluções";
import Administracao from "./pages/Administracao";
import Fornecedores from "./pages/Fornecedores"; 

function App() {
  const [usuario, setUsuario] = useState(null);
  const [pagina, setPagina] = useState("Dashboard");

  if (!usuario) {
    return (
      <Login 
        onLogin={(dadosUsuario) => {
          setUsuario(dadosUsuario); 
          setPagina("Dashboard");   
        }} 
      />
    );
  }

  function renderizarPagina() {
    const paginasRestritas = ["Admin", "Fornecedores"];
    if (paginasRestritas.includes(pagina) && usuario.role !== "admin") {
      return <Dashboard />; 
    }

    switch (pagina) {
      case "Dashboard":
        return <Dashboard />;
      case "Estoque":
        return <Estoque />;
      case "Funcionários":
        return <Funcionarios />;
      case "Entradas":
        return <Entradas />;
      case "Entregas":
        return <Entregas />;
      case "Devoluções":
        return <Devolucoes />;
      case "Admin": 
        return <Administracao />;
      case "Fornecedores": 
        return <Fornecedores />;
        
      default:
        return <Dashboard />;
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      <Header 
        paginaAtual={pagina} 
        setPagina={setPagina} 
        usuario={usuario} 
        onLogout={() => setUsuario(null)}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 animate-fade-in">
        {renderizarPagina()}
      </main>
    </div>
  );
}

export default App;