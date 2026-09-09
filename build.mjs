import { mkdir, cp, readFile, writeFile } from 'node:fs/promises';
import vm from 'node:vm';
const files = ['index.html', 'style.css', 'script.js', 'order.js', 'menu.js'];
await mkdir('dist/assets', { recursive: true });
for (const file of files) {
  const source = await readFile(file, 'utf8');
  if (file.endsWith('.js')) new vm.Script(source, { filename: file });
  await writeFile(`dist/${file}`, source, 'utf8');
}
await cp('assets', 'dist/assets', { recursive: true });
console.log('Site estático gerado em dist. HTML, CSS e JavaScript puro; nenhuma dependência de runtime.');
