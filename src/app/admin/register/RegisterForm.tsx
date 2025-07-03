import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { FormField } from '@/components/shared/FormField';
import { AgreementCheckbox } from '@/components/shared/AgreementCheckbox';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import axios from '@/lib/axios';

interface RegisterFormProps {
  onSuccess: (email: string) => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!fullName) {
      newErrors.fullName = 'Họ tên là bắt buộc';
    }
    if (!email) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    if (!password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (password.length < 8) {
      newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = 'Mật khẩu phải chứa chữ hoa, chữ thường và số';
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = fullName && email && password && confirmPassword && agree && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setErrors({});
    try {
      await axios.post('/admin/register', {
        fullName,
        email,
        password,
      });
      onSuccess(email);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      if (err.response && err.response.data && err.response.data.message) {
        setErrors({ general: err.response.data.message });
      } else {
        setErrors({ general: 'Đăng ký thất bại. Vui lòng thử lại.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="w-full max-w-md mx-auto flex flex-col gap-6 items-center px-0 pb-8" autoComplete="off" onSubmit={handleSubmit}>
      {errors.general && (
        <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded-lg w-full">
          <p className="text-red-600 text-sm">{errors.general}</p>
        </div>
      )}
      <FormField label="Họ tên" htmlFor="fullName" error={errors.fullName}>
        <Input
          id="fullName"
          type="text"
          value={fullName}
          onChange={e => {
            setFullName(e.target.value);
            if (errors.fullName) setErrors(prev => ({ ...prev, fullName: undefined }));
          }}
          placeholder="Nhập họ tên của bạn"
          required
        />
      </FormField>
      <FormField label="Email" htmlFor="email" error={errors.email}>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={e => {
            setEmail(e.target.value);
            if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
          }}
          placeholder="Nhập email của bạn"
          required
        />
      </FormField>
      <FormField label="Mật khẩu" htmlFor="password" error={errors.password}>
        <PasswordInput
          id="password"
          name="password"
          value={password}
          onChange={e => {
            setPassword(e.target.value);
            if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
          }}
          placeholder="Nhập mật khẩu"
          required
        />
        <p className="text-gray-500 text-xs mt-1">
          Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số
        </p>
      </FormField>
      <FormField label="Xác nhận mật khẩu" htmlFor="confirmPassword" error={errors.confirmPassword}>
        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          value={confirmPassword}
          onChange={e => {
            setConfirmPassword(e.target.value);
            if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: undefined }));
          }}
          placeholder="Nhập lại mật khẩu"
          required
        />
      </FormField>
      <AgreementCheckbox
        checked={agree}
        onChange={e => setAgree(e.target.checked)}
        required
      />
      <Button
        type="submit"
        variant="lime"
        fullWidth
        disabled={!isFormValid || isLoading}
      >
        {isLoading ? 'Đang đăng ký...' : 'Tiếp tục'}
      </Button>
      <div className="text-center w-full mt-2">
        <span className="text-gray-800 text-sm">Đã có tài khoản? </span>
        <Link href="/admin/login" className="text-lime-600 font-semibold hover:underline text-sm">
          Đăng nhập
        </Link>
      </div>
    </form>
  );
} 