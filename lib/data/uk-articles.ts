export interface UkArticle {
  tag: string
  title: string
  imagePath: string
}

export const ukArticles: UkArticle[] = [
  {
    tag: 'POLICY & INCENTIVES',
    title: 'UK Solar Grants 2026',
    imagePath: '/static/images/article-placeholder.webp',
  },
  {
    tag: 'BUYING GUIDE',
    title: 'How to Choose the Right Solar System?',
    imagePath: '/static/images/article-placeholder.webp',
  },
  {
    tag: 'TECHNOLOGY',
    title: 'Battery Storage 101: Everything You Need to Know',
    imagePath: '/static/images/article-placeholder.webp',
  },
]

export interface UkFaq {
  q: string
  a: string
}

export const ukFaqItem: UkFaq = {
  q: 'Top 20 Frequently Asked Questions',
  a: 'Get answers about installation, savings, eligibility, and after-sales support for UK home solar systems.',
}