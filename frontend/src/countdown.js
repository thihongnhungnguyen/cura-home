export function calendarDaysUntil(date,now=new Date()){
 const parts=/^(\d{4})-(\d{2})-(\d{2})$/.exec(date||'');
 if(!parts)return null;
 const [year,month,day]=parts.slice(1).map(Number);
 const target=Date.UTC(year,month-1,day);
 if(new Date(target).toISOString().slice(0,10)!==date)return null;
 return Math.round((target-Date.UTC(now.getFullYear(),now.getMonth(),now.getDate()))/86400000);
}

export function isVietnamFlight(event){
 const category=(event.category||'').toLowerCase();
 const title=(event.title||'').toLowerCase();
 const flight=/bay|flight|fly|vol|vlucht|flyvning|chuyến bay/.test(category+' '+title);
 const vietnam=/việt nam|viet nam|vietnam|\bvn\b/.test(category+' '+title);
 return flight&&vietnam;
}

export function upcomingCountdownEvents(records,googleEvents=[],now=new Date()){
 const local=records.filter(x=>x.kind==='event').map(x=>({id:'local:'+x.id,title:x.title,date:x.date,category:x.category||'',person:x.person||''}));
 const google=googleEvents.map(x=>({id:'google:'+x.id,title:x.title,date:x.start?.slice(0,10),category:'',person:''}));
 return [...local,...google].filter(x=>{const days=calendarDaysUntil(x.date,now);return days!==null&&days>=0}).sort((a,b)=>a.date.localeCompare(b.date)||a.title.localeCompare(b.title));
}
