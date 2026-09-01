export interface UkProduct {
  id: 'essential' | 'storage-core' | 'smart-home' | 'premium-backup'
  name: string
  subtitle: string
  power: string
  storage: string
  priceFrom: number
  features: string[]
  popular?: boolean
  imagePath: string
}

export const ukProducts: UkProduct[] = [
  {
    id: 'essential',
    name: 'Solar Essential',
    subtitle: 'Simple start',
    power: '8 modules',
    storage: '-',
    priceFrom: 8999,
    features: ['Solar: 8 modules', 'Entry-level home generation'],
    imagePath: '/images/Solar_Essential.webp',
  },
  {
    id: 'storage-core',
    name: 'Storage Core',
    subtitle: 'Solar + Storage',
    power: '8 modules',
    storage: '5.12 kWh',
    priceFrom: 12999,
    features: [
      'Solar: 8 modules',
      'Battery: 5.12 kWh',
      'Inverter: 3.6 kW',
      'HEMS direction',
    ],
    popular: true,
    imagePath: '/images/Storage_core.webp',
  },
  {
    id: 'smart-home',
    name: 'Smart Home',
    subtitle: 'More control',
    power: '10 modules',
    storage: '15.36 kWh',
    priceFrom: 19238,
    features: [
      'Battery: 15.36 kWh',
      'Inverter: 5 kW',
      'HEMS',
    ],
    imagePath: '/images/Premium_backup.webp',
  },
  {
    id: 'premium-backup',
    name: 'Premium Backup',
    subtitle: 'Higher storage',
    power: '12 modules',
    storage: '20 kWh',
    priceFrom: 23800,
    features: [
      'Battery: 20 kWh',
      'Inverter: 6 kW',
      'HEMS',
      'Heat Pump pathway',
    ],
    imagePath: '/images/Smart_home.webp',
  },
]

export const ukProductFormatPrice = (n: number): string =>
  `£${n.toLocaleString('en-GB')}`