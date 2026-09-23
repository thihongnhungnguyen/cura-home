import test from 'node:test';
import assert from 'node:assert/strict';
import {calendarDaysUntil,isVietnamFlight,upcomingCountdownEvents} from '../frontend/src/countdown.js';

test('countdown uses calendar days around midnight rather than 24-hour periods',()=>{
 assert.equal(calendarDaysUntil('2027-01-16',new Date(2027,0,15,23,59)),1);
 assert.equal(calendarDaysUntil('2027-01-16',new Date(2027,0,16,0,1)),0);
 assert.equal(calendarDaysUntil('2027-01-16',new Date(2027,0,17,0,1)),-1);
 assert.equal(calendarDaysUntil('2027-02-30'),null);
});

test('upcoming calendar and saved events sort by date, excluding past or malformed dates',()=>{
 const now=new Date(2027,0,10,20);
 const records=[{id:'past',kind:'event',title:'Old',date:'2027-01-09'},{id:'trip',kind:'event',title:'Bay về Việt Nam',date:'2027-01-16',category:'Chuyến bay · Việt Nam'},{id:'food',kind:'food',title:'Rice',date:'2027-01-11'}];
 const result=upcomingCountdownEvents(records,[{id:'google',title:'Meeting',start:'2027-01-12T09:00:00+01:00'}],now);
 assert.deepEqual(result.map(x=>x.id),['google:google','local:trip']);
 assert.equal(isVietnamFlight(result[1]),true);
 assert.equal(isVietnamFlight({title:'Flight to Paris'}),false);
});
