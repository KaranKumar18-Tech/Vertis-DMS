import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff } from 'lucide-react';

export const InvestorLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    consentChecked: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    
    if (!formData.username.trim())
      newErrors.username = 'Please enter your username or PAN number';
    
    if (!formData.password.trim())
      newErrors.password = 'Please enter your password';
    
    if (!formData.consentChecked)
      newErrors.consent = 'You must accept the consent to proceed';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    const validUsernames = [
      'investor', 'IJKLM9012N', 
      'prasad@vertis.co.in'
    ];
    const validPassword = 'Investor@123';
    
    if (!validUsernames.includes(formData.username) ||
      formData.password !== validPassword) {
      setLoginAttempts(prev => prev + 1);
      setErrors({ 
        credentials: 'Invalid username or password' 
      });
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      navigate('/investor-preview');
    }, 1200);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F0E8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '460px', margin: '0 auto', paddingTop: '48px', paddingBottom: '40px', paddingLeft: '24px', paddingRight: '24px' }}>
        
        {/* TOP BRANDING */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <img 
            src="https://i.postimg.cc/tgd6PLdh/image.png"
            alt="VERTIS"
            style={{ height: '44px', objectFit: 'contain', marginBottom: '16px', display: 'block', margin: '0 auto 16px' }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                const fallback = document.createElement('div');
                fallback.textContent = 'VERTIS';
                fallback.style.color = '#8B1A1A';
                fallback.style.fontWeight = 'bold';
                fallback.style.fontSize = '20px';
                fallback.style.marginBottom = '16px';
                parent.insertBefore(fallback, target);
              }
            }}
          />
          <h1 style={{ color: '#8B1A1A', fontWeight: 'bold', fontSize: '22px', marginBottom: '4px' }}>
            Investor Portal
          </h1>
          <p style={{ color: '#6B7280', fontSize: '13px' }}>
            Vertis Infrastructure Trust
          </p>
        </div>

        {/* DEMO CREDENTIALS HINT BOX */}
        <div style={{
          backgroundColor: '#FEF3C7',
          border: '1px solid #F59E0B',
          borderRadius: '12px',
          padding: '14px 18px',
          marginBottom: '16px',
          display: 'flex',
          gap: '10px',
          alignItems: 'flex-start'
        }}>
          <span style={{ fontSize: '16px', flexShrink: 0, marginTop: '1px' }}>ℹ️</span>
          <div>
            <p style={{ fontWeight: '600', color: '#92400E', fontSize: '13px', marginBottom: '6px' }}>
              Demo Credentials — Copy & Paste
            </p>
            
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#92400E', fontSize: '12px', minWidth: '75px' }}>
                  Username:
                </span>
                <code style={{
                  backgroundColor: 'white',
                  border: '1px solid #F59E0B',
                  borderRadius: '6px',
                  padding: '3px 10px',
                  fontSize: '13px',
                  color: '#1A1A1A',
                  fontFamily: 'monospace',
                  cursor: 'pointer',
                  userSelect: 'all'
                }}
                onClick={() => copyToClipboard('investor', 'username')}>
                  investor
                </code>
                {copied === 'username' && 
                  <span style={{ color: '#166534', fontSize: '11px' }}>✓ Copied!</span>
                }
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#92400E', fontSize: '12px', minWidth: '75px' }}>
                  Password:
                </span>
                <code style={{
                  backgroundColor: 'white',
                  border: '1px solid #F59E0B',
                  borderRadius: '6px',
                  padding: '3px 10px',
                  fontSize: '13px',
                  color: '#1A1A1A',
                  fontFamily: 'monospace',
                  cursor: 'pointer',
                  userSelect: 'all'
                }}
                onClick={() => copyToClipboard('Investor@123', 'password')}>
                  Investor@123
                </code>
                {copied === 'password' && 
                  <span style={{ color: '#166534', fontSize: '11px' }}>✓ Copied!</span>
                }
              </div>
            </div>
            
            <p style={{ fontSize: '11px', color: '#92400E', marginTop: '8px', opacity: 0.8 }}>
              💡 Click any value to copy it instantly
            </p>
          </div>
        </div>

        {/* FORM CARD */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          padding: '28px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid #E5E7EB'
        }}>
          <h2 style={{ fontWeight: 'bold', fontSize: '18px', color: '#1A1A1A', marginBottom: '4px' }}>
            Investor Login
          </h2>
          <p style={{ color: '#6B7280', fontSize: '12px', marginBottom: '20px' }}>
            Access your distribution details and documents
          </p>

          <form onSubmit={handleLogin}>
            {/* FIELD 1 — Username */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px', display: 'block' }}>
                Username / PAN *
              </label>
              <div style={{ position: 'relative' }}>
                <User style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} size={15} />
                <input
                  type="text"
                  placeholder="Enter username or PAN"
                  value={formData.username}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, username: e.target.value }));
                    if (errors.username) setErrors(prev => ({ ...prev, username: '' }));
                  }}
                  style={{
                    width: '100%',
                    paddingLeft: '36px',
                    paddingRight: '12px',
                    paddingTop: '10px',
                    paddingBottom: '10px',
                    border: errors.username ? '1px solid #DC2626' : '1px solid #D1D5DB',
                    borderRadius: '10px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: errors.username ? '#FEF2F2' : 'white',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              {errors.username && (
                <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>
                  ⚠ {errors.username}
                </p>
              )}
            </div>

            {/* FIELD 2 — Password */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px', display: 'block' }}>
                Password *
              </label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} size={15} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, password: e.target.value }));
                    if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                  }}
                  style={{
                    width: '100%',
                    paddingLeft: '36px',
                    paddingRight: '40px',
                    paddingTop: '10px',
                    paddingBottom: '10px',
                    border: errors.password ? '1px solid #DC2626' : '1px solid #D1D5DB',
                    borderRadius: '10px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: errors.password ? '#FEF2F2' : 'white',
                    boxSizing: 'border-box'
                  }}
                />
                <div 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                  {showPassword ? <EyeOff size={15} color="#9CA3AF" /> : <Eye size={15} color="#9CA3AF" />}
                </div>
              </div>
              {errors.password && (
                <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>
                  ⚠ {errors.password}
                </p>
              )}
            </div>

            {/* CONSENT CHECKBOX */}
            <div style={{
              backgroundColor: formData.consentChecked ? '#F0FDF4' : '#FDF0F0',
              border: formData.consentChecked ? '1px solid #86EFAC' : errors.consent ? '1px solid #DC2626' : '1px solid #D4A0A0',
              borderRadius: '12px',
              padding: '14px 16px',
              transition: 'all 0.3s ease',
              marginBottom: '20px'
            }}>
              <label style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.consentChecked}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, consentChecked: e.target.checked }));
                    if (errors.consent) setErrors(prev => ({ ...prev, consent: '' }));
                  }}
                  style={{ 
                    marginTop: '2px', 
                    accentColor: '#8B1A1A',
                    width: '15px', height: '15px',
                    flexShrink: 0, cursor: 'pointer'
                  }}
                />
                <span style={{ fontSize: '12px', color: '#374151', lineHeight: '1.5' }}>
                  I consent to this application recording my session data and IP address for audit and compliance purposes as per SEBI guidelines.{' '}
                  <span style={{ color: '#8B1A1A', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}>
                    View Privacy Policy
                  </span>
                </span>
              </label>
              {errors.consent && (
                <p style={{ color: '#DC2626', fontSize: '11px', marginTop: '6px', marginLeft: '25px' }}>
                  ⚠ {errors.consent}
                </p>
              )}
            </div>

            {/* SIGN IN BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                backgroundColor: '#8B1A1A',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '12px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                opacity: isLoading ? 0.8 : 1,
                marginBottom: '16px'
              }}
            >
              {isLoading ? (
                <>
                  <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  Signing in...
                </>
              ) : (
                'Sign In →'
              )}
            </button>

            {/* FORGOT PASSWORD */}
            <div style={{ textAlign: 'right' }}>
              <span style={{ color: '#8B1A1A', fontSize: '13px', cursor: 'pointer' }} className="hover:underline">
                Forgot Password?
              </span>
            </div>

            {/* WRONG CREDENTIALS ERROR */}
            {errors.credentials && (
              <div style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #FCA5A5',
                borderRadius: '10px',
                padding: '12px 14px',
                fontSize: '13px',
                color: '#DC2626',
                marginTop: '12px'
              }}>
                ⚠ {errors.credentials}. Please check your credentials and try again.
                {loginAttempts >= 2 && (
                  <p style={{ marginTop: '6px', fontSize: '12px', color: '#92400E' }}>
                    💡 Hint: Use the demo credentials shown above the form.
                  </p>
                )}
              </div>
            )}
          </form>
        </div>

        {/* BOTTOM SECTION */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p style={{ color: '#6B7280', fontSize: '13px' }}>
            Are you an admin? {' '}
            <span 
              onClick={() => navigate('/admin/login')} 
              style={{ color: '#8B1A1A', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}
              className="hover:underline"
            >
              Admin Login →
            </span>
          </p>
          <span style={{ color: '#9CA3AF', fontSize: '11px', display: 'block', marginTop: '16px' }}>
            © Vertis Infrastructure Trust
          </span>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
};
