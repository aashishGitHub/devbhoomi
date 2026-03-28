export interface User {
    id: string;
    name: string;
    email: string;
    role: "customer" | "wholesaler" | "admin";
    phone?: string;
    created_at: string;
}

export interface AuthTokens {
    access_token: string;
    refresh_token: string;
    expires_in: number;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    phone?: string;
    account_type: "customer" | "wholesaler";
}
