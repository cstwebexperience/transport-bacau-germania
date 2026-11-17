import { createRequire } from 'module';
const require = createRequire('C:/Users/cst/axphub/');
const pw = require('playwright');
import http from 'http'; import fs from 'fs'; import path from 'path';
const root = path.resolve(process.argv[2]); const out = process.argv[3];
const types={'.html':'text/html','.jpg':'image/jpeg','.js':'text/javascript','.css':'text/css','.woff2':'font/woff2'};
const srv = http.createServer((q,r)=>{let p=path.join(root,decodeURIComponent(q.url.split('?')[0]));if(fs.existsSync(p)&&fs.statSync(p).isDirectory())p=path.join(p,'index.html');if(!fs.existsSync(p)){r.writeHead(404);return r.end();}r.writeHead(200,{'content-type':types[path.extname(p)]||'application/octet-stream'});fs.createReadStream(p).pipe(r);}).listen(4777);
const runs=[['chromium','desk',{width:1536,height:864}],['chromium','m412',{width:412,height:900,isMobile:true,hasTouch:true,deviceScaleFactor:2}],['webkit','iphone',{width:390,height:844,isMobile:true,hasTouch:true,deviceScaleFactor:2}],['chromium','m320',{width:320,height:700,isMobile:true,hasTouch:true}]];
for (const [eng,name,vp] of runs){
  const b = await pw[eng].launch(); const ctx = await b.newContext({viewport:{width:vp.width,height:vp.height},isMobile:vp.isMobile,hasTouch:vp.hasTouch,deviceScaleFactor:vp.deviceScaleFactor||1});
  const p = await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
  await p.goto('http://localhost:4777/',{waitUntil:'networkidle'}); await p.waitForTimeout(2500);
  await p.screenshot({path:`${out}/${name}-hero.png`});
  const ov = await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
  await p.evaluate(()=>document.querySelectorAll('.rv').forEach(e=>e.classList.add('in')));
  await p.waitForTimeout(1000);
  await p.screenshot({path:`${out}/${name}-full.png`,fullPage:true});
  console.log(name,'overflow',ov,'errors',errs);
  await b.close();
}
srv.close();
