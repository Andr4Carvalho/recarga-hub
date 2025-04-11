import { 
    Car,
    Home,
    Plug
} from "lucide-react";
import PgHome from "./pages/Home";
import PontosRecarga from "./pages/PontosRecarga";
import Veiculos from "./pages/Veiculos";

const routesConfig = [
    { path: "/", element: <PgHome />, icon: <Home size={20} />, text: "Home", protected: true },
    { path: "/pontosrecarga", element: <PontosRecarga />, icon: <Plug size={20} />, text: "Minhas Estações", protected: true },
    { path: "/veiculos", element: <Veiculos />, icon: <Car size={20} />, text: "Meus Veículos", protected: true },
];

export default routesConfig;