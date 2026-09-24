import test from 'node:test';
import assert from 'node:assert/strict';
import {nutritionForRecipe,sumMealLogs} from '../frontend/src/nutrition.js';

test('recipe totals use grams and portion count without inventing unavailable nutrients',()=>{
 const pantry=[{id:'rice',kind:'food',title:'Gạo',details:JSON.stringify({nutritionPer100g:{kcal:350,protein:7,fat:1,carbs:77,fiber:2,sodium:1}})}];
 const recipe={details:JSON.stringify({ingredients:[{foodId:'rice',name:'Gạo',grams:200}],servings:2})};
 assert.equal(nutritionForRecipe(recipe,pantry).nutrition.kcal,350);
 const incomplete={details:JSON.stringify({ingredients:[{name:'Thịt bò',grams:150}],servings:2})};
 assert.equal(nutritionForRecipe(incomplete,pantry).nutrition,null);
 assert.deepEqual(nutritionForRecipe(incomplete,pantry).missing,['Thịt bò']);
 const partlyKnown=[{id:'egg',kind:'food',title:'Trứng',details:JSON.stringify({nutritionPer100g:{kcal:155,protein:13,fat:11,carbs:1}})},...pantry];
 const mixed={details:JSON.stringify({ingredients:[{foodId:'rice',name:'Gạo',grams:100},{foodId:'egg',name:'Trứng',grams:100}],servings:1})};
 assert.equal(nutritionForRecipe(mixed,partlyKnown).nutrition.kcal,505);
 assert.equal(nutritionForRecipe(mixed,partlyKnown).nutrition.fiber,undefined);
});

test('a partially documented meal does not turn missing fat into zero grams',()=>{
 const logs=[{details:JSON.stringify({nutrition:{kcal:400,protein:20}})},{details:JSON.stringify({nutrition:{kcal:200,protein:10,fat:5}})}];
 const {total,coverage}=sumMealLogs(logs);
 assert.equal(total.kcal,600);
 assert.equal(coverage.kcal,2);
 assert.equal(coverage.fat,1);
});
