import axios from './axios';

// Đăng nhập
export const loginSuperAdmin = (email: string) =>
    axios.post('/superAdmin/login', { email });

// Xác thực đăng nhập
export const verifySuperAdminLogin = (email: string, activationCode: string) =>
    axios.post('/superAdmin/login/verify', { email, activationCode });

// Đăng xuất
export const logoutSuperAdmin = () =>
    axios.post('/superAdmin/logout');

// Gửi lại mã xác thực
export const resendLoginCode = (email: string) =>
    axios.post('/superAdmin/resend-login-code', { email });



