export interface BlogPost {
  slug: string
  category: string
  title: string
  excerpt: string
  author: string
  date: string
  readTime: string
  img: string
  featured: boolean
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: '1', category: 'Industry News',
    title: '10 Shipping Trends That Will Define Logistics in 2025',
    excerpt: 'From AI-powered route optimisation to green freight initiatives, these are the forces reshaping global supply chains this year.',
    author: 'James Okonkwo', date: 'May 18, 2025', readTime: '6 min read',
    img: 'https://images.pexels.com/photos/1427541/pexels-photo-1427541.jpeg?auto=compress&w=800',
    featured: true,
  },
  {
    slug: '2', category: 'Tips & Guides',
    title: 'How to Prepare Your Shipment for Customs Clearance',
    excerpt: 'A step-by-step guide to getting your documentation right the first time and avoiding costly delays at the border.',
    author: 'Amina Hassan', date: 'May 12, 2025', readTime: '8 min read',
    img: 'https://images.pexels.com/photos/906982/pexels-photo-906982.jpeg?auto=compress&w=800',
    featured: false,
  },
  {
    slug: '3', category: 'Company News',
    title: 'Accessiblexpress Expands to 12 New Countries Across Southeast Asia',
    excerpt: "We're thrilled to announce same-day and next-day delivery capabilities in Thailand, Vietnam, Indonesia, and 9 more markets.",
    author: 'Accessiblexpress Team', date: 'May 5, 2025', readTime: '3 min read',
    img: 'https://images.pexels.com/photos/358319/pexels-photo-358319.jpeg?auto=compress&w=800',
    featured: false,
  },
  {
    slug: '4', category: 'Tips & Guides',
    title: 'Air vs Ocean Freight: Which Is Right for Your Business?',
    excerpt: 'We break down cost, speed, reliability, and carbon impact so you can make the best decision for every shipment.',
    author: 'David Mensah', date: 'Apr 28, 2025', readTime: '7 min read',
    img: 'https://images.pexels.com/photos/1427541/pexels-photo-1427541.jpeg?auto=compress&w=800',
    featured: false,
  },
  {
    slug: '5', category: 'Industry News',
    title: 'The Rise of On-Demand Freight: What It Means for SMEs',
    excerpt: "Small and medium businesses now have access to enterprise-grade logistics. Here's how on-demand freight is levelling the playing field.",
    author: 'Sarah Adeyemi', date: 'Apr 20, 2025', readTime: '5 min read',
    img: 'https://images.pexels.com/photos/906982/pexels-photo-906982.jpeg?auto=compress&w=800',
    featured: false,
  },
  {
    slug: '6', category: 'Company News',
    title: 'Introducing Real-Time SMS Tracking for All Shipments',
    excerpt: 'No app required. Every shipment now sends automatic SMS updates at every milestone, keeping your customers informed end to end.',
    author: 'Accessiblexpress Team', date: 'Apr 10, 2025', readTime: '2 min read',
    img: 'https://images.pexels.com/photos/358319/pexels-photo-358319.jpeg?auto=compress&w=800',
    featured: false,
  },
]
