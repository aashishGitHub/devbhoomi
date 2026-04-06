'use client';
import { useAuthStore } from "@/store/authStore";

export default function LogoutButton() {
    const clearAuth = useAuthStore((state) => state.clearAuth);

    const handleLogout = () => {
        clearAuth();
        // Optionally, redirect to login page or home
        window.location.href = "/auth/login";
    };

    return (
        <button onClick={handleLogout} className="btn btn-logout">
            Logout
        </button>
    );
}