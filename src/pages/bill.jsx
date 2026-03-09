import { useState, useCallback } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

// ─── DESIGN TOKENS (matches PVPROTECT white theme) ───────────────────────────
const C = {
  orange:"#FF6B00", orangeD:"#E55A00", orangeBg:"#FFF3EB", orangeBd:"#FFD4B0",
  green:"#00B074",  greenBg:"#E6F8F2", greenBd:"#99DECA",
  red:"#EF4444",    redBg:"#FEF2F2",   redBd:"#FECACA",
  purple:"#7C3AED", purpleBg:"#F5F3FF",purpleBd:"#C4B5FD",
  teal:"#0891B2",   tealBg:"#E0F2FE",  tealBd:"#7DD3FC",
  text:"#111827", textSub:"#6B7280", textLight:"#9CA3AF",
  border:"#E5E7EB", bg:"#F9FAFB", white:"#FFFFFF",
  shadow:"0 1px 3px rgba(0,0,0,0.08),0 4px 16px rgba(0,0,0,0.05)",
  shadowLg:"0 10px 40px rgba(0,0,0,0.18)", radius:14,
};

// ─── SEED DATA ────────────────────────────────────────────────────────────────
const amcFee = 8000;
const SEED_PENDING = [
  { id:"WO-2024-0118", client:"Ramesh Patel",  site:"Rooftop A, Pune",      service:"Maintenance + Repair", tech:"Arun Kumar", date:"Oct 28, 2025", hours:4.5, amc:true,  amcYear:2,
    parts:[
      { id:"p1",name:"MC4 Connector Set",     desc:"Staubli MC4, UV resistant",qty:2, unit:"pair",rate:280,  emoji:"🔌",bg:C.tealBg   },
      { id:"p2",name:"AC/DC Surge Protector", desc:"40kA SPD, DIN rail",      qty:1, unit:"pcs", rate:1800, emoji:"⚡",bg:C.orangeBg },
      { id:"p3",name:"DC Cable 6mm² — 10m",   desc:"TÜV certified",           qty:10,unit:"mtr", rate:65,   emoji:"🔧",bg:C.greenBg  },
    ],
    labor:[
      { id:"l1",name:"Inverter Fault Diagnosis & Repair",desc:"IGBT + firmware",hrs:2.5,rate:800,emoji:"🛠️",bg:C.purpleBg },
      { id:"l2",name:"Annual System Inspection",         desc:"Panel, wiring, earthing",hrs:2.0,rate:800,emoji:"🔍",bg:C.greenBg  },
    ],
    solar:{ gen:412, offset:77, saving:1272, export:376 },
  },
  { id:"WO-2024-0117", client:"Priya Sharma", site:"Flat 4B, Nashik",       service:"New Installation",     tech:"Vijay Rao",  date:"Oct 27, 2025", hours:12, amc:false, amcYear:1,
    parts:[
      { id:"p1",name:"Solar Panel 450W (×8)",desc:"Mono PERC, tier-1",qty:8, unit:"pcs",rate:9500, emoji:"☀️",bg:C.orangeBg },
      { id:"p2",name:"String Inverter 3.6kW",desc:"Solis, grid-tie",  qty:1, unit:"pcs",rate:28000,emoji:"⚡",bg:C.tealBg   },
    ],
    labor:[ { id:"l1",name:"Installation & Commissioning",desc:"Full rooftop setup",hrs:12,rate:700,emoji:"🛠️",bg:C.purpleBg } ],
    solar:{ gen:0, offset:0, saving:0, export:0 },
  },
  { id:"WO-2024-0116", client:"Suresh Mehta", site:"Factory, Aurangabad",   service:"Panel Cleaning",       tech:"Ravi Singh", date:"Oct 26, 2025", hours:2,  amc:false, amcYear:1,
    parts:[ { id:"p1",name:"Cleaning Solution 5L",desc:"Anti-soiling",qty:2,unit:"btl",rate:450,emoji:"🧴",bg:C.tealBg } ],
    labor:[ { id:"l1",name:"Panel Cleaning (24 panels)",desc:"Wash + inspect",hrs:2,rate:600,emoji:"🧹",bg:C.greenBg } ],
    solar:{ gen:380, offset:62, saving:890, export:120 },
  },
];

const SEED_APPROVED = [
  { inv:"INV-2025-1117",client:"Priya Sharma", service:"Panel Cleaning",  amount:11240, credit:890,  amc:true, amcYear:2,by:"Rajesh",date:"Oct 25",status:"paid"   },
  { inv:"INV-2025-1116",client:"Suresh Mehta", service:"Inverter Repair", amount:8450,  credit:312,  amc:false,amcYear:1,by:"Rajesh",date:"Oct 22",status:"viewed" },
  { inv:"INV-2025-1115",client:"Anita Joshi",  service:"New Installation",amount:132800,credit:null, amc:true, amcYear:1,by:"Meera", date:"Oct 18",status:"overdue"},
];

const MONTHLY = [
  {m:"May",grid:3200,solar:1800},{m:"Jun",grid:2800,solar:2400},
  {m:"Jul",grid:2400,solar:2800},{m:"Aug",grid:2100,solar:3100},
  {m:"Sep",grid:2600,solar:2600},{m:"Oct",grid:1760,solar:3200},
];
const ENERGY_SPLIT = [
  {name:"Solar",value:68,color:C.orange},
  {name:"Battery",value:14,color:C.green},
  {name:"Grid",value:18,color:C.purple},
];
const CLIENT_SEED = [
  { id:"INV-2025-0924",title:"Quarterly Panel Cleaning",        date:"Sep 18, 2025",paid:"Sep 22, 2025",amount:3200, saving:960, status:"paid",amc:false },
  { id:"INV-2025-0618",title:"Annual Inspection + AMC Year 1",  date:"Jun 12, 2025",paid:"Jun 15, 2025",amount:16400,saving:1140,status:"paid",amc:true  },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmt  = n => `₹${Number(n).toLocaleString("en-IN")}`;
const calcBill = (wo, incAmc) => {
  const pt  = wo.parts.reduce((s,p)=>s+p.qty*p.rate,0);
  const lt  = wo.labor.reduce((s,l)=>s+l.hrs*l.rate,0);
  const amc = incAmc ? amcFee : 0;
  const sub = pt + lt + amc - (wo.solar.export||0);
  const tax = Math.round(sub * 0.18);
  return { pt, lt, amc, sub, tax, total:sub+tax };
};

// ─── ATOMIC UI ───────────────────────────────────────────────────────────────
const Badge = ({label,color=C.orange,bg})=>(
  <span style={{display:"inline-flex",alignItems:"center",padding:"3px 10px",borderRadius:20,
    fontSize:11,fontWeight:700,whiteSpace:"nowrap",background:bg||(color+"18"),color}}>{label}</span>
);
const StatusBadge = ({status})=>{
  const m={due:{l:"DUE",c:C.orange},paid:{l:"PAID",c:C.green},overdue:{l:"OVERDUE",c:C.red},viewed:{l:"VIEWED",c:C.teal},sent:{l:"SENT",c:C.purple}};
  const s=m[status]||m.due; return <Badge label={s.l} color={s.c}/>;
};
const IconBox = ({emoji,bg,size=40})=>(
  <div style={{width:size,height:size,borderRadius:Math.round(size*.28),background:bg,
    display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*.42,flexShrink:0}}>{emoji}</div>
);
const Card = ({children,style={}})=>(
  <div style={{background:C.white,borderRadius:C.radius,boxShadow:C.shadow,
    border:`1px solid ${C.border}`,padding:"18px 20px",...style}}>{children}</div>
);
const SecLabel = ({children})=>(
  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
    <span style={{fontSize:10,fontWeight:700,color:C.textLight,textTransform:"uppercase",letterSpacing:1.2,whiteSpace:"nowrap"}}>{children}</span>
    <div style={{flex:1,height:1,background:C.border}}/>
  </div>
);
const Inp = ({value,onChange,placeholder,type="text",min,step,style={}})=>(
  <input type={type} value={value} onChange={onChange} placeholder={placeholder} min={min} step={step}
    style={{width:"100%",padding:"7px 10px",borderRadius:8,border:`1px solid ${C.border}`,
      background:C.bg,color:C.text,fontFamily:"inherit",fontSize:13,outline:"none",...style}}/>
);
const TRow = ({label,value,color=C.textSub,bold=false,hi=false})=>(
  <div style={{display:"flex",justifyContent:"space-between",padding:hi?"12px 16px":"9px 16px",
    background:hi?C.orangeBg:"transparent",borderBottom:`1px solid ${C.border}`,fontSize:hi?15:13}}>
    <span style={{color:bold?C.text:C.textSub,fontWeight:bold?700:500}}>{label}</span>
    <span style={{fontFamily:"monospace",fontWeight:bold?800:600,color}}>{value}</span>
  </div>
);
const Tog = ({checked,onChange})=>(
  <div onClick={()=>onChange(!checked)} style={{width:40,height:22,borderRadius:20,position:"relative",
    transition:"background .2s",background:checked?C.orange:C.border,cursor:"pointer",flexShrink:0}}>
    <div style={{position:"absolute",top:3,left:checked?20:3,width:16,height:16,borderRadius:"50%",
      background:C.white,transition:"left .2s",boxShadow:"0 1px 4px rgba(0,0,0,0.2)"}}/>
  </div>
);
const Toast = ({msg,visible})=>(
  <div style={{position:"fixed",bottom:24,right:24,zIndex:400,background:C.white,borderRadius:12,
    padding:"12px 18px",boxShadow:C.shadowLg,border:`1px solid ${C.green}50`,
    display:"flex",alignItems:"center",gap:10,maxWidth:340,fontSize:13,fontWeight:500,color:C.text,
    opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(70px)",
    transition:"all .3s cubic-bezier(0.4,0,0.2,1)",pointerEvents:"none"}}>
    <span style={{fontSize:18}}>✅</span>{msg}
  </div>
);

// ─── FLOW STRIP ───────────────────────────────────────────────────────────────
const FlowStrip = ({step})=>{
  const steps=[
    {icon:"🔧",title:"Technician\nCompletes Work"},
    {icon:"📋",title:"Auto-Reflected\nto Admin"},
  ]
  return(
    <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:C.radius,
      boxShadow:C.shadow,padding:"14px 20px",display:"flex",alignItems:"center",overflowX:"auto",gap:0}}>
      {steps.map((s,i)=>{
        const done=i<step, active=i===step;
        const clr=done?C.green:active?C.orange:C.textLight;
        return(
          <div key={i} style={{display:"flex",alignItems:"center",flexShrink:0}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:36,height:36,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:17,background:done?C.greenBg:active?C.orangeBg:C.bg,border:`1.5px solid ${clr}`}}>{s.icon}</div>
              <div>{s.title.split("\n").map((l,j)=>(
                <div key={j} style={{fontSize:j===0?12:11,fontWeight:j===0?700:400,color:clr,lineHeight:1.3}}>{l}</div>
              ))}</div>
            </div>
            {i<steps.length-1&&<div style={{width:24,textAlign:"center",color:C.textLight,fontSize:18,margin:"0 8px"}}>→</div>}
          </div>
        );
      })}
    </div>
  );
};

// ─── BILL EDIT MODAL ──────────────────────────────────────────────────────────
const EditModal = ({wo,initAmc,onClose,onSave})=>{
  const [parts, setParts] = useState(wo.parts.map(p=>({...p})));
  const [labor, setLabor] = useState(wo.labor.map(l=>({...l})));
  const [amc,   setAmc]   = useState(initAmc);
  const [amcYr, setAmcYr] = useState(wo.amcYear);

  const updP=(id,f,v)=>setParts(ps=>ps.map(p=>p.id===id?{...p,[f]:v}:p));
  const updL=(id,f,v)=>setLabor(ls=>ls.map(l=>l.id===id?{...l,[f]:v}:l));
  const addP=()=>setParts(ps=>[...ps,{id:`p${Date.now()}`,name:"New Item",desc:"",qty:1,unit:"pcs",rate:0,emoji:"🔩",bg:C.bg}]);
  const remP=(id)=>setParts(ps=>ps.filter(p=>p.id!==id));
  const addL=()=>setLabor(ls=>[...ls,{id:`l${Date.now()}`,name:"New Service",desc:"",hrs:1,rate:800,emoji:"🛠️",bg:C.purpleBg}]);
  const remL=(id)=>setLabor(ls=>ls.filter(l=>l.id!==id));

  const bill = calcBill({...wo,parts,labor},amc);

  return(
    <>
      <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:200}}/>
      <div style={{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",
        width:700,maxWidth:"96vw",maxHeight:"90vh",overflowY:"auto",
        background:C.white,borderRadius:20,zIndex:201,boxShadow:C.shadowLg,display:"flex",flexDirection:"column"}}>

        {/* Header */}
        <div style={{padding:"16px 24px",borderBottom:`1px solid ${C.border}`,display:"flex",
          alignItems:"center",gap:12,position:"sticky",top:0,background:C.white,zIndex:2}}>
          <IconBox emoji="✏️" bg={C.orangeBg} size={38}/>
          <div style={{flex:1}}>
            <div style={{fontWeight:800,fontSize:16,color:C.text}}>Edit Bill — {wo.id}</div>
            <div style={{fontSize:12,color:C.textSub,marginTop:2}}>{wo.client} · {wo.site}</div>
          </div>
          <button onClick={onClose} style={{border:"none",background:C.bg,borderRadius:8,
            padding:"6px 14px",cursor:"pointer",fontSize:13,color:C.textSub}}>✕ Close</button>
        </div>

        <div style={{padding:"20px 24px",display:"flex",flexDirection:"column",gap:22}}>

          {/* PARTS TABLE */}
          <div>
            <SecLabel>🔩 Parts &amp; Materials</SecLabel>
            <div style={{background:C.bg,borderRadius:10,padding:"10px 12px",marginBottom:6,
              display:"grid",gridTemplateColumns:"2fr 80px 100px 100px 36px",gap:8}}>
              {["Item Name","Qty","Rate (₹)","Amount",""].map(h=>(
                <div key={h} style={{fontSize:10,fontWeight:700,color:C.textLight,textTransform:"uppercase",letterSpacing:.8}}>{h}</div>
              ))}
            </div>
            {parts.map(p=>(
              <div key={p.id} style={{display:"grid",gridTemplateColumns:"2fr 80px 100px 100px 36px",
                gap:8,marginBottom:8,alignItems:"center"}}>
                <Inp value={p.name} onChange={e=>updP(p.id,"name",e.target.value)} placeholder="Part name"/>
                <Inp value={p.qty}  onChange={e=>updP(p.id,"qty",parseFloat(e.target.value)||0)} type="number" min="0"/>
                <Inp value={p.rate} onChange={e=>updP(p.id,"rate",parseFloat(e.target.value)||0)} type="number" min="0"/>
                <div style={{fontFamily:"monospace",fontWeight:700,fontSize:14,color:C.orange,textAlign:"right",
                  background:C.orangeBg,borderRadius:8,padding:"7px 10px"}}>{fmt(p.qty*p.rate)}</div>
                <button onClick={()=>remP(p.id)} style={{border:"none",background:C.redBg,color:C.red,
                  borderRadius:7,padding:"7px",cursor:"pointer",fontSize:14,fontWeight:700}}>✕</button>
              </div>
            ))}
            <button onClick={addP} style={{border:`1.5px dashed ${C.orangeBd}`,background:C.orangeBg,
              color:C.orange,borderRadius:10,padding:"8px 16px",cursor:"pointer",fontWeight:600,
              fontSize:13,width:"100%"}}>+ Add Part / Material</button>
          </div>

          {/* LABOR TABLE */}
          <div>
            <SecLabel>👷 Service &amp; Labor</SecLabel>
            <div style={{background:C.bg,borderRadius:10,padding:"10px 12px",marginBottom:6,
              display:"grid",gridTemplateColumns:"2fr 80px 100px 100px 36px",gap:8}}>
              {["Service Name","Hours","Rate/hr","Amount",""].map(h=>(
                <div key={h} style={{fontSize:10,fontWeight:700,color:C.textLight,textTransform:"uppercase",letterSpacing:.8}}>{h}</div>
              ))}
            </div>
            {labor.map(l=>(
              <div key={l.id} style={{display:"grid",gridTemplateColumns:"2fr 80px 100px 100px 36px",
                gap:8,marginBottom:8,alignItems:"center"}}>
                <Inp value={l.name} onChange={e=>updL(l.id,"name",e.target.value)} placeholder="Service name"/>
                <Inp value={l.hrs}  onChange={e=>updL(l.id,"hrs",parseFloat(e.target.value)||0)} type="number" min="0" step="0.5"/>
                <Inp value={l.rate} onChange={e=>updL(l.id,"rate",parseFloat(e.target.value)||0)} type="number" min="0"/>
                <div style={{fontFamily:"monospace",fontWeight:700,fontSize:14,color:C.orange,textAlign:"right",
                  background:C.orangeBg,borderRadius:8,padding:"7px 10px"}}>{fmt(l.hrs*l.rate)}</div>
                <button onClick={()=>remL(l.id)} style={{border:"none",background:C.redBg,color:C.red,
                  borderRadius:7,padding:"7px",cursor:"pointer",fontSize:14,fontWeight:700}}>✕</button>
              </div>
            ))}
            <button onClick={addL} style={{border:`1.5px dashed ${C.orangeBd}`,background:C.orangeBg,
              color:C.orange,borderRadius:10,padding:"8px 16px",cursor:"pointer",fontWeight:600,
              fontSize:13,width:"100%"}}>+ Add Service / Labor</button>
          </div>

          {/* AMC OPTION */}
          <div style={{background:amc?C.purpleBg:C.bg,borderRadius:12,
            border:`1.5px solid ${amc?C.purpleBd:C.border}`,padding:"16px 18px",transition:"all .2s"}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:amc?16:0}}>
              <IconBox emoji="📋" bg={amc?C.purpleBg:C.bg} size={36}/>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:14,color:amc?C.purple:C.text}}>AMC — Annual Maintenance Contract</div>
                <div style={{fontSize:12,color:C.textSub,marginTop:2}}>Toggle to include AMC renewal in this bill</div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:13,fontWeight:600,color:amc?C.purple:C.textLight}}>{amc?"Included":"Not Included"}</span>
                <Tog checked={amc} onChange={setAmc}/>
              </div>
            </div>
            {amc&&(
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
                <div>
                  <div style={{fontSize:11,color:C.textSub,marginBottom:5,fontWeight:600}}>Plan Type</div>
                  <div style={{background:C.purpleBg,border:`1px solid ${C.purpleBd}`,borderRadius:8,
                    padding:"8px 12px",fontSize:13,fontWeight:700,color:C.purple}}>Annual Plan</div>
                </div>
                <div>
                  <div style={{fontSize:11,color:C.textSub,marginBottom:5,fontWeight:600}}>Contract Year</div>
                  <select value={amcYr} onChange={e=>setAmcYr(Number(e.target.value))}
                    style={{width:"100%",padding:"8px 10px",borderRadius:8,border:`1px solid ${C.purpleBd}`,
                      background:C.purpleBg,color:C.purple,fontFamily:"inherit",fontSize:13,fontWeight:700}}>
                    {[1,2,3,4,5].map(y=><option key={y} value={y}>Year {y}</option>)}
                  </select>
                </div>
                <div>
                  <div style={{fontSize:11,color:C.textSub,marginBottom:5,fontWeight:600}}>Annual Amount</div>
                  <div style={{background:C.purpleBg,border:`1px solid ${C.purpleBd}`,borderRadius:8,
                    padding:"8px 12px",fontSize:15,fontWeight:800,color:C.purple,fontFamily:"monospace"}}>{fmt(amcFee)}</div>
                </div>
                <div style={{gridColumn:"1/-1",background:"rgba(124,58,237,0.06)",borderRadius:9,
                  padding:"9px 14px",display:"flex",gap:18,flexWrap:"wrap"}}>
                  {["✅ 4 scheduled visits/year","✅ 24hr priority support","✅ Free minor repairs"].map(t=>(
                    <span key={t} style={{fontSize:12,color:C.textSub}}>{t}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* LIVE TOTAL PREVIEW */}
          <div>
            <SecLabel>🧾 Live Bill Preview</SecLabel>
            <div style={{background:C.bg,borderRadius:12,overflow:"hidden",border:`1px solid ${C.border}`}}>
              <TRow label="Parts & Materials"   value={fmt(bill.pt)}   color={C.text}/>
              <TRow label="Service & Labor"     value={fmt(bill.lt)}   color={C.text}/>
              {amc&&<TRow label={`AMC — Year ${amcYr}`} value={fmt(bill.amc)} color={C.purple}/>}
              {wo.solar.export>0&&<TRow label="Solar Export Credit" value={`− ${fmt(wo.solar.export)}`} color={C.green}/>}
              <TRow label="GST @ 18%"           value={fmt(bill.tax)}  color={C.text}/>
              <TRow label="Total Payable"       value={fmt(bill.total)} color={C.orange} bold hi/>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{padding:"16px 24px",borderTop:`1px solid ${C.border}`,background:C.bg,
          display:"flex",gap:10,position:"sticky",bottom:0}}>
          <button onClick={onClose} style={{flex:1,padding:11,borderRadius:10,border:`1px solid ${C.border}`,
            background:C.white,color:C.textSub,fontWeight:600,cursor:"pointer",fontSize:13}}>Cancel</button>
          <button onClick={()=>onSave({parts,labor,amc,amcYear:amcYr,total:bill.total})}
            style={{flex:3,padding:11,borderRadius:10,border:"none",
              background:`linear-gradient(135deg,${C.orange},${C.orangeD})`,
              color:C.white,fontWeight:700,cursor:"pointer",fontSize:14,
              boxShadow:`0 4px 14px ${C.orange}44`}}>💾 Save Changes</button>
        </div>
      </div>
    </>
  );
};

// ─── WO DRAWER ────────────────────────────────────────────────────────────────
const WODrawer = ({wo,incAmc,onClose,onEdit,onApprove})=>{
  if(!wo) return null;
  const bill = calcBill(wo, incAmc);
  return(
    <>
      <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:100}}/>
      <div style={{position:"fixed",top:0,right:0,bottom:0,width:520,maxWidth:"96vw",
        background:C.white,zIndex:101,display:"flex",flexDirection:"column",
        boxShadow:"-8px 0 40px rgba(0,0,0,0.15)"}}>
        <style>{`@keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>

        <div style={{padding:"16px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:10}}>
          <div style={{flex:1}}>
            <div style={{fontWeight:800,fontSize:15,color:C.text}}>{wo.id}</div>
            <div style={{fontSize:12,color:C.textSub,marginTop:2}}>{wo.client} · {wo.site}</div>
          </div>
          <Badge label="Pending Approval" color={C.orange}/>
          <button onClick={onClose} style={{border:"none",background:C.bg,borderRadius:8,
            padding:"6px 12px",cursor:"pointer",fontSize:13,color:C.textSub}}>✕</button>
        </div>

        <div style={{flex:1,overflowY:"auto",padding:"18px 20px",display:"flex",flexDirection:"column",gap:16}}>
          {/* Tech */}
          <div style={{background:C.bg,borderRadius:12,padding:"12px 14px",display:"flex",gap:12,border:`1px solid ${C.border}`}}>
            <div style={{width:40,height:40,borderRadius:11,background:C.tealBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>👷</div>
            <div>
              <div style={{fontWeight:700,fontSize:13}}>{wo.tech} — Lead Technician</div>
              <div style={{fontSize:11,color:C.textSub,marginTop:3,lineHeight:1.8}}>
                {wo.date} · {wo.hours} hrs &nbsp;|&nbsp; GPS ✓ · Photos ✓
              </div>
            </div>
          </div>

          {/* Parts */}
          <div>
            <SecLabel>🔩 Parts &amp; Materials</SecLabel>
            {wo.parts.map((p,i)=>(
              <div key={p.id} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"8px 0",
                borderBottom:i<wo.parts.length-1?`1px solid ${C.border}`:"none"}}>
                <div style={{width:28,height:28,borderRadius:7,background:p.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{p.emoji}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:600,color:C.text}}>{p.name}</div>
                  <div style={{fontSize:11,color:C.textSub,marginTop:1}}>{p.desc}</div>
                </div>
                <div style={{fontSize:11,color:C.textSub,minWidth:40}}>×{p.qty}</div>
                <div style={{fontSize:11,color:C.textSub,minWidth:55,textAlign:"right"}}>{fmt(p.rate)}</div>
                <div style={{fontFamily:"monospace",fontWeight:700,fontSize:13,minWidth:70,textAlign:"right"}}>{fmt(p.qty*p.rate)}</div>
              </div>
            ))}
          </div>

          {/* Labor */}
          <div>
            <SecLabel>👷 Service &amp; Labor</SecLabel>
            {wo.labor.map((l,i)=>(
              <div key={l.id} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"8px 0",
                borderBottom:i<wo.labor.length-1?`1px solid ${C.border}`:"none"}}>
                <div style={{width:28,height:28,borderRadius:7,background:l.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{l.emoji}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:600,color:C.text}}>{l.name}</div>
                  <div style={{fontSize:11,color:C.textSub,marginTop:1}}>{l.desc}</div>
                </div>
                <div style={{fontSize:11,color:C.textSub,minWidth:40}}>{l.hrs}h</div>
                <div style={{fontSize:11,color:C.textSub,minWidth:55,textAlign:"right"}}>{fmt(l.rate)}/hr</div>
                <div style={{fontFamily:"monospace",fontWeight:700,fontSize:13,minWidth:70,textAlign:"right"}}>{fmt(l.hrs*l.rate)}</div>
              </div>
            ))}
          </div>

          {/* AMC */}
          <div style={{background:incAmc?C.purpleBg:C.bg,borderRadius:12,padding:"12px 14px",border:`1.5px solid ${incAmc?C.purpleBd:C.border}`}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:18}}>📋</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:13,color:incAmc?C.purple:C.textSub}}>AMC — Annual Maintenance Contract</div>
                {incAmc
                  ?<div style={{fontSize:11,color:C.textSub,marginTop:2}}>Year {wo.amcYear} · 4 visits · 24hr support</div>
                  :<div style={{fontSize:11,color:C.textLight,marginTop:2}}>Not included — toggle in table or edit bill to add</div>}
              </div>
              {incAmc
                ?<span style={{fontFamily:"monospace",fontWeight:800,fontSize:15,color:C.purple}}>{fmt(amcFee)}</span>
                :<Badge label="Not Included" color={C.textLight}/>}
            </div>
          </div>

          {/* Solar */}
          {wo.solar.gen>0&&(
            <div style={{background:C.orangeBg,borderRadius:12,padding:"12px 14px",border:`1px solid ${C.orangeBd}`}}>
              <div style={{fontSize:12,fontWeight:700,color:C.orange,marginBottom:10}}>☀️ Solar Performance — Oct 2025</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
                {[[`${wo.solar.gen} kWh`,"Generated",C.orange],[`${wo.solar.offset}%`,"Offset",C.orange],
                  [fmt(wo.solar.saving),"Savings",C.green],[fmt(wo.solar.export),"Export Credit",C.teal]].map(([v,l,clr])=>(
                  <div key={l} style={{textAlign:"center",background:"rgba(255,255,255,0.7)",borderRadius:8,padding:"8px 4px"}}>
                    <div style={{fontWeight:800,fontSize:14,color:clr}}>{v}</div>
                    <div style={{fontSize:10,color:C.textSub,marginTop:2}}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Totals */}
          <div>
            <SecLabel>🧾 Bill Summary</SecLabel>
            <div style={{background:C.bg,borderRadius:12,overflow:"hidden",border:`1px solid ${C.border}`}}>
              <TRow label="Parts & Materials"   value={fmt(bill.pt)}   color={C.text}/>
              <TRow label="Service & Labor"     value={fmt(bill.lt)}   color={C.text}/>
              {incAmc&&<TRow label={`AMC — Year ${wo.amcYear}`} value={fmt(bill.amc)} color={C.purple}/>}
              {wo.solar.export>0&&<TRow label="Solar Export Credit" value={`− ${fmt(wo.solar.export)}`} color={C.green}/>}
              <TRow label="GST @ 18%"           value={fmt(bill.tax)}  color={C.text}/>
              <TRow label="Total Payable"       value={fmt(bill.total)} color={C.orange} bold hi/>
              {wo.solar.saving>0&&<TRow label="💰 Client saves this month" value={fmt(wo.solar.saving)} color={C.green}/>}
            </div>
          </div>
        </div>

        <div style={{padding:"14px 20px",borderTop:`1px solid ${C.border}`,background:C.bg,display:"flex",gap:10}}>
          <button onClick={onClose} style={{flex:1,padding:10,borderRadius:10,border:`1px solid ${C.redBd}`,
            background:C.redBg,color:C.red,fontWeight:700,cursor:"pointer",fontSize:13}}>✕ Reject</button>
          <button onClick={onEdit} style={{flex:1,padding:10,borderRadius:10,border:`1px solid ${C.border}`,
            background:C.white,color:C.textSub,fontWeight:600,cursor:"pointer",fontSize:13}}>✏️ Edit Bill</button>
          <button onClick={onApprove} style={{flex:2,padding:10,borderRadius:10,border:"none",
            background:`linear-gradient(135deg,${C.orange},${C.orangeD})`,color:C.white,fontWeight:700,
            cursor:"pointer",fontSize:13,boxShadow:`0 4px 14px ${C.orange}44`}}>✅ Approve & Generate</button>
        </div>
      </div>
    </>
  );
};

// ─── APPROVE MODAL ────────────────────────────────────────────────────────────
const ApproveModal = ({wo,bill,onClose,onConfirm})=>{
  if(!wo) return null;
  return(
    <>
      <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:200}}/>
      <div style={{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",
        background:C.white,borderRadius:20,padding:28,width:430,maxWidth:"92vw",
        zIndex:201,boxShadow:C.shadowLg}}>
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{fontSize:44,marginBottom:8}}>✅</div>
          <div style={{fontSize:18,fontWeight:800,color:C.text}}>Approve &amp; Auto-Generate Bill</div>
          <div style={{fontSize:13,color:C.textSub,marginTop:6,lineHeight:1.7}}>
            This will instantly generate the bill and notify the client via SMS &amp; email.
          </div>
        </div>
        <div style={{background:C.bg,borderRadius:12,padding:"14px 16px",marginBottom:18,border:`1px solid ${C.border}`}}>
          {[["Invoice","INV-"+wo.id.replace("WO-","")],["Client",wo.client],
            ["Includes AMC",bill.amc>0?`Yes — Year ${wo.amcYear}`:"No"],["Notify via","SMS + Email (instant)"]].map(([l,v])=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",
              borderBottom:`1px solid ${C.border}`,fontSize:13}}>
              <span style={{color:C.textSub}}>{l}</span><span style={{fontWeight:600,color:C.text}}>{v}</span>
            </div>
          ))}
          <div style={{display:"flex",justifyContent:"space-between",padding:"12px 0 0",fontSize:15}}>
            <span style={{fontWeight:700}}>Total Amount</span>
            <span style={{fontWeight:800,color:C.orange,fontFamily:"monospace",fontSize:22}}>{fmt(bill.total)}</span>
          </div>
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={onClose} style={{flex:1,padding:12,borderRadius:10,border:`1px solid ${C.border}`,
            background:C.white,cursor:"pointer",fontWeight:600,fontSize:13,color:C.textSub}}>Cancel</button>
          <button onClick={onConfirm} style={{flex:2,padding:12,borderRadius:10,border:"none",
            background:`linear-gradient(135deg,${C.orange},${C.orangeD})`,color:C.white,
            fontWeight:700,cursor:"pointer",fontSize:14,boxShadow:`0 4px 14px ${C.orange}44`}}>✅ Confirm Approval</button>
        </div>
      </div>
    </>
  );
};

// ─── PAY MODAL ────────────────────────────────────────────────────────────────
const PayModal = ({bill,onClose,onConfirm})=>{
  if(!bill) return null;
  return(
    <>
      <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:200}}/>
      <div style={{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",
        background:C.white,borderRadius:20,padding:28,width:380,maxWidth:"92vw",zIndex:201,boxShadow:C.shadowLg}}>
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{fontSize:44,marginBottom:8}}>💳</div>
          <div style={{fontSize:17,fontWeight:800,color:C.text}}>Confirm Payment</div>
        </div>
        <div style={{background:C.greenBg,borderRadius:12,padding:"16px",marginBottom:18,
          textAlign:"center",border:`1px solid ${C.greenBd}`}}>
          <div style={{fontSize:12,color:C.textSub}}>Amount Due</div>
          <div style={{fontSize:34,fontWeight:800,color:C.green,fontFamily:"monospace"}}>{fmt(bill.amount)}</div>
          <div style={{fontSize:11,color:C.textSub,marginTop:4}}>{bill.id} · Via UPI</div>
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={onClose} style={{flex:1,padding:12,borderRadius:10,border:`1px solid ${C.border}`,
            background:C.white,cursor:"pointer",fontWeight:600,fontSize:13}}>Cancel</button>
          <button onClick={onConfirm} style={{flex:2,padding:12,borderRadius:10,border:"none",
            background:`linear-gradient(135deg,${C.green},#00c887)`,color:C.white,
            fontWeight:700,cursor:"pointer",fontSize:13}}>✅ Proceed to Pay</button>
        </div>
      </div>
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN PANEL
// ═══════════════════════════════════════════════════════════════════════════════
const AdminPanel = ({onToast,onBillApproved})=>{
  const [pending,    setPending]    = useState(SEED_PENDING.map(w=>({...w})));
  const [approved,   setApproved]   = useState([]);
  const [amcMap,     setAmcMap]     = useState({});   // overrides per WO
  const [drawerWO,   setDrawerWO]   = useState(null);
  const [editWO,     setEditWO]     = useState(null);
  const [approveWO,  setApproveWO]  = useState(null);

  const getAmc = wo => amcMap[wo.id] !== undefined ? amcMap[wo.id] : wo.amc;

  const handleSaveEdit = useCallback((changes)=>{
    setPending(ps=>ps.map(w=>w.id===editWO.id?{...w,parts:changes.parts,labor:changes.labor,amcYear:changes.amcYear}:w));
    setAmcMap(m=>({...m,[editWO.id]:changes.amc}));
    setEditWO(null);
    onToast("💾 Bill updated successfully!");
  },[editWO,onToast]);

  const handleConfirmApprove = useCallback(()=>{
    const wo   = approveWO;
    const incAmc = getAmc(wo);
    const bill = calcBill(wo, incAmc);
    const dueDate = new Date(Date.now()+30*24*3600000)
      .toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"});
    const row = {
      inv:"INV-"+wo.id.replace("WO-",""),
      client:wo.client, service:wo.service,
      amount:bill.total, credit:wo.solar.export||null,
      amc:incAmc, amcYear:wo.amcYear,
      by:"Admin", date:new Date().toLocaleDateString("en-IN",{day:"numeric",month:"short"}),
      status:"sent", isNew:true,
    };
    const clientBill = {
      id:row.inv, title:`${wo.service}${incAmc?` + AMC Yr ${wo.amcYear}`:""}`,
      date:new Date().toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}),
      paid:dueDate, amount:bill.total, saving:wo.solar.saving, status:"due", amc:incAmc,
    };
    setApproved(a=>[row,...a]);
    setPending(ps=>ps.filter(w=>w.id!==wo.id));
    setApproveWO(null);
    setDrawerWO(null);
    onBillApproved(clientBill);
    onToast(`✅ ${row.inv} generated! ${wo.client} notified via SMS & email.`);
  },[approveWO,amcMap,onBillApproved,onToast]);

  const TH = ({cols})=>(
    <thead><tr style={{borderBottom:`2px solid ${C.border}`}}>
      {cols.map(h=><th key={h} style={{textAlign:"left",padding:"0 10px 10px 0",fontSize:10,
        fontWeight:700,color:C.textLight,textTransform:"uppercase",letterSpacing:.9,whiteSpace:"nowrap"}}>{h}</th>)}
    </tr></thead>
  );

  return(
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <FlowStrip step={2}/>

      {/* KPIs */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14}}>
        {[
          {icon:"⏳",bg:C.orangeBg,label:"Pending Approval",    val:pending.length,            color:C.orange, sub:`${pending.length} awaiting review`},
          {icon:"🧾",bg:C.greenBg, label:"Bills Generated MTD", val:approved.length+3,          color:C.green,  sub:`${approved.length} approved today`},
          {icon:"💰",bg:C.tealBg,  label:"Revenue (MTD)",       val:"₹2.4L",                    color:C.teal,   sub:"▲ 18% vs last month"},
          {icon:"📋",bg:C.purpleBg,label:"AMC Renewals",        val:pending.filter(w=>getAmc(w)).length, color:C.purple,sub:"Due this cycle"},
        ].map(k=>(
          <Card key={k.label} style={{position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:k.color,borderRadius:`${C.radius}px ${C.radius}px 0 0`}}/>
            <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
              <IconBox emoji={k.icon} bg={k.bg} size={42}/>
              <div>
                <div style={{fontSize:11,color:C.textSub,fontWeight:500}}>{k.label}</div>
                <div style={{fontSize:26,fontWeight:800,color:k.color,lineHeight:1.1,marginTop:3}}>{k.val}</div>
                <div style={{fontSize:11,color:C.textSub,marginTop:3}}>{k.sub}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* PENDING TABLE */}
      <Card>
        <div style={{display:"flex",alignItems:"center",marginBottom:16,gap:10}}>
          <IconBox emoji="🔧" bg={C.orangeBg} size={36}/>
          <div style={{flex:1}}>
            <div style={{fontWeight:700,fontSize:15,color:C.text}}>Pending Work Orders — Awaiting Approval</div>
            <div style={{fontSize:12,color:C.textSub,marginTop:1}}>
              Review details, ✏️ edit bill items, toggle AMC per job, then approve to auto-generate.
            </div>
          </div>
          <Badge label={`${pending.length} Pending`} color={C.orange}/>
        </div>
        {pending.length===0
          ?<div style={{textAlign:"center",padding:"28px 0",color:C.textLight,fontSize:14}}>🎉 All work orders approved!</div>
          :(
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
              <TH cols={["Work Order","Client","Site","Service","Technician","Date","Est. Bill","AMC","Actions"]}/>
              <tbody>
                {pending.map(wo=>{
                  const incAmc = getAmc(wo);
                  const bill = calcBill(wo, incAmc);
                  return(
                    <tr key={wo.id} onClick={()=>setDrawerWO(wo)}
                      style={{borderBottom:`1px solid ${C.border}`,cursor:"pointer"}}
                      onMouseEnter={e=>e.currentTarget.style.background=C.bg}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <td style={{padding:"11px 10px 11px 0",fontWeight:700,color:C.orange,fontFamily:"monospace",fontSize:12}}>{wo.id}</td>
                      <td style={{padding:"11px 10px 11px 0",fontWeight:600}}>{wo.client}</td>
                      <td style={{padding:"11px 10px 11px 0",color:C.textSub,fontSize:12}}>{wo.site}</td>
                      <td style={{padding:"11px 10px 11px 0"}}>{wo.service}</td>
                      <td style={{padding:"11px 10px 11px 0",color:C.textSub}}>{wo.tech}</td>
                      <td style={{padding:"11px 10px 11px 0",color:C.textSub,fontSize:12}}>{wo.date.split(",")[0]}</td>
                      <td style={{padding:"11px 10px 11px 0",fontFamily:"monospace",fontWeight:700,color:C.text}}>{fmt(bill.total)}</td>
                      <td style={{padding:"11px 10px 11px 0"}}>
                        <div onClick={e=>e.stopPropagation()} style={{display:"flex",alignItems:"center",gap:8}}>
                          <Tog checked={incAmc} onChange={v=>setAmcMap(m=>({...m,[wo.id]:v}))}/>
                          <span style={{fontSize:11,color:incAmc?C.purple:C.textLight,fontWeight:600}}>{incAmc?"Yes":"No"}</span>
                        </div>
                      </td>
                      <td style={{padding:"11px 0 11px 0"}}>
                        <div onClick={e=>e.stopPropagation()} style={{display:"flex",gap:6}}>
                          <button onClick={()=>setEditWO(wo)}
                            style={{padding:"5px 10px",borderRadius:7,border:`1px solid ${C.border}`,
                              background:C.white,color:C.textSub,fontWeight:600,cursor:"pointer",fontSize:11}}>✏️ Edit</button>
                          <button onClick={()=>{setApproveWO(wo);}}
                            style={{padding:"5px 10px",borderRadius:7,border:`1px solid ${C.orangeBd}`,
                              background:C.orangeBg,color:C.orange,fontWeight:700,cursor:"pointer",fontSize:11}}>✅ Approve</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* AUTO-GENERATED BILLS TABLE */}
      <Card>
        <div style={{display:"flex",alignItems:"center",marginBottom:16,gap:10}}>
          <IconBox emoji="✅" bg={C.greenBg} size={36}/>
          <div style={{flex:1}}>
            <div style={{fontWeight:700,fontSize:15,color:C.text}}>Auto-Generated Bills — Recent</div>
            <div style={{fontSize:12,color:C.textSub,marginTop:1}}>
              Bills appear here <strong>automatically</strong> the moment you approve a work order above ↑
            </div>
          </div>
          <Badge label={`${approved.length+3} Total`} color={C.green}/>
          <button onClick={()=>onToast("📥 Exporting CSV...")}
            style={{padding:"7px 14px",borderRadius:8,border:`1px solid ${C.border}`,
              background:C.white,color:C.textSub,cursor:"pointer",fontSize:12,fontWeight:600}}>⬇ Export</button>
        </div>

        {approved.length>0&&(
          <div style={{background:C.greenBg,border:`1px solid ${C.greenBd}`,borderRadius:10,
            padding:"10px 14px",marginBottom:14,display:"flex",alignItems:"center",gap:10,fontSize:13}}>
            <span style={{fontSize:16}}>🎉</span>
            <span style={{color:C.textSub}}><strong style={{color:C.green}}>{approved.length} new bill{approved.length>1?"s":""}</strong> auto-generated from your approvals above</span>
          </div>
        )}

        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <TH cols={["Invoice #","Client","Service","Amount","Solar Credit","AMC","By","Date","Status"]}/>
            <tbody>
              {/* Newly generated */}
              {approved.map((b,i)=>(
                <tr key={b.inv} style={{borderBottom:`1px solid ${C.border}`,background:b.isNew?"#f0fdf4":"transparent"}}
                  onMouseEnter={e=>e.currentTarget.style.background=C.bg}
                  onMouseLeave={e=>e.currentTarget.style.background=b.isNew&&i!==0?"transparent":"#f0fdf4"}>
                  <td style={{padding:"11px 10px 11px 0"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontFamily:"monospace",fontWeight:700,color:C.orange,fontSize:12}}>{b.inv}</span>
                      <Badge label="NEW" color={C.green} bg={C.greenBg}/>
                    </div>
                  </td>
                  <td style={{padding:"11px 10px 11px 0",fontWeight:600}}>{b.client}</td>
                  <td style={{padding:"11px 10px 11px 0",color:C.textSub}}>{b.service}</td>
                  <td style={{padding:"11px 10px 11px 0",fontFamily:"monospace",fontWeight:700}}>{fmt(b.amount)}</td>
                  <td style={{padding:"11px 10px 11px 0",color:b.credit?C.green:C.textLight,fontFamily:"monospace"}}>{b.credit?fmt(b.credit):"—"}</td>
                  <td style={{padding:"11px 10px 11px 0"}}><Badge label={b.amc?`✓ Yr${b.amcYear}`:"✗ No"} color={b.amc?C.purple:C.textLight}/></td>
                  <td style={{padding:"11px 10px 11px 0",color:C.textSub,fontSize:12}}>{b.by}</td>
                  <td style={{padding:"11px 10px 11px 0",color:C.textSub,fontSize:12}}>{b.date}</td>
                  <td style={{padding:"11px 0 11px 0"}}><StatusBadge status={b.status}/></td>
                </tr>
              ))}
              {/* Seed rows */}
              {SEED_APPROVED.map(b=>(
                <tr key={b.inv} style={{borderBottom:`1px solid ${C.border}`}}
                  onMouseEnter={e=>e.currentTarget.style.background=C.bg}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={{padding:"11px 10px 11px 0",fontFamily:"monospace",fontWeight:700,color:C.orange,fontSize:12}}>{b.inv}</td>
                  <td style={{padding:"11px 10px 11px 0",fontWeight:600}}>{b.client}</td>
                  <td style={{padding:"11px 10px 11px 0",color:C.textSub}}>{b.service}</td>
                  <td style={{padding:"11px 10px 11px 0",fontFamily:"monospace",fontWeight:700}}>{fmt(b.amount)}</td>
                  <td style={{padding:"11px 10px 11px 0",color:b.credit?C.green:C.textLight,fontFamily:"monospace"}}>{b.credit?fmt(b.credit):"—"}</td>
                  <td style={{padding:"11px 10px 11px 0"}}><Badge label={b.amc?`✓ Yr${b.amcYear}`:"✗ No"} color={b.amc?C.purple:C.textLight}/></td>
                  <td style={{padding:"11px 10px 11px 0",color:C.textSub,fontSize:12}}>{b.by}</td>
                  <td style={{padding:"11px 10px 11px 0",color:C.textSub,fontSize:12}}>{b.date}</td>
                  <td style={{padding:"11px 0 11px 0"}}><StatusBadge status={b.status}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modals */}
      {drawerWO&&!editWO&&!approveWO&&(
        <WODrawer wo={drawerWO} incAmc={getAmc(drawerWO)}
          onClose={()=>setDrawerWO(null)}
          onEdit={()=>{setEditWO(drawerWO);setDrawerWO(null);}}
          onApprove={()=>{setApproveWO(drawerWO);setDrawerWO(null);}}/>
      )}
      {editWO&&(
        <EditModal wo={editWO} initAmc={getAmc(editWO)}
          onClose={()=>setEditWO(null)} onSave={handleSaveEdit}/>
      )}
      {approveWO&&(
        <ApproveModal wo={approveWO} bill={calcBill(approveWO,getAmc(approveWO))}
          onClose={()=>setApproveWO(null)} onConfirm={handleConfirmApprove}/>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// CLIENT PANEL
// ═══════════════════════════════════════════════════════════════════════════════
const ClientPanel = ({onToast,newBills})=>{
  const allBills = [...newBills,...CLIENT_SEED];
  const [sel, setSel] = useState(allBills[0]);
  const [pm,  setPm]  = useState("upi");
  const [pay, setPay] = useState(null);

  return(
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      {/* Hero */}
      <div style={{background:`linear-gradient(135deg,${C.orangeBg},#fffdf9)`,borderRadius:C.radius,
        border:`1px solid ${C.orangeBd}`,boxShadow:C.shadow,padding:"20px 24px",display:"flex",alignItems:"center",gap:20}}>
        <div style={{width:52,height:52,borderRadius:14,background:`linear-gradient(135deg,${C.green},#00c887)`,
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>🏠</div>
        <div style={{flex:1}}>
          <div style={{fontSize:18,fontWeight:800,color:C.text}}>Ramesh Patel</div>
          <div style={{fontSize:12,color:C.textSub,marginTop:3}}>📍 Rooftop A · Kothrud, Pune · 3.2 kW · AMC: Year 2 Active</div>
        </div>
        <div style={{display:"flex",gap:22}}>
          {[["₹1,14,800","Total Savings",C.green],["77%","Solar Offset",C.orange],[`${allBills.length}`,"Bills Total",C.teal]].map(([v,l,clr])=>(
            <div key={l} style={{textAlign:"center"}}>
              <div style={{fontSize:20,fontWeight:800,color:clr}}>{v}</div>
              <div style={{fontSize:11,color:C.textSub,marginTop:2}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Notice */}
      <div style={{background:C.greenBg,borderRadius:10,padding:"10px 16px",border:`1px solid ${C.greenBd}`,
        display:"flex",alignItems:"center",gap:10,fontSize:13}}>
        <span style={{fontSize:16}}>ℹ️</span>
        <span style={{color:C.textSub}}>Bills appear here only <strong style={{color:C.text}}>after admin verification and approval</strong> of the technician's completed work order.</span>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1.45fr",gap:18,alignItems:"start"}}>
        {/* LEFT */}
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          {/* Bill list */}
          <Card>
            <div style={{display:"flex",alignItems:"center",marginBottom:14,gap:8}}>
              <IconBox emoji="📂" bg={C.orangeBg} size={32}/>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:14,color:C.text}}>Your Approved Bills</div>
                <div style={{fontSize:11,color:C.textSub}}>Tap to analyse &amp; pay</div>
              </div>
              {newBills.length>0&&<Badge label={`${newBills.length} New`} color={C.green}/>}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {allBills.map(b=>(
                <div key={b.id} onClick={()=>setSel(b)}
                  style={{background:sel?.id===b.id?C.orangeBg:C.bg,
                    border:`1.5px solid ${sel?.id===b.id?C.orange:C.border}`,
                    borderRadius:12,padding:"12px 14px",cursor:"pointer",transition:"all .15s",
                    display:"flex",alignItems:"center",gap:12,
                    boxShadow:b.status==="due"?`0 0 0 2px ${C.orange}22`:"none"}}>
                  <div style={{width:36,height:36,borderRadius:10,flexShrink:0,
                    background:b.status==="due"?C.orangeBg:C.greenBg,
                    display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🧾</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontFamily:"monospace",fontSize:11,color:C.textSub}}>{b.id}</div>
                    <div style={{fontWeight:700,fontSize:13,color:C.text,marginTop:1,
                      whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{b.title}</div>
                    <div style={{fontSize:11,color:C.textSub,marginTop:2}}>{b.status==="due"?`Due: ${b.paid}`:`Paid: ${b.paid}`}</div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{fontWeight:800,fontSize:14,color:b.status==="due"?C.orange:C.text}}>{fmt(b.amount)}</div>
                    <div style={{fontSize:10,color:C.green,marginTop:2}}>Saved {fmt(b.saving)} ☀️</div>
                    <div style={{marginTop:4}}><StatusBadge status={b.status}/></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Chart */}
          <Card>
            <div style={{display:"flex",alignItems:"center",marginBottom:14,gap:8}}>
              <IconBox emoji="📊" bg={C.tealBg} size={32}/>
              <div>
                <div style={{fontWeight:700,fontSize:14,color:C.text}}>Bill Analysis — Monthly</div>
                <div style={{fontSize:11,color:C.textSub}}>Grid cost vs. solar savings</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={155}>
              <BarChart data={MONTHLY} barSize={11} barGap={3}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false}/>
                <XAxis dataKey="m" tick={{fontSize:10,fill:C.textSub}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:10,fill:C.textSub}} axisLine={false} tickLine={false} tickFormatter={v=>`₹${v/1000}k`}/>
                <Tooltip formatter={(v,n)=>[fmt(v),n==="grid"?"Grid Cost":"Solar Saving"]}
                  contentStyle={{borderRadius:10,border:`1px solid ${C.border}`,fontSize:12}}/>
                <Bar dataKey="grid"  fill={C.teal}   radius={[4,4,0,0]}/>
                <Bar dataKey="solar" fill={C.orange} radius={[4,4,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
            <div style={{display:"flex",gap:16,justifyContent:"center",marginTop:8}}>
              {[["Grid Cost",C.teal],["Solar Saving",C.orange]].map(([l,clr])=>(
                <div key={l} style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:C.textSub}}>
                  <div style={{width:10,height:10,borderRadius:2,background:clr}}/>{l}
                </div>
              ))}
            </div>
          </Card>

          {/* Donut */}
          <Card>
            <div style={{display:"flex",alignItems:"center",marginBottom:10,gap:8}}>
              <IconBox emoji="☀️" bg={C.orangeBg} size={32}/>
              <div style={{fontWeight:700,fontSize:14,color:C.text}}>Energy Source Split</div>
            </div>
            <div style={{display:"flex",alignItems:"center"}}>
              <ResponsiveContainer width={120} height={120}>
                <PieChart>
                  <Pie data={ENERGY_SPLIT} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" startAngle={90} endAngle={-270}>
                    {ENERGY_SPLIT.map((e,i)=><Cell key={i} fill={e.color}/>)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{flex:1,display:"flex",flexDirection:"column",gap:8}}>
                {ENERGY_SPLIT.map(e=>(
                  <div key={e.name} style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:10,height:10,borderRadius:"50%",background:e.color,flexShrink:0}}/>
                    <span style={{fontSize:12,flex:1,color:C.textSub}}>{e.name}</span>
                    <span style={{fontWeight:700,fontSize:13,color:e.color}}>{e.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT */}
        {sel&&(
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {/* Bill detail */}
            <div style={{background:C.white,borderRadius:C.radius,boxShadow:C.shadow,border:`1px solid ${C.border}`,overflow:"hidden"}}>
              <div style={{background:"linear-gradient(135deg,#0f1a28,#162233)",padding:"18px 22px",
                display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:40,height:40,borderRadius:10,background:`linear-gradient(135deg,${C.orange},${C.orangeD})`,
                    display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>☀️</div>
                  <div>
                    <div style={{fontSize:16,fontWeight:800,color:"#fff",letterSpacing:.5}}>PV<span style={{color:C.orange}}>Pro</span>Tech</div>
                    <div style={{fontSize:11,color:"#8a97ab",marginTop:2}}>Solar Energy Solutions Pvt. Ltd.</div>
                  </div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontFamily:"monospace",fontSize:13,color:C.orange,fontWeight:700}}>{sel.id}</div>
                  <div style={{fontSize:11,color:"#8a97ab",marginTop:3}}>{sel.status==="due"?`Due: ${sel.paid}`:`Paid: ${sel.paid}`}</div>
                  <div style={{marginTop:6}}><StatusBadge status={sel.status}/></div>
                </div>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",borderBottom:`1px solid ${C.border}`}}>
                {[["From","PVProTech Pvt. Ltd.","Pune · GSTIN: 27ABCDE1234F1Z5"],
                  ["Bill To","Ramesh Patel","Flat 302, Kothrud, Pune"]].map(([l,n,d])=>(
                  <div key={l} style={{padding:"13px 18px",borderRight:l==="From"?`1px solid ${C.border}`:"none"}}>
                    <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:1,color:C.textLight,fontWeight:700,marginBottom:5}}>{l}</div>
                    <div style={{fontWeight:700,fontSize:13}}>{n}</div>
                    <div style={{fontSize:11,color:C.textSub,marginTop:2,lineHeight:1.7}}>{d}</div>
                  </div>
                ))}
              </div>

              <div style={{padding:"14px 18px",borderBottom:`1px solid ${C.border}`}}>
                <SecLabel>Services &amp; Parts</SecLabel>
                {[
                  ["🛠️",C.purpleBg,"Inverter Repair & Diagnosis","4.5 hrs · Arun Kumar","₹3,600",null],
                  ["🔩",C.tealBg,  "Parts (MC4, SPD, Cable)","Staubli, 40kA SPD, 10m","₹3,010",null],
                  ["🔍",C.greenBg, "Annual Inspection","Panel, wiring, earthing","₹1,200",null],
                  ...(sel.amc?[["📋",C.purpleBg,`AMC — Year ${sel.amcYear||2} Plan`,"4 visits · Priority · 12 months",fmt(amcFee),C.purple]]:[]),
                ].map(([ico,bg,name,sub,amt,ac],i,arr)=>(
                  <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"8px 0",
                    borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none"}}>
                    <div style={{width:28,height:28,borderRadius:7,background:bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{ico}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:600}}>{name}</div>
                      <div style={{fontSize:11,color:C.textSub,marginTop:1}}>{sub}</div>
                    </div>
                    <div style={{fontWeight:700,fontSize:14,color:ac||C.text}}>{amt}</div>
                  </div>
                ))}
              </div>

              <div style={{padding:"13px 18px",background:C.orangeBg,borderBottom:`1px solid ${C.border}`}}>
                <div style={{fontSize:12,fontWeight:700,color:C.orange,marginBottom:10}}>☀️ Your Solar This Month</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
                  {[["412 kWh","Generated",C.orange],["77%","Offset",C.orange],[fmt(sel.saving),"Savings",C.green],["₹376","Credit",C.teal]].map(([v,l,clr])=>(
                    <div key={l} style={{textAlign:"center",background:"rgba(255,255,255,0.7)",borderRadius:8,padding:"8px 4px"}}>
                      <div style={{fontWeight:800,fontSize:14,color:clr}}>{v}</div>
                      <div style={{fontSize:10,color:C.textSub,marginTop:2}}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>

              <TRow label="Sub-total"               value="₹15,810" color={C.text}/>
              <TRow label="Solar Export Credit"     value="− ₹376"  color={C.green}/>
              <TRow label="GST (CGST + SGST @18%)" value="₹2,774"  color={C.text}/>
              <TRow label="Total Payable"           value={fmt(sel.amount)} color={C.orange} bold hi/>
              <TRow label="💰 You saved this month" value={fmt(sel.saving)} color={C.green}/>

              <div style={{padding:"12px 18px",borderTop:`1px solid ${C.border}`,display:"flex",gap:8,background:C.bg}}>
                <button onClick={()=>onToast("📄 Downloading PDF...")}
                  style={{flex:1,padding:10,borderRadius:10,border:`1px solid ${C.border}`,
                    background:C.white,color:C.textSub,fontWeight:600,cursor:"pointer",fontSize:12}}>⬇ PDF</button>
                {sel.status==="due"&&(
                  <button onClick={()=>setPay(sel)}
                    style={{flex:3,padding:10,borderRadius:10,border:"none",
                      background:`linear-gradient(135deg,${C.green},#00c887)`,color:C.white,
                      fontWeight:700,cursor:"pointer",fontSize:14,boxShadow:`0 4px 14px ${C.green}44`}}>
                    💳 Pay {fmt(sel.amount)} Now
                  </button>
                )}
              </div>
            </div>

            {/* Payment */}
            {sel.status==="due"&&(
              <Card>
                <div style={{display:"flex",alignItems:"center",marginBottom:14,gap:8}}>
                  <IconBox emoji="💳" bg={C.greenBg} size={32}/>
                  <div style={{fontWeight:700,fontSize:14,color:C.text}}>Payment Options</div>
                </div>
                <div style={{background:C.greenBg,borderRadius:12,padding:"12px 16px",display:"flex",
                  justifyContent:"space-between",alignItems:"center",marginBottom:14,border:`1px solid ${C.greenBd}`}}>
                  <div>
                    <div style={{fontSize:11,color:C.textSub}}>Amount Due</div>
                    <div style={{fontSize:11,color:C.textLight,marginTop:1}}>Due by {sel.paid}</div>
                  </div>
                  <div style={{fontSize:28,fontWeight:800,color:C.green,fontFamily:"monospace"}}>{fmt(sel.amount)}</div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:14}}>
                  {[["📱","UPI","GPay, Paytm","upi"],["🏦","Net Banking","All banks","nb"],["💳","Card","Credit/Debit","card"]].map(([ic,n,s,k])=>(
                    <div key={k} onClick={()=>setPm(k)}
                      style={{background:pm===k?C.greenBg:C.bg,border:`1.5px solid ${pm===k?C.green:C.border}`,
                        borderRadius:12,padding:"12px 8px",textAlign:"center",cursor:"pointer",transition:"all .15s"}}>
                      <div style={{fontSize:22,marginBottom:5}}>{ic}</div>
                      <div style={{fontSize:12,fontWeight:700,color:C.text}}>{n}</div>
                      <div style={{fontSize:10,color:C.textSub,marginTop:2}}>{s}</div>
                    </div>
                  ))}
                </div>
                <button onClick={()=>setPay(sel)}
                  style={{width:"100%",padding:13,borderRadius:12,border:"none",
                    background:`linear-gradient(135deg,${C.green},#00c887)`,color:C.white,
                    fontWeight:700,cursor:"pointer",fontSize:15,boxShadow:`0 4px 16px ${C.green}44`}}>
                  ✅ Pay {fmt(sel.amount)} Now
                </button>
                <div style={{textAlign:"center",fontSize:10,color:C.textLight,marginTop:8}}>
                  🔒 Secured by Razorpay · GST Invoice auto-attached
                </div>
              </Card>
            )}

            {/* Timeline */}
            <Card>
              <div style={{display:"flex",alignItems:"center",marginBottom:14,gap:8}}>
                <IconBox emoji="🕐" bg={C.tealBg} size={32}/>
                <div style={{fontWeight:700,fontSize:14,color:C.text}}>Service Timeline</div>
              </div>
              {[
                {dot:"✓",bg:C.greenBg, bd:C.green,  t:"Technician Completed Work",  d:"Arun Kumar completed job. Parts logged.",        ts:"Oct 28 · 4:45 PM",  c:C.green  },
                {dot:"✓",bg:C.greenBg, bd:C.green,  t:"Admin Verified & Approved",   d:"Work order reviewed and approved by Admin.",     ts:"Oct 29 · 10:12 AM", c:C.green  },
                {dot:"🧾",bg:C.greenBg,bd:C.green,  t:"Bill Auto-Generated",         d:`${sel.id} created automatically. SMS sent.`,     ts:"Oct 29 · 10:12 AM", c:C.green  },
                {dot:"₹",bg:sel.status==="paid"?C.greenBg:C.orangeBg,
                  bd:sel.status==="paid"?C.green:C.orange,
                  t:sel.status==="paid"?"Payment Completed ✓":"Payment Pending",
                  d:sel.status==="paid"?"Payment received. Thank you!":`Pay before ${sel.paid}.`,
                  ts:sel.status==="paid"?sel.paid:`Due: ${sel.paid}`,
                  c:sel.status==="paid"?C.green:C.orange},
              ].map((s,i,arr)=>(
                <div key={i} style={{display:"flex",gap:12,paddingBottom:i<arr.length-1?14:0,position:"relative"}}>
                  {i<arr.length-1&&<div style={{position:"absolute",left:14,top:30,bottom:0,width:1,background:C.border}}/>}
                  <div style={{width:28,height:28,borderRadius:8,background:s.bg,border:`1.5px solid ${s.bd}`,
                    display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,flexShrink:0,zIndex:1}}>{s.dot}</div>
                  <div>
                    <div style={{fontWeight:700,fontSize:13,color:s.c}}>{s.t}</div>
                    <div style={{fontSize:11,color:C.textSub,marginTop:3,lineHeight:1.5}}>{s.d}</div>
                    <div style={{fontSize:10,color:C.textLight,marginTop:4}}>{s.ts}</div>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        )}
      </div>

      <PayModal bill={pay} onClose={()=>setPay(null)}
        onConfirm={()=>{setPay(null);onToast("💳 Redirecting to payment gateway...");}}/>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════════════════════
export default function BillAnalysis() {
  const [tab,      setTab]      = useState("client");
  const [toast,    setToast]    = useState({msg:"",vis:false});
  const [clientNew,setClientNew]= useState([]);

  const showToast = useCallback((msg)=>{
    setToast({msg,vis:true});
    setTimeout(()=>setToast(t=>({...t,vis:false})),3500);
  },[]);

  const handleBillApproved = useCallback((bill)=>{
    setClientNew(prev=>[bill,...prev]);
  },[]);

  return(
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:"'Segoe UI',system-ui,sans-serif"}}>
      {/* Header */}
      <div style={{background:C.white,borderBottom:`1px solid ${C.border}`,padding:"14px 26px",
        display:"flex",alignItems:"center",gap:16,boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
        <div style={{width:44,height:44,borderRadius:12,background:`linear-gradient(135deg,${C.green},#00c887)`,
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>📊</div>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <h1 style={{fontSize:20,fontWeight:800,color:C.text,margin:0}}>Bill Analysis</h1>
            <Badge label="New Feature" color={C.orange}/>
          </div>
          <div style={{fontSize:12,color:C.textSub,marginTop:2}}>
            Technician work → Admin approval → Auto-generated bill → Client payment
          </div>
        </div>
        <button onClick={()=>showToast("📤 Exporting...")}
          style={{padding:"8px 16px",borderRadius:10,border:`1px solid ${C.border}`,
            background:C.white,color:C.textSub,fontWeight:600,cursor:"pointer",fontSize:13}}>📤 Export</button>
        <button onClick={()=>showToast("🔄 Refreshed!")}
          style={{padding:"8px 16px",borderRadius:10,border:`1px solid ${C.border}`,
            background:C.white,color:C.textSub,fontWeight:600,cursor:"pointer",fontSize:13}}>🔄 Refresh</button>
      </div>

      {/* Tabs */}
      <div style={{background:C.white,borderBottom:`1px solid ${C.border}`,padding:"0 26px",display:"flex"}}>
        {[
          {key:"client",label:"📊 Bill Analysis",  sub:"Client View",  color:C.orange},
          {key:"admin", label:"⚙️ Bill Approval",   sub:"Admin Portal", color:C.purple},
        ].map(t=>(
          <button key={t.key} onClick={()=>setTab(t.key)}
            style={{padding:"14px 20px",border:"none",background:"transparent",cursor:"pointer",
              fontFamily:"inherit",borderBottom:`3px solid ${tab===t.key?t.color:"transparent"}`,
              display:"flex",alignItems:"center",gap:8,transition:"all .15s"}}>
            <span style={{fontSize:14,fontWeight:700,color:tab===t.key?t.color:C.textSub}}>{t.label}</span>
            <span style={{fontSize:10,color:C.textLight,background:C.bg,borderRadius:6,padding:"1px 7px"}}>{t.sub}</span>
            {t.key==="client"&&clientNew.length>0&&<Badge label={`${clientNew.length} New`} color={C.green}/>}
          </button>
        ))}
      </div>

      <div style={{padding:"20px 26px"}}>
        {tab==="admin" &&<AdminPanel  onToast={showToast} onBillApproved={handleBillApproved}/>}
        {tab==="client"&&<ClientPanel onToast={showToast} newBills={clientNew}/>}
      </div>

      <Toast msg={toast.msg} visible={toast.vis}/>
    </div>
  );
}