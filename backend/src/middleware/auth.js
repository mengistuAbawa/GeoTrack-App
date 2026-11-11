const jwt=require('jsonwebtoken');
function authenticate(req,res,next){ const h=req.headers.authorization||''; if(!h.startsWith('Bearer ')) return res.status(401).json({message:'Authentication required'}); try { req.auth=jwt.verify(h.slice(7),process.env.JWT_SECRET); next(); } catch { return res.status(401).json({message:'Invalid or expired token'}); } }
exports.authenticate=authenticate;
exports.requireUser=(req,res,next)=>{ if(req.auth?.type!=='user') return res.status(403).json({message:'User access required'}); next(); };
exports.requireAdmin=(req,res,next)=>{ if(req.auth?.type!=='admin') return res.status(403).json({message:'Administrator access required'}); next(); };
