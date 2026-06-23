const root = await fetch('http://127.0.0.1:4000/');
console.log('ROOT', root.status, root.statusText);
console.log(await root.text());

const api = await fetch('http://127.0.0.1:4000/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: 'test', description: 'test' }),
});
console.log('API', api.status, api.statusText);
console.log(await api.text());
