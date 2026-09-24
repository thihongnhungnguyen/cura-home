import React from 'react';
import {House,ShoppingBasket,UtensilsCrossed,HeartPulse,Car,GraduationCap,BriefcaseBusiness,Wallet,Plane,Gift,Shirt,Scissors,Package,CalendarDays,BookHeart,Sparkles,Flower2,Coffee,CookingPot,Apple,Beef,Refrigerator,Archive,ClipboardCheck} from 'lucide-react';
import {detailsOf} from './recurrence.js';
export const icons={home:House,shopping:ShoppingBasket,meal:UtensilsCrossed,health:HeartPulse,travel:Plane,school:GraduationCap,work:BriefcaseBusiness,money:Wallet,gift:Gift,clothes:Shirt,beauty:Scissors,goods:Package,calendar:CalendarDays,diary:BookHeart,sparkle:Sparkles,plant:Flower2,coffee:Coffee,cook:CookingPot,fruit:Apple,meat:Beef,fridge:Refrigerator,storage:Archive,task:ClipboardCheck};
export const iconKeys=Object.keys(icons);
const kindIcons={income:'money',expense:'shopping',tax:'money',saving:'gift',event:'calendar',health:'health',food:'fridge',meal:'cook',wardrobe:'clothes',idea:'sparkle',household:'home',shopping:'shopping',task:'task'};
export function iconFor(record){const key=detailsOf(record).icon||kindIcons[record.kind]||'sparkle';return icons[key]||Sparkles}
export default function IconPicker({value,onChange,tr}){return <div className="icon-picker" role="group" aria-label={tr('Biểu tượng danh mục')}>{iconKeys.map(key=>{const Icon=icons[key];return <button key={key} type="button" className={value===key?'selected':''} aria-label={key} title={key} aria-pressed={value===key} onClick={()=>onChange(key)}><Icon size={20}/></button>})}</div>}
