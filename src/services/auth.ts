
import api from "./api";


export const login = async (body: { email: string, password: string }) => {
    try {
        const response = await api.post(`/login`, body);
        console.log(response)

return response?.data;
    } catch (error) {
        console.log(error);

        throw error;
    }
};

export const getProfile = async (token: string) => {
    try {
        const response = await api.get("/profile", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        
return response?.data;
    } catch (error) {
        console.error(error);

        throw error;
    }
};

