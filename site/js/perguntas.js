const GRUPOS=[
  {v:"Faço parte da equipe dela",set:"equipe"},
  {v:"Sou par ou de outra área que trabalha com a Qualidade",set:"lateral"},
  {v:"Sou gestor(a) dela",set:"gestor"}
];
const SETNOME={equipe:"Equipe dela",lateral:"Pares e outras áreas",gestor:"Gestor(a)"};
const CONTATO=["Todo dia","Algumas vezes por semana","Às vezes"];
const setDe=g=>GRUPOS.find(x=>x.v===g)?.set;

/* Abertura comum a todos os grupos */
const ABERTURA={t:"Primeira impressão",qs:[
  {id:"palavras",tipo:"txt",curto:1,l:"Que três palavras descrevem a Luiany como supervisora até agora?"},
  {id:"forte",tipo:"txt",l:"O que ela já está fazendo bem nesse começo como supervisora?",h:"Se puder, conte uma situação."}
]};

/* h = dica para quem responde; opc = pode ficar em branco. As hipóteses do DISC ficam no Firebase, nunca aqui. */
const SETS={
 equipe:[ABERTURA,
  {t:"Conhecimento e presença",qs:[
   {id:"e_tecnico",tipo:"opt",l:"Quando você tem uma dúvida técnica (critério, ensaio, especificação), ela:",o:["Sabe responder e explica","Sabe, mas explica pouco","Nem sempre sabe, mas busca a resposta","Não costuma ajudar com isso"],neg:[3]},
   {id:"e_turnos",tipo:"opt",l:"Ela é presente para todos os turnos, e não só para quem trabalha no mesmo horário que ela?",h:"Não precisa dizer qual é o seu turno.",o:["Sim, todos os turnos sentem a presença dela","Mais ou menos, alguns turnos a veem pouco","Quase só para quem trabalha no horário dela"],neg:[1,2]}
  ]},
  {t:"No dia a dia com ela",qs:[
   {id:"e_orient",tipo:"opt",l:"Quando ela te passa uma tarefa, você entende o que precisa fazer?",o:["Sim, fica claro o que fazer e por quê","Entendo o que fazer, mas não o porquê","Às vezes fico com dúvida","Muitas vezes fico perdido(a)"]},
   {id:"e_conversa",tipo:"opt",l:"Como é conversar com ela?",o:["Fácil, ela é acessível","Tranquilo, mas ela é mais reservada","Ela tenta ser próxima, mas parece forçado","Difícil, eu evito"]},
   {id:"e_delegar",tipo:"opt",l:"Como ela divide o trabalho?",o:["Divide as tarefas e confia na equipe","Divide, mas confere tudo de novo","Prefere fazer sozinha","Não fica claro quem faz o quê"]},
   {id:"e_justa",tipo:"opt",l:"Ela trata todos da equipe com o mesmo critério, sem favoritismo?",o:["Sim, é justa com todos","Na maioria das vezes","Percebo que tem preferidos","Não, trata as pessoas de forma diferente"]},
   {id:"e_desenvolve",tipo:"opt",l:"Ela te ensina e ajuda você a crescer no trabalho?",o:["Sim, orienta e me desenvolve","Às vezes","Só corrige quando eu erro","Não"]},
   {id:"e_reconhece",tipo:"opt",l:"Quando você faz um bom trabalho, ela reconhece?",o:["Sim, e fala na hora","Às vezes","Raramente","Só fala quando algo dá errado"]},
   {id:"e_pessoa",tipo:"opt",l:"Ela demonstra interesse por você como pessoa, e não só pelo trabalho?",o:["Sim, se interessa de verdade","Um pouco","Pouco, o foco é só o trabalho","Não"]},
   {id:"e_mudanca",tipo:"opt",l:"Quando ela muda uma regra ou um jeito de fazer, ela explica o motivo?",o:["Sempre explica","Às vezes explica","Só avisa que mudou","Muda sem avisar direito"]},
   {id:"e_combina",tipo:"opt",l:"Ela cumpre o que combina com a equipe?",o:["Sempre","Na maioria das vezes","Às vezes esquece ou muda","Raramente"]}
  ]},
  {t:"Quando as coisas apertam",qs:[
   {id:"e_erro",tipo:"opt",l:"Se você errasse algo no trabalho, contaria para ela?",o:["Contaria na hora, sem medo","Contaria, mas com receio","Tentaria resolver sozinho(a) antes","Evitaria contar"]},
   {id:"e_ideia",tipo:"opt",l:"Quando você dá uma ideia ou discorda de algo, ela:",o:["Escuta e considera","Escuta, mas faz do jeito dela sem explicar","Fica na defensiva ou responde de forma dura","Nem dá abertura"]},
   {id:"e_lento",tipo:"opt",l:"Quando alguém da equipe tem dificuldade ou demora para aprender, ela:",o:["Tem paciência e ensina","Ensina, mas mostra impaciência","Faz ela mesma para ganhar tempo","Cobra de forma dura"]},
   {id:"e_conflito",tipo:"opt",l:"Quando há desentendimento entre pessoas da equipe, ela:",o:["Conversa e ajuda a resolver","Resolve rápido, sem ouvir todos os lados","Deixa para lá","Toma partido"],neg:[1,2,3]},
   {id:"e_assume",tipo:"opt",l:"Quando algo dá errado por uma decisão dela, ela:",o:["Assume e corrige","Corrige, mas não comenta","Coloca a culpa em outra pessoa ou no processo"],neg:[2]},
   {id:"e_pressao",tipo:"txt",l:"Num dia corrido ou com problema (lote reprovado, falta de gente), como ela fala com a equipe?"}
  ]},
  {t:"Olhando de outro jeito",qs:[
   {id:"e_novato",tipo:"txt",l:"Se um colega novo entrasse amanhã na equipe, o que você diria para ele sobre como é trabalhar com a Luiany?",h:"Fale como falaria para um colega, sem filtro."},
   {id:"e_melhoria",tipo:"txt",opc:1,l:"Ela já trouxe alguma mudança ou melhoria para a Qualidade? Como a equipe recebeu?",h:"Se não lembrar de nenhuma, pode deixar em branco."}
  ]},
  {t:"Para ela crescer",qs:[
   {id:"e_nota",tipo:"opt",row:1,l:"De 0 a 10, o quanto você recomendaria a Luiany como líder para um colega?",o:["0","1","2","3","4","5","6","7","8","9","10"],ex:"O que faria essa nota subir?"},
   {id:"e_facilitar",tipo:"txt",l:"O que ela poderia fazer para facilitar o seu trabalho?",h:"Pode ser algo simples."}
  ]}
 ],
 lateral:[ABERTURA,
  {t:"Parceria entre as áreas",qs:[
   {id:"l_tecnico",tipo:"opt",l:"Os critérios e explicações técnicas que ela passa para a sua área são:",o:["Claros e bem fundamentados","Corretos, mas pouco explicados","Às vezes inconsistentes","Difíceis de entender ou aplicar"]},
   {id:"l_acesso",tipo:"opt",l:"Quando sua área precisa da Qualidade, ela:",o:["Resolve rápido","Resolve, mas demora","Passa para outra pessoa","É difícil conseguir a atenção dela"]},
   {id:"l_comunica",tipo:"opt",l:"Quando ela comunica um problema ou uma decisão para sua área:",o:["Explica com clareza e mostra o motivo","É clara, mas seca","Comunica pouco, ficamos sabendo depois","A forma de falar gera atrito"]},
   {id:"l_relacao",tipo:"opt",l:"Na relação com você e sua área, ela é:",o:["Parceira, constrói junto","Cordial, mas distante","Aparece mais para apontar problemas","Difícil de lidar"]},
   {id:"l_discorda",tipo:"opt",l:"Quando você discorda dela sobre algum assunto, ela:",o:["Ouve e busca um acordo","Ouve, mas mantém a posição sem explicar","Fica na defensiva","Evita a discussão"]},
   {id:"l_justa",tipo:"opt",l:"Ela usa os mesmos critérios com todas as áreas, sem favorecer ou pegar mais pesado com alguma?",o:["Sim, é imparcial","Na maioria das vezes","Às vezes favorece alguma área","Pega mais pesado com algumas áreas"]},
   {id:"l_causa",tipo:"opt",l:"Quando aparece um problema de qualidade envolvendo sua área, ela:",o:["Busca a causa junto com a gente","Aponta o problema e espera a gente resolver","Procura um culpado","Resolve sozinha sem envolver a área"]},
   {id:"l_assume",tipo:"opt",l:"Quando um problema envolve uma falha da Qualidade, ela:",o:["Reconhece e corrige","Corrige, mas não comenta","Transfere a responsabilidade para outra área"],neg:[2]},
   {id:"l_antecipa",tipo:"opt",l:"Ela avisa ou age antes que um problema chegue à sua área?",o:["Sim, antecipa bem","Às vezes","Normalmente só depois que o problema aparece","Não percebo isso"]}
  ]},
  {t:"Situação real",qs:[
   {id:"l_nao",tipo:"txt",opc:1,l:"Já aconteceu de ela precisar segurar algo da sua área por causa da qualidade, ou dizer 'não'? Como ela conduziu?",h:"Se nunca aconteceu, pode deixar em branco."}
  ]},
  {t:"Olhando de outro jeito",qs:[
   {id:"l_aprendeu",tipo:"txt",opc:1,l:"O que você ou sua área já aprenderam trabalhando com ela?",h:"Opcional."},
   {id:"l_melhoria",tipo:"txt",opc:1,l:"Ela já trouxe alguma melhoria que afetou a sua área? Qual?",h:"Opcional."}
  ]},
  {t:"Para ela crescer",qs:[
   {id:"l_nota",tipo:"opt",row:1,l:"De 0 a 10, como você avalia a parceria da Qualidade com a sua área desde que ela assumiu?",o:["0","1","2","3","4","5","6","7","8","9","10"],ex:"O que faria essa nota subir?"},
   {id:"l_continuar",tipo:"txt",l:"O que ela deve continuar fazendo na relação com a sua área?"},
   {id:"l_melhor",tipo:"txt",l:"O que ela poderia fazer para a parceria com a sua área funcionar ainda melhor?"}
  ]}
 ],
 gestor:[ABERTURA,
  {t:"Postura como supervisora",qs:[
   {id:"g_tecnico",tipo:"opt",l:"O domínio técnico dela para o cargo hoje é:",o:["Forte, é referência","Adequado","Tem lacunas importantes"],neg:[2]},
   {id:"g_turnos",tipo:"opt",l:"Ela consegue acompanhar todos os turnos da Qualidade?",o:["Sim, acompanha todos","Acompanha, mas alguns turnos ficam descobertos","Fica concentrada no horário dela"],neg:[1,2]},
   {id:"g_decisao",tipo:"opt",l:"Quando precisa tomar uma decisão difícil ou impopular, ela:",o:["Decide com firmeza e explica o porquê","Decide, mas sem explicar","Hesita ou adia","Espera que você decida"]},
   {id:"g_feedback",tipo:"opt",l:"Quando você dá um feedback ou discorda de algo que ela fez, ela:",o:["Recebe bem e ajusta","Ouve, mas mantém do jeito dela","Fica na defensiva","Concorda, mas não muda"]},
   {id:"g_ajuda",tipo:"opt",l:"Quando enfrenta algo novo ou difícil, ela:",o:["Procura você para alinhar","Tenta sozinha e avisa no final","Só aparece quando já virou problema"],neg:[1,2]},
   {id:"g_ritmo",tipo:"opt",l:"Nas últimas semanas, ela parece:",o:["No controle da rotina","Acelerada, mas dando conta","Sobrecarregada, apagando incêndios","Mudando de prioridade a todo momento"]},
   {id:"g_justa",tipo:"opt",l:"Nas decisões sobre a equipe (escala, cobranças, oportunidades), ela é imparcial?",o:["Sim, usa critérios claros","Na maioria das vezes","Às vezes favorece algumas pessoas"],neg:[2]},
   {id:"g_desgaste",tipo:"opt",l:"Você percebe sinais de cansaço ou irritação nela?",o:["Não percebo","Às vezes","Com frequência"],neg:[2]},
   {id:"g_tecnica",tipo:"opt",l:"Hoje ela atua mais como:",o:["Técnica (resolve ela mesma)","Equilibrada entre técnica e líder","Líder (faz a equipe resolver)"],neg:[]},
   {id:"g_desenvolve",tipo:"opt",l:"Ela está desenvolvendo a equipe (orienta, dá feedback, prepara pessoas)?",o:["Sim, de forma ativa","Um pouco","Ainda não"],neg:[2]},
   {id:"g_assume",tipo:"opt",l:"Quando algo dá errado sob a responsabilidade dela, ela:",o:["Assume, explica e corrige","Corrige, mas minimiza","Justifica ou transfere a responsabilidade"],neg:[2]},
   {id:"g_metas",tipo:"opt",l:"Com metas e prazos, ela:",o:["Cumpre e se antecipa","Cumpre, mas no limite","Às vezes atrasa","Precisa ser cobrada"]},
   {id:"g_equipe",tipo:"opt",l:"Como a equipe reagiu a ela como supervisora?",o:["Aceitou bem","Aceitou, com resistência de algumas pessoas","Há resistência clara"],neg:[2]}
  ]},
  {t:"Situação real",qs:[
   {id:"g_posicao",tipo:"txt",l:"Conte uma situação em que ela precisou se posicionar ou defender um padrão de qualidade sob pressão. Como ela se saiu?",h:"Se ainda não aconteceu, conte como ela lidou com a situação mais difícil até agora."}
  ]},
  {t:"Desenvolvimento",qs:[
   {id:"g_confia",tipo:"opt",row:1,l:"De 0 a 10, quanto você confia em deixar a Qualidade nas mãos dela hoje?",o:["0","1","2","3","4","5","6","7","8","9","10"],ex:"O que falta para chegar a 10?"},
   {id:"g_6meses",tipo:"txt",l:"Imagine a Luiany daqui a 6 meses, indo muito bem no cargo. O que ela estaria fazendo de diferente de hoje?",h:"Isso ajuda a definir as metas de desenvolvimento dela."},
   {id:"g_continuar",tipo:"txt",l:"O que ela deve continuar fazendo?"},
   {id:"g_melhoria",tipo:"txt",opc:1,l:"Que melhoria ela já trouxe, ou qual você espera que ela traga, para a Qualidade?",h:"Opcional."},
   {id:"g_evolucao",tipo:"txt",l:"Desde que ela assumiu, o que você já viu evoluir?"},
   {id:"g_foco",tipo:"txt",l:"Qual é a principal coisa que ela precisa desenvolver nos próximos meses?"},
   {id:"g_apoio",tipo:"txt",l:"Que apoio ela precisa para isso (seu, do RH, treinamento)?"}
  ]}
 ]
};
const TODOS_Q={};
const NA="Não tive como observar";
const opcoes=q=>q.row?q.o:[...q.o,NA];
const negIdx=q=>q.row?[]:(q.neg||[q.o.length-2,q.o.length-1]);
const exigeEx=(q,v)=>!!v&&negIdx(q).some(i=>q.o[i]===v);
const todasDe=set=>SETS[set].flatMap(p=>p.qs);
Object.values(SETS).flat().flatMap(p=>p.qs).forEach(q=>TODOS_Q[q.id]=q);
const nQs=set=>todasDe(set).length;
const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const NOME_AVALIADA=window.SITE_CONFIG.nomeAvaliada;
