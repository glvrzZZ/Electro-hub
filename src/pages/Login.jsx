import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(username, password);
    if (success) {
      navigate('/'); // ⬅️ Перенаправляем на главную после входа
    } else {
      setError('Неверный логин или пароль');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Вход</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Логин"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Войти</button>
      </form>
      {error && <p style={styles.error}>{error}</p>}
      <p style={styles.hint}>Для теста: логин <b>user</b>, пароль <b>pass</b></p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 320,
    margin: '80px auto',
    padding: 20,
    background: '#111',
    color: 'white',
    borderRadius: 10,
    boxShadow: '0 0 15px rgba(255,255,255,0.1)',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    marginBottom: 12,
    padding: 10,
    fontSize: 16,
    borderRadius: 4,
    border: '1px solid #444',
    backgroundColor: '#222',
    color: 'white',
  },
  button: {
    width: '100%',
    padding: 10,
    fontSize: 16,
    backgroundColor: '#1976d2',
    color: 'white',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
  hint: {
    marginTop: 20,
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
  }
};
