fetch('http://localhost:3001/api/auth/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@securecare.local', password: 'admin123' })
}).then(r => r.text()).then(console.log).catch(console.error);
