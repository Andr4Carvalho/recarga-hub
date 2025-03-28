import { 
    Home
} from "lucide-react";
import PgHome from "./pages/Home";

const routesConfig = [
    { path: "/", element: <PgHome />, icon: <Home size={20} />, text: "Home", protected: true },
];

export default routesConfig;