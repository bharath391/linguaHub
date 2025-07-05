import { useState } from "react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import useSignUp from "../hooks/useSignUp";

const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { isPending, error, signupMutation } = useSignUp();

  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation(signupData);
  };

  return (
    <div className="h-screen flex items-center justify-center p-4 bg-black">
      <div className="flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden border border-yellow-600/30">
        {/* LEFT - SIGNUP FORM */}
        <div className="w-full lg:w-1/2 p-6 sm:p-10 flex flex-col justify-center">
          {/* LOGO */}
          <div className="mb-6 flex items-center justify-start gap-3">
            <img className="size-10" src="/linguaLogo.png" alt="Logo" />
            <span className="text-3xl font-bold tracking-widest text-yellow-400 font-mono">
              LinguaHub
            </span>
          </div>

          {/* ERROR */}
          {error && (
            <div className="alert bg-yellow-800 text-yellow-100 border border-yellow-600 mb-4">
              <span>{error.response.data.message}</span>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-yellow-400">
                Create an Account
              </h2>
              <p className="text-sm text-neutral-400">
                Join LinguaHub and start your language adventure!
              </p>
            </div>

            <div className="space-y-5">
              {/* FULL NAME */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-neutral-300">Full Name</span>
                </label>
                <input
                  type="text"
                  placeholder="name here.. "
                  className="input bg-neutral-800 border border-neutral-700 focus:outline-none focus:border-yellow-500 text-neutral-100"
                  value={signupData.fullName}
                  onChange={(e) =>
                    setSignupData({ ...signupData, fullName: e.target.value })
                  }
                  required
                />
              </div>

              {/* EMAIL */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-neutral-300">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="email here.."
                  className="input bg-neutral-800 border border-neutral-700 focus:outline-none focus:border-yellow-500 text-neutral-100"
                  value={signupData.email}
                  onChange={(e) =>
                    setSignupData({ ...signupData, email: e.target.value })
                  }
                  required
                />
              </div>

              {/* PASSWORD */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-neutral-300">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="********"
                  className="input bg-neutral-800 border border-neutral-700 focus:outline-none focus:border-yellow-500 text-neutral-100"
                  value={signupData.password}
                  onChange={(e) =>
                    setSignupData({ ...signupData, password: e.target.value })
                  }
                  required
                />
                <p className="text-xs text-neutral-500 mt-1">
                  Password must be at least 6 characters long
                </p>
              </div>

              {/* TERMS */}
              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm checkbox-warning"
                    required
                  />
                  <span className="text-xs leading-tight text-neutral-400">
                    I agree to the{" "}
                    <span onClick={() => toast.success('chill bruh , no terms and conditions !')} className="text-yellow-400 hover:underline">
                      terms of service
                    </span>{" "}
                    and{" "}
                    <span onClick={() => toast.success('chill chill , you data is safe with me and i do not store any chat or calls data--refer opensource-- !')} className="text-yellow-400 hover:underline">
                      privacy policy
                    </span>
                  </span>
                </label>
              </div>

              {/* SUBMIT */}
              <button
                className="btn bg-yellow-500 hover:bg-yellow-400 text-black font-semibold w-full transition"
                type="submit"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>

              {/* LOGIN LINK */}
              <div className="text-center mt-4">
                <p className="text-sm text-neutral-400">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-yellow-400 hover:underline font-medium"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>

        {/* RIGHT - IMAGE */}
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
                Connect and Learn with Friends
              </h2>
              <p className="text-neutral-400">
                Make new friends, practice languages, and explore cultures together.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
