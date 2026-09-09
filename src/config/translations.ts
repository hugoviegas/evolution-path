import { LanguageCode } from "./languages";

export interface Translation {
  EN: string;
  PT: string;
}

export interface Translations {
  [key: string]: Translation;
}

export const translations: Translations = {
  // Navigation
  about: { EN: "About", PT: "Sobre" },
  projects: { EN: "Projects", PT: "Projetos" },
  experience: { EN: "Experience", PT: "Experiência" },
  contact: { EN: "Contact", PT: "Contato" },

  // Hero Section
  hello: { EN: "Hello, I'm", PT: "Olá, eu sou" },
  goodMorning: { EN: "Hi, Good Morning! I'm", PT: "Oi, Bom Dia! Eu sou" },
  goodAfternoon: { EN: "Hi, Good Afternoon! I'm", PT: "Oi, Boa Tarde! Eu sou" },
  goodEvening: { EN: "Hi, Good Evening! I'm", PT: "Oi, Boa Noite! Eu sou" },
  goodNight: { EN: "Hi, Good Night! I'm", PT: "Oi, Boa Noite! Eu sou" },
  role: {
    EN: "IT Support Specialist → Full-Stack Developer",
    PT: "Especialista em TI → Desenvolvedor Full-Stack",
  },
  description: {
    EN: "IT professional with 4+ years of experience in technical support, system administration, and infrastructure management. Expert in Active Directory administration, user account management, and technical troubleshooting across Windows and Linux environments. Currently supporting IT operations for 120+ users in Dublin educational institution.",
    PT: "Profissional de TI com 4+ anos de experiência em suporte técnico, administração de sistemas e gestão de infraestrutura. Especialista em administração de Active Directory, gestão de contas de usuários e resolução de problemas técnicos em ambientes Windows e Linux. Atualmente suportando operações de TI para 120+ usuários em instituição educacional em Dublin.",
  },
  viewProjects: { EN: "View My Projects", PT: "Ver Meus Projetos" },
  getInTouch: { EN: "Get In Touch", PT: "Entre em Contato" },
  seeResume: { EN: "See Resume", PT: "Ver Currículo" },
  downloadResume: { EN: "Download Resume", PT: "Baixar Currículo" },

  // About Section
  journeySummary1: {
    EN: "IT professional with 4+ years of progressive experience in technical support and system administration. Started my IT career with ETAL in 2020, where I managed Windows Server environments for 50+ employees and developed a custom JavaScript automation solution using Node.js, Express.js, and Google Workspace APIs that reduced administrative processing time by 90%. This success demonstrated the power of combining technical expertise with process optimization to deliver measurable business impact.",
    PT: "Profissional de TI com 4+ anos de experiência progressiva em suporte técnico e administração de sistemas. Iniciei minha carreira em TI na ETAL em 2020, onde gerenciei ambientes Windows Server para 50+ funcionários e desenvolvi uma solução de automação personalizada em JavaScript usando Node.js, Express.js e APIs do Google Workspace que reduziu o tempo de processamento administrativo em 90%. Esse sucesso demonstrou o poder de combinar expertise técnica com otimização de processos para gerar impacto comercial mensurável.",
  },
  journeySummary2: {
    EN: "In September 2024, I joined Erin College as an IT Support Specialist and System Administrator, where I provide hands-on technical support and system administration for an educational institution with 120+ users. I manage Google Workspace enterprise environments, administer Active Directory user accounts and Group Policy configurations, and implement security policies following information security best practices. Concurrently, I'm pursuing a Bachelor of Science (Honours) in Computing - Software Engineering at CCT College Dublin, combining professional practice with academic study to deepen my technical expertise and career development.",
    PT: "Em setembro de 2024, me juntei ao Erin College como Especialista em Suporte de TI e Administrador de Sistemas, onde forneço suporte técnico prático e administração de sistemas para uma instituição educacional com 120+ usuários. Gerencio ambientes empresariais do Google Workspace, administro contas de usuários do Active Directory e configurações de Group Policy, e implemento políticas de segurança seguindo as melhores práticas de segurança da informação. Simultaneamente, estou cursando um Bacharelado em Computação - Engenharia de Software (Honras) no CCT College Dublin, combinando prática profissional com estudo acadêmico para aprofundar minha expertise técnica e desenvolvimento de carreira.",
  },
  readFullStory: { EN: "Read Full Story", PT: "Ler História Completa" },
  fullStoryTitle: { EN: "My Complete Journey", PT: "Minha Jornada Completa" },

  // Skills Section
  skillsTitle: { EN: "Skills & Technologies", PT: "Habilidades & Tecnologias" },
  otherSkills: { EN: "Other Skills", PT: "Outras Habilidades" },
  showMoreSkills: { EN: "Show More Skills", PT: "Mostrar Mais Habilidades" },
  showLessSkills: { EN: "Show Less", PT: "Mostrar Menos" },

  // Experience Section
  experienceTitle: {
    EN: "Professional Experience",
    PT: "Experiência Profissional",
  },
  present: { EN: "Present", PT: "Atual" },

  // Projects Section
  projectsTitle: { EN: "Featured Projects", PT: "Projetos em Destaque" },
  viewProject: { EN: "View Project", PT: "Ver Projeto" },
  viewCode: { EN: "View Code", PT: "Ver Código" },

  // Contact Section
  contactTitle: { EN: "Let's Work Together", PT: "Vamos Trabalhar Juntos" },
  contactDescription: {
    EN: "Ready to bring your ideas to life? Let's discuss your next project.",
    PT: "Pronto para dar vida às suas ideias? Vamos discutir seu próximo projeto.",
  },

  // Stats Section
  statsTitle: { EN: "Results That Matter", PT: "Resultados Que Importam" },

  // Footer
  footerText: {
    EN: "Built with passion using React, TypeScript, and Tailwind CSS.",
    PT: "Construído com paixão usando React, TypeScript e Tailwind CSS.",
  },

  // Additional UI strings
  aboutTitle: { EN: "About Me", PT: "Sobre Mim" },
  aboutSummary: {
    EN: "IT professional with 4+ years of hands-on experience in technical support, system administration, and infrastructure management across enterprise and educational environments. Proven expertise in Active Directory administration, user account management, and technical troubleshooting in Windows and Linux server environments. Currently supporting IT operations for 120+ users in Dublin.",
    PT: "Profissional de TI com 4+ anos de experiência prática em suporte técnico, administração de sistemas e gestão de infraestrutura em ambientes corporativos e educacionais. Expertise comprovada em administração de Active Directory, gestão de contas de usuários e resolução de problemas técnicos em ambientes de servidores Windows e Linux. Atualmente suportando operações de TI para 120+ usuários em Dublin.",
  },
  myJourney: { EN: "Professional Background", PT: "Histórico Profissional" },

  // Highlights
  highlight1Title: {
    EN: "4+ Years Experience",
    PT: "4+ Anos de Experiência",
  },
  highlight1Desc: {
    EN: "Technical support, system administration, and infrastructure management",
    PT: "Suporte técnico, administração de sistemas e gestão de infraestrutura",
  },
  highlight2Title: {
    EN: "90% Process Reduction",
    PT: "Redução de 90% nos Processos",
  },
  highlight2Desc: {
    EN: "JavaScript automation solution with Node.js, Express.js, and Google Workspace",
    PT: "Solução de automação JavaScript com Node.js, Express.js e Google Workspace",
  },
  highlight3Title: {
    EN: "Active Directory & Google Workspace",
    PT: "Active Directory & Google Workspace",
  },
  highlight3Desc: {
    EN: "Expert in user account management, permissions, and hybrid IT infrastructure",
    PT: "Especialista em gestão de contas de usuários, permissões e infraestrutura de TI híbrida",
  },
  highlight4Title: { EN: "Continuous Learning", PT: "Aprendizado Contínuo" },
  highlight4Desc: {
    EN: "Currently pursuing Computer Science degree (Honours) at CCT College Dublin",
    PT: "Cursando Bacharelado em Ciência da Computação (Honras) no CCT College Dublin",
  },

  technicalSkills: { EN: "Technical Skills", PT: "Habilidades Técnicas" },
  languagesTitle: { EN: "Languages", PT: "Idiomas" },
  native: { EN: "Native", PT: "Nativo" },
  c1Proficiency: { EN: "C1 Proficiency", PT: "Proficiência C1" },

  // Projects
  projectsIntro: {
    EN: "A showcase of innovative solutions that demonstrate my journey from IT Support to Full-Stack Development, with measurable impact and cutting-edge technologies.",
    PT: "Uma seleção de soluções que mostram minha evolução de Suporte de TI a Desenvolvedor Full-Stack, com impacto mensurável e tecnologias modernas.",
  },
  "category.All": { EN: "All", PT: "Todos" },
  "category.Automation": { EN: "Automation", PT: "Automação" },
  "category.Web Development": {
    EN: "Web Development",
    PT: "Desenvolvimento Web",
  },
  "category.Mobile": { EN: "Mobile", PT: "Mobile" },

  // Individual projects (titles, descriptions, metrics)
  "project.1.title": {
    EN: "D'Arcy McGee's Irish Pub Website",
    PT: "Site do D'Arcy McGee's Irish Pub",
  },
  "project.1.description": {
    EN: "Professional restaurant website featuring modern responsive design, interactive menu system, event listings, and seamless user experience.",
    PT: "Site profissional para restaurante com design responsivo, sistema de menu interativo, lista de eventos e experiência de usuário fluida.",
  },
  "project.1.metrics": { EN: "Live Client Website", PT: "Site do Cliente" },

  "project.2.title": {
    EN: "Business Process Automation System",
    PT: "Sistema de Automação de Processos",
  },
  "project.2.description": {
    EN: "Custom JavaScript solution integrated with Google Sheets and AppSheet that reduced critical business processes by 90%.",
    PT: "Solução personalizada em JavaScript integrada ao Google Sheets e AppSheet que reduziu processos críticos em 90%.",
  },
  "project.2.metrics": {
    EN: "90% time reduction",
    PT: "Redução de 90% no tempo",
  },

  "project.3.title": {
    EN: "Modern E-Commerce Platform",
    PT: "Plataforma de E-Commerce Moderna",
  },
  "project.3.description": {
    EN: "Full-stack e-commerce solution with authentication, payment processing and admin dashboard.",
    PT: "Solução full-stack de e-commerce com autenticação, processamento de pagamentos e painel administrativo.",
  },
  "project.3.metrics": { EN: "Full-stack solution", PT: "Solução full-stack" },

  "project.4.title": {
    EN: "Project Management Dashboard",
    PT: "Dashboard de Gestão de Projetos",
  },
  "project.4.description": {
    EN: "Collaborative task management app with real-time updates and project analytics.",
    PT: "Aplicativo de gestão de tarefas colaborativo com atualizações em tempo real e análises de projetos.",
  },
  "project.4.metrics": {
    EN: "Team collaboration",
    PT: "Colaboração de equipe",
  },

  "badge.featuredProject": {
    EN: "Featured Project",
    PT: "Projeto em Destaque",
  },
  liveDemo: { EN: "Live Demo", PT: "Ver Demo" },
  code: { EN: "Code", PT: "Código" },
  projectsCTA: {
    EN: "Want to see more of my work or discuss a project?",
    PT: "Quer ver mais do meu trabalho ou discutir um projeto?",
  },
  projectsCTABtn: { EN: "Let's Work Together", PT: "Vamos Trabalhar Juntos" },

  // Contact
  sendMessageTitle: { EN: "Send a Message", PT: "Enviar uma Mensagem" },
  contactPrompt: {
    EN: "Have a project in mind? I'd love to hear about it.",
    PT: "Tem um projeto em mente? Adoraria saber sobre ele.",
  },
  "placeholder.name": { EN: "Your Name", PT: "Seu Nome" },
  "placeholder.email": { EN: "Your Email", PT: "Seu Email" },
  "placeholder.subject": { EN: "Subject", PT: "Assunto" },
  "placeholder.project": {
    EN: "Tell me about your project...",
    PT: "Me conte sobre seu projeto...",
  },
  "toast.messageSentTitle": { EN: "Message Sent!", PT: "Mensagem Enviada!" },
  "toast.messageSentDesc": {
    EN: "Thank you for reaching out. I'll get back to you within 24 hours.",
    PT: "Obrigado pelo contato. Responderei em até 24 horas.",
  },
  "send.sending": { EN: "Sending...", PT: "Enviando..." },
  "send.sendMessage": { EN: "Send Message", PT: "Enviar Mensagem" },
  "send.successTitle": { EN: "Message Sent!", PT: "Mensagem Enviada!" },
  "send.successMessage": {
    EN: "Thank you for reaching out. I'll get back to you within 24 hours.",
    PT: "Obrigado pelo contato. Responderei em até 24 horas.",
  },
  "send.errorTitle": { EN: "Error", PT: "Erro" },
  "send.errorMessage": {
    EN: "Failed to send message. Please try again or contact me directly.",
    PT: "Falha ao enviar mensagem. Tente novamente ou entre em contato diretamente.",
  },
  "validation.nameRequired": {
    EN: "Name is required",
    PT: "Nome é obrigatório",
  },
  "validation.emailRequired": {
    EN: "Email is required",
    PT: "Email é obrigatório",
  },
  "validation.emailInvalid": {
    EN: "Please enter a valid email",
    PT: "Por favor, insira um email válido",
  },
  "validation.subjectRequired": {
    EN: "Subject is required",
    PT: "Assunto é obrigatório",
  },
  "validation.messageRequired": {
    EN: "Message is required",
    PT: "Mensagem é obrigatória",
  },
  "validation.messageTooShort": {
    EN: "Message must be at least 10 characters",
    PT: "Mensagem deve ter pelo menos 10 caracteres",
  },
  "validation.errorTitle": { EN: "Validation Error", PT: "Erro de Validação" },
  "validation.errorMessage": {
    EN: "Please fix the errors and try again.",
    PT: "Por favor, corrija os erros e tente novamente.",
  },
  connectWithMe: { EN: "Connect With Me", PT: "Conecte-se Comigo" },
  availableForWork: {
    EN: "Available for Work",
    PT: "Disponível para Trabalho",
  },
  availabilityText: {
    EN: "Currently accepting new projects and opportunities.",
    PT: "Atualmente aceitando novos projetos e oportunidades.",
  },
  currentTimeInDublin: {
    EN: "Current time in Dublin",
    PT: "Hora atual em Dublin",
  },

  // Footer
  "footer.copyright": {
    EN: "© {year} Hugo Viegas. All rights reserved.",
    PT: "© {year} Hugo Viegas. Todos os direitos reservados.",
  },
  "footer.madeWith": { EN: "Made with", PT: "Feito com" },
  "footer.inLocation": { EN: "in Dublin, Ireland", PT: "em Dublin, Irlanda" },
  "footer.additionalInfo": {
    EN: "Available for freelance work and full-time opportunities • Fluent in Portuguese & English • Open to remote and hybrid arrangements",
    PT: "Disponível para trabalho freelance e oportunidades em tempo integral • Fluente em Português e Inglês • Aberto a arranjos remotos e híbridos",
  },

  // Stats
  "stats.processReduction": {
    EN: "Process Time Reduction",
    PT: "Redução do Tempo de Processo",
  },
  "stats.viewsGrowth": {
    EN: "Users Supported",
    PT: "Usuários Suportados",
  },
  "stats.yearsExperience": {
    EN: "Years Experience",
    PT: "Anos de Experiência",
  },
  "stats.countriesWorked": { EN: "Countries Worked", PT: "Países Trabalhados" },

  // Experience
  experienceIntro: {
    EN: "A professional journey spanning technical support, system administration, and infrastructure management across Brazil and Ireland, with expertise in Active Directory, Google Workspace, and process automation.",
    PT: "Uma jornada profissional abrangendo suporte técnico, administração de sistemas e gestão de infraestrutura no Brasil e Irlanda, com expertise em Active Directory, Google Workspace e automação de processos.",
  },
  timelineTitle: {
    EN: "Professional Timeline",
    PT: "Linha do Tempo Profissional",
  },
  currentFocusLabel: { EN: "Professional Focus", PT: "Foco Profissional" },
  currentFocusText: {
    EN: "Expert in Active Directory administration, user account management, and technical troubleshooting across Windows and Linux environments. Skilled in Google Workspace administration, system automation, and implementing technical solutions that optimize workflows and enhance system reliability.",
    PT: "Especialista em administração de Active Directory, gestão de contas de usuários e resolução de problemas técnicos em ambientes Windows e Linux. Hábil em administração do Google Workspace, automação de sistemas e implementação de soluções técnicas que otimizam fluxos de trabalho e aumentam confiabilidade dos sistemas.",
  },
  certificationsTitle: {
    EN: "Skills & Certifications",
    PT: "Habilidades & Certificações",
  },
  experienceShowMore: {
    EN: "Show more",
    PT: "Ver mais",
  },
  experienceShowLess: {
    EN: "Show less",
    PT: "Ver menos",
  },

  // Work Experience and Education
  workExperienceTitle: {
    EN: "Work Experience",
    PT: "Experiência Profissional",
  },
  educationTitle: {
    EN: "Education",
    PT: "Educação",
  },

  fullStory: {
    EN: `A long time ago I found a spark. At eight years old, a first phone became my training droid — downloading .jar games, tweaking settings and customizing things were my first experiments with systems (my tiny training droid did more beeps than features). At eleven, curiosity became a mission: a Lego robotics championship at school. We built and programmed a robot with a drag‑and‑drop language, won regionals and reached nationals. Tools were humble, but the lesson was clear: like a young Padawan, I had found a path worth mastering (no robes required).

Years later, at seventeen, a first job as a supermarket apprentice funded my first laptop (my first cockpit). With it came image and video editing, system restores, and an obsession with how things work under the hood. At eighteen, formal training in Analysis and Systems Development gave structure to that curiosity — programming logic, mathematics, databases and web development became the foundation for building real systems.

In 2021 a small venture took shape with a friend and my older brother: a videomaker and social media studio (my brother the wise co‑pilot). It sharpened storytelling and design, but it also revealed a deeper calling — solving operational problems with code. In IT at a services company, in stolen hours, AppSheet on top of Google Sheets became the engine for an internal app that simplified daily processes (a small rebellion against slow processes). I learned HR and finance workflows end‑to‑end to design it properly. The result: the timesheet close for 400+ employees fell from four days to about one. Curiosity met impact; making messy workflows simple became my signature.

Ireland came next. A year of saving made the move possible for better opportunities and full English immersion. Two years in hospitality accelerated fluency and cultural understanding. In September 2024, the path doubled down: a Higher Diploma in Science of Computing at CCT College and an IT role at Erin College began the same month. The academic effort paid off with First‑Class results. At work, spreadsheet automation evolved with AI prompting and sharper programming logic — projects across departments were streamlined and each week revealed another layer of automation possible within Google's ecosystem.

Alongside this, a practical challenge from the restaurant job led to building the D'Arcy McGee's website. With AI tooling, UX study and hands‑on engineering, a fast, functional site shipped — proof that delivering quick, reliable value is a repeatable skill (almost a pixel‑perfect lightsaber, but not quite). Today I seek a front‑end or full‑stack role that values curiosity, product sense and the ability to turn complex processes into elegant, measurable solutions. The drive is the same as that eleven‑year‑old at the robotics table: learn fast, build well, and keep moving.
`,

    PT: `Há muito tempo encontrei uma faísca. Aos oito anos, um primeiro celular virou meu pequeno droide de treino — baixar joguinhos .jar, mexer em configurações e personalizar tudo foram meus primeiros experimentos com sistemas (meu droide fazia mais bipes que milagres). Aos onze, a curiosidade virou missão: um campeonato escolar de robótica Lego. Construímos e programamos um robô com uma linguagem de arrastar e soltar, vencemos a etapa regional e chegamos ao nacional. As ferramentas eram simples, mas a lição ficou clara: como um jovem Padawan, encontrei um caminho a ser dominado (sem túnicas, por enquanto).

Anos depois, aos dezessete, o primeiro emprego como aprendiz de supermercado financiou meu primeiro notebook (meu primeiro cockpit). Com ele vieram edição de imagem e vídeo, restaurações de sistema e a obsessão por entender como as coisas funcionam por baixo do capô. Aos dezoito, a formação em Análise e Desenvolvimento de Sistemas deu estrutura a essa curiosidade — lógica de programação, matemática, bancos de dados e desenvolvimento web tornaram‑se a base para construir sistemas reais.

Em 2021, com um amigo e meu irmão mais velho, nasceu um pequeno estúdio de videomaker e social media (meu irmão, o co‑piloto sábio). Isso aprimorou a narrativa e o design, mas também revelou um chamado mais profundo — resolver problemas operacionais com código. Em TI, numa empresa de prestação de serviços, nas horas vagas o AppSheet sobre Google Sheets virou o motor de um app interno que simplificou processos diários (uma pequena rebelião contra processos lentos). Aprendi os fluxos de RH e financeiro ponta a ponta para desenhá‑lo bem. O resultado: o fechamento de ponto de mais de 400 colaboradores caiu de quatro dias para cerca de um. Curiosidade virou impacto; transformar processos caóticos em soluções simples virou minha marca.

Veio então a Irlanda. Um ano de economias tornou a mudança possível, em busca de melhores oportunidades e imersão no inglês. Dois anos na hospitalidade aceleraram a fluência e o entendimento cultural. Em setembro de 2024, a jornada se intensificou: um Higher Diploma em Science of Computing no CCT College e um cargo de TI no Erin College começaram no mesmo mês. O esforço acadêmico rendeu First‑Class. No trabalho, as automações em planilhas evoluíram com prompting de IA e lógica de programação mais robusta — projetos em vários departamentos foram otimizados e, a cada semana, surgia uma nova camada de automação possível dentro do ecossistema Google.

Paralelamente, um desafio prático do restaurante onde trabalhava levou à construção do site do D'Arcy McGee's. Com ferramentas de IA, estudo de UX e engenharia prática, saiu um site rápido e funcional — prova de que entregar valor com rapidez é uma habilidade repetível (quase um sabre de luz em pixels). Hoje procuro uma vaga front‑end ou full‑stack que valorize essa combinação de curiosidade, senso de produto e capacidade de transformar processos complexos em soluções elegantes e mensuráveis. A motivação é a mesma daquele garoto de onze anos na mesa de robótica: aprender rápido, construir bem e seguir em frente.`,
  },

  // Contact info labels
  contactEmailLabel: { EN: "Email", PT: "Email" },
  contactLocationLabel: { EN: "Location", PT: "Localização" },
  contactLocationValue: { EN: "Dublin, Ireland", PT: "Dublin, Irlanda" },
  contactResponseLabel: { EN: "Response Time", PT: "Tempo de Resposta" },
  contactResponseValue: { EN: "Within 24 hours", PT: "Em até 24 horas" },

  // Spoken languages
  portuguese: { EN: "Portuguese", PT: "Português" },
  english: { EN: "English", PT: "Inglês" },

  // Fun Stuff / Widgets section
  funStuffTitle: { EN: "Fun Stuff", PT: "Fun Stuff" },
  funStuffDescription: {
    EN: "Some experiments and interactive toys I've built.",
    PT: "Alguns experimentos e brinquedos interativos que eu criei.",
  },

  // Programming Skills section
  programmingSkillsTitle: {
    EN: "Programming Languages & Tools",
    PT: "Linguagens de Programação & Ferramentas",
  },
  itSkillsTitle: {
    EN: "IT & Infrastructure",
    PT: "TI & Infraestrutura",
  },

  // =========================================================================
  // Invite flow (/invite) — Sprint 1. PT copy authored by Hugo; EN is a
  // separate translation, never an auto-translation of the PT phrasing.
  // =========================================================================

  // Generic wizard navigation
  "invite.nav.back": { EN: "Back", PT: "Voltar" },
  "invite.nav.next": { EN: "Next", PT: "Próximo" },
  "invite.nav.continue": { EN: "Continue", PT: "Continuar" },
  "invite.nav.start": { EN: "Let's go", PT: "Vamos lá" },
  "invite.nav.submit": { EN: "Confirm", PT: "Confirmar" },
  "invite.progress.stepOf": { EN: "Step {current} of {total}", PT: "Passo {current} de {total}" },

  // Hero
  "invite.hero.badge": { EN: "A special invite, just for you", PT: "Um convite especial, só pra você" },
  "invite.hero.title": { EN: "This isn't a regular message.", PT: "Isso aqui não é uma mensagem qualquer." },
  "invite.hero.subtitle": {
    EN: "I put together a little something instead of just texting \"quer sair comigo?\". A few quick steps, a quiz, and — if you're up for it — a first date at the end.",
    PT: "Resolvi fazer diferente de só mandar um \"quer sair comigo?\" no zap. Alguns passos rápidos, um quizzinho, e — se você topar — um primeiro encontro no final.",
  },
  "invite.hero.cta": { EN: "Start the invite", PT: "Começar o convite" },

  // Identity & socials
  "invite.identity.title": { EN: "First, who am I talking to?", PT: "Antes de tudo, com quem eu tô falando?" },
  "invite.identity.subtitle": {
    EN: "Just the basics so I know it's really you.",
    PT: "Só o básico, pra eu saber que é você mesmo do outro lado.",
  },
  "invite.identity.name.label": { EN: "Your name", PT: "Seu nome" },
  "invite.identity.name.placeholder": { EN: "e.g. Maria", PT: "ex.: Maria" },
  "invite.identity.instagram.label": { EN: "Instagram", PT: "Instagram" },
  "invite.identity.instagram.placeholder": { EN: "@yourhandle", PT: "@seuusuario" },
  "invite.identity.email.label": { EN: "Email (optional)", PT: "Email (opcional)" },
  "invite.identity.email.placeholder": { EN: "you@example.com", PT: "voce@exemplo.com" },
  "invite.identity.phone.label": { EN: "Phone (optional)", PT: "Telefone (opcional)" },
  "invite.identity.phone.placeholder": { EN: "+353 ...", PT: "+55 ..." },
  "invite.identity.privacyNote": {
    EN: "This is only used to confirm it's you and to plan the date — nothing else.",
    PT: "Isso é só pra confirmar que é você e combinar o encontro — nada além disso.",
  },
  "invite.identity.error.name": { EN: "I need a name to call you by", PT: "Preciso de um nome pra te chamar" },
  "invite.identity.error.instagram": { EN: "Your Instagram handle is required", PT: "Seu Instagram é obrigatório" },
  "invite.identity.error.email": { EN: "That doesn't look like a valid email", PT: "Esse email não parece válido" },

  // Intentions
  "invite.intentions.title": { EN: "What are you hoping for?", PT: "O que você tá esperando disso?" },
  "invite.intentions.subtitle": {
    EN: "No wrong answers — pick whatever feels honest right now.",
    PT: "Não tem resposta errada — escolhe o que for mais sincero agora.",
  },
  "invite.intentions.getToKnow": { EN: "Just get to know each other and see what happens", PT: "Só conhecer pra ver no que dá" },
  "invite.intentions.bigPlans": { EN: "Big plans", PT: "Grandes planos" },
  "invite.intentions.funDate": { EN: "Just a fun date", PT: "Só um date divertido" },
  "invite.intentions.straightToPoint": { EN: "I want to get straight to the point", PT: "Quero ir direto ao ponto" },
  "invite.intentions.youDecide": { EN: "You decide", PT: "Você decide" },
  "invite.intentions.noIntention": { EN: "No intention at all, just curious", PT: "Intenção nenhuma, só fiquei curiosa" },

  // Quiz wizard
  "invite.quiz.title": { EN: "Getting to know you", PT: "Te conhecendo um pouco" },
  "invite.quiz.subtitle": {
    EN: "Quick, playful questions. Skip anything too personal for now.",
    PT: "Perguntas rápidas e sem compromisso. Pula o que for muito pessoal por enquanto.",
  },
  "invite.quiz.privateOption": { EN: "I'd rather tell you in person", PT: "Prefiro contar pessoalmente" },

  "invite.quiz.hobbies.question": { EN: "What do you do for fun?", PT: "No seu tempo livre, você é mais..." },
  "invite.quiz.hobbies.techGames": { EN: "Tech & games", PT: "Tecnologia e games" },
  "invite.quiz.hobbies.outdoors": { EN: "Anything outdoors", PT: "Qualquer coisa ao ar livre" },
  "invite.quiz.hobbies.moviesSeries": { EN: "Movies & series", PT: "Filmes e séries" },
  "invite.quiz.hobbies.sports": { EN: "Sports", PT: "Esportes" },
  "invite.quiz.hobbies.bitOfEverything": { EN: "A bit of everything", PT: "Um pouco de tudo" },

  "invite.quiz.lifestyle.question": { EN: "Are you more of a...", PT: "Você é mais..." },
  "invite.quiz.lifestyle.earlyBird": { EN: "Early bird", PT: "Pessoa matutina" },
  "invite.quiz.lifestyle.nightOwl": { EN: "Night owl", PT: "Pessoa notívaga" },
  "invite.quiz.lifestyle.planner": { EN: "I plan everything", PT: "Planejo tudo" },
  "invite.quiz.lifestyle.spontaneous": { EN: "Full spontaneous", PT: "Espontânea total" },

  "invite.quiz.pets.question": { EN: "Pets?", PT: "E os pets?" },
  "invite.quiz.pets.dogPerson": { EN: "Dog person", PT: "Sou mais cachorro" },
  "invite.quiz.pets.catPerson": { EN: "Cat person", PT: "Sou mais gato" },
  "invite.quiz.pets.allAnimals": { EN: "I love all animals", PT: "Amo qualquer bicho" },
  "invite.quiz.pets.notReally": { EN: "Not really my thing", PT: "Não curto muito" },

  "invite.quiz.kids.question": { EN: "Kids, someday?", PT: "Filhos, algum dia?" },
  "invite.quiz.kids.wantSomeday": { EN: "Want them someday", PT: "Quero, algum dia" },
  "invite.quiz.kids.wantSoon": { EN: "Want them fairly soon", PT: "Quero, e não tão longe" },
  "invite.quiz.kids.notSure": { EN: "Honestly not sure yet", PT: "Sinceramente ainda não sei" },
  "invite.quiz.kids.dontWant": { EN: "Don't want kids", PT: "Não quero filhos" },

  "invite.quiz.gym.question": { EN: "Gym & fitness?", PT: "Academia e exercício?" },
  "invite.quiz.gym.regular": { EN: "Regular gym-goer", PT: "Vou regularmente" },
  "invite.quiz.gym.sometimes": { EN: "Sometimes, when I feel like it", PT: "De vez em quando" },
  "invite.quiz.gym.notMyThing": { EN: "Not really my thing", PT: "Não é muito minha praia" },

  "invite.quiz.travel.question": { EN: "How do you like to travel?", PT: "Como você curte viajar?" },
  "invite.quiz.travel.backpacker": { EN: "Backpacker, figure it out as I go", PT: "Mochilão, no improviso" },
  "invite.quiz.travel.comfort": { EN: "Comfort first", PT: "Conforto em primeiro lugar" },
  "invite.quiz.travel.roadtrip": { EN: "Road trips", PT: "Viagem de carro" },
  "invite.quiz.travel.homebody": { EN: "Honestly, I'd rather stay home", PT: "Sinceramente, prefiro ficar em casa" },

  "invite.quiz.whereToLive.question": { EN: "Brasil or somewhere else?", PT: "Brasil ou fora?" },
  "invite.quiz.whereToLive.brasil": { EN: "Brasil, for sure", PT: "Brasil, com certeza" },
  "invite.quiz.whereToLive.outside": { EN: "Open to living abroad", PT: "Topo morar fora" },
  "invite.quiz.whereToLive.openToBoth": { EN: "Either works for me", PT: "Tanto faz pra mim" },

  "invite.quiz.extraHabits.question": { EN: "One more thing about you", PT: "Mais uma coisinha sobre você" },
  "invite.quiz.extraHabits.coffeeAddict": { EN: "Coffee addict", PT: "Viciada em café" },
  "invite.quiz.extraHabits.foodie": { EN: "Foodie", PT: "Ama comer bem" },
  "invite.quiz.extraHabits.gamerAtNight": { EN: "Gaming at night", PT: "Joga até tarde" },
  "invite.quiz.extraHabits.alwaysOnline": { EN: "Always online", PT: "Sempre online" },

  // "Conheça seu futuro algo…" bio section (UI chrome; bio content itself is
  // editable data — see src/config/inviteBaseline.ts, not translation keys)
  "invite.bio.title": { EN: "Meet your future... something?", PT: "Conheça seu futuro algo…" },
  "invite.bio.subtitle": {
    EN: "A quick intro before we get to the fun part.",
    PT: "Uma introdução rápida antes da parte divertida.",
  },
  "invite.bio.who.title": { EN: "Who's Hugo", PT: "Quem é o Hugo" },
  "invite.bio.what.title": { EN: "What he does", PT: "O que ele faz" },
  "invite.bio.likes.title": { EN: "Things he likes", PT: "Coisas que ele gosta" },
  "invite.bio.techStackLabel": { EN: "Works with", PT: "Trabalha com" },
  "invite.bio.editableNote": {
    EN: "Editable — Hugo can tune this text anytime from the profile page.",
    PT: "Editável — o Hugo pode ajustar esse texto quando quiser pela página de perfil.",
  },
  "invite.bio.photosCaption": { EN: "A few photos from Instagram", PT: "Umas fotos do Instagram" },

  // Date type
  "invite.dateType.title": { EN: "Pick a first date", PT: "Escolhe um primeiro encontro" },
  "invite.dateType.subtitle": {
    EN: "Choose your favorite, and a backup if you'd like. I'll use your pick to plan the actual date.",
    PT: "Escolhe sua favorita, e uma reserva se quiser. Eu uso essa escolha pra planejar o encontro de verdade.",
  },
  "invite.dateType.primaryLabel": { EN: "First choice", PT: "Primeira escolha" },
  "invite.dateType.secondaryLabel": { EN: "Second choice (optional)", PT: "Segunda escolha (opcional)" },
  "invite.dateType.otherPlaceholder": { EN: "Tell me your idea...", PT: "Me conta sua ideia..." },

  "invite.dateType.hiking.label": { EN: "Hiking", PT: "Trilha" },
  "invite.dateType.hiking.desc": { EN: "Fresh air and a good view", PT: "Ar puro e uma vista boa" },
  "invite.dateType.dinner.label": { EN: "Dinner", PT: "Jantar" },
  "invite.dateType.dinner.desc": { EN: "Good food, good conversation", PT: "Comida boa, papo bom" },
  "invite.dateType.pub.label": { EN: "Pub", PT: "Pub" },
  "invite.dateType.pub.desc": { EN: "A pint and easy conversation", PT: "Uma cerveja e papo tranquilo" },
  "invite.dateType.party.label": { EN: "Little party", PT: "Baladinha" },
  "invite.dateType.party.desc": { EN: "Music and dancing", PT: "Música e uma dançada" },
  "invite.dateType.games.label": { EN: "Games", PT: "Games" },
  "invite.dateType.games.desc": { EN: "Board games or console, your pick", PT: "Jogo de tabuleiro ou de console, você escolhe" },
  "invite.dateType.climbing.label": { EN: "Climbing", PT: "Escalada" },
  "invite.dateType.climbing.desc": { EN: "A bit of adrenaline together", PT: "Uma adrenalina a dois" },
  "invite.dateType.adventure.label": { EN: "Adventure", PT: "Aventura" },
  "invite.dateType.adventure.desc": { EN: "Surprise me, within reason", PT: "Me surpreende, dentro do razoável" },
  "invite.dateType.cinema.label": { EN: "Cinema", PT: "Cinema" },
  "invite.dateType.cinema.desc": { EN: "Popcorn and a big screen", PT: "Pipoca e telão" },
  "invite.dateType.netflix.label": { EN: "Netflix at home", PT: "Netflix em casa" },
  "invite.dateType.netflix.desc": { EN: "Cozy and low-key", PT: "Sofá e clima tranquilo" },
  "invite.dateType.gameNight.label": { EN: "Game night with friends", PT: "Dia de jogos com amigos" },
  "invite.dateType.gameNight.desc": { EN: "Bring the group along", PT: "Chama a galera também" },
  "invite.dateType.youDecide.label": { EN: "You decide", PT: "Você decide" },
  "invite.dateType.youDecide.desc": { EN: "Surprise planned by Hugo", PT: "Surpresa planejada pelo Hugo" },
  "invite.dateType.other.label": { EN: "Other", PT: "Outro" },
  "invite.dateType.other.desc": { EN: "Got a better idea?", PT: "Tem uma ideia melhor?" },

  // Compatibility
  "invite.compat.title": { EN: "You vs. Hugo", PT: "Você vs. Hugo" },
  "invite.compat.scoreLabel": { EN: "Compatibility", PT: "Compatibilidade" },
  "invite.compat.summary.great": {
    EN: "Uncanny. We might actually get along scarily well.",
    PT: "Assustador. A gente pode se dar bem demais.",
  },
  "invite.compat.summary.good": {
    EN: "Solid overlap — enough in common to make a great first conversation.",
    PT: "Boa sintonia — dá pano pra manga numa primeira conversa.",
  },
  "invite.compat.summary.curious": {
    EN: "Pretty different, but that just means more to talk about.",
    PT: "Bem diferentes, mas isso só significa mais assunto pra conversar.",
  },
  "invite.compat.summary.mystery": {
    EN: "You kept it mysterious — I like that. Guess we'll find out in person.",
    PT: "Você deixou tudo no mistério — e eu gostei. Acho que a gente descobre pessoalmente.",
  },

  // Availability & who decides
  "invite.availability.title": { EN: "Last thing: when works for you?", PT: "Última coisa: quando funciona pra você?" },
  "invite.availability.subtitle": {
    EN: "Pick whatever days and times could work — nothing is locked in yet.",
    PT: "Marca os dias e horários que podem funcionar — nada tá travado ainda.",
  },
  "invite.availability.whoDecides.title": { EN: "Who picks the date type?", PT: "Quem escolhe o tipo de encontro?" },
  "invite.availability.whoDecides.guest": { EN: "I'll decide", PT: "Eu decido" },
  "invite.availability.whoDecides.hugo": { EN: "You decide, Hugo", PT: "Você decide, Hugo" },
  "invite.availability.daysLabel": { EN: "Available days", PT: "Dias disponíveis" },
  "invite.availability.day.mon": { EN: "Mon", PT: "Seg" },
  "invite.availability.day.tue": { EN: "Tue", PT: "Ter" },
  "invite.availability.day.wed": { EN: "Wed", PT: "Qua" },
  "invite.availability.day.thu": { EN: "Thu", PT: "Qui" },
  "invite.availability.day.fri": { EN: "Fri", PT: "Sex" },
  "invite.availability.day.sat": { EN: "Sat", PT: "Sáb" },
  "invite.availability.day.sun": { EN: "Sun", PT: "Dom" },
  "invite.availability.period.morning": { EN: "Morning", PT: "Manhã" },
  "invite.availability.period.afternoon": { EN: "Afternoon", PT: "Tarde" },
  "invite.availability.period.evening": { EN: "Evening", PT: "Noite" },
  "invite.availability.note.label": { EN: "Anything else I should know? (optional)", PT: "Mais alguma coisa que eu deva saber? (opcional)" },
  "invite.availability.note.placeholder": { EN: "e.g. Only after work, or weekends are easier", PT: "ex.: Só depois do trabalho, ou fim de semana é mais fácil" },

  // Summary & confirmation
  "invite.summary.title": { EN: "Here's everything, before you send it", PT: "Aqui está tudo, antes de enviar" },
  "invite.summary.subtitle": {
    EN: "Take a look, then confirm when you're ready.",
    PT: "Dá uma olhada, e confirma quando estiver pronta.",
  },
  "invite.summary.section.identity": { EN: "About you", PT: "Sobre você" },
  "invite.summary.section.intentions": { EN: "Intentions", PT: "Intenções" },
  "invite.summary.section.quiz": { EN: "Quiz highlights", PT: "Destaques do quiz" },
  "invite.summary.section.dateType": { EN: "Date type", PT: "Tipo de encontro" },
  "invite.summary.section.whoDecides": { EN: "Who decides", PT: "Quem decide" },
  "invite.summary.section.availability": { EN: "Availability", PT: "Disponibilidade" },
  "invite.summary.noAnswer": { EN: "Not answered", PT: "Não respondido" },
  "invite.summary.disclaimer": {
    EN: "Your answers are only used to plan this date and won't be shared anywhere else.",
    PT: "Suas respostas são usadas só pra planejar esse encontro e não vão pra mais lugar nenhum.",
  },
  "invite.summary.cta": { EN: "Send my answers to Hugo", PT: "Enviar minhas respostas pro Hugo" },
  "invite.summary.sending": { EN: "Sending...", PT: "Enviando..." },
  "invite.summary.submitError": {
    EN: "Something went wrong sending your answers. Please try again in a moment.",
    PT: "Algo deu errado ao enviar suas respostas. Tenta de novo daqui a pouco.",
  },
  "invite.summary.confirmedTitle": { EN: "Sent! 🎉", PT: "Enviado! 🎉" },
  "invite.summary.confirmedBody": {
    EN: "Hugo will reach out on Instagram or by the contact you shared to lock in the details.",
    PT: "O Hugo vai chamar no Instagram ou pelo contato que você passou pra combinar os detalhes.",
  },

  // Profile edit page (/invite/profile) — Hugo-only, front-end only in Sprint 1
  "invite.profile.title": { EN: "Invite profile editor", PT: "Editor do perfil do convite" },
  "invite.profile.subtitle": {
    EN: "Tune what guests see on /invite. Saved locally in this browser for now — Firestore sync comes in Sprint 2.",
    PT: "Ajuste o que quem recebe o convite vê em /invite. Por enquanto fica salvo só nesse navegador — a sincronização com o Firestore vem no Sprint 2.",
  },
  "invite.profile.bio.title": { EN: "Bio shown on the invite", PT: "Bio exibida no convite" },
  "invite.profile.bio.roleLabel": { EN: "Role", PT: "Cargo" },
  "invite.profile.bio.cityLabel": { EN: "City", PT: "Cidade" },
  "invite.profile.bio.vibeLabel": { EN: "Vibe / about", PT: "Vibe / sobre" },
  "invite.profile.bio.techStackLabel": { EN: "Tech stack (comma separated)", PT: "Stack (separado por vírgula)" },
  "invite.profile.baseline.title": { EN: "Your baseline answers", PT: "Suas respostas base" },
  "invite.profile.baseline.subtitle": {
    EN: "Used to compute the compatibility score against guest answers.",
    PT: "Usadas pra calcular a compatibilidade com as respostas de quem responde.",
  },
  "invite.profile.baseline.intentionLabel": { EN: "Your intention", PT: "Sua intenção" },
  "invite.profile.dateDefaults.title": { EN: "Default date-type suggestions", PT: "Sugestões padrão de encontro" },
  "invite.profile.loading": { EN: "Loading your saved profile...", PT: "Carregando seu perfil salvo..." },
  "invite.profile.save": { EN: "Save changes", PT: "Salvar alterações" },
  "invite.profile.saving": { EN: "Saving...", PT: "Salvando..." },
  "invite.profile.saved": { EN: "Saved!", PT: "Salvo!" },
  "invite.profile.saveError": {
    EN: "Couldn't save to the server, but your changes are kept in this browser. Try again in a moment.",
    PT: "Não deu pra salvar no servidor, mas suas alterações ficaram guardadas nesse navegador. Tenta de novo daqui a pouco.",
  },
  "invite.profile.reset": { EN: "Reset to defaults", PT: "Restaurar padrão" },
  "invite.profile.langTabLabel": { EN: "Editing text in", PT: "Editando texto em" },
};

export const getTranslation = (key: string, language: LanguageCode): string => {
  return translations[key]?.[language] || key;
};
