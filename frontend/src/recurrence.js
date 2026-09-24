// A saved record remains the source of truth; occurrences are generated for display.
const ymd=d=>`${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}-${String(d.getUTCDate()).padStart(2,'0')}`;
const parse=s=>/^\d{4}-\d{2}-\d{2}$/.test(s||'')?new Date(s+'T12:00:00Z'):null;
export function detailsOf(record){try{return JSON.parse(record.details||'{}')||{}}catch{return {}}}
export function withDetails(record,changes){return JSON.stringify({...detailsOf(record),...changes})}
export function recurrenceOf(record){const r=detailsOf(record).recurrence;return r&&['daily','weekly','monthly','yearly'].includes(r.frequency)?r:null}
export function occurrenceDates(record,from,to){const repeat=recurrenceOf(record),start=parse(record.date),fromDate=parse(from),toDate=parse(to);if(!start||!fromDate||!toDate||fromDate>toDate)return [];
 if(!repeat)return record.date>=from&&record.date<=to?[record.date]:[];
 const until=parse(repeat.until),end=until&&until<toDate?until:toDate;if(end<start)return [];
 const interval=Math.max(1,Math.min(12,Number(repeat.interval)||1)),dates=[];
 if(repeat.frequency==='daily'||repeat.frequency==='weekly'){
  const days=interval*(repeat.frequency==='weekly'?7:1),i=Math.max(0,Math.floor((fromDate-start)/(86400000*days))-1);
  for(let step=i;step<500;step++){const date=new Date(start);date.setUTCDate(date.getUTCDate()+step*days);if(date>end)break;if(date>=fromDate)dates.push(ymd(date))}
 }else{
  // Anchor each occurrence to the original date, so Jan 31 -> Feb 28 -> Mar 31.
  const months=interval*(repeat.frequency==='yearly'?12:1);
  for(let step=0;step<240;step++){const targetMonth=start.getUTCMonth()+step*months,year=start.getUTCFullYear()+Math.floor(targetMonth/12),month=((targetMonth%12)+12)%12;
   const max=new Date(Date.UTC(year,month+1,0)).getUTCDate(),date=new Date(Date.UTC(year,month,Math.min(start.getUTCDate(),max),12));if(date>end)break;if(date>=fromDate)dates.push(ymd(date))}
 }
 return dates;
}
export function expandRecords(records,from,to,kinds){return records.filter(x=>!kinds||kinds.includes(x.kind)).flatMap(record=>occurrenceDates(record,from,to).map(date=>({...record,date,source_id:record.id,id:record.id+'@'+date,recurring:!!recurrenceOf(record)})))}
export function nextOccurrences(records,from,to,kinds){return expandRecords(records,from,to,kinds).sort((a,b)=>a.date.localeCompare(b.date))}
