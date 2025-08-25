const backend_url = import.meta.env.VITE_BACKEND_URI;
const API_BASE = backend_url+'/api/admin';

const adminApi = {
    login: async (userId, password) => {
        try {
            const response = await fetch(`${API_BASE}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId, password })
            });

            return await response.json();
        } catch (error) {
            throw new Error('Network error: ' + error.message);
        }
    },

    verifyToken: async (token) => {
        try {
            const response = await fetch(`${API_BASE}/verify`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                return await response.json();
            } else {
                throw new Error('Token verification failed');
            }
        } catch (error) {
            throw new Error('Verification error: ' + error.message);
        }
    },

    getDashboard: async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_BASE}/dashboard`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                return await response.json();
            } else {
                throw new Error('Dashboard access denied');
            }
        } catch (error) {
            throw new Error('Dashboard error: ' + error.message);
        }
    }
};

export default adminApi;