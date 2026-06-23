import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Alexey Samoylov',
  description: 'Go tools, agent workflows, and infrastructure automation.',
  base: '/',
  cleanUrls: true,
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: 'Projects', link: '/projects' },
      { text: 'GitHub', link: 'https://github.com/metalagman' },
      { text: 'Telegram', link: 'https://t.me/metalagman' },
      { text: 'LinkedIn', link: 'https://www.linkedin.com/in/alexey-samoylov-10469b39' }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/metalagman' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/in/alexey-samoylov-10469b39' }
    ],
    footer: {
      message: 'Go tools, agent workflows, and infrastructure automation.',
      copyright: 'Copyright © 2026 Alexey Samoylov'
    }
  }
})
