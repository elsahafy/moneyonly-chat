import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/me`, {
          headers: { Authorization: token },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setUser(data);
      } catch (err) {
        localStorage.removeItem('token');
        navigate('/auth/login');
      }
    };

    fetchUser();
  }, [navigate]);

  return (
    <div className="p-6">
      {user ? (
        <>
          <h1 className="text-2xl font-bold">Welcome, {user.name}!</h1>
          <p className="text-gray-700">Your email: {user.email}</p>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;