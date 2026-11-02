/* Small, exact-label UI filters. No OCR, network, or chat-content collection. */
(function(root){
 const labels=/^(?:(?:\d[\d,]*|\d[\d,]*\+)\s*(?:(?:new|unread)\s+)?messages?|(?:\d[\d,]*|\d[\d,]*\+)\s*条(?:新|未读)?消息|(?:see|show|view)\s+more|查看更多|显示更多|更多消息)$/i;
 function isNoiseLabel(text){return typeof text==='string'&&labels.test(text.replace(/\s+/g,' ').trim())}
 function isNoiseControl(el){
  if(!el||!el.getBoundingClientRect||['P','PRE','CODE','TEXTAREA','INPUT','IMG','CANVAS','VIDEO'].includes(el.tagName)||el.isContentEditable)return false;
  const r=el.getBoundingClientRect();if(r.width<=0||r.width>240||r.height<=0||r.height>60)return false;
  if(el.querySelector('img,canvas,video,input,textarea,[contenteditable="true"],p,pre,code'))return false;
  const style=getComputedStyle(el),role=el.getAttribute('role');
  const interactive=['BUTTON','A','SUMMARY'].includes(el.tagName)||role==='button'||el.hasAttribute('tabindex')||style.cursor==='pointer';
  if(!interactive)return false;
  // textContent avoids touching parent messages; bounded exact whole-label match only.
  const text=(el.textContent||'');if(text.length>80)return false;
  return isNoiseLabel(text);
 }
 root.isNoiseControl=isNoiseControl;
 if(typeof module!=='undefined')module.exports={isNoiseLabel,isNoiseControl};
})(globalThis);
