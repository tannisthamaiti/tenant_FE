export type UserRole = 'agent' | 'tenant' | 'landlord' | 'vendor';

export interface User {
    id: string;
    email: string;
    role: UserRole;
}

export interface MaintenanceRequest {
    id: string;
    tenant_id: string;
    vendor_id?: string;
    title: string;
    status: 'PENDING' | 'APPROVED' | 'ASSIGNED' | 'COMPLETED';
    created_at: string;
}

export interface CreateRequestDTO {
    title: string;
    description?: string;
}