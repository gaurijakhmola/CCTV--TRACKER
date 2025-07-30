const BASE_URL = 'http://localhost:4000/api';

export async function login(username, password) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Login failed');
  }
  return res.json();
}

export async function fetchStations() {
  const res = await fetch(`${BASE_URL}/stations`);
  if (!res.ok) throw new Error('Failed to load stations');
  return res.json();
}

// Add other APIs similarly...
