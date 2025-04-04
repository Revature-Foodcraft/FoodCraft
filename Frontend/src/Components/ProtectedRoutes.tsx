import { Navigate } from "react-router-dom";

export function ProtectedRoute({ isLoggedIn, children }: { isLoggedIn: boolean; children: React.ReactNode }) {
    if(isLoggedIn || localStorage.getItem("token")){
        return children
    }else{
        return <Navigate to="/login" replace/>;
    }
}