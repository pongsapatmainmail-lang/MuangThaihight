import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // ตรวจสอบรหัสผ่าน
    if (formData.password !== formData.password2) {
      setError('รหัสผ่านไม่ตรงกัน');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร');
      setLoading(false);
      return;
    }

    const result = await register(formData);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ee4d2d] to-[#f05d40] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-white text-5xl font-bold mb-2">Shopee</h1>
          <p className="text-white/90">สร้างบัญชีใหม่</p>
        </div>

        {/* Register Form */}
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            สมัครสมาชิก
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                ชื่อผู้ใช้ *
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ee4d2d]"
                placeholder="username"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                อีเมล *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ee4d2d]"
                placeholder="example@email.com"
              />
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  ชื่อ
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ee4d2d]"
                  placeholder="ชื่อจริง"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  นามสกุล
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ee4d2d]"
                  placeholder="นามสกุล"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                รหัสผ่าน *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ee4d2d]"
                placeholder="อย่างน้อย 8 ตัวอักษร"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                ยืนยันรหัสผ่าน *
              </label>
              <input
                type="password"
                name="password2"
                value={formData.password2}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ee4d2d]"
                placeholder="กรอกรหัสผ่านอีกครั้ง"
              />
            </div>

            {/* Terms */}
            <div className="text-xs text-gray-600">
              การสมัครสมาชิก ถือว่าคุณยอมรับ{' '}
              <a href="#" className="text-[#ee4d2d] hover:underline">
                ข้อตกลงและเงื่อนไข
              </a>{' '}
              และ{' '}
              <a href="#" className="text-[#ee4d2d] hover:underline">
                นโยบายความเป็นส่วนตัว
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#ee4d2d] hover:bg-[#d73211] text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">หรือสมัครด้วย</span>
            </div>
          </div>

          {/* Social Register */}
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-2 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-xl">G</span>
              <span className="font-semibold text-gray-700">สมัครด้วย Google</span>
            </button>

            <button className="w-full flex items-center justify-center gap-2 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-xl">f</span>
              <span className="font-semibold text-gray-700">สมัครด้วย Facebook</span>
            </button>
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center text-gray-600">
            มีบัญชีอยู่แล้ว?{' '}
            <Link to="/login" className="text-[#ee4d2d] font-semibold hover:underline">
              เข้าสู่ระบบ
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-white hover:underline">
            ← กลับหน้าหลัก
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;