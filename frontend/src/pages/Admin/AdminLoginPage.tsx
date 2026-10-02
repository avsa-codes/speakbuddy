import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(
        'http://localhost:5000/api/admin/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Admin login failed.');
      }
      navigate('/admin/dashboard');
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Something went wrong.'
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className='text-white'>
      {' '}
      <h1>Admin Login</h1>{' '}
      <form onSubmit={handleLogin}>
        {' '}
        <div>
          {' '}
          <label htmlFor="email">Email</label>{' '}
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />{' '}
        </div>{' '}
        <div>
          {' '}
          <label htmlFor="password">Password</label>{' '}
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />{' '}
        </div>{' '}
        {error && <p>{error}</p>}{' '}
        <button type="submit" disabled={isLoading}>
          {' '}
          {isLoading ? 'Logging in...' : 'Login'}{' '}
        </button>{' '}
      </form>{' '}
    </div>
  );
}
export default AdminLoginPage;
