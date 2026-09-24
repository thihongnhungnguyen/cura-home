import {detailsOf} from './recurrence.js';

export const nutritionKeys=['kcal','protein','fat','carbs','fiber','sodium'];
export const nutritionUnits={kcal:'kcal',protein:'g',fat:'g',carbs:'g',fiber:'g',sodium:'mg'};
export function validNutrition(value){return value&&Number.isFinite(Number(value.kcal))&&value.kcal!==''&&nutritionKeys.slice(1,4).every(k=>value[k]!==''&&value[k]!=null&&Number.isFinite(Number(value[k]))&&Number(value[k])>=0)&&Number(value.kcal)>=0}
export function readNutrition(value){if(!validNutrition(value))return null;return Object.fromEntries(nutritionKeys.filter(k=>value[k]!==''&&value[k]!=null&&Number.isFinite(Number(value[k]))&&Number(value[k])>=0).map(k=>[k,Number(value[k])]))}
export function nutritionForRecipe(recipe,foods){
 const info=detailsOf(recipe),manual=readNutrition(info.nutritionPerServing);
 if(manual)return {nutrition:manual,source:'manual',missing:[]};
 const ingredients=info.ingredients||[];
 if(!ingredients.length)return {nutrition:null,source:'unknown',missing:[]};
 const missing=[],totals=Object.fromEntries(nutritionKeys.map(k=>[k,0])),known=new Set(nutritionKeys);
 for(const part of ingredients){
  const food=foods.find(x=>x.kind==='food'&&(part.foodId?x.id===part.foodId:x.title.trim().toLocaleLowerCase()===part.name.trim().toLocaleLowerCase()));
  const values=readNutrition(detailsOf(food||{}).nutritionPer100g),grams=Number(part.grams);
  if(!values||!Number.isFinite(grams)||grams<=0){missing.push(part.name);continue}
  for(const key of nutritionKeys)if(values[key]===undefined)known.delete(key);else totals[key]+=values[key]*grams/100;
 }
 if(missing.length)return {nutrition:null,source:'incomplete',missing};
 const servings=Math.max(1,Number(info.servings)||1);
 return {nutrition:Object.fromEntries(nutritionKeys.filter(k=>known.has(k)).map(k=>[k,Math.round(totals[k]/servings*10)/10])),source:'ingredients',missing:[]};
}
export function sumMealLogs(logs){const total=Object.fromEntries(nutritionKeys.map(k=>[k,0])),coverage=Object.fromEntries(nutritionKeys.map(k=>[k,0]));for(const log of logs){const n=detailsOf(log).nutrition||{};for(const key of nutritionKeys)if(n[key]!==''&&n[key]!=null&&Number.isFinite(Number(n[key]))){total[key]+=Number(n[key]);coverage[key]++}}return {total,coverage}}
