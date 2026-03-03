import fs from 'fs';
import fetch from 'node-fetch';
import FormData from 'form-data';

// simple helper to make request with cookie jar
let cookies = [];

function saveCookies(res) {
  const set = res.headers.raw()['set-cookie'];
  if (set) {
    set.forEach(cookie => {
      const part = cookie.split(';')[0];
      if (!cookies.includes(part)) cookies.push(part);
    });
  }
}

function cookieHeader() {
  return cookies.join('; ');
}

async function main() {
  const base = 'http://localhost:3000';
  // register a user
  console.log('Registering user');
  let res = await fetch(base + '/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ login_id: 'testuser', nickname: 'Test', email: 'test@example.com', password: 'Password123!', confirmPassword: 'Password123!' }),
    redirect: 'manual'
  });
  saveCookies(res);
  console.log('Register status', res.status);

  // login
  console.log('Logging in');
  res = await fetch(base + '/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': cookieHeader() },
    body: new URLSearchParams({ login_id: 'testuser', password: 'Password123!' })
  });
  saveCookies(res);
  console.log('Login status', res.status, 'cookies', cookies);

  // upload image
  console.log('Uploading image');
  const form = new FormData();
  // create a tiny PNG 1x1 base64
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=', 'base64');
  form.append('profileImage', png, { filename: 'tiny.png', contentType: 'image/png' });

  res = await fetch(base + '/profile/update-image', {
    method: 'POST',
    headers: { 'Cookie': cookieHeader() },
    body: form,
    redirect: 'manual'
  });
  console.log('Upload status', res.status);
  const text = await res.text();
  console.log('Upload response text', text.slice(0,200));
}

main().catch(console.error);
