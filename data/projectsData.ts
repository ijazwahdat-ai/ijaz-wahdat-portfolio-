interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] =[
  {
    title: 'Afghan Telecom LLaMA (MCIT)',
    description: `Afghanistan's first domain-specific LLM engineered for the Ministry of Communications and IT. Fine-tuned Llama-2-7B using QLoRA on a custom dataset of 1,750 telecom Q&A pairs. Achieved 89% factual accuracy. Click to view the video demonstration and system screenshots.`,
    imgSrc: '/static/images/chatbot.jpg',
    href: '/blog/mcit-project-demo', // این لینک کاربر را به صفحه‌ای می‌برد که ویدیو در آن است
  },
  {
    title: 'Shin Ghazi Baba PVC Smart Assistant',
    description: `An intelligent, database-driven conversational AI embedded directly into the company's website. It provides customers with accurate, real-time product information and dynamic pricing. Features full trilingual support (Dari, Pashto, and English) to maximize customer engagement and streamline business operations.`,
    imgSrc: '/static/images/pvc-bot.jpg',
  },
  {
    title: 'Shining Stars Academy AI Assistant',
    description: `A custom-built, web-embedded conversational agent designed for Shining Stars Online Academy. It instantly answers student and parent inquiries regarding course details, registration processes, and academy policies, ensuring 24/7 automated support and enhanced user experience.`,
    imgSrc: '/static/images/academy-bot.jpg', // عکسی که از سایت آکادمی فرستادید را برای این گذاشتیم
  },
  {
    title: 'Academy Automation System',
    description: `An end-to-end automation solution streamlining student registration and reporting. Integrated Google Forms, Sheets, and Apps Script with a Telegram Bot to automate workflows. Reduces manual administrative overhead and provides real-time notifications for educational institutions.`,
    imgSrc: '/static/images/system.jpg',
    href: 'https://github.com/ijazwahdat-ai/academy-automation-system',
  },
  {
    title: 'Multi-intent Trilingual Chatbot (Rasa)',
    description: `An intelligent conversational agent built with the Rasa framework, featuring trilingual support (Pashto, Dari, English). Integrated with a live Weather API to provide real-time forecasts for all 34 provinces of Afghanistan. Capable of handling diverse user intents ranging from Islamic guidance to healthcare.`,
    imgSrc: '/static/images/rasa-bot1.jpg',
  },
]

export default projectsData