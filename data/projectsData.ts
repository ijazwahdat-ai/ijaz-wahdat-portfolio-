interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: 'Afghan Telecom LLaMA (MCIT)',
    description: `Afghanistan's first domain-specific LLM engineered for the Ministry of Communications and IT.
    Fine-tuned Llama-2-7B using QLoRA on a custom dataset of 1,750 telecom Q&A pairs.
    Achieved 89% factual accuracy in handling USSD codes, bundle inquiries, and ISP policies for AWCC, Salaam, and Roshan.`,
    imgSrc: '/static/images/telecom-ai.jpg',
    href: 'https://github.com/ijazwahdat-ai/Afghan-Telecom-LLaMA-MCIT',
  },
  {
    title: 'Academy Automation System',
    description: `An end-to-end automation solution streamlining student registration and reporting.
    Integrated Google Forms, Sheets, and Apps Script with a Telegram Bot to automate workflows.
    Reduces manual administrative overhead and provides real-time notifications for educational institutions.`,
    imgSrc: '/static/images/automation.jpg',
    href: 'https://github.com/ijazwahdat-ai/academy-automation-system',
  },
  {
    title: 'Modern AI Engineer Portfolio',
    description: `A high-performance personal portfolio built with Next.js, TypeScript, and Tailwind CSS.
    Features a responsive design, dark mode support, and CI/CD deployment via Vercel.
    Showcases professional expertise in AI, NLP, and Full-Stack development.`,
    imgSrc: '/static/images/telegram.jpg',
    imgSrc: '/static/images/wepapp.jpg',
    href: 'https://github.com/ijazwahdat-ai/ijaz-wahdat-portfolio-',
  },
]

export default projectsData