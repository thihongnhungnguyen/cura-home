import React,{useEffect,useState} from 'react';
import {CalendarDays,Plane,Luggage,MapPin,Plus,ChevronDown} from 'lucide-react';
import {t} from './i18n.js';
import {calendarDaysUntil,isVietnamFlight,upcomingCountdownEvents} from './countdown.js';

const example={id:'sample',title:'Bay về Việt Nam',date:'2027-01-16',category:'Chuyến bay · Việt Nam',person:'Cả nhà'};
const locales={vi:'vi-VN',en:'en-GB',fr:'fr-FR',nl:'nl-NL',da:'da-DK'};
const emptyForm={title:'',date:'',time:'',flight:false};
const localISODate=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};

export default function Countdown({items,googleEvents,createEvent,lang}){
 const [selected,setSelected]=useState(()=>localStorage.getItem('cura-countdown-event')||'');
 const [form,setForm]=useState(emptyForm);
 const [editing,setEditing]=useState(false);
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState('');
 const [now,setNow]=useState(()=>new Date());
 useEffect(()=>{const timer=setInterval(()=>setNow(new Date()),60000);return()=>clearInterval(timer)},[]);
 const events=upcomingCountdownEvents(items,googleEvents,now);
 const event=selected==='sample'?example:events.find(x=>x.id===selected)||events[0]||example;
 const days=calendarDaysUntil(event.date,now);
 const flight=isVietnamFlight(event);
 const sample=event.id==='sample';
 const dateLabel=new Intl.DateTimeFormat(locales[lang],{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(event.date+'T12:00:00Z'));
 async function save(e){
  e.preventDefault();setBusy(true);setError('');
  try{
   const created=await createEvent({kind:'event',title:form.title.trim(),date:form.date,category:form.flight?'Chuyến bay · Việt Nam':'',person:'Cả nhà',time:form.time||''});
   choose('local:'+created.id);setEditing(false);setForm(emptyForm);
  }catch(err){setError(err.message)}finally{setBusy(false)}
 }
 function choose(id){setSelected(id);localStorage.setItem('cura-countdown-event',id)}
 return <section className={'countdown-card '+(flight?'travel':'ordinary')} aria-label={t('Đếm ngược sự kiện',lang)}>
  <div className="countdown-main">
   <div className="countdown-top"><span className="countdown-kicker"><CalendarDays size={15}/>{t('ĐẾM NGƯỢC SỰ KIỆN',lang)}</span><button type="button" className="countdown-add" onClick={()=>{setForm(sample?{title:example.title,date:example.date,time:'',flight:true}:emptyForm);setEditing(x=>!x)}}><Plus size={15}/>{t('Thêm sự kiện',lang)}</button></div>
   <div className="countdown-content"><div className="countdown-copy"><span className="countdown-overline">{sample?t('Mẫu minh họa · chưa lưu',lang):t('Sự kiện sắp đến',lang)}</span><h2>{event.title}</h2><p className="countdown-date">{dateLabel}{event.person&&event.person!=='Cả nhà'?' · '+event.person:''}</p><div className="countdown-number"><strong>{Math.abs(days)}</strong><span>{days<0?t('Đã qua',lang):days===0?t('Hôm nay!',lang):t('ngày nữa',lang)}</span></div></div>
    <div className="countdown-visual" aria-hidden="true">{flight?<><span className="flight-badge"><MapPin size={13}/> VIỆT NAM</span><div className="flight-route"><span className="flight-line"/><Plane size={41} strokeWidth={1.6}/></div><div className="luggage-stack"><span className="case case-back"><Luggage/></span><span className="case case-front"><Luggage/></span></div><span className="destination-stamp">VN <span>✳</span></span></>:<><div className="ordinary-halo"/><CalendarDays size={86} strokeWidth={1}/><span className="ordinary-spark">✳</span></>}</div>
   </div>
   <div className="countdown-footer"><label className="countdown-select"><span>{t('Đếm ngược đến',lang)}</span><span className="select-shell"><select value={event.id} onChange={e=>choose(e.target.value)} aria-label={t('Chọn sự kiện đếm ngược',lang)}>{events.map(x=><option key={x.id} value={x.id}>{x.title} · {x.date}</option>)}<option value="sample">{t('Mẫu: Bay về Việt Nam · 16/01/2027',lang)}</option></select><ChevronDown size={14}/></span></label>{sample&&<button className="countdown-save-sample" onClick={async()=>{setBusy(true);setError('');try{const created=await createEvent({kind:'event',title:example.title,date:example.date,category:example.category,person:'Cả nhà',time:''});choose('local:'+created.id)}catch(err){setError(err.message)}finally{setBusy(false)}}} disabled={busy}>{t('Lưu chuyến đi mẫu',lang)}</button>}</div>
  </div>
  {editing&&<form className="countdown-form" onSubmit={save}><label>{t('Tên sự kiện',lang)}<input required maxLength={180} value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder={t('Ví dụ: Bay về Việt Nam',lang)}/></label><label>{t('Ngày diễn ra',lang)}<input required type="date" min={localISODate()} value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></label><label>{t('Giờ (nếu biết)',lang)}<input type="time" value={form.time} onChange={e=>setForm({...form,time:e.target.value})}/></label><label className="countdown-check"><input type="checkbox" checked={form.flight} onChange={e=>setForm({...form,flight:e.target.checked})}/>{t('Chuyến bay về Việt Nam',lang)}</label><button type="submit" className="primary" disabled={busy}>{t('Lưu và đếm ngược',lang)}</button></form>}
  {error&&<p className="countdown-error" role="alert">{error}</p>}
 </section>
}
