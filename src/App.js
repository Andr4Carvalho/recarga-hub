import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import routes from "./routesConfig";
import PrivateRoute from "./PrivateRoute.js";
import Login from "./pages/Login.js";
import Register from "./pages/Register.js";
import Auth from "./services/AuthService.js";
import Loading from "./pages/Loading.js";
import Sidebar, { SidebarItem } from "./components/Sidebar"

const App = () => {
    const location = useLocation();
    const isLoginPage = location.pathname === "/login" || location.pathname === "/register";
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (Auth.isTokenExpired(token) && (location.pathname !== "/login" && location.pathname !== "/register")) {
            window.location.href = "/login";
        } else {
            setLoading(false);
        }
    }, [location]);

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            {!isLoginPage ? (
                <div className="flex">
                    <Sidebar>
                        {routes.filter((route) => route.showList !== false).map((route) => (
                            <SidebarItem key={route.path} icon={route.icon} text={route.text} to={route.path} />
                        ))}
                    </Sidebar>

                    <div className="w-full overflow-x-auto">
                        <Routes>
                            {routes.map((route) => (
                                <Route
                                    key={route.path}
                                    path={route.path}
                                    element={
                                        route.protected ? (
                                            <PrivateRoute element={route.element} />
                                        ) : (
                                            route.element
                                        )
                                    }
                                />
                            ))}
                        </Routes>
                    </div>
                </div>
            ) : (
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            )}
        </>
    );
};

export default App;