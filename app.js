// Rotatividade do Hostel: lógica principal separada para facilitar manutenção.
(function(){
const $=id=>document.getElementById(id);
const beds=[
 {room:"1",bed:"Casal",type:"casal"},{room:"2",bed:"Casal",type:"casal"},{room:"3",bed:"Casal",type:"casal"},
 {room:"4",bed:"Casal",type:"casal"},{room:"5",bed:"Casal",type:"casal"},
 {room:"9",bed:"Casal",type:"casal"},{room:"9",bed:"Extra solteiro",type:"solteiro"},
 {room:"10",bed:"Casal",type:"casal"},{room:"11",bed:"Casal",type:"casal"},{room:"12",bed:"Casal",type:"casal"},
 {room:"13",bed:"Casal",type:"casal"},{room:"14",bed:"Casal",type:"casal"},{room:"15",bed:"Casal",type:"casal"},
 {room:"16",bed:"Casal",type:"casal"},{room:"6",bed:"Solteiro",type:"solteiro"},
 {room:"17",bed:"Solteiro",type:"solteiro"},
 {room:"7",bed:"Solteiro 1",type:"solteiro"},{room:"7",bed:"Solteiro 2",type:"solteiro"},{room:"7",bed:"Solteiro 3",type:"solteiro"},{room:"7",bed:"Solteiro 4",type:"solteiro"},
 {room:"8",bed:"Solteiro 1",type:"solteiro"},{room:"8",bed:"Solteiro 2",type:"solteiro"},{room:"8",bed:"Solteiro 3",type:"solteiro"},{room:"8",bed:"Solteiro 4",type:"solteiro"}
];

const octoberSeedRows = [["L","L","L","X","L","X","LS","L","L","L","L","L","L","X","X","L","X","L"],["L","L","X","L","X","X","L","L","L","X","L","L","L","X","L","L","X","L"],["L","X","L","L","L","X","LS","L","L","L","L","X","L","X","L","L","L","L"],["X","LS","X","X","L","X","L","X","L","X","X","L","X","X","X","L","X","X"],["L","L","X","L","L","X","L","X","L","L","L","L","L","L","L","L","L","L"],["X","L","X","X","X","L","X","X","L","X","X","X","X","X","X","L","X","X"],["X","L","L","L","X","X","L","X","L","X","L","X","X","X","L","X","X","L"],["L","X","L","LS","L","X","L","L","X","L","X","L","X","L","X","L","X","X"],["L","X","L","LS","X","X","X","L","X","L","X","L","X","L","X","L","X","X"],["L","X","L","X","X","X","X","L","X","L","X","X","X","L","X","L","X","X"],["L","X","L","X","X","X","X","X","X","L","X","X","X","L","X","X","X","X"],["X","X","L","X","LS","X","L","X","L","X","L","L","L","X","LS","L","X","L"],["X","X","L","X","X","X","L","X","L","X","L","L","L","X","LS","L","X","X"],["X","X","X","X","L","X","L","X","X","L","X","X","L","X","LS","X","X","X"],["L","L","L","L","L","X","L","X","L","X","L","L","LS","L","X","X","L","L"],["X","X","X","X","X","X","L","X","X","X","X","X","L","X","LS","X","X","X"],["X","X","X","X","L","X","L","X","X","X","L","X","LS","L","X","X","X","X"],["X","L","L","L","X","LS","L","L","X","X","X","L","L","X","LS","L","L","L"],["X","L","L","L","L","X","L","L","L","L","X","L","L","X","LS","L","X","X"],["X","L","L","L","L","X","L","L","L","X","L","L","L","X","L","X","L","L"],["LS","L","L","L","L","L","L","L","L","L","L","L","L","L","L","X","L","L"],["X","L","L","X","L","L","L","L","L","X","L","X","L","L","L","L","L","L"],["L","L","L","X","X","X","L","X","L","X","X","L","L","X","LS","L","X","X"],["X","L","X","X","X","X","X","L","L","L","X","X","X","X","X","L","X","X"]];

let data={};
const key=()=>`hostel-rotatividade-${$('unit').value}-${$('month').value}`;
function blankMonth(){return {responsible:"",cells:{}}}
function load(){
 try {
   const saved=localStorage.getItem(key());
   if(saved) data=JSON.parse(saved);
   else data=blankMonth();
   if($('unit').value==="SR" && $('month').value==="2026-10" && (!data.cells || Object.keys(data.cells).length===0)){
     data=blankMonth();
     octoberSeedRows.forEach((row,i)=>row.forEach((v,j)=>{if(v)data.cells[`${i}|${j+1}`]=v}));
     data.prefilledFromPhoto=true;
     localStorage.setItem(key(),JSON.stringify(data));
   }
 } catch(e){data=blankMonth()}
 $('responsible').value=data.responsible||"";
 render()
}
function persist(show){data.responsible=$('responsible').value;try{localStorage.setItem(key(),JSON.stringify(data));if(show)alert("Salvo neste dispositivo.")}catch(e){if(show)alert("Não foi possível salvar automaticamente neste navegador. Faça um Backup JSON.")}}
function days(){const [y,m]=$('month').value.split('-').map(Number);return new Date(y,m,0).getDate()}
function status(row,d){return data.cells[`${row}|${d}`]||""}
function setStatus(row,d,v){if(v)data.cells[`${row}|${d}`]=v;else delete data.cells[`${row}|${d}`];persist(false);updateMetrics();updateDaily()}
function changed(v){return v==="L"||v==="LS"}
function render(){
 const n=days();$('gridTitle').textContent=`Unidade ${$('unit').value} • Grade de ${$('month').value}`;
 let html='<thead><tr><th>Quarto</th><th>Cama</th>';
 for(let d=1;d<=n;d++)html+=`<th>${d}</th>`;
 html+='</tr></thead><tbody>';
 beds.forEach((b,i)=>{html+=`<tr><td>${b.room}</td><td>${b.bed}</td>`;
 for(let d=1;d<=n;d++){const v=status(i,d);html+=`<td class="status" data-print="${v||'·'}"><select aria-label="Quarto ${b.room}, ${b.bed}, dia ${d}" data-row="${i}" data-day="${d}">
 <option value="" ${v===""?"selected":""}>·</option><option value="L" ${v==="L"?"selected":""}>L</option><option value="LS" ${v==="LS"?"selected":""}>LS</option><option value="X" ${v==="X"?"selected":""}>X</option></select></td>`}
 html+='</tr>'});
 html+='</tbody>';
 $('grid').innerHTML=html;
 $('grid').querySelectorAll('select').forEach(sel=>sel.addEventListener('change',e=>{const s=e.target;setStatus(+s.dataset.row,+s.dataset.day,s.value);s.closest('td').dataset.print=s.value||'·';updateAll()}));
 updateAll();
}
function totalsForDay(d){
 let couple=0,single=0,ls=0,l=0,pending=0;
 beds.forEach((b,i)=>{let v=status(i,d);if(changed(v)){if(b.type==="casal")couple++;else single++;if(v==="LS")ls++;else l++}else if(v==="")pending++});
 return {couple,single,total:couple+single,ls,l,pending}
}
function updateMetrics(){
 let total=0,c=0,s=0,peak=0,peakDay="—";
 for(let d=1;d<=days();d++){const t=totalsForDay(d);total+=t.total;c+=t.couple;s+=t.single;if(t.total>peak){peak=t.total;peakDay=String(d).padStart(2,"0")}}
 $('mTotal').textContent=total;$('mCouple').textContent=c;$('mSingle').textContent=s;$('mPeak').textContent=peak?`${peak} (dia ${peakDay})`:"—";
 $('summaryNote').textContent=`Total de marcações L/LS no mês: ${total}. Média por dia do mês: ${(total/days()).toFixed(1).replace(".",",")}.`;
}
function updateDaily(){
 let h='<thead><tr><th>Dia</th><th>Casal</th><th>Solteiro</th><th>Total trocas</th><th>L</th><th>LS</th><th>Em branco</th></tr></thead><tbody>';
 for(let d=1;d<=days();d++){const t=totalsForDay(d);h+=`<tr><td>${String(d).padStart(2,"0")}</td><td>${t.couple}</td><td>${t.single}</td><td><b>${t.total}</b></td><td>${t.l}</td><td>${t.ls}</td><td>${t.pending}</td></tr>`}
 h+='</tbody>';$('daily').innerHTML=h;
}
function updateAll(){updateMetrics();updateDaily()}
function download(name,content,type){const blob=new Blob([content],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1200)}
function csv(){
 const n=days();let rows=[["Quarto","Cama",...Array.from({length:n},(_,i)=>String(i+1))]];
 beds.forEach((b,i)=>rows.push([b.room,b.bed,...Array.from({length:n},(_,j)=>status(i,j+1))]));
 rows.push([]);rows.push(["Resumo diário"]);rows.push(["Dia","Trocas casal","Trocas solteiro","Total","L","LS","Em branco"]);
 for(let d=1;d<=n;d++){const t=totalsForDay(d);rows.push([d,t.couple,t.single,t.total,t.l,t.ls,t.pending])}
 const text=rows.map(r=>r.map(x=>`"${String(x??"").replace(/"/g,'""')}"`).join(";")).join("\r\n");
 download(`rotatividade_hostel_${$('unit').value}_${$('month').value}.csv`,"\ufeff"+text,"text/csv;charset=utf-8");
}
function jsonBackup(){data.responsible=$('responsible').value;download(`backup_rotatividade_${$('unit').value}_${$('month').value}.json`,JSON.stringify({app:"Rotatividade do Hostel",version:1,unit:$('unit').value,month:$('month').value,data},null,2),"application/json")}
$('month').addEventListener('change',load);
$('unit').addEventListener('change',load);
$('responsible').addEventListener('change',()=>persist(false));
$('saveBtn').addEventListener('click',()=>persist(true));
$('clearMonth').addEventListener('click',()=>{if(confirm("Apagar todas as marcações deste mês neste dispositivo? Faça backup antes, se necessário.")){data=blankMonth();persist(false);render()}});
$('csvBtn').addEventListener('click',csv);
$('jsonBtn').addEventListener('click',jsonBackup);
$('importBtn').addEventListener('click',()=>$('jsonFile').click());
$('jsonFile').addEventListener('change',async e=>{const f=e.target.files[0];if(!f)return;try{const obj=JSON.parse(await f.text());if(!obj.data||!obj.month)throw new Error();$('month').value=obj.month;if(obj.unit && ['SR','MK'].includes(obj.unit))$('unit').value=obj.unit;data=obj.data;persist(false);load();alert("Backup importado. Os dados deste mês foram carregados neste dispositivo.")}catch(err){alert("Esse arquivo não parece ser um backup válido deste sistema.")}e.target.value=""});
$('printBtn').addEventListener('click',()=>window.print());
load();
})();
