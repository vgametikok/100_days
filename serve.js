const http=require('http'),fs=require('fs'),path=require('path');
const ROOT=__dirname;
const PORT=+process.argv[2]||5090;
const TYPES={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css','.png':'image/png','.json':'application/json'};
http.createServer((req,res)=>{
  if(req.method==='POST'&&req.url==='/shot'){
    let body='';req.on('data',c=>body+=c);
    req.on('end',()=>{
      const b64=body.replace(/^data:image\/\w+;base64,/,'');
      fs.writeFileSync(path.join(ROOT,'shot.png'),Buffer.from(b64,'base64'));
      res.writeHead(200);res.end('ok');
    });return;
  }
  let p=decodeURIComponent(req.url.split('?')[0]);
  if(p==='/'||p==='') p='/index.html';
  const file=path.join(ROOT,p);
  fs.readFile(file,(err,data)=>{
    if(err){res.writeHead(404);res.end('not found');return;}
    const ext=path.extname(file).toLowerCase();
    res.writeHead(200,{'Content-Type':TYPES[ext]||'application/octet-stream','Cache-Control':'no-store'});
    res.end(data);
  });
}).listen(PORT,()=>console.log('100-days-survive on '+PORT));
