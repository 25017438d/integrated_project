import fetch from 'node-fetch';
import FormData from 'form-data';

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
  // register new user
  let res = await fetch(base + '/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ login_id: 'noticeuser', nickname: 'Notice', email: 'notice@example.com', password: 'Password123!', confirmPassword: 'Password123!' }),
    redirect: 'manual'
  });
  saveCookies(res);
  console.log('register status', res.status);

  // login
  res = await fetch(base + '/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': cookieHeader() },
    body: new URLSearchParams({ login_id: 'noticeuser', password: 'Password123!' })
  });
  saveCookies(res);
  console.log('login status', res.status, cookies);

  // submit notice with image
  const form = new FormData();
  form.append('type', 'lost');
  form.append('venue', 'test');
  form.append('contact', 'test');
  form.append('description', 'desc');
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=', 'base64');
  form.append('image', png, { filename: 'tiny.png', contentType: 'image/png' });

  res = await fetch(base + '/notices/new', {
    method: 'POST',
    headers: { 'Cookie': cookieHeader() },
    body: form,
    redirect: 'manual'
  });
  console.log('notice status', res.status);
  let text = await res.text();
  console.log('notice text', text.slice(0,200));

  // now try uploading a non-image to trigger error
  const badForm = new FormData();
  badForm.append('type','found');
  badForm.append('venue','nowhere');
  badForm.append('contact','none');
  badForm.append('description','bad');
  badForm.append('image', Buffer.from('hello'), { filename: 'bad.txt', contentType: 'text/plain' });
  res = await fetch(base + '/notices/new', {
    method: 'POST',
    headers: { 'Cookie': cookieHeader() },
    body: badForm,
    redirect: 'manual'
  });
  console.log('bad upload status', res.status);
  text = await res.text();
  console.log('bad upload response', text.slice(0,200));
}

main().catch(console.error);
