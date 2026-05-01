export interface User {
    id: string;
    name: string;
    email: string;
    role: "customer" | "wholesaler" | "admin";
    phone?: string;
    address_line1?: string;
    address_line2?: string;
    address_city?: string;
    address_state?: string;
    address_pincode?: string;
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

export interface UpdateProfilePayload {
    name?: string;
    phone?: string;
    address_line1?: string;
    address_line2?: string;
    address_city?: string;
    address_state?: string;
    address_pincode?: string;
}
