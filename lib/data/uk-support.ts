export interface UkSupportItem {
  icon: 'app' | 'warranty' | 'service' | 'knowledge' | 'contact' | 'gdpr' | 'privacy' | 'terms'
  title: string
  description: string
}

export const ukSupportItems: UkSupportItem[] = [
  {
    icon: 'app',
    title: 'HEMS App',
    description: 'Monitor & manage your energy',
  },
  {
    icon: 'warranty',
    title: 'Warranty',
    description: 'Up to 15 Years - Product & Performance',
  },
  {
    icon: 'service',
    title: 'Service Request',
    description: 'Submit a ticket - Get fast help',
  },
  {
    icon: 'knowledge',
    title: 'Knowledge Base',
    description: 'Guides & manuals - Download center',
  },
  {
    icon: 'contact',
    title: 'Contact Us',
    description: 'Call · E-mail or Live Chat - We\'re here!',
  },
  {
    icon: 'gdpr',
    title: 'GDPR Compliant',
    description: 'Your data is protected',
  },
  {
    icon: 'privacy',
    title: 'Secure & Private',
    description: 'We respect your privacy',
  },
  {
    icon: 'terms',
    title: 'Transparent Terms',
    description: 'Clear & fair policies',
  },
]