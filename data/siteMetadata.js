/** @type {import("pliny/config").PlinyConfig } */
const siteMetadata = {
  title: 'Ijazulhaq Wahdat | AI Engineer',
  author: 'Ijazulhaq Wahdat',
  headerTitle: 'Ijazulhaq Wahdat',
  description: 'Portfolio of an AI Agent Engineer specializing in Telecom LLMs, Intelligent Agents, and Enterprise Automation.',
  language: 'en-us',
  theme: 'system', // system, dark or light
  siteUrl: 'https://my-portfolio-two-jet-j.vercel.app',
  siteRepo: 'https://github.com/ijazwahdat-ai',
  siteLogo: `${process.env.BASE_PATH || ''}/static/images/logo.png`,
  socialBanner: `${process.env.BASE_PATH || ''}/static/images/twitter-card.png`,
  email: 'ijazulhaqwahdat01@gmail.com',
  github: 'https://github.com/ijazwahdat-ai',
  linkedin: 'https://www.linkedin.com/in/ijaz-wahdat',
  // شبکه‌های اجتماعی غیرفعال
  mastodon: '',
  x: '',
  facebook: '',
  youtube: '',
  threads: '',
  instagram: '',
  medium: '',
  bluesky: '',
  locale: 'en-US',
  stickyNav: false,
  analytics: {
    umamiAnalytics: {
      umamiWebsiteId: process.env.NEXT_UMAMI_ID,
    },
  },
  newsletter: {
    provider: 'buttondown',
  },
  comments: {
    // کامنت‌ها را غیرفعال کردیم
    provider: '',
    giscusConfig: {
      repo: process.env.NEXT_PUBLIC_GISCUS_REPO,
      repositoryId: process.env.NEXT_PUBLIC_GISCUS_REPOSITORY_ID,
      category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY,
      categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID,
      mapping: 'pathname',
      reactions: '1',
      metadata: '0',
      theme: 'light',
      darkTheme: 'transparent_dark',
      lang: 'en',
    },
  },
  search: {
    provider: 'kbar',
    kbarConfig: {
      searchDocumentsPath: `${process.env.BASE_PATH || ''}/search.json`,
    },
  },
}

module.exports = siteMetadata