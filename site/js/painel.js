const hipBox=q=>q.hip?`<div class="hyp"><b>O que investigamos (DISC)</b>${esc(q.hip)}</div>`:"";
const rotuloSet=set=>SETNOME[set];

function blocoQ(q,n,rs){
  if(q.tipo==="opt"){const t=rs.length||1,exs=rs.filter(r=>r[q.id+"_ex"]);
    const med=q.row&&rs.length?(rs.reduce((a,r)=>a+(+r[q.id]||0),0)/rs.length).toFixed(1).replace(".",","):null;
    return`<div class="q"><h3><span class="qn">${n}</span>${q.l}</h3>${hipBox(q)}${med?`<p class="num">Média: ${med}</p>`:""}<div class="dist">${opcoes(q).map(o=>{const k=rs.filter(r=>r[q.id]===o).length;return`<div class="drow"><span>${o}</span><span class="num">${k}</span><div class="dbar"><i style="width:${k/t*100}%"></i></div></div>`}).join("")}</div>${exs.map(r=>`<blockquote>${esc(r[q.id+"_ex"])}<small>${esc(r[q.id])}</small></blockquote>`).join("")}</div>`}
  const xs=rs.filter(r=>r[q.id]);
  return`<div class="q"><h3><span class="qn">${n}</span>${q.l}</h3>${hipBox(q)}${xs.map(r=>`<blockquote>${esc(r[q.id])}<small>${esc(r.contato)}</small></blockquote>`).join("")||'<span class="muted">Sem respostas.</span>'}</div>`;
}

const TEMA={tecnico:"Conhecimento técnico",turnos:"Presença nos turnos",orient:"Comunicação",comunica:"Comunicação",mudanca:"Comunicação",
 conversa:"Relacionamento",relacao:"Relacionamento",pessoa:"Relacionamento",delegar:"Delegação",justa:"Imparcialidade",
 desenvolve:"Desenvolvimento de pessoas",reconhece:"Desenvolvimento de pessoas",lento:"Desenvolvimento de pessoas",
 combina:"Organização e entrega",metas:"Organização e entrega",ritmo:"Organização e entrega",acesso:"Organização e entrega",antecipa:"Organização e entrega",
 erro:"Segurança para falar",ideia:"Abertura a opiniões",discorda:"Abertura a opiniões",feedback:"Abertura a opiniões",
 conflito:"Gestão de conflitos",assume:"Integridade",causa:"Parceria e solução de problemas",decisao:"Firmeza nas decisões",
 ajuda:"Pede apoio quando precisa",desgaste:"Sinais de desgaste",equipe:"Aceitação da equipe"};
const temaDe=q=>TEMA[q.id.replace(/^[elg]_/,"")];
function indicadores(){
  const temas={};let opts=0,comEx=0,na=0;
  respostas.forEach(r=>{const s=setDe(r.grupo);if(!s)return;todasDe(s).forEach(q=>{
    if(q.tipo!=="opt"||q.row)return;const v=r[q.id];if(!v)return;opts++;
    if(v===NA){na++;}else if(r[q.id+"_ex"])comEx++;
    const t=temaDe(q);if(!t||!negIdx(q).length)return;
    const T=temas[t]||(temas[t]={fav:0,neg:0,mid:0,na:0});
    if(v===NA)T.na++;else if(q.o[0]===v)T.fav++;else if(exigeEx(q,v))T.neg++;else T.mid++;
  })});
  const lista=Object.entries(temas).map(([t,T])=>{const n=T.fav+T.neg+T.mid;const fp=n?T.fav/n:0,np=n?T.neg/n:0;
    const st=!n?"sem":np>=.3?"critico":(np>=.15||fp<.5)?"atencao":"bom";return{t,n,fp,np,mp:n?T.mid/n:0,na:T.na,st}}).sort((a,b)=>b.np-a.np||a.fp-b.fp);
  const nota=id=>{const v=respostas.map(r=>r[id]).filter(x=>x!==undefined&&x!==""&&x!==NA).map(Number);return v.length?{m:v.reduce((a,b)=>a+b,0)/v.length,n:v.length}:null};
  const ultima=respostas.map(r=>r.em).filter(Boolean).sort().pop();
  return{lista,opts,comEx,na,notas:[["Equipe · recomendaria como líder","e_nota"],["Áreas · parceria","l_nota"],["Gestor · confiança no cargo","g_confia"]].map(([l,id])=>({l,...(nota(id)||{m:null,n:0})})),ultima};
}
const pct=x=>Math.round(x*100)+"%";
const STLAB={bom:"Favorável",atencao:"Atenção",critico:"Crítico",sem:"Sem dados"};
function renderIndicadores(porSet){
  const I=indicadores(),fmt=n=>n==null?"–":n.toFixed(1).replace(".",",");
  const fortes=I.lista.filter(x=>x.n).sort((a,b)=>b.fp-a.fp).slice(0,3),aten=I.lista.filter(x=>x.st==="critico"||x.st==="atencao").slice(0,3);
  return`<div class="card">
    <div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:10px;align-items:center"><h2>Indicadores</h2>
    <button class="btn ghost" type="button" id="baixar">Baixar planilha das respostas</button></div>
    <p class="muted" id="bmsg" hidden></p>
    <div class="kpis">
      <div class="kpi"><b>${respostas.length}</b><span>respostas</span><small>${Object.keys(SETS).map(s=>`${SETNOME[s]} ${porSet[s].length}`).join(" · ")}</small></div>
      ${I.notas.map(x=>`<div class="kpi"><b>${fmt(x.m)}</b><span>${x.l}</span><small>${x.n} nota${x.n===1?"":"s"} de 0 a 10</small></div>`).join("")}
      <div class="kpi"><b>${I.opts?pct(I.comEx/Math.max(1,I.opts-I.na)):"–"}</b><span>respostas com exemplo</span><small>quanto maior, mais rico o feedback</small></div>
      <div class="kpi"><b>${I.opts?pct(I.na/I.opts):"–"}</b><span>"não tive como observar"</span><small>${I.ultima?"última resposta em "+new Date(I.ultima).toLocaleDateString("pt-BR"):"sem respostas ainda"}</small></div>
    </div>
  </div>
  <div class="grid2">
    <div class="card"><span class="eyebrow">Pontos fortes</span>${fortes.length?fortes.map(x=>`<div class="drow"><span>${x.t}</span><span class="num">${pct(x.fp)}</span></div>`).join(""):'<p class="muted">Aparecem quando chegarem respostas.</p>'}<p class="hint">% de respostas na opção mais positiva</p></div>
    <div class="card"><span class="eyebrow">Pontos de atenção</span>${aten.length?aten.map(x=>`<div class="drow"><span>${x.t}</span><span class="num">${pct(x.np)}</span></div>`).join(""):'<p class="muted">Nenhum tema em atenção até agora.</p>'}<p class="hint">% de respostas nas opções negativas</p></div>
  </div>
  <div class="card"><h2>Termômetro por tema</h2>
    <p class="muted">Junta as perguntas dos três grupos por tema. Verde: favorável · Azul-claro: intermediário · Vermelho: negativo. "Não observou" fica de fora do cálculo.</p>
    <div class="termo">${I.lista.length?I.lista.map(x=>`<div class="trow"><div class="tl"><span>${x.t}</span><span class="pill ${x.st}">${STLAB[x.st]}</span></div>
      <div class="tbar"><i class="f" style="width:${x.fp*100}%"></i><i class="m" style="width:${x.mp*100}%"></i><i class="n" style="width:${x.np*100}%"></i></div>
      <small class="num muted">${x.n} resposta${x.n===1?"":"s"}${x.na?` · ${x.na} não observou`:""}</small></div>`).join(""):'<p class="muted">O termômetro aparece quando chegarem as primeiras respostas.</p>'}</div>
  </div>`;
}
function baixarCSV(){
  const cols=[];const vis=new Set();Object.values(SETS).flat().flatMap(p=>p.qs).forEach(q=>{if(vis.has(q.id))return;vis.add(q.id);cols.push(q);});
  const cel=v=>'"'+String(v??"").replace(/"/g,'""').replace(/\r?\n/g," ")+'"';
  const head=["Grupo","Contato","Data",...cols.flatMap(q=>q.tipo==="opt"?[q.l,q.l+" (exemplo)"]:[q.l])];
  const linhas=respostas.map(r=>{const s=setDe(r.grupo);return[SETNOME[s]||"",r.contato,r.em?new Date(r.em).toLocaleDateString("pt-BR"):"",...cols.flatMap(q=>q.tipo==="opt"?[r[q.id]||"",r[q.id+"_ex"]||""]:[r[q.id]||""])]});
  const csv="\ufeff"+[head,...linhas].map(l=>l.map(cel).join(";")).join("\r\n");
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));
  a.download="feedback-"+NOME_AVALIADA.toLowerCase().replace(/\s+/g,"-")+"-"+new Date().toISOString().slice(0,10)+".csv";
  document.body.appendChild(a);a.click();a.remove();
}
/* ===== Relatório do RH em camadas ===== */
const BLOCOS=[
 ["Liderança de pessoas",["Delegação","Desenvolvimento de pessoas","Relacionamento","Segurança para falar","Gestão de conflitos","Aceitação da equipe","Presença nos turnos"]],
 ["Comunicação",["Comunicação","Abertura a opiniões"]],
 ["Postura sob pressão",["Firmeza nas decisões","Pede apoio quando precisa","Sinais de desgaste"]],
 ["Técnica e entrega",["Conhecimento técnico","Organização e entrega","Parceria e solução de problemas"]],
 ["Integridade e imparcialidade",["Integridade","Imparcialidade"]]
];
const FATORES=[
 {k:"firmeza",f:"Ponto 1",d:"",disc:"",ids:["e_conflito","g_decisao","l_nao"]},
 {k:"proximidade",f:"Ponto 2",d:"",disc:"",ids:["e_conversa","e_pessoa","l_relacao"]},
 {k:"ritmo",f:"Ponto 3",d:"",disc:"",ids:["e_turnos","e_combina","l_acesso","g_ritmo","g_desgaste","g_turnos","g_metas"]},
 {k:"comunicacao",f:"Ponto 4",d:"",disc:"",ids:["e_orient","e_mudanca","e_reconhece","l_comunica","l_tecnico"]},
 {k:"paciencia",f:"Ponto 5",d:"",disc:"",ids:["e_lento","e_erro","e_justa","l_justa","g_justa"]},
 {k:"centraliza",f:"Ponto 6",d:"",disc:"",ids:["e_delegar","e_desenvolve","l_causa","g_ajuda","g_desenvolve"]},
 {k:"questionamento",f:"Ponto 7",d:"",disc:"",ids:["e_ideia","l_discorda","g_feedback","e_assume","l_assume","g_assume"]},
 {k:"forcas",f:"Ponto 8",d:"",disc:"",ids:["e_tecnico","l_antecipa","g_tecnico"],forca:true}
];
const corta=(t,n=200)=>t.length>n?t.slice(0,n).replace(/\s+\S*$/,"")+"…":t;

function contar(ids){
  let fav=0,neg=0,mid=0,na=0;
  respostas.forEach(r=>ids.forEach(id=>{const q=TODOS_Q[id];if(!q||q.tipo!=="opt"||q.row)return;const v=r[id];if(!v)return;
    if(v===NA)na++;else if(v===q.o[0])fav++;else if(exigeEx(q,v))neg++;else mid++;}));
  const n=fav+neg+mid;return{fav,neg,mid,na,n,fp:n?fav/n:0,np:n?neg/n:0,mp:n?mid/n:0};
}
const status=c=>!c.n?"sem":c.np>=.3?"critico":(c.np>=.15||c.fp<.5)?"atencao":"bom";
function idsDoTema(t){return Object.values(TODOS_Q).filter(q=>q.tipo==="opt"&&!q.row&&temaDe(q)===t&&negIdx(q).length).map(q=>q.id)}

function vozes(t,polo,max=2){
  const out=[];
  respostas.forEach(r=>idsDoTema(t).forEach(id=>{const q=TODOS_Q[id],v=r[id],ex=r[id+"_ex"];if(!ex||!v||v===NA)return;
    const neg=exigeEx(q,v);if((polo==="neg"&&neg)||(polo==="fav"&&v===q.o[0]))out.push(ex);}));
  return [...new Set(out)].sort((a,b)=>b.length-a.length).slice(0,max);
}
function abertas(ids,max){
  const out=[];respostas.forEach(r=>ids.forEach(id=>{if(r[id]&&r[id].length>=10)out.push(r[id])}));
  return out.sort((a,b)=>b.length-a.length).slice(0,max);
}


const NOMEG3={equipe:"a equipe",lateral:"os pares e as outras áreas",gestor:"o gestor"};
const QUEM={equipe:"alguém da equipe",lateral:"alguém de outra área ou par",gestor:"o gestor"};
function contarEm(rs,ids){const bak=respostas;respostas=rs;const c=contar(ids);respostas=bak;return c}
function fatorHTML(F){
  const c=contar(F.ids);let v;
  if(!c.n)v="Sem dados";else if(F.forca)v=c.fp>=.6?"Confirmada":c.fp>=.4?"Parcial":"Não confirmada";else v=c.np>=.3?"Confirmada":c.np>=.15?"Parcial":"Não confirmada";
  const cls={"Confirmada":F.forca?"bom":"critico","Parcial":"atencao","Não confirmada":F.forca?"critico":"bom","Sem dados":"sem"}[v];
  const frase=!c.n?"Ainda não há respostas suficientes para conferir.":F.forca
    ?{"Confirmada":"A força já é percebida no cargo","Parcial":"A força aparece em parte","Não confirmada":"A força ainda não aparece nas respostas"}[v]
    :{"Confirmada":"Isso é percebido pelas pessoas","Parcial":"Isso aparece em parte","Não confirmada":"Isso não aparece nas respostas: as pessoas descrevem o contrário"}[v];
  // por grupo
  const grupos=Object.keys(SETS).map(s=>{const rs=respostas.filter(r=>setDe(r.grupo)===s);const g=contarEm(rs,F.ids);return{s,g}}).filter(x=>x.g.n);
  const per=x=>F.forca?x.g.fp:x.g.np;
  const quem=grupos.filter(x=>per(x)>=(F.forca?.5:.25)).map(x=>NOMEG3[x.s]);
  const quemL=quem.length>1?quem.slice(0,-1).join(", ")+" e "+quem[quem.length-1]:quem[0];const quemTxt=c.n&&v!=="Não confirmada"&&quem.length?`, principalmente por ${quemL}`:"";
  // exemplo: polaridade conforme o veredito
  const querNeg=F.forca?v==="Não confirmada":v!=="Não confirmada";
  const exs=[];respostas.forEach(r=>F.ids.forEach(id=>{const q=TODOS_Q[id];if(!q)return;const val=r[id];
    if(q.tipo==="txt")return;
    const ex=r[id+"_ex"];if(!ex||!val||val===NA)return;const neg=exigeEx(q,val);
    if((querNeg&&neg)||(!querNeg&&val===q.o[0]))exs.push({t:ex,s:setDe(r.grupo),o:val});}));
  exs.sort((a,b)=>b.t.length-a.t.length);
  const usados=new Set(),sel=[];for(const e of exs){if(sel.length>=2)break;if(usados.has(e.s)&&exs.some(x=>!usados.has(x.s)&&!sel.includes(x)))continue;sel.push(e);usados.add(e.s)}
  return`<article class="hip2 ${cls}">
    <header><b>${F.f}</b><span class="pill ${cls}">${v}</span></header>
    <p><span class="lab">O DISC indica</span> que ${F.disc}</p>
    <p><span class="lab">Na prática</span> <b>${frase}${quemTxt}.</b>${c.n?` <span class="muted">${F.forca?pct(c.fp)+" das respostas foram na opção mais positiva":pct(c.np)+" das respostas apontam esse comportamento; "+pct(c.fp)+" apontam o contrário"}.</span>`:""}</p>
    ${grupos.length>1?`<div class="gchips">${grupos.map(x=>`<span>${SETNOME[x.s]} <b class="num">${pct(per(x))}</b></span>`).join("")}</div>`:""}
    ${sel.length?`<div class="evid"><span class="lab">Com base em comentários como</span>${sel.map(e=>`<blockquote>“${esc(corta(e.t,220))}”<small>${QUEM[e.s]}${e.o?` · respondeu “${esc(e.o)}”`:""}</small></blockquote>`).join("")}</div>`:(c.n?'<p class="hint">Ninguém deixou um exemplo escrito para este ponto.</p>':"")}
  </article>`;
}
function renderRelatorio(porSet){
  const I=indicadores(),fmt=n=>n==null?"–":n.toFixed(1).replace(".",",");
  const temas=I.lista.filter(x=>x.n);
  const fortes=[...temas].sort((a,b)=>b.fp-a.fp).filter(x=>x.fp>=.5).slice(0,3);
  const aten=temas.filter(x=>x.st==="critico"||x.st==="atencao").slice(0,3);
  const sint=!temas.length?"":`Destaque em ${fortes.map(x=>x.t.toLowerCase()).join(" e ")||"nenhum tema ainda"}${aten.length?`; atenção para ${aten.map(x=>x.t.toLowerCase()).join(", ")}`:""}.`;
  const rt=cfg.roteiro;
  const nav=[["r1","Resumo"],["r2","Competências"],["r3","DISC × percepção"],["r4","O que disseram"],["r5","Para a conversa"]];
  const vazio=!respostas.length;
  return`
  <nav class="rnav">${nav.map(([id,t],i)=>`<button type="button" data-ir="${id}"><span>${i+1}</span>${t}</button>`).join("")}</nav>

  <section class="card rel" id="r1">
    <div class="rhead"><span class="eyebrow">1 · Resumo em 1 minuto</span><button class="btn ghost" type="button" id="baixar">Baixar planilha</button></div>
    <p class="muted" id="bmsg" hidden></p>
    ${vazio?'<p class="muted">O resumo aparece assim que chegarem as primeiras respostas.</p>':`
    ${sint?`<p class="sintese">${esc(sint)}</p>`:""}
    <div class="kpis">
      <div class="kpi"><b>${respostas.length}</b><span>respostas</span><small>${Object.keys(SETS).map(s=>`${SETNOME[s]} ${porSet[s].length}`).join(" · ")}</small></div>
      ${I.notas.map(x=>`<div class="kpi"><b>${fmt(x.m)}</b><span>${x.l}</span><small>${x.n} nota${x.n===1?"":"s"} de 0 a 10</small></div>`).join("")}
    </div>
    <div class="grid2">
      <div class="lista bom"><h3>Pontos fortes</h3>${fortes.map(x=>`<div class="li"><span>${x.t}</span><b class="num">${pct(x.fp)}</b></div>`).join("")||'<p class="muted">Ainda nenhum tema com maioria favorável.</p>'}<small>% de respostas na opção mais positiva</small></div>
      <div class="lista critico"><h3>Pontos de atenção</h3>${aten.map(x=>`<div class="li"><span>${x.t}</span><b class="num">${pct(x.np)}</b></div>`).join("")||'<p class="muted">Nenhum tema em atenção.</p>'}<small>% de respostas nas opções negativas</small></div>
    </div>`}
  </section>

  <section class="card rel" id="r2">
    <span class="eyebrow">2 · Mapa de competências</span>
    <p class="muted">Os 17 temas agrupados em 5 blocos. Toque num bloco para ver os temas.</p>
    <div class="blocos">${BLOCOS.map(([b,ts])=>{const c=contar(ts.flatMap(idsDoTema)),st=status(c);
      return`<details class="bloco ${st}"><summary><span class="bt">${b}</span><span class="pill ${st}">${STLAB[st]}</span>
        <span class="tbar"><i class="f" style="width:${c.fp*100}%"></i><i class="m" style="width:${c.mp*100}%"></i><i class="n" style="width:${c.np*100}%"></i></span></summary>
        <div class="termo">${ts.map(t=>{const x=contar(idsDoTema(t)),s2=status(x);return`<div class="trow"><div class="tl"><span>${t}</span><span class="pill ${s2}">${STLAB[s2]}</span></div>
          <div class="tbar"><i class="f" style="width:${x.fp*100}%"></i><i class="m" style="width:${x.mp*100}%"></i><i class="n" style="width:${x.np*100}%"></i></div>
          <small class="num muted">${x.n} resposta${x.n===1?"":"s"}${x.na?` · ${x.na} não observou`:""}</small></div>`}).join("")}</div></details>`}).join("")}</div>
    <p class="legenda"><i class="f"></i>favorável <i class="m"></i>intermediário <i class="n"></i>negativo · "não observou" fica fora do cálculo</p>
  </section>

  <section class="card rel" id="r3">
    <span class="eyebrow">3 · DISC × percepção das pessoas</span>
    <p class="muted">O que o DISC dela indica, conferido com o que as pessoas responderam, com exemplos reais. Atualiza sozinho conforme as respostas chegam.</p>
    <div class="hips">${FATORES.map(fatorHTML).join("")}</div>
  </section>

  <section class="card rel" id="r4">
    <span class="eyebrow">4 · O que as pessoas disseram</span>
    <p class="muted">Só as falas mais concretas dos pontos fortes e de atenção. Todas as respostas estão no anexo.</p>
    ${vazio?'<p class="muted">As falas aparecem quando chegarem respostas.</p>':`
    <div class="grid2">
      <div>${fortes.map(x=>{const vs=vozes(x.t,"fav");return vs.length?`<h3 class="vt bom">${x.t}</h3>${vs.map(v=>`<blockquote>${esc(corta(v))}</blockquote>`).join("")}`:""}).join("")||'<p class="muted">Sem exemplos nos pontos fortes ainda.</p>'}</div>
      <div>${aten.map(x=>{const vs=vozes(x.t,"neg");return vs.length?`<h3 class="vt critico">${x.t}</h3>${vs.map(v=>`<blockquote>${esc(corta(v))}</blockquote>`).join("")}`:""}).join("")||'<p class="muted">Sem exemplos nos pontos de atenção.</p>'}</div>
    </div>
    ${(()=>{const s=abertas(["e_facilitar","l_melhor","g_foco"],4);return s.length?`<h3 class="vt">O que pedem a ela</h3>${s.map(v=>`<blockquote>${esc(corta(v))}</blockquote>`).join("")}`:""})()}`}
  </section>

  <section class="card rel" id="r5">
    <span class="eyebrow">5 · Para a conversa</span>
    ${rt?`<div class="grid2">
      <div><h3 class="vt bom">Reconhecer</h3><ul class="ul">${(rt.reconhecer||[]).map(x=>`<li><b>${esc(x.tema)}</b></li>`).join("")}</ul></div>
      <div><h3 class="vt critico">Ajustar</h3><ul class="ul">${(rt.ajustar||[]).map(x=>`<li><b>${esc(x.tema)}</b><br><span class="muted">${esc(x.pergunta||"")}</span></li>`).join("")}</ul></div>
    </div>
    <h3 class="vt">Combinados para 90 dias</h3><ol class="ul">${(rt.combinados||[]).map(x=>`<li>${esc(x)}</li>`).join("")}</ol>
    <button class="btn ghost" type="button" id="irRot">Ver roteiro completo</button>`
    :`<p class="muted">Quando tiver respostas suficientes (o ideal é 5 ou mais), gere o roteiro. O resumo dele aparece aqui.</p><button class="btn ghost" type="button" id="irRot">Ir para o roteiro</button>`}
  </section>`;
}

function renderPainel(){
  const P=$("#v-painel");
  const porSet={};Object.keys(SETS).forEach(s=>porSet[s]=respostas.filter(r=>setDe(r.grupo)===s));
  P.innerHTML=renderRelatorio(porSet)+`
  <details class="card anexo"><summary><span class="eyebrow">Anexo</span> <b>Todas as respostas, pergunta por pergunta</b></summary>
    <p class="muted">Cada grupo respondeu perguntas diferentes. Pares e outras áreas aparecem juntos para preservar o anonimato. Embaixo de cada pergunta está o que ela investiga no DISC.</p>
  ${Object.keys(SETS).map(s=>{let n=0;const rs=porSet[s];
    return`<div class="anexo-g"><span class="eyebrow">${SETNOME[s]} · ${rs.length} resposta${rs.length===1?"":"s"}</span>
      ${rs.length?SETS[s].map(p=>`<div class="part"><h3 class="muted">${p.t}</h3>${p.qs.map(q=>blocoQ(q,++n,rs)).join("")}</div>`).join(""):'<p class="muted">Ainda sem respostas deste grupo.</p>'}</div>`}).join("")}
  </details>`;
  $("#baixar").onclick=baixarCSV;$("#irRot").onclick=()=>aba("roteiro");
  P.querySelectorAll("[data-ir]").forEach(b=>b.onclick=()=>$("#"+b.dataset.ir).scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"}));
}
function textoRespostas(){
  return respostas.map((r,i)=>{const s=setDe(r.grupo);return`Resposta ${i+1} (${rotuloSet(s)}, contato: ${r.contato})\n`+todasDe(s).map(q=>`- [${q.id}] ${q.l}\n  ${r[q.id]||"(em branco)"}${r[q.id+"_ex"]?`\n  Exemplo: ${r[q.id+"_ex"]}`:""}`).join("\n")}).join("\n\n");
}
const hipotesesTexto=()=>{const vist=new Set();return Object.values(SETS).flat().flatMap(p=>p.qs).filter(q=>q.hip&&!vist.has(q.id)&&vist.add(q.id)).map(q=>`[${q.id}] ${q.hip}`).join("\n")};

function renderRoteiro(){
  const R=$("#v-roteiro"),rt=cfg.roteiro;
  const cor={"Confirmada":"var(--bad)","Parcial":"var(--accent)","Não confirmada":"var(--hyp)"};
  R.innerHTML=`<div class="card">
    <h2>Roteiro da conversa</h2>
    <p class="muted">O roteiro é montado pelo Claude. 1) Clique em <b>Copiar pedido para o Claude</b> e cole numa conversa com o Claude. 2) Copie a resposta dele (o bloco que começa com <code>{</code>) e cole no campo abaixo. 3) Clique em Salvar roteiro. O ideal é fazer isso com pelo menos 5 respostas.</p>
    <button class="btn" id="gerar" type="button" ${respostas.length?"":"disabled"}>Copiar pedido para o Claude (${respostas.length} resposta${respostas.length===1?"":"s"})</button>
    <p id="gmsg" class="muted" hidden></p>
    <textarea id="rot_json" placeholder="Cole aqui a resposta do Claude" style="min-height:120px;font-family:var(--mono);font-size:.85rem"></textarea>
    <button class="btn ghost" id="rot_salvar" type="button">Salvar roteiro</button>
    <p id="rmsg" class="muted" hidden></p>
  </div>
  ${rt?`<div class="card roteiro">
    <p class="num muted">Gerado em ${new Date(rt.em).toLocaleString("pt-BR")} com ${rt.n} respostas</p>
    <section><span class="eyebrow">DISC × percepção das pessoas</span><ul>${(rt.hipoteses||[]).map(x=>`<li><span class="ver" style="color:${cor[x.veredito]||"var(--muted)"}">${esc(x.veredito)}</span><b>${esc(x.hipotese)}</b>. ${esc(x.evidencia)}</li>`).join("")}</ul></section>
    <section><span class="eyebrow">1 · Abertura</span><p>${esc(rt.abertura)}</p><p class="fala">${esc(rt.fala_abertura)}</p></section>
    <section><span class="eyebrow">2 · O que reconhecer</span><ul>${(rt.reconhecer||[]).map(x=>`<li><b>${esc(x.tema)}</b>. ${esc(x.evidencia)}</li>`).join("")}</ul></section>
    <section><span class="eyebrow">3 · O que ajustar</span><ul>${(rt.ajustar||[]).map(x=>`<li><b>${esc(x.tema)}</b>. ${esc(x.evidencia)}<br><span class="muted">Pergunta para ela: ${esc(x.pergunta)}</span></li>`).join("")}</ul></section>
    <section><span class="eyebrow">4 · O custo da adaptação</span><p>${esc(rt.adaptacao)}</p><p class="fala">${esc(rt.fala_adaptacao)}</p></section>
    <section><span class="eyebrow">5 · Ponto cego</span><p>${esc(rt.ponto_cego)}</p><p class="fala">${esc(rt.fala_ponto_cego)}</p></section>
    <section><span class="eyebrow">6 · Combinados (próximos 90 dias)</span><ul>${(rt.combinados||[]).map(x=>`<li>${esc(x)}</li>`).join("")}</ul></section>
    <section><span class="eyebrow">7 · Fechamento</span><p class="fala">${esc(rt.fechamento)}</p></section>
    ${rt.cuidados?`<section><span class="eyebrow">Como conduzir com o perfil dela</span><p>${esc(rt.cuidados)}</p></section>`:""}
  </div>`:`<div class="card"><span class="eyebrow">Estrutura que será montada</span><p>DISC × percepção (cada hipótese confirmada ou não) · Abertura · O que reconhecer · O que ajustar · O custo da adaptação · Ponto cego · Combinados para 90 dias · Fechamento · Como conduzir com o perfil dela.</p></div>`}`;
  const b=$("#gerar");if(b)b.onclick=copiarPedido;$("#rot_salvar").onclick=salvarRoteiro;
}

function montarPedido(){
  const hips=hipotesesTexto();
  const prompt=`Você é especialista em RH e desenvolvimento de líderes numa indústria de MDF (Sudati). Monte o roteiro de uma conversa de feedback para ${NOME_AVALIADA}, que assumiu há pouco tempo a supervisão da Qualidade e está num programa de desenvolvimento. Quem conduz é o RH com a coordenadora.

PERFIL DISC DELA:
${cfg.disc||"(não informado)"}

HIPÓTESES QUE CADA PERGUNTA INVESTIGA:
${hips}

Regras:
- O conteúdo do feedback vem das RESPOSTAS. O DISC serve para levantar hipóteses e ajustar a forma da conversa, nunca como acusação ou rótulo.
- Em "hipoteses", para cada hipótese relevante, diga se as respostas a confirmam ("Confirmada"), confirmam em parte ("Parcial") ou não confirmam ("Não confirmada"), com a evidência (quantas pessoas, que tipo de exemplo). Use exatamente esses três valores em "veredito".
- "adaptacao": em 2-3 frases, o que as respostas mostram sobre o esforço de adaptação descrito no DISC: está funcionando, está custando caro, ou os dois. "fala_adaptacao": como abrir esse assunto com cuidado, perguntando como ela está se sentindo.
- Use só o que está nas respostas, priorizando temas que se repetem e exemplos concretos. Não invente fatos.
- Nunca identifique quem disse o quê; parafraseie os exemplos sem detalhes que entreguem o autor.
- Cada grupo (equipe, pares e outras áreas, gestor) respondeu perguntas diferentes; compare as visões entre os grupos quando fizer sentido.
- Linguagem direta, respeitosa, em português do Brasil.
- Respostas "Não tive como observar" não contam a favor nem contra; se forem muitas numa pergunta, diga que o tema ainda não pôde ser avaliado.
- Dê aos pontos fortes o mesmo peso e a mesma evidência que aos pontos de desenvolvimento.
- "reconhecer": 2 a 3 temas. "ajustar": 2 a 3 temas, cada um com uma pergunta aberta para ela refletir.
- "combinados": 3 ações concretas e verificáveis para 90 dias.
- "cuidados": como conduzir a conversa considerando o perfil dela (com base no DISC).

Responda apenas JSON com as chaves: hipoteses[{hipotese,veredito,evidencia}], abertura, fala_abertura, reconhecer[{tema,evidencia}], ajustar[{tema,evidencia,pergunta}], adaptacao, fala_adaptacao, ponto_cego, fala_ponto_cego, combinados[], fechamento, cuidados.

RESPOSTAS:
${textoRespostas()}`;
  return prompt;
}
async function copiarPedido(){
  const m=$("#gmsg");m.hidden=false;const t=montarPedido();
  try{await navigator.clipboard.writeText(t);m.textContent="Pedido copiado. Cole numa conversa com o Claude e traga a resposta para o campo abaixo."}
  catch(x){const ta=$("#rot_json");ta.value=t;ta.select();m.textContent="Não consegui copiar sozinho: o pedido está no campo abaixo, selecionado. Copie com Ctrl+C, depois apague e cole a resposta do Claude."}
}
async function salvarRoteiro(){
  const m=$("#rmsg");m.hidden=false;let txt=$("#rot_json").value.trim();
  const i=txt.indexOf("{"),j=txt.lastIndexOf("}");if(i<0||j<0){m.textContent="Não encontrei o roteiro no texto colado. Copie a resposta inteira do Claude.";return}
  try{const o=JSON.parse(txt.slice(i,j+1));cfg.roteiro={...o,em:new Date().toISOString(),n:respostas.length};await window.fbSalvarRH({roteiro:cfg.roteiro});renderRoteiro()}
  catch(x){m.textContent="O texto colado não está no formato esperado. Peça ao Claude: responda só o JSON."}
}
function renderConfig(){
  $("#v-config").innerHTML=`<div class="card">
    <h2>Dados do DISC</h2>
    <p class="muted">O perfil DISC e as hipóteses ficam guardados no Firebase, protegidos pelo login, e nunca no código do site. Na primeira vez, carregue o arquivo <b>disc-luiany.json</b> que veio no pacote. Esse arquivo não vai para o GitHub.</p>
    <p>Situação: <b>${discCarregado?"DISC carregado":"DISC ainda não carregado"}</b></p>
    <label class="f">Carregar arquivo do DISC (.json)<input id="cf_file" type="file" accept=".json,application/json"></label>
    <label class="f">Resumo do DISC (usado no pedido do roteiro)<textarea id="cf_disc" style="min-height:200px">${esc(cfg.disc)}</textarea></label>
    <p id="cf_msg" class="muted"></p>
    <button class="btn" type="button" id="cf_save">Salvar resumo</button></div>`;
  $("#cf_file").onchange=async e=>{const f=e.target.files[0];if(!f)return;
    try{const o=JSON.parse(await f.text());if(!o.hips||!o.fatores)throw 0;
      await window.fbSalvarRH({disc:o.disc||"",hips:o.hips,fatores:o.fatores});$("#cf_msg").textContent="DISC carregado e salvo no Firebase."}
    catch(x){$("#cf_msg").textContent="Esse arquivo não é o do DISC. Use o disc-luiany.json do pacote."}};
  $("#cf_save").onclick=async()=>{try{await window.fbSalvarRH({disc:$("#cf_disc").value.trim()});$("#cf_msg").textContent="Salvo."}catch(x){$("#cf_msg").textContent="Não foi possível salvar."}};
}
const ABAS=["painel","roteiro","config"];
let cfg={disc:"",roteiro:null},respostas=[],discCarregado=false;
function aba(k){ABAS.forEach(a=>{$("#v-"+a).hidden=a!==k;$("#tab-"+a).setAttribute("aria-selected",a===k)});
  ({painel:renderPainel,roteiro:renderRoteiro,config:renderConfig})[k]?.()}
ABAS.forEach(k=>$("#tab-"+k).onclick=()=>aba(k));
const visivel=k=>!$("#v-"+k).hidden;
function aplicarRH(d){
  cfg.disc=d.disc||"";cfg.roteiro=d.roteiro||null;discCarregado=!!(d.hips&&d.fatores);
  Object.values(TODOS_Q).forEach(q=>{q.hip=(d.hips||{})[q.id]||""});
  FATORES.forEach((F,i)=>{const x=(d.fatores||{})[F.k];if(x){F.f=x.f;F.d=x.d;F.disc=x.disc}});
  ABAS.forEach(a=>{if(visivel(a))aba(a)});
}
function aplicarRespostas(rr){respostas=rr;if(visivel("painel"))renderPainel();if(visivel("roteiro"))renderRoteiro()}
window.painel={aplicarRH,aplicarRespostas,aba};
