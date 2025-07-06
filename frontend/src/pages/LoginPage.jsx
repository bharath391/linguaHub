import { useState } from "react";
import { Link } from "react-router";
import useLogin from "../hooks/useLogin";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const { isPending, error, loginMutation } = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };

  return (
    <div className="h-screen flex items-center justify-center p-4 bg-black">
      <div className="flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden border border-yellow-600/30">
        {/* LOGIN FORM SECTION */}
        <div className="w-full lg:w-1/2 p-6 sm:p-10 flex flex-col justify-center">
          {/* LOGO */}
          <div className="mb-6 flex items-center justify-start gap-3">
            <img className="size-10" src="/linguaLogo.png" alt="Logo" />
            <span className="text-3xl font-bold tracking-widest text-yellow-400 font-mono">
              LinguaHub
            </span>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="alert bg-yellow-800 text-yellow-100 border border-yellow-600 mb-4">
              <span>{error.response.data.message}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-yellow-400">Welcome Back</h2>
              <p className="text-sm text-neutral-400">
                Sign in to continue your language journey
              </p>
            </div>

            <div className="space-y-5">
              {/* Email */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-neutral-300">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="input bg-neutral-800 border border-neutral-700 focus:outline-none focus:border-yellow-500 text-neutral-100"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                />
              </div>

              {/* Password */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-neutral-300">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input bg-neutral-800 border border-neutral-700 focus:outline-none focus:border-yellow-500 text-neutral-100"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn bg-yellow-500 hover:bg-yellow-400 text-black font-semibold w-full transition"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>

              {/* Link */}
              <div className="text-center mt-4">
                <p className="text-sm text-neutral-400">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-yellow-400 hover:underline font-medium"
                  >
                    Create one
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>

        {/* IMAGE SECTION */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-neutral-800 items-center justify-center border-l border-neutral-700">
          <div className="max-w-md p-10">
            <div className="relative aspect-square max-w-sm mx-auto">
              <img
                src="/i.png"
                alt="Language connection illustration"
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />
            </div>

            <div className="text-center mt-6 space-y-3">
              <h2 className="text-xl font-semibold text-yellow-400">
                Connect with language partners
              </h2>
              <p className="text-neutral-400">
                Practice conversations, make friends, and improve your skills together.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
