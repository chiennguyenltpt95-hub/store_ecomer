import { Eye, EyeOff, Mail } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!form.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Enter a valid email';
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // TODO: connect to auth service
    navigate('/');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-start">
      <div className="w-1/3 bg-black relative">
        <img src="/banner-login.svg" alt="Login Banner" className="w-full h-full object-cover absolute top-0 left-0" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center p-6 relative ">
        <div className="flex flex-col w-1/3 border-0 border-white rounded-[6px] p-8 bg-[#F7F7F7] shadow-lg h-max">
          <div className="relative flex gap-1.5">
            <button
              type="button"
              className="w-full border-0  bg-[#A5D4FE] text-sm font-semibold py-2.5 rounded-xl shadow-[0_0_2px_0_rgba(23,26,31,0.12),0_0_1px_0_rgba(23,26,31,0.07)] transition-colors cursor-pointer"
            >
              Login
            </button>
            <button
              type="button"
              className="w-full border border-gray-300 text-sm font-semibold py-2.5 rounded-2xl shadow-[0_0_2px_0_rgba(23,26,31,0.12),0_0_1px_0_rgba(23,26,31,0.07)] transition-colors cursor-pointer"
            >
              Sign Up
            </button>
          </div>
          <h1 className="text-4xl font-bold text-center mt-8 mb-8">
            Welcome <br /> Back!
          </h1>
          <p className="text-center text-[20px] text-gray-500 mb-6">Login to your account</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <fieldset>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input id="username" type="text" className="block pl-9 pr-3 p-2 rounded border border-black/10 w-full" />
              </div>
            </fieldset>
            <fieldset>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input id="password" type={showPassword ? 'text' : 'password'} className="block pr-9 p-2 rounded border border-black/10 w-full" />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </fieldset>
            <p className="text-sm text-blue-500 cursor-pointer text-right mt-0">Forgot Password?</p>

            <button
              type="submit"
              className="w-1/2 border-0 m-auto bg-[#A5D4FE] text-sm font-semibold py-2.5 rounded-xl shadow-[0_0_2px_0_rgba(23,26,31,0.12),0_0_1px_0_rgba(23,26,31,0.07)] transition-colors cursor-pointer mt-4"
            >
              Login
            </button>
          </form>

          <div className="flex items-center gap-2 my-6 ">
            <img src="line.svg" alt="" className="flex-1 h-[2px] w-full" />
            <p className="text-sm text-gray-500">Or continue with</p>
            <img src="line.svg" alt="" className="flex-1 h-[2px] w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
