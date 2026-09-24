import test from 'node:test';
import assert from 'node:assert/strict';
import {occurrenceDates,expandRecords,withDetails} from '../frontend/src/recurrence.js';

test('monthly income and expenses follow the original date and stop at until date',()=>{
 const salary={id:'salary',kind:'income',date:'2026-01-31',amount:2000,details:JSON.stringify({recurrence:{frequency:'monthly',until:'2026-04-30'}})};
 assert.deepEqual(occurrenceDates(salary,'2026-02-01','2026-04-30'),['2026-02-28','2026-03-31','2026-04-30']);
 assert.equal(expandRecords([salary],'2026-02-01','2026-02-28',['income']).reduce((sum,x)=>sum+x.amount,0),2000);
});

test('a completed task occurrence keeps other dates available',()=>{
 const task={id:'task',kind:'task',date:'2026-09-01',details:JSON.stringify({recurrence:{frequency:'weekly'}})};
 const completed={...task,details:withDetails(task,{completedDates:['2026-09-08']})};
 const dates=expandRecords([completed],'2026-09-01','2026-09-22',['task']);
 assert.deepEqual(dates.map(x=>x.date),['2026-09-01','2026-09-08','2026-09-15','2026-09-22']);
 assert.deepEqual(JSON.parse(completed.details).completedDates,['2026-09-08']);
});
