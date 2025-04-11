import { 
    Home,
    Plug
} from "lucide-react";
import PgHome from "./pages/Home";
import PontosRecarga from "./pages/PontosRecarga";

const routesConfig = [
    { path: "/", element: <PgHome />, icon: <Home size={20} />, text: "Home", protected: true },
    { path: "/pontosrecarga", element: <PontosRecarga />, icon: <Plug size={20} />, text: "Minhas Estações", protected: true },
];

export default routesConfig;