import axios from './axios';

export const loginSuperAdmin = (email: string) =>
    axios.post('/superAdmin/login', { email });

export const verifySuperAdminLogin = (email: string, activationCode: string) =>
    axios.post('/superAdmin/login/verify', { email, activationCode });

export const logoutSuperAdmin = async (refreshToken?: string) => {
    try {
        if (refreshToken) {
            await axios.post('/superAdmin/logout', { refreshToken });
        }
        return { success: true };
    } catch (error) {
        console.error('Logout API error:', error);
        return { success: true };
    }
};

export const resendLoginCode = (email: string) =>
    axios.post('/superAdmin/resend-login-code', { email });



