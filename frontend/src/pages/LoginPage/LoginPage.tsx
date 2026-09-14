import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import MobileHeader from '../../components/MobileHeader';
import LandingMobileNavigation from '../../components/LandingMobileNavigation';

function LoginPage() {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');

    if (!email.trim()) {
      setError('Email is required.');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email.');
      return;
    }

    if (!password.trim()) {
      setError('Password is required.');
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);

      navigate('/home');
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 pb-24 text-white sm:pb-0">
      <MobileHeader to="/" />

      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-md items-center justify-center px-5 py-12 sm:px-6">
        <section className="w-full">
          <div className="mb-8 text-center">
            <Link
              to="/"
              className="hidden text-2xl font-bold tracking-tight text-white sm:inline-block"
            >
              SpeakBuddy
            </Link>

            <h1 className="mt-8 text-3xl font-bold tracking-tight sm:text-4xl">
              Welcome back 👋
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-400 sm:text-base">
              Continue your speaking journey.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/20 sm:p-8"
          >
            <div className="flex w-full justify-center">
              {error && (
                <p className="mt-1 text-center text-sm font-medium text-red-500">
                  {error}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium text-slate-200"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-blue-400"
                placeholder="you@example.com"
              />
            </div>

            <div className="mt-5">
              <label
                htmlFor="password"
                className="text-sm font-medium text-slate-200"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-blue-400"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex w-full justify-center">
              {success && (
                <p className="mt-1 text-center text-sm font-medium text-green-500">
                  {success}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 w-full rounded-xl bg-blue-500 px-4 py-3 font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400"
            >
              {isLoading ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-blue-400 hover:text-blue-300"
            >
              Sign up
            </Link>
          </p>
        </section>
      </div>

      <LandingMobileNavigation showHome={true} />
    </main>
  );
}

export default LoginPage;
