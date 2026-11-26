/* ==========================================================================
   TREINO DE AÇO — Complete 62-Step BetterMe Military Calisthenics Blueprint
   All screens 0..61 localized into pt-BR using custom Drive avatar assets
   ========================================================================== */

window.TREINO_DE_ACO_STEPS = [
  /* 0 — ENTRY LOADER */
  {
    id: 'entry_loader',
    type: 'entryLoader',
    header: 'none',
    showHelp: true,
    title: 'CALISTENIA MILITAR:<br>TREINE COMO UMA FERA',
    image: 'assets/img/loader_runner.webp',
    note: 'Mantenha esta página aberta',
    sub: 'Preparando seu plano de treino...'
  },

  /* ==================== SECTION 1: MEU PERFIL ==================== */
  /* 1 — AGE SPLIT FIRST PAGE */
  {
    id: 'age_bracket',
    type: 'splitFirst',
    header: 'brand',
    showHelp: true,
    key: 'idadeFaixa',
    title: 'Plano de Calistenia Militar',
    image: 'assets/img/pose_standing.webp',
    options: [
      { value: '18-29', label: '18–29' },
      { value: '30-39', label: '30–39' },
      { value: '40-49', label: '40–49' },
      { value: '50+', label: '50+' }
    ]
  },

  /* 2 — SOCIAL PROOF + BRAZILIAN REFERENCES */
  {
    id: 'social_proof_age',
    type: 'infoSocialAge',
    header: 'brand',
    image: 'assets/img/br_references.webp',
    cta: 'CONTINUAR'
  },

  /* 3 — TRIED MILITARY CALISTHENICS BEFORE? */
  {
    id: 'tried_before',
    type: 'splitSingle',
    section: 1, sectionLabel: 'Meu Perfil', segPct: 16.7,
    key: 'experiencia',
    title: 'Você já experimentou a Calistenia Militar antes?',
    image: 'assets/img/high_knees.webp',
    options: [
      { value: 'Sim', label: 'Sim' },
      { value: 'Não', label: 'Não' }
    ]
  },

  /* 4 — EASY & EFFECTIVE INTERSTITIAL */
  {
    id: 'info_easy',
    type: 'infoPhoto',
    header: 'brand',
    title: 'A Calistenia Militar é simples e eficaz',
    sub: 'É um estilo de treino que usa apenas o peso do seu corpo. Vamos ajudar você a entrar em forma em casa, usando zero equipamentos!',
    image: 'assets/img/high_plank.webp',
    cta: 'CONTINUAR'
  },

  /* 5 — MAIN GOAL */
  {
    id: 'main_goal',
    type: 'splitSingle',
    section: 1, sectionLabel: 'Meu Perfil', segPct: 27.8,
    key: 'objetivo',
    title: 'Qual é o seu objetivo principal?',
    image: 'assets/img/pose_standing.webp',
    wideOptions: true,
    options: [
      { value: 'Ganhar massa muscular', label: 'Ganhar massa muscular' },
      { value: 'Perder peso', label: 'Perder peso' },
      { value: 'Perder gordura e ganhar músculo', label: 'Perder gordura e ganhar músculo' },
      { value: 'Melhorar o condicionamento geral', label: 'Melhorar o condicionamento geral' }
    ]
  },

  /* 6 — APP 3-PHONE MOCKUP INTERSTITIAL */
  {
    id: 'info_solution',
    type: 'infoSolution',
    header: 'brand',
    image: 'assets/img/app_mockup_3phones.webp',
    cta: 'CONTINUAR'
  },

  /* 7 — ADDITIONAL GOALS (MULTI-SELECT) */
  {
    id: 'extra_goals',
    type: 'multiList',
    section: 1, sectionLabel: 'Meu Perfil', segPct: 55.6,
    key: 'objetivosExtras',
    title: 'O que mais você quer conquistar com este plano?',
    sub: 'Selecione todas as opções que se aplicam',
    cta: 'PRÓXIMO PASSO',
    options: [
      { value: 'Aumentar resistência e fôlego', label: 'Aumentar resistência e fôlego' },
      { value: 'Melhorar a postura', label: 'Melhorar a postura' },
      { value: 'Desenvolver flexibilidade', label: 'Desenvolver flexibilidade' },
      { value: 'Aumentar vigor e libido', label: 'Aumentar vigor e libido' },
      { value: 'Nenhuma das anteriores', label: 'Nenhuma das anteriores', exclusive: true }
    ]
  },

  /* 8 — PHYSICAL BUILD (2x2 PHOTO GRID — DRIVE CROPS!) */
  {
    id: 'current_build',
    type: 'photoGrid2',
    section: 1, sectionLabel: 'Meu Perfil', segPct: 66.7,
    key: 'porteFisico',
    title: 'Como você descreveria seu porte físico?',
    options: [
      { value: 'Magro', label: 'Magro', img: 'assets/img/body_1.webp' },
      { value: 'Porte médio', label: 'Porte médio', img: 'assets/img/body_2.webp' },
      { value: 'Forte / encorpado', label: 'Encorpado', img: 'assets/img/body_3.webp' },
      { value: 'Acima do peso', label: 'Acima do peso', img: 'assets/img/body_4.webp' }
    ]
  },

  /* 9 — BODY GOAL (2x2 PHOTO GRID — DRIVE CROPS!) */
  {
    id: 'body_goal',
    type: 'photoGrid2',
    section: 1, sectionLabel: 'Meu Perfil', segPct: 72.2,
    key: 'fisicoIdeal',
    title: 'Qual físico você quer alcançar?',
    sub: 'Visualize sua meta para manter a motivação e o compromisso com o treino',
    options: [
      { value: 'Alguns quilos a menos', label: 'Mais seco', img: 'assets/img/goal_1.webp' },
      { value: 'Atlético', label: 'Atlético', img: 'assets/img/goal_2.webp' },
      { value: 'Definido', label: 'Definido', img: 'assets/img/goal_3.webp' },
      { value: 'Forte e volumoso', label: 'Forte e volumoso', img: 'assets/img/goal_4.webp' }
    ]
  },

  /* 10 — PROBLEM AREAS (MULTI-SELECT HORIZONTAL PICTURE CARDS — DRIVE CROPS!) */
  {
    id: 'problem_areas',
    type: 'picRowMulti',
    section: 1, sectionLabel: 'Meu Perfil', segPct: 83.3,
    key: 'areasProblema',
    title: 'Quais áreas você quer trabalhar?',
    sub: 'Selecione todas as opções que se aplicam',
    cta: 'PRÓXIMO PASSO',
    options: [
      { value: 'Barriga saliente', label: 'Barriga saliente', img: 'assets/img/zone_barriga.webp' },
      { value: 'Gordura na cintura', label: 'Gordura na cintura', img: 'assets/img/zone_cintura.webp' },
      { value: 'Peito pouco desenvolvido', label: 'Peito pouco desenvolvido', img: 'assets/img/zone_peito.webp' },
      { value: 'Braços finos', label: 'Braços finos', img: 'assets/img/zone_bracos.webp' },
      { value: 'Pernas finas', label: 'Pernas finas', img: 'assets/img/zone_pernas.webp' }
    ]
  },

  /* 11 — WEIGHT CHANGE PATTERN */
  {
    id: 'weight_pattern',
    type: 'splitSingle',
    section: 1, sectionLabel: 'Meu Perfil', segPct: 88.9,
    key: 'variacaoPeso',
    title: 'Como seu peso costuma variar?',
    image: 'assets/img/forearm_plank-v.webp',
    wideOptions: true,
    options: [
      { value: 'Ectomorfo', label: 'Tenho dificuldade para ganhar peso ou músculo' },
      { value: 'Mesomorfo', label: 'Engordo e emagreço facilmente' },
      { value: 'Endomorfo', label: 'Engordo rápido, mas emagreço devagar' }
    ]
  },

  /* 12 — LAST TIME IN BEST SHAPE */
  {
    id: 'best_shape_ago',
    type: 'splitSingle',
    section: 1, sectionLabel: 'Meu Perfil', segPct: 94.4,
    key: 'melhorForma',
    title: 'Há quanto tempo você esteve na melhor forma da sua vida?',
    image: 'assets/img/pose_standing.webp',
    wideOptions: true,
    options: [
      { value: 'Menos de 1 ano', label: 'Há menos de 1 ano' },
      { value: '1 a 2 anos', label: 'Há 1 a 2 anos' },
      { value: 'Mais de 3 anos', label: 'Há mais de 3 anos' },
      { value: 'Nunca', label: 'Nunca estive' }
    ]
  },

  /* 13 — BODY TYPE RESULT + FULLBODY 20 MIN PREVIEW */
  {
    id: 'info_somatotype',
    type: 'infoSomatotype',
    header: 'brand',
    image: 'assets/img/fullbody_preview.webp',
    cta: 'CONTINUAR'
  },

  /* ==================== SECTION 2: ATIVIDADE ==================== */
  /* 14 — FLEXIBILITY */
  {
    id: 'flexibility',
    type: 'singleList',
    section: 2, sectionLabel: 'Atividade', segPct: 6.25,
    key: 'flexibilidade',
    title: 'Quão flexível você se considera?',
    image: 'assets/img/shoulder_stretch.webp',
    options: [
      { value: 'Muito flexível', label: 'Muito flexível' },
      { value: 'Razoavelmente flexível', label: 'Razoavelmente flexível' },
      { value: 'Não muito bom', label: 'Sou meio travado' },
      { value: 'Não tenho certeza', label: 'Não tenho certeza' }
    ]
  },

  /* 15 — DAILY WALKING */
  {
    id: 'daily_walk',
    type: 'singleList',
    section: 2, sectionLabel: 'Atividade', segPct: 12.5,
    key: 'caminhada',
    title: 'Quanto você caminha por dia?',
    image: 'assets/img/loader_runner.webp',
    imagePos: 'center 15%',
    options: [
      { value: 'Menos de 30 min', label: 'Menos de 30 minutos' },
      { value: '30 a 60 min', label: '30 a 60 minutos' },
      { value: 'Mais de 60 min', label: 'Mais de 60 minutos' }
    ]
  },

  /* 16 — WORKOUTS IN LAST 3 MONTHS */
  {
    id: 'recent_workouts',
    type: 'splitSingle',
    section: 2, sectionLabel: 'Atividade', segPct: 18.75,
    key: 'treinos3Meses',
    title: 'Quantas vezes você treinou nos últimos 3 meses?',
    image: 'assets/img/high_knees.webp',
    wideOptions: true,
    options: [
      { value: 'Nenhuma', label: 'Nenhuma vez' },
      { value: '1-2 vezes', label: '1 a 2 vezes' },
      { value: 'Algumas vezes por mês', label: 'Algumas vezes por mês' },
      { value: 'Regularmente', label: 'Regularmente' }
    ]
  },

  /* 17 — ANIMATED 4-WEEK MILESTONE BAR CHART */
  {
    id: 'info_four_weeks',
    type: 'infoFourWeeks',
    header: 'brand',
    title: 'Apenas quatro semanas para ficar irreconhecível',
    sub: 'Este não é mais um "segunda-feira eu começo". Seu desafio foi criado para você <strong>sentir a diferença desde o primeiro dia</strong>.<br><br>Nossos treinos de Calistenia Militar são curtos, intensos e cabem até na rotina mais corrida.<br><br><strong>SEMANA 4:</strong> corpo definido e <strong>abdômen trincado</strong>, energia dos 20, e até sua esposa nota a diferença.',
    cta: 'CONTINUAR'
  },

  /* 18 — TYPICAL WORKOUT INTENSITY (2-LINE LIST) */
  {
    id: 'typical_workout',
    type: 'singleList',
    section: 2, sectionLabel: 'Atividade', segPct: 37.5,
    key: 'intensidade',
    title: 'O que melhor descreve o treino ideal para você?',
    image: 'assets/img/forearm_plank.webp',
    imagePos: 'center 68%',
    options: [
      { value: 'Leve', label: 'Leve e tranquilo', desc: 'Ritmo suave, esforço mínimo, quase sem suar' },
      { value: 'Moderado', label: 'Moderado', desc: 'Ativo, esforço médio, respiração levemente acelerada' },
      { value: 'Intenso', label: 'Intenso', desc: 'Esforço total, bastante suor e foco máximo' }
    ]
  },

  /* 19 — PUSH-UPS */
  {
    id: 'pushups',
    type: 'singleList',
    section: 2, sectionLabel: 'Atividade', segPct: 43.75,
    key: 'flexoes',
    title: 'Quantas flexões você consegue fazer seguidas?',
    image: 'assets/img/high_plank.webp',
    options: [
      { value: '0', label: 'Não consigo fazer flexões' },
      { value: '1-10', label: '1 a 10 flexões' },
      { value: '11-20', label: '11 a 20 flexões' },
      { value: '20+', label: 'Mais de 20 flexões' }
    ]
  },

  /* 20 — SQUATS */
  {
    id: 'squats',
    type: 'splitSingle',
    section: 2, sectionLabel: 'Atividade', segPct: 50,
    key: 'agachamentos',
    title: 'Quantos agachamentos você consegue fazer seguidos?',
    image: 'assets/img/squat_studio.webp',
    wideOptions: true,
    options: [
      { value: '0', label: 'Não consigo fazer agachamentos' },
      { value: '1-20', label: '1 a 20 agachamentos' },
      { value: '21-40', label: '21 a 40 agachamentos' },
      { value: '40+', label: 'Mais de 40 agachamentos' }
    ]
  },

  /* 21 — FITNESS SCORE BREAKDOWN */
  {
    id: 'info_fitness_score',
    type: 'infoFitnessScore',
    header: 'brand',
    cta: 'CONTINUAR'
  },

  /* 22 — EXERCISE PREF #1: AVANÇO LATERAL */
  {
    id: 'ex_lateral_lunge',
    type: 'exercisePref',
    section: 2, sectionLabel: 'Atividade', segPct: 62.5,
    key: 'exAvanco',
    title: 'Você gosta deste exercício?',
    badge: 'Avanço Lateral',
    image: 'assets/img/side_lunge.webp',
    options: [
      { value: 'Sim', label: 'Sim' },
      { value: 'Não', label: 'Não' },
      { value: 'Tanto faz', label: 'Não me importo' }
    ]
  },

  /* 23 — EXERCISE PREF #2: PRANCHA PEGADA FECHADA */
  {
    id: 'ex_close_plank',
    type: 'exercisePref',
    section: 2, sectionLabel: 'Atividade', segPct: 68.75,
    key: 'exPrancha',
    title: 'Você gosta deste exercício?',
    badge: 'Prancha Pegada Fechada',
    image: 'assets/img/high_plank.webp',
    options: [
      { value: 'Sim', label: 'Sim' },
      { value: 'Não', label: 'Não' },
      { value: 'Tanto faz', label: 'Não me importo' }
    ]
  },

  /* 24 — EXERCISE PREF #3: TORÇÃO TÁTICA */
  {
    id: 'ex_tactical_twist',
    type: 'exercisePref',
    section: 2, sectionLabel: 'Atividade', segPct: 75,
    key: 'exTorcao',
    title: 'Você gosta deste exercício?',
    badge: 'Torção Tática Abdominal',
    image: 'assets/img/abs_twist.webp',
    options: [
      { value: 'Sim', label: 'Sim' },
      { value: 'Não', label: 'Não' },
      { value: 'Tanto faz', label: 'Não me importo' }
    ]
  },

  /* 25 — SENSITIVE BACK / KNEES (MULTI-SELECT PHOTO GRID — DRIVE CROPS!) */
  {
    id: 'joint_struggles',
    type: 'photoGridMulti',
    section: 2, sectionLabel: 'Atividade', segPct: 81.25,
    key: 'sensibilidades',
    title: 'Você sente desconforto em alguma destas áreas?',
    sub: 'Selecione todas as opções que se aplicam',
    cta: 'PRÓXIMO PASSO',
    options: [
      { value: 'Costas sensíveis', label: 'Costas sensíveis', img: 'assets/img/pain_back-v2.webp' },
      { value: 'Joelhos sensíveis', label: 'Joelhos sensíveis', img: 'assets/img/pain_knee-v2.webp' },
      { value: 'Nenhuma das anteriores', label: 'Nenhuma delas', img: 'assets/img/pain_none.webp', exclusive: true }
    ]
  },

  /* 26 — WORKOUT DURATION */
  {
    id: 'workout_duration',
    type: 'splitSingle',
    section: 2, sectionLabel: 'Atividade', segPct: 87.5,
    key: 'duracaoTreino',
    title: 'Quanto tempo você quer que seus treinos durem?',
    image: 'assets/img/squat_studio.webp',
    wideOptions: true,
    options: [
      { value: '10-15 min', label: '10–15 min' },
      { value: '15-20 min', label: '15–20 min' },
      { value: '20-25 min', label: '20–25 min' },
      { value: '25+ min', label: 'Mais de 25 min' },
      { value: 'Não sei', label: 'Não tenho certeza' }
    ]
  },

  /* 27 — WEEKLY FREQUENCY */
  {
    id: 'weekly_freq',
    type: 'singleList',
    section: 2, sectionLabel: 'Atividade', segPct: 93.75,
    key: 'frequenciaSemanal',
    title: 'Quantas vezes por semana você gostaria de treinar?',
    image: 'assets/img/abs_twist.webp',
    options: [
      { value: '1-2 vezes', label: '1 a 2 vezes por semana' },
      { value: '3-4 vezes', label: '3 a 4 vezes por semana' },
      { value: '5+ vezes', label: '5 ou mais vezes por semana' }
    ]
  },

  /* 28 — ANIMATED DUAL-CURVE SVG: RESULTS VS STRESS */
  {
    id: 'info_smarter',
    type: 'infoResultsStress',
    header: 'brand',
    title: 'Entre em forma treinando com inteligência, não com exagero',
    sub: 'O excesso de treino eleva o estresse e prejudica a recuperação. Por isso, seu plano no <strong>Treino de Aço</strong> equilibra intensidade e descanso para resultados visíveis sem esgotamento.',
    cta: 'CONTINUAR'
  },

  /* ==================== SECTION 3: ESTILO DE VIDA E HÁBITOS ==================== */
  /* 29 — WORK SCHEDULE */
  {
    id: 'work_schedule',
    type: 'splitSingle',
    section: 3, sectionLabel: 'Estilo de Vida', segPct: 8.33,
    key: 'rotinaTrabalho',
    title: 'Como é a sua rotina de trabalho?',
    image: 'assets/img/pose_standing.webp',
    wideOptions: true,
    options: [
      { value: 'Horário comercial', label: 'Horário comercial (9h às 18h)' },
      { value: 'Turnos noturnos', label: 'Turnos noturnos' },
      { value: 'Horários flexíveis', label: 'Meus horários são flexíveis' },
      { value: 'Aposentado / sem trabalho', label: 'Aposentado / não trabalhando no momento' }
    ]
  },

  /* 30 — TYPICAL DAY */
  {
    id: 'typical_day',
    type: 'splitSingle',
    section: 3, sectionLabel: 'Estilo de Vida', segPct: 16.67,
    key: 'diaTipico',
    title: 'Como você descreveria um dia comum seu?',
    image: 'assets/img/high_knees.webp',
    wideOptions: true,
    options: [
      { value: 'Sedentário', label: 'Passo a maior parte do tempo sentado' },
      { value: 'Em pé', label: 'Fico o tempo todo em pé' },
      { value: 'Equilibrado', label: 'Equilíbrio entre sentado e em movimento' },
      { value: 'Variável', label: 'Meu nível de atividade muda todo dia' }
    ]
  },

  /* 31 — DAYTIME ENERGY */
  {
    id: 'energy_levels',
    type: 'singleList',
    section: 3, sectionLabel: 'Estilo de Vida', segPct: 25,
    key: 'energiaDia',
    title: 'Como ficam seus níveis de energia durante o dia?',
    image: 'assets/img/loader_runner.webp',
    imagePos: 'center 15%',
    options: [
      { value: 'Baixa e inconsistente', label: 'Baixos e inconsistentes' },
      { value: 'Estáveis', label: 'Permanecem estáveis' },
      { value: 'Oscilam', label: 'Oscilam ao longo do dia' },
      { value: 'Alta o dia todo', label: 'Ficam altos o dia inteiro' }
    ]
  },

  /* 32 — MOTIVATIONAL ENERGY INTERSTITIAL */
  {
    id: 'info_energy',
    type: 'infoPhoto',
    header: 'brand',
    title: 'Abasteça seu dia com energia constante',
    sub: 'A Calistenia Militar reacende sua <strong>energia</strong>, sua <strong>libido</strong> e sua <strong>testosterona</strong> 🔥 A vitalidade de um homem nunca some, ela só precisa do estímulo certo para despertar.<br><br>Você não precisa recorrer a reposição hormonal, remédios ou <strong>métodos invasivos.</strong> Descubra como desbloquear sua força bruta e desejo sexual de forma natural.',
    image: 'assets/img/shoulder_stretch.webp',
    cta: 'CONTINUAR'
  },

  /* 33 — WATER INTAKE (TOP PHOTO + 2x2 GRID) */
  {
    id: 'water_intake',
    type: 'topPhotoGrid2',
    section: 3, sectionLabel: 'Estilo de Vida', segPct: 41.67,
    key: 'agua',
    title: 'Quanto de água você bebe por dia?',
    sub: '1 copo médio equivale a cerca de 240 ml',
    image: 'assets/img/water_bottle.webp',
    options: [
      { value: 'Só café ou chá', label: 'Só tomo café ou chá' },
      { value: 'Cerca de 2 copos', label: 'Cerca de 2 copos' },
      { value: '2 a 6 copos', label: 'De 2 a 6 copos' },
      { value: 'Mais de 6 copos', label: 'Mais de 6 copos' }
    ]
  },

  /* 34 — SLEEP DURATION (TOP PHOTO + 2x2 GRID) */
  {
    id: 'sleep_hours',
    type: 'topPhotoGrid2',
    section: 3, sectionLabel: 'Estilo de Vida', segPct: 50,
    key: 'sono',
    title: 'Quantas horas você costuma dormir por noite?',
    image: 'assets/img/sleep_olive.webp',
    options: [
      { value: 'Menos de 5h', label: 'Menos de 5 horas' },
      { value: '5-6h', label: '5 a 6 horas' },
      { value: '7-8h', label: '7 a 8 horas' },
      { value: 'Mais de 8h', label: 'Mais de 8 horas' }
    ]
  },

  /* 35 — EATING HABITS (MULTI-SELECT) */
  {
    id: 'eating_habits',
    type: 'multiList',
    section: 3, sectionLabel: 'Estilo de Vida', segPct: 58.33,
    key: 'habitos',
    title: 'Você se identifica com algum destes hábitos?',
    sub: 'Selecione todas as opções que se aplicam',
    cta: 'PRÓXIMO PASSO',
    options: [
      { value: 'Comer por estresse ou tédio', label: 'Comer por estresse ou tédio' },
      { value: 'Exagerar nas porções', label: 'Exagerar nas porções' },
      { value: 'Beliscar tarde da noite', label: 'Beliscar tarde da noite' },
      { value: 'Pular refeições', label: 'Pular refeições com frequência' },
      { value: 'Nenhuma das anteriores', label: 'Nenhuma das anteriores', exclusive: true }
    ]
  },

  /* 36 — FOOD CRAVINGS (MULTI-SELECT) */
  {
    id: 'cravings',
    type: 'multiList',
    section: 3, sectionLabel: 'Estilo de Vida', segPct: 66.67,
    key: 'vontades',
    title: 'Quais alimentos você sente mais vontade de comer?',
    sub: 'Selecione todas as opções que se aplicam',
    cta: 'PRÓXIMO PASSO',
    options: [
      { value: 'Doces', label: 'Doces e sobremesas' },
      { value: 'Salgados', label: 'Salgadinhos e petiscos' },
      { value: 'Fast food', label: 'Lanches e fast food' },
      { value: 'Refrigerante', label: 'Refrigerante e bebidas açucaradas' },
      { value: 'Nenhuma das anteriores', label: 'Nenhuma das anteriores', exclusive: true }
    ]
  },

  /* 37 — SMOKING WITH HEALTH CONSENT CHECKBOX + CORAL ALERT + SKIP! */
  {
    id: 'smoking_consent',
    type: 'smokingConsent',
    section: 3, sectionLabel: 'Estilo de Vida', segPct: 75,
    key: 'fumo',
    title: 'Você fuma?',
    cta: 'CONTINUAR',
    skipLabel: 'PULAR ESTA PERGUNTA',
    options: [
      { value: 'Sim, todos os dias', label: 'Sim, todos os dias' },
      { value: 'Ocasionalmente', label: 'Socialmente / ocasionalmente' },
      { value: 'Cigarro eletrônico / vape', label: 'Cigarro eletrônico / vape' },
      { value: 'Parei recentemente', label: 'Parei recentemente' },
      { value: 'Não, nunca fumei', label: 'Não, nunca fumei' }
    ]
  },

  /* 38 — ALCOHOL FREQUENCY + SKIP */
  {
    id: 'alcohol',
    type: 'singleWithSkip',
    section: 3, sectionLabel: 'Estilo de Vida', segPct: 83.33,
    key: 'alcool',
    title: 'Com que frequência você consome bebidas alcoólicas?',
    cta: 'CONTINUAR',
    skipLabel: 'PULAR ESTA PERGUNTA',
    options: [
      { value: 'Várias vezes por semana', label: 'Várias vezes por semana' },
      { value: 'Algumas vezes por mês', label: 'Algumas vezes por mês' },
      { value: 'Em ocasiões raras', label: 'Apenas em ocasiões especiais' },
      { value: 'Nunca', label: 'Nunca' }
    ]
  },

  /* ==================== SECTION 4: METAS DE PESO ==================== */
  /* 41 — HEIGHT (FT/CM TOGGLE) */
  {
    id: 'height',
    type: 'heightInput',
    section: 4, sectionLabel: 'Metas de Peso', segPct: 20,
    key: 'alturaCm',
    title: 'Qual é a sua altura?',
    cta: 'PRÓXIMO PASSO'
  },

  /* 42 — CURRENT WEIGHT (LBS/KG TOGGLE + LIVE BMI CARD) */
  {
    id: 'current_weight',
    type: 'weightInput',
    section: 4, sectionLabel: 'Metas de Peso', segPct: 40,
    key: 'pesoKg',
    title: 'Qual é o seu peso atual?',
    cta: 'PRÓXIMO PASSO'
  },

  /* 43 — GOAL WEIGHT (LBS/KG TOGGLE + LIVE HEALTH BENEFIT CARD) */
  {
    id: 'goal_weight',
    type: 'goalWeightInput',
    section: 4, sectionLabel: 'Metas de Peso', segPct: 60,
    key: 'metaKg',
    title: 'Qual é o seu peso objetivo?',
    cta: 'PRÓXIMO PASSO'
  },

  /* 44 — EXACT AGE (LIVE PERSONALIZATION CARD) */
  {
    id: 'exact_age',
    type: 'ageInput',
    section: 4, sectionLabel: 'Metas de Peso', segPct: 80,
    key: 'idadeExata',
    title: 'Qual é a sua idade?',
    cta: 'PRÓXIMO PASSO'
  },

  /* 45 — 4-BAR ANALYSIS LOADER */
  {
    id: 'loader_analysis',
    type: 'barLoader',
    header: 'brand',
    title: 'Analisando suas respostas...'
  },

  /* 46 — WELLNESS & BMI PROFILE SUMMARY (EXACT step_119.png) */
  {
    id: 'wellness_profile',
    type: 'bmiWellness',
    header: 'brand',
    title: 'Aqui está seu perfil de bem‑estar',
    cta: 'CONTINUAR'
  },

  /* ==================== SECTION 5: QUASE LÁ ==================== */
  /* 47 — LIFE EVENTS AFFECTING FITNESS */
  {
    id: 'life_events',
    type: 'iconMultiList',
    section: 5, sectionLabel: 'Quase Lá', segPct: 15.8,
    key: 'eventosPassados',
    title: 'Algum destes fatores afetou seu físico nos últimos anos?',
    sub: 'Selecione todas as opções que se aplicam',
    cta: 'PRÓXIMO PASSO',
    options: [
      { value: 'Pressão no trabalho', label: 'Pressão no trabalho', icon: '💼' },
      { value: 'Rotina familiar corrida', label: 'Rotina familiar corrida', icon: '🏠' },
      { value: 'Separação ou mudança pessoal', label: 'Separação ou mudança pessoal', icon: '💔' },
      { value: 'Metabolismo mais lento', label: 'Metabolismo mais lento com a idade', icon: '⏳' },
      { value: 'Estresse financeiro', label: 'Desafios financeiros', icon: '📉' },
      { value: 'Outros eventos estressantes', label: 'Outros momentos de estresse', icon: '⚡' },
      { value: 'Desempenho sexual caiu', label: 'Meu desempenho sexual caiu', icon: '😮‍💨' },
      { value: 'Nenhuma das anteriores', label: 'Nenhuma das anteriores', icon: '✓', exclusive: true }
    ]
  },

  /* 48 — UPCOMING EVENT */
  {
    id: 'upcoming_event',
    type: 'iconSingleList',
    section: 5, sectionLabel: 'Quase Lá', segPct: 28,
    key: 'eventoFuturo',
    title: 'Você tem algum evento importante chegando?',
    sub: 'Ter uma data no horizonte é um ótimo combustível para manter o foco',
    options: [
      { value: 'Viagem / Férias', label: 'Viagem ou férias', icon: '✈️' },
      { value: 'Competição', label: 'Competição ou desafio', icon: '🏆' },
      { value: 'Data especial', label: 'Encontro ou data importante', icon: '📅' },
      { value: 'Aventura ao ar livre', label: 'Aventura ao ar livre', icon: '⛰️' },
      { value: 'Aniversário', label: 'Aniversário', icon: '🎂' },
      { value: 'Feriado / Festas', label: 'Feriados e festas de fim de ano', icon: '🎉' },
      { value: 'Reencontro', label: 'Reencontro com amigos', icon: '🤝' },
      { value: 'Casamento', label: 'Casamento', icon: '💍' },
      { value: 'Outro', label: 'Outro evento', icon: '✨' },
      { value: 'Nenhum evento', label: 'Nenhum evento em breve', icon: '—' }
    ]
  },

  /* 49 — CUSTOM DARK CALENDAR DATE PICKER */
  {
    id: 'event_calendar',
    type: 'calendarPicker',
    header: 'brand',
    title: 'Quando é o seu evento?',
    sub: 'Vamos manter essa data importante em mente para ajustar o ritmo da sua meta',
    cta: 'CONTINUAR',
    skipLabel: 'PULAR ESTA ETAPA'
  },

  /* 50 — WEIGHT PROJECTION CHART + EXPERT QUOTE CARD */
  {
    id: 'weight_projection',
    type: 'projectionQuote',
    header: 'brand',
    title: 'O plano que finalmente vai colocar você em forma',
    quoteAvatar: 'assets/img/pain_none.webp',
    quoteText: '“Nosso Plano de Calistenia Militar vai transformar seu corpo e sua mentalidade. Sessões curtas e intensas constroem disciplina, força real e resistência mental.”',
    cta: 'CONTINUAR'
  },

  /* 51 — WHAT STOPPED YOU BEFORE */
  {
    id: 'past_barriers',
    type: 'iconMultiList',
    section: 5, sectionLabel: 'Quase Lá', segPct: 42.1,
    key: 'barreiras',
    title: 'O que impediu você de entrar em forma antes?',
    sub: 'Selecione todas as opções que se aplicam',
    cta: 'PRÓXIMO PASSO',
    options: [
      { value: 'Falta de motivação', label: 'Falta de motivação', icon: '🔋' },
      { value: 'Falta de um plano claro', label: 'Não ter um plano claro', icon: '🗺️' },
      { value: 'Falta de tempo', label: 'Falta de tempo', icon: '⏱️' },
      { value: 'Nenhuma das anteriores', label: 'Nenhuma das anteriores', icon: '✓', exclusive: true }
    ]
  },

  /* 52 — ANIMATED COMPARATIVE SVG (YOUR STRENGTH) */
  {
    id: 'info_strength_compare',
    type: 'infoStrengthCompare',
    header: 'brand',
    title: 'O Treino de Aço vai manter você no caminho certo!',
    sub: 'Seu protocolo entrega a estrutura exata para você manter constância e conquistar resultados reais sem desistir no meio do caminho.',
    cta: 'CONTINUAR'
  },

  /* 53 — DEEP MOTIVATION */
  {
    id: 'deep_motivation',
    type: 'multiList',
    section: 5, sectionLabel: 'Quase Lá', segPct: 63.2,
    key: 'motivacoes',
    title: 'Qual é a sua maior motivação para transformar seu físico?',
    sub: 'Selecione todas as opções que se aplicam',
    cta: 'PRÓXIMO PASSO',
    options: [
      { value: 'Ficar mais atraente', label: 'Ficar com aparência melhor e mais atraente' },
      { value: 'Mais confiança no corpo', label: 'Sentir mais confiança no próprio corpo' },
      { value: 'Fortalecer imunidade', label: 'Fortalecer a saúde e a imunidade' },
      { value: 'Mais força no dia a dia', label: 'Ter mais força para tarefas do dia a dia' },
      { value: 'Mais saúde e energia', label: 'Sentir-me mais saudável e cheio de energia' },
      { value: 'Outro', label: 'Outro motivo' }
    ]
  },

  /* 54 — CONFIDENCE CHECK */
  {
    id: 'confidence',
    type: 'confidenceSingle',
    section: 5, sectionLabel: 'Quase Lá', segPct: 84.2,
    key: 'confianca',
    image: 'assets/img/pain_none.webp',
    imagePos: 'center top',
    options: [
      { value: 'Acredito que consigo!', label: 'Eu acredito que consigo!' },
      { value: 'Incerto, mas disposto', label: 'Estou incerto, mas disposto a tentar!' },
      { value: 'Ainda inseguro', label: 'Ainda estou um pouco inseguro' }
    ]
  },

  /* 55 — AWARDS & TRUST BADGES */
  {
    id: 'info_trusted',
    type: 'infoAwards',
    header: 'brand',
    title: 'Por que o Treino de Aço é uma escolha confiável',
    cta: 'CONTINUAR',
    awards: [
      { icon: '🏆', title: 'Protocolo Estruturado de 28 Dias', desc: 'Progressão diária planejada para treinar em casa sem equipamentos', year: 'MÉTODO' },
      { icon: '⭐', title: 'Avaliação 4,8 / 5 pelos Alunos', desc: 'Milhares de homens acima dos 30 recuperando força e definição', year: '40K+' },
      { icon: '🛡️', title: 'Baseado em Referências Esportivas', desc: 'Alinhado a princípios de calistenia funcional e proteção articular', year: '2026' }
    ]
  },

  /* 56 — CIRCULAR RING LOADER + TESTIMONIALS */
  {
    id: 'loader_final',
    type: 'ringLoader',
    header: 'brand',
    title: 'Criando seu Plano personalizado de Calistenia Militar'
  },

  /* 57 — EMAIL CAPTURE */
  {
    id: 'email_capture',
    type: 'emailCapture',
    header: 'brandNoBack',
    cta: 'CONTINUAR'
  },

  /* 58 — NAME CAPTURE */
  {
    id: 'name_capture',
    type: 'nameCapture',
    header: 'brand',
    title: 'Qual é o seu nome?',
    cta: 'CONTINUAR'
  },

  /* 59 — PLAN-READY PERSONALIZED SUMMARY + ASCENDING GRAPH */
  {
    id: 'plan_ready_graph',
    type: 'planReadyGraph',
    header: 'brand',
    cta: 'CONTINUAR'
  },

  /* 60 — START-TODAY ANIMATED OLIVE-GLOW SPLASH */
  {
    id: 'start_today_splash',
    type: 'startTodaySplash',
    header: 'brandOnly'
  },

  /* 61 — INTERACTIVE PERFORATED OLIVE SCRATCH CARD (FINAL PRE-CHECKOUT STEP!) */
  {
    id: 'scratch_card',
    type: 'scratchCard',
    header: 'brand',
    title: 'Raspe para revelar seu desconto especial!',
    sub: 'Queremos que você comece sua jornada no Treino de Aço com uma boa surpresa'
  }
];
