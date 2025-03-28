import { ChevronFirst, ChevronLast } from "lucide-react"
import { createContext, useContext, useState } from "react"
import { NavLink } from "react-router-dom";

const SidebarContext = createContext();

export default function Sidebar({ children }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <>
            {/* Overlay no mobile */}
            {expanded && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-10"
                    onClick={() => setExpanded(false)}
                ></div>
            )}

            <aside className={`md:relative h-screen top-0 z-20 transition-all duration-300
                ${expanded ? "fixed w-auto shadow-lg" : "w-16"}
                bg-white border-r shadow-sm md:z-10`}
            >
                <nav className="h-full flex flex-col">
                    <div className="p-4 pb-2 flex items-center">
                            <img
                                src="../icon.png"
                                alt="Logo"
                                className={`overflow-hidden transition-all max-w-16 h-11 rounded-full object-contain object-left
                                ${expanded ? "w-32" : "w-0"}`}
                            />
                        <button
                            onClick={() => setExpanded((curr) => !curr)}
                            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 ml-auto"
                        >
                            {expanded ? <ChevronFirst /> : <ChevronLast />}
                        </button>
                    </div>

                    <SidebarContext.Provider value={{ expanded }}>
                        <ul className="flex-1 px-2">{children}</ul>
                    </SidebarContext.Provider>
                </nav>
            </aside>
        </>
    );
}

export function SidebarItem({ icon, text, to, alert }) {
    const { expanded } = useContext(SidebarContext);

    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${isActive
                    ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
                    : "hover:bg-indigo-50 text-gray-600"
                }`
            }
        >
            {icon}
            <span className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0 h-0"}`}>
                {text}
            </span>
            {alert && <div className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${expanded ? "" : "top-2"}`}></div>}

            {!expanded && (
                <div className="absolute z-50 left-full whitespace-nowrap rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0">
                    {text}
                </div>
            )}
        </NavLink>
    );
}