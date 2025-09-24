import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, ArrowRight, ArrowLeft, Shield, Clock } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState(1); // 1: Registration form, 2: OTP verification
  const [resendTimer, setResendTimer] = useState(0);
  
  const { register, verifyRegistration, resendOTP } = useAuth();

  // Start resend timer
  const startResendTimer = () => {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Basic validation
    if (!email || !password || !confirmPassword) {
      setError('يرجى ملء جميع الحقول');
      setLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setError('يرجى إدخال بريد إلكتروني صحيح');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('كلمة المرور وتأكيدها غير متطابقين');
      setLoading(false);
      return;
    }

    const result = await register(email, password, confirmPassword);
    
    if (result.success) {
      setSuccess(result.message);
      setStep(2);
      startResendTimer();
    } else {
      setError(result.error || 'فشل إنشاء الحساب');
    }
    
    setLoading(false);
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!otp || otp.length !== 6) {
      setError('يرجى إدخال رمز التحقق المكون من 6 أرقام');
      setLoading(false);
      return;
    }

    const result = await verifyRegistration(email, otp);
    
    if (result.success) {
      setSuccess(result.message);
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } else {
      setError(result.error || 'فشل التحقق من الرمز');
    }
    
    setLoading(false);
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    
    setLoading(true);
    setError('');
    
    const result = await resendOTP(email, 'register');
    
    if (result.success) {
      setSuccess(result.message);
      startResendTimer();
    } else {
      setError(result.error || 'فشل إعادة إرسال الرمز');
    }
    
    setLoading(false);
  };

  const goBack = () => {
    setStep(1);
    setOtp('');
    setError('');
    setSuccess('');
    setResendTimer(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4" dir="rtl">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">أ</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {step === 1 ? 'إنشاء حساب جديد' : 'التحقق من البريد الإلكتروني'}
          </h1>
          <p className="text-gray-600">
            {step === 1 ? 'انضم إلى نظام إدارة المتجر' : 'أدخل رمز التحقق المرسل إلى بريدك الإلكتروني'}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                {success}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="أدخل بريدك الإلكتروني"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-10 pl-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="أدخل كلمة المرور"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تأكيد كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pr-10 pl-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="أعد إدخال كلمة المرور"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              variant="success"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  جاري إنشاء الحساب...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  إنشاء الحساب
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleOTPSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                {success}
              </div>
            )}

            <div className="text-center mb-6">
              <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                تم إرسال رمز التحقق إلى:
              </p>
              <p className="font-medium text-gray-900">{email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رمز التحقق
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-center text-lg tracking-widest"
                  placeholder="000000"
                  maxLength="6"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              variant="success"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  جاري التحقق...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  التحقق من الرمز
                  <Shield className="w-4 h-4" />
                </div>
              )}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={resendTimer > 0 || loading}
                className="text-green-600 hover:text-green-800 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                {resendTimer > 0 ? (
                  <div className="flex items-center justify-center gap-2">
                    <Clock className="w-4 h-4" />
                    إعادة الإرسال خلال {resendTimer} ثانية
                  </div>
                ) : (
                  'إعادة إرسال الرمز'
                )}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={goBack}
                className="text-gray-600 hover:text-gray-800 font-medium flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                العودة للخلف
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            لديك حساب بالفعل؟{' '}
            <button
              onClick={() => window.location.href = '/login'}
              className="text-green-600 hover:text-green-800 font-medium"
            >
              تسجيل الدخول
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Register;
