import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('out');
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json','.txt':'text/plain','.xml':'application/xml','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.ico':'image/x-icon','.pdf':'application/pdf','.woff2':'font/woff2','.woff':'font/woff'};
http.createServer(async(req,res)=>{
 if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405);res.end();return;}
 try{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if(pathname==='/.netlify/functions/google-reviews'){
   const lang=new URL(req.url,'http://localhost').searchParams.get('lang')==='en'?'en':'it';
   try{const upstream=await fetch('https://clmautomation.it/.netlify/functions/google-reviews?lang='+lang,{signal:AbortSignal.timeout(10000)});const body=await upstream.text();res.writeHead(upstream.status,{'Content-Type':'application/json; charset=utf-8'});res.end(req.method==='HEAD'?undefined:body);}catch{res.writeHead(502,{'Content-Type':'application/json'});res.end(JSON.stringify({error:'Reviews unavailable'}));}return;
  }
  let file=path.resolve(root,'.'+pathname);
  if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  if((await stat(file)).isDirectory())file=path.join(file,'index.html');
  const data=await readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});res.end(req.method==='HEAD'?undefined:data);
 }catch{res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});res.end(await readFile(path.join(root,'404.html')).catch(()=>Buffer.from('Not found')));}
}).listen(Number(process.env.PORT||3101),'127.0.0.1',()=>console.log('Preview: http://localhost:'+(process.env.PORT||3101)));
