export type Category = 'services' | 'freight' | 'movers' | 'customs'

export type IconPath = string | string[]

export interface ServiceDetail {
  slug: string
  icon: IconPath
  title: string
  desc: string
  longDesc: string
  features: string[]
  img: string
  to: string
  featured?: boolean
}

// ── Services ────────────────────────────────────────────────────────────────
export const SERVICES_CATALOG: ServiceDetail[] = [
  {
    slug: 'express-delivery',
    icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z',
    title: 'Express Delivery',
    desc: 'Same-day & next-day parcel delivery',
    longDesc: 'When speed is everything, our Express service guarantees same-day delivery domestically and next-day delivery internationally, with real-time GPS tracking every step of the way. Pickup within 2 hours of booking, dedicated couriers, and proof of delivery on every parcel.',
    features: [
      'Same-day pickup within 2 hours of booking',
      'Next-day international delivery to 120+ countries',
      'Live GPS tracking from pickup to signature',
      'Photo & digital signature proof of delivery',
      'Dedicated express courier network, no shared routes',
    ],
    img: 'https://images.pexels.com/photos/4246019/pexels-photo-4246019.jpeg?auto=compress&cs=tinysrgb&w=1200&h=700&fit=crop',
    to: '/services/express-delivery',
    featured: false,
  },
  {
    slug: 'warehousing',
    icon: ['M3 9.5L12 3l9 6.5V21H3V9.5z', 'M9 21V12h6v9'],
    title: 'Warehousing & Fulfillment',
    desc: 'Storage & fulfilment in 50+ locations',
    longDesc: 'Climate-controlled storage across 50+ locations worldwide, with pick, pack & ship handled end-to-end through a live inventory management portal. Whether you need short-term overflow storage or a full fulfilment operation, our warehousing network scales with your business.',
    features: [
      'Climate-controlled storage in 50+ global locations',
      'Real-time inventory dashboard with stock alerts',
      'Pick, pack & ship — same-day order processing',
      'Returns processing & reverse logistics included',
      'Barcode & RFID inventory tracking',
    ],
    img: 'https://images.pexels.com/photos/1797428/pexels-photo-1797428.jpeg?auto=compress&cs=tinysrgb&w=1200&h=700&fit=crop',
    to: '/services/warehousing',
    featured: true,
  },
]

// ── Freight ─────────────────────────────────────────────────────────────────
export const FREIGHT_CATALOG: ServiceDetail[] = [
  {
    slug: 'air-freight',
    icon: 'M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5',
    title: 'Air Freight',
    desc: '500+ airports · 2–4 day transit',
    longDesc: 'Access 500+ airports worldwide with 2–4 day international transit times. Every air shipment includes full customs documentation, dangerous goods certification where required, and optional temperature-controlled handling for sensitive cargo.',
    features: [
      '500+ airports served across 6 continents',
      '2–4 day international transit as standard',
      'Dangerous goods (DG) certified handling',
      'Temperature-controlled options for pharma & perishables',
      'Full customs documentation prepared for you',
    ],
    img: 'https://images.pexels.com/photos/747679/pexels-photo-747679.jpeg?auto=compress&cs=tinysrgb&w=1200&h=700&fit=crop',
    to: '/freight/air-freight',
    featured: false,
  },
  {
    slug: 'ocean-freight',
    icon: ['M12 3v4', 'M3 17l2-6h14l2 6H3z', 'M1 21h22', 'M7 11V7a5 5 0 0110 0v4'],
    title: 'Ocean Freight',
    desc: '300+ ports · FCL & LCL options',
    longDesc: 'The most economical way to move bulk cargo. FCL and LCL options to 300+ ports globally, with door-to-door or port-to-port service and real-time container tracking so you always know exactly where your shipment is.',
    features: [
      'FCL (Full Container Load) & LCL (shared container) options',
      '300+ ports served worldwide',
      'Door-to-door or port-to-port service',
      'Real-time container-level tracking',
      'Competitive rates on all major trade lanes',
    ],
    img: 'https://images.pexels.com/photos/906982/pexels-photo-906982.jpeg?auto=compress&cs=tinysrgb&w=1200&h=700&fit=crop',
    to: '/freight/ocean-freight',
    featured: true,
  },
  {
    slug: 'road-freight',
    icon: ['M9 17a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0z', 'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l1 1h1m8-1V8h3l3 3v4l1 1h-1m-6 0h-3'],
    title: 'Road Freight',
    desc: '2,000+ vehicles · cross-border routes',
    longDesc: 'Our fleet of 2,000+ vehicles covers major trade corridors across Africa, Europe, and Asia. Full truckload (FTL) and less-than-truckload (LTL) options, with refrigerated and oversize cargo capability, all tracked live from pickup to delivery.',
    features: [
      '2,000+ vehicle fleet across major trade corridors',
      'FTL & LTL options for any shipment size',
      'Refrigerated & oversize cargo capability',
      'Cross-border customs handling included',
      'Live GPS tracking on every route',
    ],
    img: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1200&h=700&fit=crop',
    to: '/freight/road-freight',
    featured: false,
  },
  {
    slug: 'soc-movements',
    icon: 'M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9',
    title: 'SOC Movements',
    desc: "Shipper-owned container management",
    longDesc: 'Full visibility on your shipper-owned containers (SOC) across multi-leg journeys. We manage depot positioning, empty returns, and container maintenance, with a dedicated coordinator tracking every leg of the movement.',
    features: [
      'End-to-end shipper-owned container tracking',
      'Depot positioning & empty container returns',
      'Container condition & maintenance reporting',
      'Dedicated SOC coordinator for every account',
      'Multi-leg journey visibility in one dashboard',
    ],
    img: 'https://images.pexels.com/photos/1427107/pexels-photo-1427107.jpeg?auto=compress&cs=tinysrgb&w=1200&h=700&fit=crop',
    to: '/freight/soc-movements',
    featured: true,
  },
]

// ── Movers ──────────────────────────────────────────────────────────────────
export const MOVERS_CATALOG: ServiceDetail[] = [
  {
    slug: 'household-goods',
    icon: 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25',
    title: 'Household Relocation',
    desc: 'Residential home moving',
    longDesc: 'From studio apartments to large family homes, we pack, load, transport, and unpack your belongings with the care they deserve — including specialty handling for pianos, antiques, and fine art.',
    features: [
      'Full-service packing with professional materials',
      'Specialty handling for pianos, antiques & fine art',
      'Furniture disassembly & reassembly on arrival',
      'Fully insured against loss or damage',
      'Flexible scheduling, including weekends',
    ],
    img: 'https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg?auto=compress&cs=tinysrgb&w=1200&h=700&fit=crop',
    to: '/movers/household-goods',
    featured: false,
  },
  {
    slug: 'commercial-goods',
    icon: 'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21',
    title: 'Commercial & Office Moving',
    desc: 'Office & business relocation',
    longDesc: 'Our commercial moving team executes office and business relocations outside business hours to minimise disruption — from desks and workstations to server rooms and sensitive equipment, all coordinated by a dedicated project manager.',
    features: [
      'Out-of-hours moves to avoid business disruption',
      'IT & server room relocation specialists',
      'Dedicated project coordinator for the full move',
      'Asset tagging & inventory tracking',
      'Same-day setup so you\'re operational the next morning',
    ],
    img: 'https://images.pexels.com/photos/1797428/pexels-photo-1797428.jpeg?auto=compress&cs=tinysrgb&w=1200&h=700&fit=crop',
    to: '/movers/commercial-goods',
    featured: true,
  },
  {
    slug: 'international-moving',
    icon: 'M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418',
    title: 'International Relocation',
    desc: 'Cross-border relocation service',
    longDesc: 'We manage the entire international move from start to finish — pre-move surveys, customs clearance, export and import documentation, door-to-door worldwide delivery, and settling-in support once you arrive.',
    features: [
      'Free pre-move survey & detailed cost estimate',
      'Customs clearance & export/import documentation handled',
      'Door-to-door delivery in 120+ countries',
      'Marine transit insurance included',
      'Destination settling-in support',
    ],
    img: 'https://images.pexels.com/photos/5025521/pexels-photo-5025521.jpeg?auto=compress&cs=tinysrgb&w=1200&h=700&fit=crop',
    to: '/movers/international-moving',
    featured: false,
  },
  {
    slug: 'storage-packing',
    icon: 'M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z',
    title: 'Storage & Packing',
    desc: 'Secure short & long-term storage',
    longDesc: 'Secure, climate-controlled storage available on a short or long-term basis, with 24/7 CCTV monitoring. Professional packing materials and fragile-item wrapping are included, and you can access your items whenever you need to.',
    features: [
      'Climate-controlled units, short or long-term',
      '24/7 CCTV monitoring & secure access',
      'Professional packing materials & fragile wrapping',
      'Flexible access to your stored items anytime',
      'Inventory list provided for every storage booking',
    ],
    img: 'https://images.pexels.com/photos/4246019/pexels-photo-4246019.jpeg?auto=compress&cs=tinysrgb&w=1200&h=700&fit=crop',
    to: '/movers/storage-packing',
    featured: true,
  },
]

// ── Customs ─────────────────────────────────────────────────────────────────
export const CUSTOMS_CATALOG: ServiceDetail[] = [
  {
    slug: 'import-clearance',
    icon: 'M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3',
    title: 'Import Clearance',
    desc: 'Full import & export clearance',
    longDesc: 'Our licensed customs brokers manage the full import clearance process — classification, duty calculation, entry filing, and release — so your goods clear customs without delays or penalties.',
    features: [
      'HS code classification by licensed brokers',
      'Duty & tax calculation with no surprises',
      'Electronic entry filing at every port',
      '24-hour clearance guarantee',
      'Direct handling of customs queries on your behalf',
    ],
    img: 'https://images.pexels.com/photos/6169668/pexels-photo-6169668.jpeg?auto=compress&cs=tinysrgb&w=1200&h=700&fit=crop',
    to: '/customs/import-clearance',
    featured: false,
  },
  {
    slug: 'export-clearance',
    icon: 'M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5',
    title: 'Export Clearance',
    desc: 'Export declarations & permit filing',
    longDesc: 'We prepare all export declarations, obtain necessary permits, and ensure your shipment departs without regulatory issues — with electronic filing at all ports and proactive monitoring of changing export rules.',
    features: [
      'Export declaration preparation & filing',
      'Permit & licence applications handled for you',
      'Electronic filing at all major ports',
      'Restricted & controlled goods compliance checks',
      'Real-time status updates until departure',
    ],
    img: 'https://images.pexels.com/photos/4483942/pexels-photo-4483942.jpeg?auto=compress&cs=tinysrgb&w=1200&h=700&fit=crop',
    to: '/customs/export-clearance',
    featured: true,
  },
  {
    slug: 'trade-consulting',
    icon: 'M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18',
    title: 'Trade Consulting',
    desc: 'Tariff optimisation & FTA advice',
    longDesc: 'Our trade compliance consultants help you understand regulations, optimise duty payments, and avoid costly errors — including free trade agreement (FTA) eligibility analysis and staff compliance training.',
    features: [
      'Free trade agreement (FTA) eligibility analysis',
      'Tariff classification review & duty optimisation',
      'Trade compliance training for your staff',
      'Regulatory change monitoring for your industry',
      'Audit support & documentation review',
    ],
    img: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200&h=700&fit=crop',
    to: '/customs/trade-consulting',
    featured: false,
  },
  {
    slug: 'importer-representative',
    icon: ['M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z', 'M4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z'],
    title: "Importer's Representative",
    desc: 'Local compliance & IOR services',
    longDesc: 'We act as your official importer of record (IOR) in markets that require a local representative — assuming full compliance responsibility on your behalf in 50+ countries, so you can trade without a local legal entity.',
    features: [
      'Importer of record (IOR) service in 50+ countries',
      'No local legal entity required',
      'Full compliance responsibility assumed on your behalf',
      'Local tax registration & reporting handled',
      'Single point of contact across all markets',
    ],
    img: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1200&h=700&fit=crop',
    to: '/customs/importer-representative',
    featured: true,
  },
]

export const CATALOGS: Record<Category, ServiceDetail[]> = {
  services: SERVICES_CATALOG,
  freight: FREIGHT_CATALOG,
  movers: MOVERS_CATALOG,
  customs: CUSTOMS_CATALOG,
}

export const CATEGORY_META: Record<Category, { label: string; path: string }> = {
  services: { label: 'Services', path: '/services' },
  freight:  { label: 'Freight',  path: '/freight' },
  movers:   { label: 'Movers',   path: '/movers' },
  customs:  { label: 'Customs',  path: '/customs' },
}
