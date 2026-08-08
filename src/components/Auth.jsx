import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import authService from "../appwrite/auth";
import { login } from "../store/authSlice";
import { Button, Input, Logo } from "./index";

const tabs = [
  { key: "login", label: "Log In", to: "/login" },
  { key: "signup", label: "Sign Up", to: "/signup" },
];

function EnvelopeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  );
}

function Auth({ initialTab = "login" }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isLogin = initialTab === "login";

  const onSubmit = async (data) => {
    if (submitting) return;
    setSubmitting(true);
    setError("");
    try {
      if (isLogin) {
        const session = await authService.login(data);
        if (session) {
          const userData = await authService.getCurrentUser();
          if (userData) dispatch(login({ userData }));
          navigate("/");
        }
      } else {
        const created = await authService.createAccount(data);
        if (created) {
          const userData = await authService.getCurrentUser();
          if (userData) {
            dispatch(login({ userData }));
            navigate("/");
          }
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex w-full flex-col items-center justify-center py-12">
      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-white shadow-sm">
        <Logo iconOnly />
      </div>

      <div className="mt-6 w-full max-w-md rounded-2xl border border-stone-200 bg-white shadow-xl shadow-stone-200/50 dark:border-white/10 dark:bg-[#111114]">
        <div
          role="tablist"
          aria-label="Authentication"
          className="flex border-b border-stone-200 dark:border-white/10"
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={initialTab === tab.key}
              onClick={() => navigate(tab.to)}
              className={`flex-1 border-b-2 px-4 py-4 text-sm transition-colors ${
                initialTab === tab.key
                  ? "border-indigo-600 font-bold text-stone-900 dark:border-pink-500 dark:text-white"
                  : "border-transparent font-medium text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-8">
          <h2 className="text-center font-display text-3xl font-bold text-stone-900 dark:text-white">
            {isLogin ? "Welcome back" : "Create your account"}
          </h2>

          {error && (
            <p
              role="alert"
              className="mt-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-400"
            >
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
            <div className="space-y-5">
              {!isLogin && (
                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  icon={<UserIcon />}
                  {...register("name", { required: true })}
                />
              )}
              <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                icon={<EnvelopeIcon />}
                {...register("email", {
                  required: true,
                  validate: {
                    matchPattern: (value) =>
                      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                      "Email address must be a valid address",
                  },
                })}
              />
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                icon={<LockIcon />}
                {...register("password", { required: true })}
              />
              <Button
                type="submit"
                variant="auth"
                size="lg"
                className="w-full"
                loading={submitting}
              >
                {isLogin ? "SIGN IN" : "CREATE ACCOUNT"}
              </Button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-stone-500 dark:text-zinc-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Link
              to={isLogin ? "/signup" : "/login"}
              className="font-medium text-indigo-600 transition-colors hover:text-indigo-500 dark:text-pink-400 dark:hover:text-pink-300"
            >
              {isLogin ? "Create an account" : "Log in"}
            </Link>
          </p>
        </div>
      </div>

      <p className="mt-8 text-center text-sm font-medium text-stone-500 dark:text-zinc-400">
        © {new Date().getFullYear()} MegaBlog.{" "}
        <Link
          to="/"
          className="transition-colors hover:text-indigo-600 dark:hover:text-pink-400"
        >
          Return to Home.
        </Link>
      </p>
    </div>
  );
}

export default Auth;
