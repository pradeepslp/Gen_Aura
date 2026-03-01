const testAdminLogin = async () => {
    try {
        const res = await fetch('http://localhost:3001/api/auth/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'admin@securecare.local',
                password: 'AdminSecurePassword123!'
            })
        });
        const data = await res.json();
        console.log("LOGIN RESPONSE:", data);
    } catch (err) {
        console.error(err);
    }
}
testAdminLogin();
