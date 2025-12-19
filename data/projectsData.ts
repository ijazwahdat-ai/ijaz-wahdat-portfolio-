interface Project {
  title: string;
  description: string;
  href?: string;
  imgSrc?: string;
  technologies?: string[];
  featured?: boolean;
  status?: string;
  achievement?: string;
}

const projectsData: Project[] = [
  {
    title: 'Afghan Telecom LLM - MCIT Partnership',
    description: `Government-Endorsed AI Initiative: Fine-tuning LLaMA 2-7B for Afghanistan's Critical Telecom Infrastructure.
    First domain-specific LLM for Afghan telecom sector using QLoRA, achieving 89% factual accuracy validated by telecom experts.`,
    href: 'https://github.com/ijazwahdat-ai/Afghan-Telecom-LLaMA-MCIT',
    technologies: ['Llama-2-7B', 'QLoRA', 'Python', 'Flask', 'Hugging Face', 'PyTorch', 'Transformer', 'Telegram Bot API'],
    featured: true,
    status: 'Completed - Production Ready',
    achievement: '89% Factual Accuracy | 85% GPU Memory Reduction'
  },
  {
    title: 'Academy Automation System',
    description: `Automated student registration system with Google Forms, Sheets, Apps Script, and Telegram Bot integration.
    Streamlines registration workflow with real-time notifications and data management.`,
    href: 'https://github.com/ijazwahdat-ai/academy-automation-system',
    technologies: ['Google Apps Script', 'JavaScript', 'Telegram Bot API', 'Google Sheets API', 'Google Forms'],
    featured: true,
    status: 'Deployed & Operational'
  },
  {
    title: 'Personal Portfolio Website',
    description: `Modern, responsive portfolio website built with Next.js, React, and Tailwind CSS.
    Deployed on Vercel with optimized performance and SEO.`,
    href: 'https://github.com/ijazwahdat-ai/ijaz-wahdat-portfolio-',
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Vercel', 'Git'],
    featured: true,
    status: 'Live Deployment'
  },
  {
    title: 'Telecom Customer Support AI Agent',
    description: `Fine-tuned Llama-2 chatbot for MCIT and local ISP services. Production-ready system using Flask integrated with Telegram Bot for customer support.`,
    href: 'https://github.com/ijazwahdat-ai/Afghan-Telecom-LLaMA-MCIT',
    technologies: ['Llama-2', 'Flask', 'Python', 'Telegram Bot API', 'REST API'],
    featured: false,
    achievement: 'Handled 1,750+ telecom QA pairs'
  },
  {
    title: 'Multi-intent Conversational Agent',
    description: `Rasa-based conversational agent with multiple intents and entity recognition for automated customer interactions.`,
    href: '#', // اگر لینک عمومی ندارید، # بگذارید
    technologies: ['Rasa', 'Python', 'NLP', 'Dialogue Management'],
    featured: false,
    status: 'Under Development'
  }
];

export default projectsData;