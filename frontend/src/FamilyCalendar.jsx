import React,{useEffect,useMemo,useState} from 'react';
import {ChevronLeft,ChevronRight,RefreshCw,ExternalLink} from 'lucide-react';
import {t} from './i18n.js';
import {detailsOf,expandRecords} from './recurrence.js';

const pad=n=>String(n).padStart(2,'0');
const dayKey=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const locale={vi:'vi-VN',en:'en-GB',fr:'fr-FR',nl:'nl-NL',da:'da-DK'};
export default function FamilyCalendar({items,people,api,lang,onError,add}){
 const [month,setMonth]=useState(()=>new Date(new Date().getFullYear(),new Date().getMonth(),1));
 const [selected,setSelected]=useState(()=>new Set());
 const [chosen,setChosen]=useState(()=>dayKey(new Date()));
 const [google,setGoogle]=useState([]),[loading,setLoading]=useState(false),[refresh,setRefresh]=useState(0),[loadError,setLoadError]=useState('');
 const names=people.filter(x=>x!=='Cả nhà');
 const start=new Date(month.getFullYear(),month.getMonth(),1),end=new Date(month.getFullYear(),month.getMonth()+1,1);
 useEffect(()=>{let alive=true;setLoading(true);setLoadError('');api('/calendar/events?from='+encodeURIComponent(start.toISOString())+'&to='+encodeURIComponent(end.toISOString())).then(rows=>{if(alive)setGoogle(rows)}).catch(err=>{if(alive){setGoogle([]);setLoadError(err.message)}}).finally(()=>{if(alive)setLoading(false)});return()=>{alive=false}},[month,refresh]);
 const entries=useMemo(()=>{
  const monthStart=dayKey(start),monthEnd=dayKey(new Date(month.getFullYear(),month.getMonth()+1,0));
  const local=expandRecords(items.filter(x=>x.kind==='event'&&x.date),monthStart,monthEnd).map(x=>({key:'local-'+x.id,date:x.date,title:x.title,person:x.person||'Cả nhà',time:x.time,source:'local'}));
  const sent=new Set(items.filter(x=>x.kind==='event').map(x=>detailsOf(x).googleEventId).filter(Boolean));
  const remote=google.filter(x=>!sent.has(x.id)).map(x=>{const match=names.find(n=>x.title?.endsWith(' · '+n));return {key:'google-'+x.id,date:x.start?.slice(0,10),title:x.title,person:match||'Cả nhà',time:x.start?.includes('T')?new Date(x.start).toLocaleTimeString(locale[lang],{hour:'2-digit',minute:'2-digit'}):'',source:'google',link:x.link}});
  return [...local,...remote].filter(x=>x.date&&(!selected.size||selected.has(x.person))).sort((a,b)=>(a.date+(a.time||'')).localeCompare(b.date+(b.time||'')));
 },[items,google,selected,people,lang,month]);
 const first=(start.getDay()+6)%7;const count=Math.ceil((first+new Date(month.getFullYear(),month.getMonth()+1,0).getDate())/7)*7;
 const cells=Array.from({length:count},(_,i)=>new Date(month.getFullYear(),month.getMonth(),i-first+1));
 const byDay=useMemo(()=>entries.reduce((map,x)=>{(map[x.date]??=[]).push(x);return map},{}),[entries]);
 function move(delta){const next=new Date(month.getFullYear(),month.getMonth()+delta,1);setMonth(next);setChosen(dayKey(next))}
 function toggle(name){setSelected(prev=>{const next=new Set(prev);next.has(name)?next.delete(name):next.add(name);return next})}
 const format=new Intl.DateTimeFormat(locale[lang],{month:'long',year:'numeric'});
 return <section className="panel family-calendar"><div className="panel-head calendar-heading"><div><h2>{t('Lịch tháng',lang)}</h2><p>{t('Chọn nhiều người để xem lịch cùng lúc.',lang)}</p></div><button className="text-btn" onClick={()=>setRefresh(x=>x+1)} disabled={loading}><RefreshCw size={15}/>{t('Làm mới',lang)}</button></div>
  <div className="calendar-filters" aria-label={t('Lọc lịch theo người',lang)}><button className={!selected.size?'selected':''} onClick={()=>setSelected(new Set())} aria-pressed={!selected.size}>{t('Tất cả',lang)}</button>{names.map(name=><button key={name} className={selected.has(name)?'selected':''} onClick={()=>toggle(name)} aria-pressed={selected.has(name)}><span className="calendar-person-dot"/>{t(name,lang)}</button>)}</div>
  <p className="calendar-help">{t('Sự kiện Google chưa gắn tên thành viên được xem là lịch chung; chỉ hiện khi chọn Tất cả hoặc Cả nhà.',lang)}</p>
  <div className="calendar-controls"><strong>{format.format(month)}</strong><div><button onClick={()=>move(-1)} aria-label={t('Tháng trước',lang)}><ChevronLeft size={19}/></button><button className="calendar-today" onClick={()=>{const now=new Date();setMonth(new Date(now.getFullYear(),now.getMonth(),1));setChosen(dayKey(now))}}>{t('Hôm nay',lang)}</button><button onClick={()=>move(1)} aria-label={t('Tháng sau',lang)}><ChevronRight size={19}/></button></div></div>
  <div className="calendar-grid" role="grid">{Array.from({length:7},(_,i)=><div className="calendar-weekday" key={i}>{new Intl.DateTimeFormat(locale[lang],{weekday:'short'}).format(new Date(2024,0,1+i))}</div>)}{cells.map(d=>{const date=dayKey(d),day=byDay[date]||[],outside=d.getMonth()!==month.getMonth();return <button type="button" key={date} className={'calendar-day'+(outside?' outside':'')+(chosen===date?' chosen':'')+(date===dayKey(new Date())?' current':'')} onClick={()=>{setChosen(date);if(outside)setMonth(new Date(d.getFullYear(),d.getMonth(),1))}} aria-label={date+' · '+day.length+' '+t('sự kiện',lang)}><span className="calendar-date">{d.getDate()}</span><span className="calendar-day-events">{day.slice(0,2).map(x=><span key={x.key} className={'calendar-event-tag '+x.source} title={x.title}>{x.title}</span>)}{day.length>2&&<small>+{day.length-2}</small>}</span></button>})}</div>
  {loadError&&<p className="form-error">{loadError} · {t('Lịch lưu trong Cura vẫn hiển thị.',lang)}</p>}
  <div className="calendar-detail"><div className="panel-head"><h3>{new Intl.DateTimeFormat(locale[lang],{dateStyle:'full'}).format(new Date(chosen+'T12:00:00'))}</h3><button className="text-btn" onClick={()=>add('event')}>+ {t('Thêm lịch hẹn',lang)}</button></div>{(byDay[chosen]||[]).length?(byDay[chosen]||[]).map(x=><div className="calendar-detail-row" key={x.key}><span>{x.time||'—'}</span><strong>{x.title}</strong><small>{t(x.person,lang)} · {x.source==='google'?'Google':'Cura'}</small>{x.link&&<a href={x.link} target="_blank" rel="noopener noreferrer" aria-label="Google Calendar"><ExternalLink size={16}/></a>}</div>):<p className="hint">{t('Ngày này chưa có lịch hẹn.',lang)}</p>}</div>
 </section>
}
