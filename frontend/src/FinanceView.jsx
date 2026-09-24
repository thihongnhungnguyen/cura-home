import React,{useState} from 'react';
import {Settings2,Wallet,Users,Tags} from 'lucide-react';
import {icons,iconFor} from './IconPicker.jsx';
import {detailsOf,expandRecords,nextOccurrences} from './recurrence.js';
import {t} from './i18n.js';
const fmt=n=>new Intl.NumberFormat('da-DK',{style:'currency',currency:'DKK',maximumFractionDigits:0}).format(n||0);
function MoneyBag({id,icon:Icon,level,name,remaining}){
 const fill=Math.round(level*66),clip='money-bag-'+id;
 return <svg className="money-bag" viewBox="0 0 170 190" role="img" aria-label={`${name}: ${fmt(remaining)}`}>
  <defs>
   <linearGradient id="bag-red" x2="1" y2=".7"><stop stopColor="#e76a60"/><stop offset=".48" stopColor="#c63840"/><stop offset="1" stopColor="#921e32"/></linearGradient>
   <linearGradient id="bag-gold" x2=".3" y2="1"><stop stopColor="#fff3aa"/><stop offset=".55" stopColor="#efbe50"/><stop offset="1" stopColor="#c77d28"/></linearGradient>
   <clipPath id={clip}><path d="M37 88 Q20 109 24 147 Q29 177 85 177 Q141 177 146 147 Q150 109 133 88 Z"/></clipPath>
  </defs>
  <ellipse cx="85" cy="180" rx="58" ry="6" fill="#8a4650" opacity=".15"/>
  <path d="M55 47 Q38 22 66 25 Q86 9 101 27 Q131 22 114 49 L107 73 H63 Z" fill="#b92c39" stroke="#f2b85c" strokeWidth="3"/>
  <path d="M37 88 Q20 109 24 147 Q29 177 85 177 Q141 177 146 147 Q150 109 133 88 Z" fill="url(#bag-red)" stroke="#a52836" strokeWidth="3"/>
  <path d="M37 88 Q20 109 24 147 Q29 177 85 177 Q141 177 146 147 Q150 109 133 88 Z" fill="none" stroke="#fff0cf" strokeWidth="2" opacity=".35" transform="translate(-5 -3)"/>
  <g clipPath={`url(#${clip})`}>
   <rect x="24" y={170-fill} width="122" height={fill+7} fill="url(#bag-gold)" opacity=".94"/>
   {Array.from({length:5},(_,row)=>Array.from({length:5},(_,col)=>{const y=166-row*14,x=35+col*24+(row%2)*8;return y>=172-fill?<g key={`${row}-${col}`}><ellipse cx={x} cy={y} rx="11" ry="5" fill="#ce8428" stroke="#fff0a9" strokeWidth="1"/><ellipse cx={x} cy={y-2} rx="10" ry="4" fill="#f8ce5d"/><ellipse cx={x} cy={y-2} rx="4" ry="2" fill="none" stroke="#b77920" strokeWidth="1"/></g>:null}))}
  </g>
  <path d="M54 54 Q85 46 116 54 L124 77 Q85 88 46 77 Z" fill="#bf303d" stroke="#f6c46c" strokeWidth="3"/>
  <ellipse cx="85" cy="83" rx="51" ry="11" fill="#e75249" stroke="#ffd988" strokeWidth="4"/>
  <ellipse cx="85" cy="79" rx="42" ry="6" fill="#ffcc78" opacity=".8"/>
  <path d="M47 94 Q41 116 44 139" fill="none" stroke="white" strokeWidth="5" opacity=".25" strokeLinecap="round"/>
  <path d="M66 111 L85 99 104 111 104 137 85 149 66 137 Z" fill="#fff2ce" stroke="#e1a33d" strokeWidth="3"/>
  <Icon x="73" y="115" width="24" height="24" color="#a33537" strokeWidth="2.5"/>
  <path d="M45 59 Q85 67 125 59" fill="none" stroke="#fcd58b" strokeWidth="4"/>
  <path d="M114 61q29-1 24 19q-5 15-22 8" fill="none" stroke="#ac642f" strokeWidth="8"/><path d="M114 61q29-1 24 19q-5 15-22 8" fill="none" stroke="#f2c76d" strokeWidth="5"/>
  <path d="M119 63q7 20 15 27" fill="none" stroke="#eeb45d" strokeWidth="3" strokeLinecap="round"/>
  <path d="M37 150q13 19 48 20" fill="none" stroke="#fff0bc" strokeWidth="2" opacity=".45"/>
 </svg>;
}
export default function FinanceView({items,people,jars,lang,month,onSettings}){
 const [group,setGroup]=useState('category'),tr=x=>t(x,lang);
 const first=month+'-01',last=new Date(Number(month.slice(0,4)),Number(month.slice(5,7)),0).toISOString().slice(0,10);
 const expenses=expandRecords(items,first,last,['expense']),incomes=expandRecords(items,first,last,['income']);
 const income=incomes.reduce((a,x)=>a+Number(x.amount||0),0),spent=expenses.reduce((a,x)=>a+Number(x.amount||0),0);
 const categories=expenses.reduce((a,x)=>{const key=group==='person'?x.person:x.category||tr('Khác');const slot=a[key]||{amount:0,icon:iconFor(x)};slot.amount+=Number(x.amount||0);a[key]=slot;return a},{});
 if(group==='person')for(const person of people)categories[person]??={amount:0,icon:Users};
 const chart=Object.entries(categories).sort((a,b)=>b[1].amount-a[1].amount);
 const coming=nextOccurrences(items,new Date().toISOString().slice(0,10),new Date(Date.now()+365*86400000).toISOString().slice(0,10),['tax','saving']).slice(0,8);
 return <><div className="metrics"><div><span>{tr('Thu nhập tháng')}</span><strong>{fmt(income)}</strong></div><div><span>{tr('Đã chi tháng')}</span><strong>{fmt(spent)}</strong></div><div><span>{tr('Chênh lệch')}</span><strong>{fmt(income-spent)}</strong></div><div><span>{tr('Claim chờ nhận')}</span><strong>{fmt(items.filter(x=>x.kind==='claim'&&x.status!=='done').reduce((a,x)=>a+Number(x.amount||0),0))}</strong></div></div>
  <section className="panel money-jars"><div className="panel-head"><div><h2>{tr('Hũ tài chính của nhà mình')}</h2><p>{tr('Mực vàng trong hũ biểu thị tiền còn lại so với kế hoạch tháng này.')}</p></div><button className="text-btn" onClick={onSettings}><Settings2 size={17}/>{tr('Thiết kế hũ')}</button></div><div className="money-jars-grid">{jars.map(jar=>{const plan=income*Number(jar.percent||0)/100;const used=expenses.filter(x=>{const d=detailsOf(x);return d.jar_id===jar.id||(!d.jar_id&&x.category?.toLowerCase()===jar.name.toLowerCase())}).reduce((a,x)=>a+Number(x.amount||0),0);const remaining=plan-used,level=plan>0?Math.min(1,Math.max(0,remaining/plan)):0,Icon=icons[jar.color?.startsWith('icon:')?jar.color.slice(5):'money']||Wallet;return <article className={'money-jar'+(remaining<0?' overdrawn':'')} key={jar.id}><MoneyBag id={jar.id} icon={Icon} level={level} name={jar.name} remaining={remaining}/><strong>{jar.name}</strong><small>{jar.percent}% · {tr('Kế hoạch')} {fmt(plan)}</small><b>{tr('Còn lại')} {fmt(remaining)}</b><div className="money-jar-track" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(level*100)} aria-label={`${jar.name}: ${Math.round(level*100)}%`}><span style={{width:Math.round(level*100)+'%'}}/></div><small>{Math.round(level*100)}% · {tr('Đã chi')} {fmt(used)}</small></article>})}</div>{!jars.length&&<p className="hint">{tr('Chưa có hũ tài chính.')}</p>}</section>
  <section className="panel spending-chart"><div className="panel-head"><div><h2>{tr('Biểu đồ chi tiêu')}</h2><p>{tr('Chọn cách nhóm các khoản chi trong tháng.')}</p></div><div className="chart-toggle"><button className={group==='category'?'selected':''} onClick={()=>setGroup('category')}><Tags size={16}/>{tr('Theo nhóm')}</button><button className={group==='person'?'selected':''} onClick={()=>setGroup('person')}><Users size={16}/>{tr('Theo người')}</button></div></div>{chart.some(([,d])=>d.amount>0)?<div className="spending-bars">{chart.map(([name,data])=>{const Icon=data.icon;return <div className="spending-bar" key={name}><span><Icon size={18}/>{tr(name)}</span><div className="spending-track"><div style={{width:Math.max(2,data.amount/(spent||1)*100)+'%'}}/></div><strong>{fmt(data.amount)}</strong></div>})}</div>:<p className="hint">{tr('Chưa ghi khoản chi tháng này.')}</p>}</section>
  <section className="panel recurring-upcoming"><div className="panel-head"><h2>{tr('Thuế & tiết kiệm sắp tới')}</h2></div>{coming.length?coming.map(x=>{const Icon=iconFor(x);return <div className="recurring-upcoming-row" key={x.id}><Icon size={18}/><strong>{x.title}</strong><small>{x.date}{x.recurring?' · ↻':''}</small><b>{fmt(x.amount)}</b></div>}):<p className="hint">{tr('Chưa có kỳ thuế hoặc tiết kiệm sắp tới.')}</p>}</section>
  </>
}
