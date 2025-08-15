import axios from './axios';

// Đăng nhập
export const loginSuperAdmin = (email: string) =>
    axios.post('/superAdmin/login', { email });

// Xác thực đăng nhập
export const verifySuperAdminLogin = (email: string, activationCode: string) =>
    axios.post('/superAdmin/login/verify', { email, activationCode });

// Đăng xuất
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

// Gửi lại mã xác thực
export const resendLoginCode = (email: string) =>
    axios.post('/superAdmin/resend-login-code', { email });



