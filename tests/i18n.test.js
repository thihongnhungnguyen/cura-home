import test from 'node:test';
import assert from 'node:assert/strict';
import {t,languages} from '../frontend/src/i18n.js';
test('all five locales label the primary navigation and new features',()=>{for(const [lang] of languages){for(const label of ['Tổng quan','Tài chính','Lịch cả nhà','Wishlist','Gia đình','Ưu đãi','Góp ý cho dự án']){const translated=t(label,lang);assert.ok(translated.length>0);if(lang!=='vi'&&label!=='Wishlist')assert.notEqual(translated,label,`${lang}: ${label}`)}}});
