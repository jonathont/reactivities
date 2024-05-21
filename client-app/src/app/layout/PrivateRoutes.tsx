import React from "react";

import { Navigate, Outlet } from "react-router-dom";
import { useStore } from "../stores/store";

// Private route component from: https://github.com/remix-run/react-router/issues/10637#issuecomment-1802180978

const PrivateRoutes = () => {
	const { userStore: { isLoggedIn } } = useStore();
	return isLoggedIn ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoutes;