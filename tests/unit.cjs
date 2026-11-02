const assert=require('node:assert/strict');const {planFrames}=require('../stitch.js');
const f=(scrollTop,height=800)=>({scrollTop,clip:{height}});
assert.deepEqual(planFrames([f(0),f(736),f(1463)]),[{index:0,dest:0,cut:0,height:800},{index:1,dest:800,cut:64,height:736},{index:2,dest:1536,cut:73,height:727}]);
assert.deepEqual(planFrames([f(220),f(956)]).map(x=>[x.dest,x.height]),[[0,800],[800,736]]);
assert.equal(planFrames([f(0),f(0)]).length,1);assert.equal(planFrames([f(0),f(0)])[0].index,1);
assert.equal(planFrames([f(0),f(10),f(20)]).reduce((sum,x)=>sum+x.height,0),820);
assert.deepEqual(planFrames([f(1000),f(0),f(500)]).map(p=>p.index),[1,2,0]);
assert.throws(()=>planFrames([f(0),f(1500)]),/空档/);
assert.equal(planFrames([f(0),f(1500),f(500),f(1000)]).reduce((s,p)=>s+p.height,0),2300);
assert.deepEqual(planFrames([]),[]);
console.log('PASS: overlap, final partial, nonzero start, reverse, duplicate/latest, gaps and backfill');

const {isNoiseLabel}=require('../noise.js');
for(const s of ['3 messages','2messages','1 message','12 new messages','See more','查看更多','3 条消息','1,200 messages'])assert(isNoiseLabel(s),s);
for(const s of ['there are 3 messages','3 messages are missing','See more information','message','聊天正文','3 messages\n正文','user messages'])assert(!isNoiseLabel(s),s);
console.log('PASS: exact UI label positives and prose negatives');
