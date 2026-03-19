import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Eye, EyeOff, Smartphone, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

export const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Admin@123');
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  
  // Forgot Password Modal State
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: Email, 2: OTP, 3: Success
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotEmailError, setForgotEmailError] = useState('');
  const [showOtpSentSuccess, setShowOtpSentSuccess] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [resendToast, setResendToast] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLockedOut) return;
    
    const errors: Record<string, string> = {};
    if (!username.trim()) {
      errors.username = "Please enter your username or email";
    }
    if (!password.trim()) {
      errors.password = "Please enter your password";
    }

    if (Object.keys(errors).length > 0) {
      setLoginErrors(errors);
      return;
    }

    setLoginErrors({});
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const isValid = (username === 'admin' || username === 'ashish.ranjan@vertis.co.in') && password === 'Admin@123';
      
      if (isValid) {
        setIsLoading(false);
        navigate('/admin/dashboard');
      } else {
        setIsLoading(false);
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        setLoginErrors({
          password: "Invalid username or password. Please check your credentials."
        });
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 400);

        if (newAttempts >= 3) {
          setIsLockedOut(true);
        }
      }
    }, 800);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only accept digits
    if (value.length > 1) value = value[0];
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 3) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleSendOtp = () => {
    if (!forgotEmail.trim()) {
      setForgotEmailError('Please enter your email or mobile number');
      return;
    }
    setForgotEmailError('');
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setShowOtpSentSuccess(true);
      setTimeout(() => {
        setShowOtpSentSuccess(false);
        setForgotStep(2);
      }, 500);
    }, 800);
  };

  const handleVerifyOtp = () => {
    const otpValue = otp.join('');
    
    if (!otpValue || otpValue.length < 4) {
      setOtpError('Please enter the 4-digit OTP sent to your registered mobile.');
      return;
    }

    setIsLoading(true);
    setOtpError('');
    
    setTimeout(() => {
      setIsLoading(false);
      if (otpValue === '1234') {
        setForgotStep(3);
        setTimeout(() => {
          closeForgotModal();
        }, 2000);
      } else {
        setOtpError('Invalid OTP. Please try again.');
        setIsShaking(true);
        setOtp(['', '', '', '']);
        otpRefs.current[0]?.focus();
        setTimeout(() => setIsShaking(false), 400);
      }
    }, 1000);
  };

  const handleResendOtp = () => {
    setResendToast(true);
    setTimeout(() => setResendToast(false), 1500);
  };

  const closeForgotModal = () => {
    setIsForgotModalOpen(false);
    setForgotStep(1);
    setForgotEmail('');
    setForgotEmailError('');
    setShowOtpSentSuccess(false);
    setOtp(['', '', '', '']);
    setOtpError('');
    setIsShaking(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F0E8] p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img 
            src="https://i.postimg.cc/tgd6PLdh/image.png" 
            alt="Vertis Infrastructure Trust"
            className="h-16 object-contain mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-[#8B1A1A]">Distribution Management System</h1>
          <p className="text-[#A52020] mt-1 text-sm font-semibold">Powered by Vertis Infrastructure Trust</p>
        </div>

        <div className={`bg-white p-8 rounded-2xl border border-[#D4A0A0] shadow-xl ${isShaking && !isForgotModalOpen ? 'animate-shake' : ''}`}>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#1A1A1A]">Admin Login</h2>
            <p className="text-sm text-slate-500 mt-1">Enter your credentials to access the portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {isLockedOut && (
              <div style={{ backgroundColor: '#FEF3C7', border: '1px solid #F59E0B', borderRadius: '12px', padding: '12px', marginTop: '12px' }}>
                <p style={{ color: '#92400E', fontSize: '13px', fontWeight: '500' }}>
                  ⚠ Too many failed attempts. Please contact your administrator.
                </p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Username <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (loginErrors.username) {
                      const newErrors = { ...loginErrors };
                      delete newErrors.username;
                      setLoginErrors(newErrors);
                    }
                  }}
                  style={loginErrors.username ? {
                    border: '1px solid #DC2626',
                    backgroundColor: '#FEF2F2',
                    outline: 'none'
                  } : username && !loginErrors.username ? {
                    border: '1px solid #86EFAC',
                    backgroundColor: '#F0FDF4'
                  } : {}}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#D4A0A0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] transition-all"
                  placeholder="Username"
                />
              </div>
              {loginErrors.username && (
                <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  ⚠ {loginErrors.username}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Password <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (loginErrors.password) {
                      const newErrors = { ...loginErrors };
                      delete newErrors.password;
                      setLoginErrors(newErrors);
                    }
                  }}
                  style={loginErrors.password ? {
                    border: '1px solid #DC2626',
                    backgroundColor: '#FEF2F2',
                    outline: 'none'
                  } : password && !loginErrors.password ? {
                    border: '1px solid #86EFAC',
                    backgroundColor: '#F0FDF4'
                  } : {}}
                  className="w-full pl-10 pr-12 py-2.5 bg-white border border-[#D4A0A0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] transition-all"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B1A1A] hover:text-[#6B1010]"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {loginErrors.password && (
                <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  ⚠ {loginErrors.password}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-300 text-[#8B1A1A] focus:ring-[#8B1A1A]" />
                <span className="text-sm text-slate-600">Remember me</span>
              </label>
              <button 
                type="button"
                onClick={() => setIsForgotModalOpen(true)}
                className="text-sm font-medium text-[#8B1A1A] hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl bg-[#8B1A1A] hover:bg-[#6B1010]" 
              isLoading={isLoading}
              disabled={isLockedOut}
            >
              {isLoading ? 'Submitting...' : 'Sign In'} {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>
        </div>

        {/* Bottom Link */}
        <div className="mt-8 text-center">
          <p style={{ color: '#6B7280', fontSize: '14px' }}>
            Are you an investor? {' '}
            <span 
              onClick={() => navigate('/investor/login')} 
              style={{ color: '#8B1A1A', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}
              className="hover:underline"
            >
              Investor Login →
            </span>
          </p>
          <p className="mt-8 text-xs text-slate-400">© Vertis Infrastructure Trust</p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal 
        isOpen={isForgotModalOpen} 
        onClose={closeForgotModal} 
        title={forgotStep === 3 ? "" : "Reset Password"}
      >
        {forgotStep === 1 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-slate-600">Enter your registered email or mobile number to receive an OTP.</p>
              <span className="text-[#8B1A1A] text-xs font-semibold whitespace-nowrap ml-2">Step 1 of 2</span>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email or Mobile</label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input 
                  type="text" 
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 bg-white border ${forgotEmailError ? 'border-red-500' : 'border-[#D4A0A0]'} rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] transition-all`}
                  placeholder="Enter email or mobile"
                />
              </div>
              {forgotEmailError && <p className="text-red-500 text-sm mt-1">{forgotEmailError}</p>}
              {showOtpSentSuccess && <p className="text-[#8B1A1A] text-sm mt-1 font-medium">✓ OTP sent successfully!</p>}
            </div>
            <Button className="w-full bg-[#8B1A1A] hover:bg-[#6B1010]" onClick={handleSendOtp} isLoading={isLoading}>
              Send OTP
            </Button>
          </div>
        )}

        {forgotStep === 2 && (
          <div className="space-y-4">
            <div className="bg-[#FDF0F0] border border-[#D4A0A0] rounded-lg p-3 mb-4">
              <p className="text-[#8B1A1A] font-semibold text-sm">📋 Demo OTP: Enter 1 2 3 4 in the boxes below</p>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-[#8B1A1A] text-xs font-semibold">Step 2 of 2</span>
            </div>

            <div className="text-center">
              <p className="text-gray-500 text-sm mb-4">Enter the 4-digit OTP sent to your registered email/mobile</p>
              
              <div className={`flex justify-center gap-3 ${isShaking && isForgotModalOpen ? 'animate-shake' : ''}`}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (otpRefs.current[i] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className="w-12 h-14 text-center text-2xl font-bold bg-white border-2 border-[#D4A0A0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A]"
                  />
                ))}
              </div>
              {otpError && (
                <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
                  ⚠ {otpError}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3 mt-6">
              <Button className="w-full bg-[#8B1A1A] hover:bg-[#6B1010]" onClick={handleVerifyOtp} isLoading={isLoading}>
                Verify OTP
              </Button>
              <div className="text-center">
                <button 
                  onClick={handleResendOtp}
                  className="text-sm text-[#8B1A1A] font-medium hover:underline"
                >
                  Didn't receive OTP? Resend
                </button>
              </div>
            </div>

            {resendToast && (
              <div className="fixed top-4 right-4 bg-white border-l-4 border-[#8B1A1A] shadow-lg rounded-lg p-4 z-50 animate-in fade-in slide-in-from-top-4">
                <p className="text-sm font-medium">OTP resent!</p>
              </div>
            )}
          </div>
        )}

        {forgotStep === 3 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-[#FDF0F0] rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[#D4A0A0]">
              <CheckCircle2 className="h-10 w-10 text-[#8B1A1A]" />
            </div>
            <h3 className="text-xl font-bold text-[#8B1A1A]">✅ Password Reset Successful!</h3>
            <p className="text-sm text-gray-500 mt-2">You can now login with your new password.</p>
          </div>
        )}
      </Modal>
    </div>
  );
};
