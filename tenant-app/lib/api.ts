import axios from 'axios';

const API_BASE_URL = 'http://5.161.48.45:8003';

// Create an instance to handle authorization headers (from Supabase)
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Interceptor to inject the Supabase JWT token into every request
 * Replace 'getSupabaseToken' with your actual Supabase auth logic
 */
apiClient.interceptors.request.use(async (config) => {
    // const { data: { session } } = await supabase.auth.getSession();
    // const token = session?.access_token;
    const token = "YOUR_SUPABASE_JWT"; // Placeholder
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const maintenanceApi = {
    // 1. SIGNUP SYNC
    syncUser: async () => {
        const response = await apiClient.post('/sync-user');
        return response.data;
    },

    // 2. TENANT: Create Request
    createRequest: async (data: CreateRequestDTO) => {
        const response = await apiClient.post<MaintenanceRequest>('/requests/create', data);
        return response.data;
    },

    // 3. LANDLORD: Approve or Assign Vendor
    updateRequestStatus: async (requestId: string, action: 'APPROVED' | 'ASSIGNED', vendorId?: string) => {
        const params = vendorId ? { request_id: requestId, action, vendor_id: vendorId } : { request_id: requestId, action };
        const response = await apiClient.patch('/requests/update-status', null, { params });
        return response.data;
    },

    // 4. VENDOR: Mark Complete
    markComplete: async (requestId: string) => {
        const response = await apiClient.patch('/requests/mark-complete', null, {
            params: { request_id: requestId }
        });
        return response.data;
    }
};