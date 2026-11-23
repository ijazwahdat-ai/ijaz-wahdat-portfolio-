import {
  LivePortfolioSnapshot,
  MasterAchievement,
  MasterCertification,
  MasterEducation,
  MasterExperience,
  MasterProject,
  MasterResearch,
  MasterService,
  MasterSkillCategory,
  NavLinkItem,
  ProfilePreset,
  SectionKey,
} from './portfolio-types'

export const DEFAULT_NAV_LINKS: NavLinkItem[] = [
  { href: '/', title: 'Home', visible: true },
  { href: '/projects', title: 'Projects', visible: true },
  { href: '/blog', title: 'Research', visible: true },
  { href: '/about', title: 'About', visible: true },
]

export const DEFAULT_SECTION_ORDER: SectionKey[] = [
  'hero',
  'projects',
  'skills',
  'experience',
  'research',
  'education',
  'certifications',
  'services',
  'achievements',
  'about',
]

export const SEED_MASTER_PROJECTS: MasterProject[] = [
  {
    id: 'proj_afghan_telecom_llama',
    title: 'Afghan Telecom LLaMA (MCIT)',
    description:
      "Afghanistan's first domain-specific LLM engineered for the Ministry of Communications and IT. Fine-tuned Llama-2-7B using QLoRA on a custom dataset of 1,750 telecom Q&A pairs. Achieved 89% factual accuracy in handling USSD codes, bundle inquiries, and ISP policies for AWCC, Salaam, MTN, Etisalat, Roshan, and MCIT.",
    imgSrc: '/static/images/chatbot.jpg',
    href: '/blog/mcit-project-demo',
    repoUrl: 'https://github.com/ijazwahdat-ai/Afghan-Telecom-LLaMA-MCIT',
    category: 'AI & LLM Engineering',
    tags: ['Llama-2', 'QLoRA', 'PEFT', 'Python', 'Telecom NLP'],
    featured: true,
  },
  {
    id: 'proj_pvc_smart_assistant',
    title: 'Shin Ghazi Baba PVC Smart Assistant',
    description:
      "An intelligent, database-driven conversational AI embedded directly into the company's website. Provides customers with accurate, real-time product information and dynamic pricing with full trilingual support (Dari, Pashto, and English) to maximize customer engagement.",
    imgSrc: '/static/images/pvc-bot-main.jpg',
    href: '/blog/pvc-smart-assistant-demo',
    repoUrl: '',
    category: 'AI & Full-Stack Integration',
    tags: ['Conversational AI', 'Database Integration', 'Trilingual NLP', 'Web Embed'],
    featured: true,
  },
  {
    id: 'proj_academy_ai_assistant',
    title: 'Shining Stars Academy AI Assistant',
    description:
      'A custom-built, web-embedded conversational agent designed for Shining Stars Online Academy. Instantly answers student and parent inquiries regarding course details, registration processes, and academy policies, ensuring 24/7 automated support.',
    imgSrc: '/static/images/website.jpg',
    href: '/blog/academy-ai-assistant-demo',
    repoUrl: '',
    category: 'AI Agents & Automation',
    tags: ['Chatbot', 'Web Automation', 'EdTech', '24/7 Support'],
    featured: true,
  },
  {
    id: 'proj_academy_automation',
    title: 'Academy Automation & Reporting System',
    description:
      'An end-to-end automation and data pipeline solution streamlining student registration, database logging, and reporting. Integrated Google Forms, Sheets, and Apps Script with a Telegram Bot to eliminate manual overhead and deliver real-time institutional alerts.',
    imgSrc: '/static/images/system.jpg',
    href: 'https://github.com/ijazwahdat-ai/academy-automation-system',
    repoUrl: 'https://github.com/ijazwahdat-ai/academy-automation-system',
    category: 'Data, Automation & Systems',
    tags: ['Google Apps Script', 'Data Pipeline', 'Telegram Bot API', 'Reporting'],
    featured: true,
  },
  {
    id: 'proj_rasa_trilingual',
    title: 'Multi-intent Trilingual Chatbot (Rasa)',
    description:
      'An intelligent conversational agent built with the Rasa framework featuring trilingual support (Pashto, Dari, English). Integrated with a live Weather API for real-time forecasts across all 34 provinces of Afghanistan alongside healthcare and guidance intents.',
    imgSrc: '/static/images/rasa-bot1.jpg',
    href: '/projects',
    repoUrl: '',
    category: 'AI & Backend Systems',
    tags: ['Rasa', 'Python', 'REST APIs', 'Multilingual NLU'],
    featured: false,
  },
  {
    id: 'proj_nextjs_portfolio',
    title: 'Dynamic Single-Link Portfolio Platform',
    description:
      'A high-performance Next.js, TypeScript, and Tailwind CSS portfolio platform engineered with Cloud Firestore, role-based preset switching, draft/publish version control, and responsive mobile administration deployed on Vercel.',
    imgSrc: '/static/images/website.jpg',
    href: 'https://github.com/ijazwahdat-ai/ijaz-wahdat-portfolio-',
    repoUrl: 'https://github.com/ijazwahdat-ai/ijaz-wahdat-portfolio-',
    category: 'Full-Stack Web Engineering',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Firestore', 'Vercel'],
    featured: true,
  },
]

export const SEED_MASTER_EXPERIENCES: MasterExperience[] = [
  {
    id: 'exp_mcit_ai',
    role: 'AI Engineer & LLM Intern (Top Performer)',
    organization: 'Ministry of Communications and IT (MCIT)',
    location: 'Kabul, Afghanistan',
    period: '2025',
    current: false,
    bullets: [
      'Engineered and fine-tuned Afghanistan’s first domain-specific telecom LLM (Llama-2-7B via QLoRA) across 1,750 manually validated Q&A records.',
      'Built the complete end-to-end pipeline from dataset curation and cleaning to evaluation and deployment for telecom operator queries (AWCC, MTN, Etisalat, Salaam, Roshan).',
      'Achieved 89% factual accuracy on USSD codes, bundle specifications, and ISP policy guidance.',
    ],
    skillsUsed: ['PyTorch', 'QLoRA', 'PEFT', 'Hugging Face', 'Python', 'Data Curation'],
  },
  {
    id: 'exp_freelance_systems',
    role: 'AI & Full-Stack Automation Specialist',
    organization: 'Independent Consulting (PVC, Shining Stars Academy)',
    location: 'Kabul / Remote',
    period: '2024 – Present',
    current: true,
    bullets: [
      'Designed and deployed database-backed trilingual web assistants (Dari, Pashto, English) for commercial and educational organizations.',
      'Automated student registration, structured reporting, and real-time Telegram notifications using Google Apps Script and cloud workflows.',
      'Delivered modern Next.js and FastAPI/Flask web interfaces optimized for low-bandwidth mobile and desktop access.',
    ],
    skillsUsed: ['Next.js', 'TypeScript', 'FastAPI', 'Flask', 'Google Apps Script', 'Rasa'],
  },
  {
    id: 'exp_workshop_instructor',
    role: 'Machine Learning & Python Workshop Instructor',
    organization: 'Kabul Polytechnic University',
    location: 'Kabul, Afghanistan',
    period: '2024 – 2025',
    current: false,
    bullets: [
      'Taught supervised and unsupervised machine learning (SVM, Random Forests, Decision Trees, Logistic Regression) to 50+ engineering students.',
      'Mentored student teams on Python data analysis workflows using Pandas, NumPy, Matplotlib, and Scikit-learn.',
    ],
    skillsUsed: ['Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib', 'Technical Instruction'],
  },
]

export const SEED_MASTER_SKILLS: MasterSkillCategory[] = [
  {
    id: 'skill_ai_llm',
    title: 'AI Agents & Generative AI',
    domain: 'AI',
    summary: 'Fine-tuning, retrieval augmentation, and multilingual conversational agents.',
    skills: [
      'QLoRA & PEFT Fine-Tuning',
      'Llama-2 & Flan-T5',
      'RAG Architectures',
      'Prompt Engineering',
      'Hugging Face Ecosystem',
      'OpenAI & Gemini APIs',
      'Rasa NLU Framework',
    ],
  },
  {
    id: 'skill_ml_data',
    title: 'Data Science, Analytics & ML',
    domain: 'Data',
    summary: 'Data validation, exploratory analysis, statistical modeling, and reporting.',
    skills: [
      'Python (Pandas, NumPy)',
      'Scikit-learn & PyTorch',
      'TensorFlow',
      'Dataset Curation & QA',
      'Matplotlib Visualization',
      'Google Sheets & Apps Script',
      'Automated M&E Reporting',
    ],
  },
  {
    id: 'skill_fullstack',
    title: 'Full-Stack Web & Backend Engineering',
    domain: 'FullStack',
    summary: 'Modern TypeScript frontends, REST APIs, and cloud-persistent architectures.',
    skills: [
      'Next.js (App Router)',
      'React & TypeScript',
      'Tailwind CSS',
      'FastAPI & Flask',
      'Cloud Firestore',
      'REST API Integration',
      'Vercel CI/CD',
    ],
  },
  {
    id: 'skill_it_systems',
    title: 'IT Operations, Systems & Automation',
    domain: 'IT',
    summary: 'Reliable deployments, workflow automation, and technical documentation.',
    skills: [
      'Linux & Cloud Deployment',
      'AWS Fundamentals',
      'Git & GitHub Workflows',
      'Telegram Bot API Automation',
      'System Troubleshooting',
      'LaTeX / Technical Documentation',
      'Ngrok & Tunneling',
    ],
  },
]

export const SEED_MASTER_EDUCATION: MasterEducation[] = [
  {
    id: 'edu_kpu_bsc',
    degree: 'B.Sc. in Computer Engineering',
    institution: 'Kabul Polytechnic University',
    year: '2025',
    thesis: 'Adapting LLaMA-2 for Telecom Customer Support (Grade: A)',
    focus: 'Artificial Intelligence, Natural Language Processing & Software Systems',
  },
]

export const SEED_MASTER_CERTIFICATIONS: MasterCertification[] = [
  {
    id: 'cert_genai_llm',
    name: 'Generative AI with Large Language Models',
    issuer: 'DeepLearning.AI & AWS',
    date: '2025',
    url: '',
    category: 'AI & LLMs',
  },
  {
    id: 'cert_nlp_spec',
    name: 'Natural Language Processing (NLP) Specialization',
    issuer: 'DeepLearning.AI / Coursera',
    date: '2025',
    url: '',
    category: 'AI & NLP',
  },
  {
    id: 'cert_ml_spec',
    name: 'Machine Learning Specialization',
    issuer: 'Stanford Online / Coursera',
    date: '2024',
    url: '',
    category: 'Machine Learning & Data',
  },
  {
    id: 'cert_mcit_top',
    name: 'MCIT Internship Certificate (Top Performer)',
    issuer: 'Ministry of Communications & IT',
    date: '2025',
    url: '',
    category: 'Telecom & Systems',
  },
  {
    id: 'cert_aws_fund',
    name: 'AWS Cloud Fundamentals',
    issuer: 'Amazon Web Services (AWS)',
    date: '2024',
    url: '',
    category: 'Cloud & IT Systems',
  },
]

export const SEED_MASTER_RESEARCH: MasterResearch[] = [
  {
    id: 'res_telecom_paper',
    title:
      'Adapting and Optimizing LLaMA-2-7B for Telecom Customer Support in Afghanistan using QLoRA',
    venue: 'KPU-IJET Technical Submission',
    date: '2025-09-28',
    summary:
      'A technical case study introducing a 1,750-record validated telecom instruction dataset and resource-efficient QLoRA fine-tuning on single-GPU hardware.',
    href: '/blog/telecom-paper',
    tags: ['Research', 'LLM', 'Telecom', 'QLoRA'],
  },
  {
    id: 'res_mcit_demo',
    title: 'Afghan Telecom LLaMA: Video Demo & Architecture',
    venue: 'MCIT Technical Showcase',
    date: '2026-04-05',
    summary:
      'Complete system demonstration and architecture overview of the telecom domain LLM handling USSD codes and ISP policies.',
    href: '/blog/mcit-project-demo',
    tags: ['LLM', 'AI', 'Llama-2', 'Telecom'],
  },
  {
    id: 'res_pvc_demo',
    title: 'Shin Ghazi Baba PVC Smart Assistant: Demo',
    venue: 'Production Case Study',
    date: '2026-04-05',
    summary:
      'Real-time response and dynamic database pricing retrieval across Dari, Pashto, and English interfaces.',
    href: '/blog/pvc-smart-assistant-demo',
    tags: ['Chatbot', 'AI', 'Database'],
  },
  {
    id: 'res_academy_demo',
    title: 'Shining Stars Academy AI Assistant: Demo',
    venue: 'EdTech Automation Case Study',
    date: '2026-04-05',
    summary:
      'Automated conversational agent managing student inquiries, class schedules, and registration onboarding.',
    href: '/blog/academy-ai-assistant-demo',
    tags: ['Chatbot', 'Automation', 'Education'],
  },
]

export const SEED_MASTER_SERVICES: MasterService[] = [
  {
    id: 'svc_ai_agents',
    title: 'Custom AI Agents & Domain LLMs',
    description:
      'End-to-end design, fine-tuning (QLoRA/RAG), and deployment of multilingual customer support and enterprise knowledge assistants.',
    deliverables: [
      'Custom dataset curation',
      'Fine-tuned LLM or RAG API',
      'Web widget integration',
    ],
  },
  {
    id: 'svc_fullstack_web',
    title: 'Full-Stack Web Applications',
    description:
      'Responsive, production-grade Next.js, TypeScript, and Python backend systems with secure authentication and cloud persistence.',
    deliverables: [
      'Next.js / React frontend',
      'REST API & database schema',
      'Vercel CI/CD pipeline',
    ],
  },
  {
    id: 'svc_data_automation',
    title: 'Data Pipelines & Process Automation',
    description:
      'Structured data validation, reporting dashboards, and automated notification workflows for institutions and operations teams.',
    deliverables: [
      'Cleaned validation schemas',
      'Automated reporting scripts',
      'Real-time alert bots',
    ],
  },
]

export const SEED_MASTER_ACHIEVEMENTS: MasterAchievement[] = [
  {
    id: 'ach_89_accuracy',
    title: 'Telecom LLM Factual Accuracy Benchmark',
    metric: '89% Accuracy',
    context: 'Achieved 89% factual accuracy across 1,750 validated telecom Q&A queries at MCIT.',
    year: '2025',
  },
  {
    id: 'ach_50_students',
    title: 'Machine Learning Instruction Impact',
    metric: '50+ Students',
    context:
      'Trained over 50 university learners in supervised ML algorithms and Python data workflows.',
    year: '2025',
  },
  {
    id: 'ach_top_performer',
    title: 'MCIT Top Performer Distinction',
    metric: 'Top Rank',
    context:
      'Awarded Top Performer distinction during engineering internship at the Ministry of Communications & IT.',
    year: '2025',
  },
]

const SHARED_SITE_BASE = {
  siteTitle: 'Ijazulhaq Wahdat',
  headerTitle: 'Ijazulhaq Wahdat',
  footerTagline: 'Engineered for clarity, reliability, and measurable impact.',
  contactEmail: 'ijazulhaqwahdat01@gmail.com',
  github: 'https://github.com/ijazwahdat-ai',
  linkedin: 'https://www.linkedin.com/in/ijaz-wahdat',
  twitter: '',
  resumeUrl: '',
  navLinks: DEFAULT_NAV_LINKS,
}

export const SEED_PROFILE_PRESETS: ProfilePreset[] = [
  {
    id: 'preset_ai_engineer',
    name: 'Artificial Intelligence Engineer',
    targetRole: 'AI Agent Engineer & LLM Specialist',
    tagline: 'Telecom LLMs, QLoRA Fine-Tuning & Production AI Agents',
    hero: {
      eyebrow: 'AI Engineering & Applied NLP',
      headline: "Building Intelligent AI Agents for Afghanistan's Telecom Future",
      highlightPhrase: 'AI Agents',
      subheadline:
        'AI Engineer specializing in Generative AI, Large Language Models (LLMs), and Transformer Architectures.',
      bioIntro:
        "Hi, I'm Ijazulhaq Wahdat. I engineer domain-specific LLMs, RAG pipelines, and multilingual conversational agents—combining rigorous AWS & DeepLearning.AI standards with practical deployment for enterprise and telecom systems.",
      primaryCtaLabel: 'View AI Projects',
      primaryCtaHref: '/projects',
      secondaryCtaLabel: 'More About Me',
      secondaryCtaHref: '/about',
      showResumeButton: false,
      resumeButtonLabel: 'Download AI Resume',
    },
    about: {
      name: 'Ijazulhaq Wahdat',
      occupation: 'AI Agent Engineer & LLM Expert',
      company: 'Kabul Polytechnic University / MCIT',
      location: 'Kabul, Afghanistan',
      avatar: '/static/images/avatar.png',
      summary:
        'Passionate AI Agent Engineer specializing in Generative AI, Large Language Models (LLMs), Natural Language Processing (NLP), and Enterprise Automation.',
      mission:
        'My mission is to modernize telecommunications and institutional services through intelligent, low-resource, multilingual AI systems.',
    },
    siteConfig: {
      ...SHARED_SITE_BASE,
      availabilityText: 'Available for AI Engineer, LLM & Applied NLP roles',
    },
    sectionOrder: [
      'hero',
      'research',
      'projects',
      'skills',
      'experience',
      'achievements',
      'education',
      'certifications',
      'services',
      'about',
    ],
    sectionVisibility: {
      hero: true,
      projects: true,
      skills: true,
      experience: true,
      research: true,
      education: true,
      certifications: true,
      services: false,
      achievements: true,
      about: true,
    },
    selectedProjectIds: [
      'proj_afghan_telecom_llama',
      'proj_pvc_smart_assistant',
      'proj_academy_ai_assistant',
      'proj_rasa_trilingual',
    ],
    selectedSkillIds: ['skill_ai_llm', 'skill_ml_data', 'skill_fullstack'],
    selectedExperienceIds: ['exp_mcit_ai', 'exp_freelance_systems', 'exp_workshop_instructor'],
    selectedEducationIds: ['edu_kpu_bsc'],
    selectedCertificationIds: ['cert_genai_llm', 'cert_nlp_spec', 'cert_ml_spec', 'cert_mcit_top'],
    selectedResearchIds: ['res_telecom_paper', 'res_mcit_demo', 'res_pvc_demo', 'res_academy_demo'],
    selectedServiceIds: ['svc_ai_agents', 'svc_fullstack_web'],
    selectedAchievementIds: ['ach_89_accuracy', 'ach_top_performer', 'ach_50_students'],
  },
  {
    id: 'preset_fullstack_dev',
    name: 'Full-Stack Developer',
    targetRole: 'Full-Stack Software Engineer',
    tagline: 'Next.js, TypeScript, Python APIs & Cloud-Native Web Applications',
    hero: {
      eyebrow: 'Full-Stack Web & API Engineering',
      headline: 'Engineering Reliable Full-Stack Web Applications & Cloud Systems',
      highlightPhrase: 'Full-Stack Web Applications',
      subheadline:
        'Software Engineer building production web apps with Next.js, TypeScript, FastAPI/Flask, and cloud databases.',
      bioIntro:
        "Hi, I'm Ijazulhaq Wahdat. I design and ship end-to-end web architectures—from responsive TypeScript interfaces and clean REST APIs to database-backed conversational systems and automated workflows deployed on Vercel.",
      primaryCtaLabel: 'Explore Web Projects',
      primaryCtaHref: '/projects',
      secondaryCtaLabel: 'Technical Stack & Bio',
      secondaryCtaHref: '/about',
      showResumeButton: false,
      resumeButtonLabel: 'Download Software CV',
    },
    about: {
      name: 'Ijazulhaq Wahdat',
      occupation: 'Full-Stack Software Engineer',
      company: 'Independent Software & AI Consulting',
      location: 'Kabul, Afghanistan',
      avatar: '/static/images/avatar.png',
      summary:
        'Full-Stack Software Engineer focused on Next.js, React, TypeScript, Python backends (FastAPI, Flask), and scalable cloud architectures.',
      mission:
        'Delivering fast, accessible, and maintainable software products that connect clean user interfaces with dependable backend logic.',
    },
    siteConfig: {
      ...SHARED_SITE_BASE,
      availabilityText: 'Open to Full-Stack Developer & Software Engineer roles',
    },
    sectionOrder: [
      'hero',
      'projects',
      'skills',
      'experience',
      'services',
      'education',
      'certifications',
      'research',
      'achievements',
      'about',
    ],
    sectionVisibility: {
      hero: true,
      projects: true,
      skills: true,
      experience: true,
      research: true,
      education: true,
      certifications: true,
      services: true,
      achievements: false,
      about: true,
    },
    selectedProjectIds: [
      'proj_nextjs_portfolio',
      'proj_pvc_smart_assistant',
      'proj_academy_automation',
      'proj_academy_ai_assistant',
      'proj_afghan_telecom_llama',
    ],
    selectedSkillIds: ['skill_fullstack', 'skill_it_systems', 'skill_ai_llm'],
    selectedExperienceIds: ['exp_freelance_systems', 'exp_mcit_ai', 'exp_workshop_instructor'],
    selectedEducationIds: ['edu_kpu_bsc'],
    selectedCertificationIds: ['cert_aws_fund', 'cert_mcit_top', 'cert_genai_llm'],
    selectedResearchIds: ['res_pvc_demo', 'res_academy_demo', 'res_mcit_demo'],
    selectedServiceIds: ['svc_fullstack_web', 'svc_ai_agents', 'svc_data_automation'],
    selectedAchievementIds: ['ach_top_performer', 'ach_89_accuracy'],
  },
  {
    id: 'preset_data_analyst',
    name: 'Data Analyst & BI Specialist',
    targetRole: 'Data Analyst & Monitoring / Reporting Specialist',
    tagline: 'Data Curation, Python Analytics, Validation & Automated Reporting',
    hero: {
      eyebrow: 'Data Analysis & Information Management',
      headline: 'Transforming Raw Institutional Data into Actionable Intelligence',
      highlightPhrase: 'Actionable Intelligence',
      subheadline:
        'Data Analyst experienced in Python (Pandas, NumPy), structured dataset validation, and automated reporting systems.',
      bioIntro:
        "Hi, I'm Ijazulhaq Wahdat. I build clean data pipelines, validate high-stakes domain datasets, and automate reporting workflows—turning fragmented records into accurate metrics for decision-makers.",
      primaryCtaLabel: 'View Data & System Projects',
      primaryCtaHref: '/projects',
      secondaryCtaLabel: 'Experience & Credentials',
      secondaryCtaHref: '/about',
      showResumeButton: false,
      resumeButtonLabel: 'Download Data Analyst CV',
    },
    about: {
      name: 'Ijazulhaq Wahdat',
      occupation: 'Data Analyst & Reporting Specialist',
      company: 'Kabul Polytechnic University / MCIT Alumni',
      location: 'Kabul, Afghanistan',
      avatar: '/static/images/avatar.png',
      summary:
        'Computer Engineering graduate specializing in Python data analysis, dataset quality assurance, automated reporting pipelines, and statistical modeling.',
      mission:
        'Helping organizations eliminate manual reporting errors through reproducible data validation and clear analytical metrics.',
    },
    siteConfig: {
      ...SHARED_SITE_BASE,
      availabilityText: 'Available for Data Analyst, M&E & Information Management roles',
    },
    sectionOrder: [
      'hero',
      'achievements',
      'projects',
      'skills',
      'experience',
      'education',
      'certifications',
      'research',
      'services',
      'about',
    ],
    sectionVisibility: {
      hero: true,
      projects: true,
      skills: true,
      experience: true,
      research: true,
      education: true,
      certifications: true,
      services: false,
      achievements: true,
      about: true,
    },
    selectedProjectIds: [
      'proj_academy_automation',
      'proj_afghan_telecom_llama',
      'proj_pvc_smart_assistant',
      'proj_nextjs_portfolio',
    ],
    selectedSkillIds: ['skill_ml_data', 'skill_it_systems', 'skill_fullstack'],
    selectedExperienceIds: ['exp_mcit_ai', 'exp_workshop_instructor', 'exp_freelance_systems'],
    selectedEducationIds: ['edu_kpu_bsc'],
    selectedCertificationIds: ['cert_ml_spec', 'cert_mcit_top', 'cert_aws_fund'],
    selectedResearchIds: ['res_telecom_paper', 'res_mcit_demo'],
    selectedServiceIds: ['svc_data_automation'],
    selectedAchievementIds: ['ach_89_accuracy', 'ach_50_students', 'ach_top_performer'],
  },
  {
    id: 'preset_it_systems',
    name: 'IT & Systems Specialist',
    targetRole: 'IT Officer & Systems Automation Specialist',
    tagline: 'Enterprise Automation, Cloud Deployments, Integration & Technical Support',
    hero: {
      eyebrow: 'IT Systems & Enterprise Automation',
      headline: 'Designing Dependable IT Workflows & Automated Support Infrastructure',
      highlightPhrase: 'Dependable IT Workflows',
      subheadline:
        'IT & Systems Specialist bridging cloud infrastructure, workflow automation, database tools, and technical operations.',
      bioIntro:
        "Hi, I'm Ijazulhaq Wahdat. With Computer Engineering training and hands-on experience at MCIT and educational institutions, I automate manual workflows, deploy reliable web services, and maintain high-availability support systems.",
      primaryCtaLabel: 'Inspect Systems Work',
      primaryCtaHref: '/projects',
      secondaryCtaLabel: 'Credentials & Stack',
      secondaryCtaHref: '/about',
      showResumeButton: false,
      resumeButtonLabel: 'Download IT Systems CV',
    },
    about: {
      name: 'Ijazulhaq Wahdat',
      occupation: 'IT Officer & Systems Specialist',
      company: 'Computer Engineering & Enterprise Operations',
      location: 'Kabul, Afghanistan',
      avatar: '/static/images/avatar.png',
      summary:
        'Computer Engineer focused on IT operations, workflow automation, cloud fundamentals, and database-backed internal systems.',
      mission:
        'Modernizing organizational IT operations with dependable automation, secure access controls, and clear documentation.',
    },
    siteConfig: {
      ...SHARED_SITE_BASE,
      availabilityText: 'Open to IT Officer, Systems Administrator & Technical Support roles',
    },
    sectionOrder: [
      'hero',
      'skills',
      'projects',
      'experience',
      'services',
      'certifications',
      'education',
      'achievements',
      'research',
      'about',
    ],
    sectionVisibility: {
      hero: true,
      projects: true,
      skills: true,
      experience: true,
      research: false,
      education: true,
      certifications: true,
      services: true,
      achievements: true,
      about: true,
    },
    selectedProjectIds: [
      'proj_academy_automation',
      'proj_nextjs_portfolio',
      'proj_academy_ai_assistant',
      'proj_pvc_smart_assistant',
    ],
    selectedSkillIds: ['skill_it_systems', 'skill_fullstack', 'skill_ml_data'],
    selectedExperienceIds: ['exp_freelance_systems', 'exp_mcit_ai', 'exp_workshop_instructor'],
    selectedEducationIds: ['edu_kpu_bsc'],
    selectedCertificationIds: ['cert_aws_fund', 'cert_mcit_top', 'cert_ml_spec'],
    selectedResearchIds: ['res_academy_demo', 'res_mcit_demo'],
    selectedServiceIds: ['svc_data_automation', 'svc_fullstack_web'],
    selectedAchievementIds: ['ach_top_performer', 'ach_50_students'],
  },
]

export function resolveSnapshotFromPreset(
  preset: ProfilePreset,
  masters: {
    projects: MasterProject[]
    skills: MasterSkillCategory[]
    experiences: MasterExperience[]
    education: MasterEducation[]
    certifications: MasterCertification[]
    research: MasterResearch[]
    services: MasterService[]
    achievements: MasterAchievement[]
  },
  versionNumber: number,
  publishedAt: string
): LivePortfolioSnapshot {
  const orderByIds = <T extends { id: string }>(items: T[], ids: string[]): T[] => {
    const map = new Map(items.map((item) => [item.id, item]))
    return ids.map((id) => map.get(id)).filter((x): x is T => Boolean(x))
  }

  return {
    activePresetId: preset.id,
    activePresetName: preset.name,
    versionNumber,
    publishedAt,
    siteConfig: preset.siteConfig,
    hero: preset.hero,
    about: preset.about,
    sectionOrder: preset.sectionOrder,
    sectionVisibility: preset.sectionVisibility,
    projects: orderByIds(masters.projects, preset.selectedProjectIds),
    skills: orderByIds(masters.skills, preset.selectedSkillIds),
    experiences: orderByIds(masters.experiences, preset.selectedExperienceIds),
    education: orderByIds(masters.education, preset.selectedEducationIds),
    certifications: orderByIds(masters.certifications, preset.selectedCertificationIds),
    research: orderByIds(masters.research, preset.selectedResearchIds),
    services: orderByIds(masters.services, preset.selectedServiceIds),
    achievements: orderByIds(masters.achievements, preset.selectedAchievementIds),
  }
}

export const DEFAULT_LIVE_SNAPSHOT: LivePortfolioSnapshot = resolveSnapshotFromPreset(
  SEED_PROFILE_PRESETS[0],
  {
    projects: SEED_MASTER_PROJECTS,
    skills: SEED_MASTER_SKILLS,
    experiences: SEED_MASTER_EXPERIENCES,
    education: SEED_MASTER_EDUCATION,
    certifications: SEED_MASTER_CERTIFICATIONS,
    research: SEED_MASTER_RESEARCH,
    services: SEED_MASTER_SERVICES,
    achievements: SEED_MASTER_ACHIEVEMENTS,
  },
  1,
  '2026-04-05T00:00:00.000Z'
)
