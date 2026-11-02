importScripts('db.js');
const queues=new Map();let lastCapture=0;
chrome.runtime.onMessage.addListener((msg,sender,respond)=>{
 if(!sender.tab||!['middle:start','middle:frame','middle:discard','middle:finish','middle:abort'].includes(msg.type))return;
 const tab=sender.tab,previous=queues.get(tab.id)||Promise.resolve();
 const work=previous.catch(()=>{}).then(async()=>{
  if(msg.type==='middle:start'){const run={id:crypto.randomUUID(),tabId:tab.id,windowId:tab.windowId,created:Date.now(),meta:msg.meta,frames:[]};await putRun(run);return {id:run.id}}
  const run=await getRun(msg.id);if(!run||run.tabId!==tab.id)throw Error('截图任务已失效，请重新开始。');
  if(msg.type==='middle:abort'){await clearRun(run.id);return {ok:true}}
  if(msg.type==='middle:discard'){run.frames.pop();await putRun(run);return {count:run.frames.length}}
  if(msg.type==='middle:frame'){
   if(run.frames.length>=100)throw Error('达到 100 屏上限，请完成本段后重新开始。');
   const delay=Math.max(0,700-(Date.now()-lastCapture));if(delay)await new Promise(r=>setTimeout(r,delay));
   const [active]=await chrome.tabs.query({active:true,windowId:run.windowId});if(active?.id!==tab.id)throw Error('请回到正在截图的标签页后再滚动。');
   const win=await chrome.windows.get(run.windowId);if(!win.focused)throw Error('请保持截图窗口在前台后再滚动。');
   const data=await chrome.tabs.captureVisibleTab(run.windowId,{format:'png'});lastCapture=Date.now();
   run.frames.push({data,...msg.frame});await putRun(run);return {count:run.frames.length}
  }
  if(msg.type==='middle:finish'){if(!run.frames.length)throw Error('还没有截图');run.meta={...run.meta,...msg.meta};await putRun(run);await chrome.tabs.create({url:chrome.runtime.getURL('result.html')+'?id='+run.id});return {ok:true}}
 });queues.set(tab.id,work);work.then(value=>respond({ok:true,...value}),error=>respond({ok:false,error:error.message})).finally(()=>{if(queues.get(tab.id)===work)queues.delete(tab.id)});return true;
});
