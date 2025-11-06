/**
 * SEED LIST - Initial QA Influencers
 *
 * This is a curated list based on multiple sources:
 * - The CTO Club
 * - Echo Global Tech
 * - Katalon
 * - Applitools
 * - Aqua Cloud
 * - Ministry of Testing
 * - GitHub Awesome Lists
 *
 * These professionals are widely recognized in the QA community.
 * You'll need to visit their LinkedIn profiles ONCE to get initial follower counts.
 * After that, the weekly monitoring system will update automatically.
 */

import { ProfileConfig } from '../scraper/config';

export const SEED_PROFILES: ProfileConfig[] = [
  // Top Tier (mentioned in 5+ sources)
  {
    id: 'angie-jones',
    name: 'Angie Jones',
    linkedinUsername: 'angiejones',
    linkedinUrl: 'https://www.linkedin.com/in/angiejones/',
    location: {
      country: 'United States',
      countryCode: 'US',
    },
    title: 'VP of Developer Relations / Director Test Automation University',
    company: 'Applitools',
    enabled: true,
  },
  {
    id: 'joe-colantonio',
    name: 'Joe Colantonio',
    linkedinUsername: 'joecolantonio',
    linkedinUrl: 'https://www.linkedin.com/in/joecolantonio/',
    location: {
      country: 'United States',
      countryCode: 'US',
    },
    title: 'Founder & Test Automation Expert',
    company: 'TestGuild',
    enabled: true,
  },
  {
    id: 'bas-dijkstra',
    name: 'Bas Dijkstra',
    linkedinUsername: 'basdijkstra',
    linkedinUrl: 'https://www.linkedin.com/in/basdijkstra/',
    location: {
      country: 'Netherlands',
      countryCode: 'NL',
    },
    title: 'Test Automation Consultant',
    company: 'Self-employed',
    enabled: true,
  },
  {
    id: 'alan-richardson',
    name: 'Alan Richardson',
    linkedinUsername: 'eviltester',
    linkedinUrl: 'https://www.linkedin.com/in/eviltester/',
    location: {
      country: 'United Kingdom',
      countryCode: 'GB',
    },
    title: 'Software Testing Consultant',
    company: 'Evil Tester',
    enabled: true,
  },
  {
    id: 'richard-bradshaw',
    name: 'Richard Bradshaw',
    linkedinUsername: 'friendlytester',
    linkedinUrl: 'https://www.linkedin.com/in/friendlytester/',
    location: {
      country: 'United Kingdom',
      countryCode: 'GB',
    },
    title: 'CEO & Co-Founder',
    company: 'Ministry of Testing',
    enabled: true,
  },

  // High Profile (mentioned in 3-4 sources)
  {
    id: 'lisa-crispin',
    name: 'Lisa Crispin',
    linkedinUsername: 'lisa-crispin',
    linkedinUrl: 'https://www.linkedin.com/in/lisa-crispin/',
    location: {
      country: 'United States',
      countryCode: 'US',
    },
    title: 'Agile Testing Coach & Author',
    company: 'Independent',
    enabled: true,
  },
  {
    id: 'kristel-kruustuk',
    name: 'Kristel Kruustuk',
    linkedinUsername: 'kristelkruustuk',
    linkedinUrl: 'https://www.linkedin.com/in/kristelkruustuk/',
    location: {
      country: 'United States',
      countryCode: 'US',
    },
    title: 'Founder & Chief Testing Officer',
    company: 'Testlio',
    enabled: true,
  },
  {
    id: 'maaret-pyhajarvi',
    name: 'Maaret Pyhäjärvi',
    linkedinUsername: 'maaret',
    linkedinUrl: 'https://www.linkedin.com/in/maaret/',
    location: {
      country: 'Finland',
      countryCode: 'FI',
    },
    title: 'Principal Test Engineer',
    company: 'Vaisala',
    enabled: true,
  },
  {
    id: 'james-bach',
    name: 'James Bach',
    linkedinUsername: 'jamesmarcusbach',
    linkedinUrl: 'https://www.linkedin.com/in/jamesmarcusbach/',
    location: {
      country: 'United States',
      countryCode: 'US',
    },
    title: 'Author & Consultant',
    company: 'Satisfice',
    enabled: true,
  },
  {
    id: 'michael-bolton',
    name: 'Michael Bolton',
    linkedinUsername: 'michael-bolton-08847',
    linkedinUrl: 'https://www.linkedin.com/in/michael-bolton-08847/',
    location: {
      country: 'Canada',
      countryCode: 'CA',
    },
    title: 'Testing & Consulting',
    company: 'DevelopSense',
    enabled: true,
  },

  // Brazil QAs (for national ranking)
  {
    id: 'julio-de-lima',
    name: 'Júlio de Lima',
    linkedinUsername: 'juliodelimaqa',
    linkedinUrl: 'https://www.linkedin.com/in/juliodelimaqa/',
    location: {
      country: 'Brazil',
      countryCode: 'BR',
      state: 'São Paulo',
      stateCode: 'SP',
    },
    title: 'QA Consultant',
    company: 'Iterasys',
    enabled: true,
  },
  {
    id: 'elias-nogueira',
    name: 'Elias Nogueira',
    linkedinUsername: 'eliasnogueira',
    linkedinUrl: 'https://www.linkedin.com/in/eliasnogueira/',
    location: {
      country: 'Brazil',
      countryCode: 'BR',
      state: 'São Paulo',
      stateCode: 'SP',
    },
    title: 'Senior Software Engineer in Test',
    company: 'Backbase',
    enabled: true,
  },

  // Selenium/Automation Pioneers
  {
    id: 'jason-huggins',
    name: 'Jason Huggins',
    linkedinUsername: 'jasonhuggins',
    linkedinUrl: 'https://www.linkedin.com/in/jasonhuggins/',
    location: {
      country: 'United States',
      countryCode: 'US',
    },
    title: 'Creator of Selenium',
    company: 'Tapster Robotics',
    enabled: true,
  },
  {
    id: 'dave-haeffner',
    name: 'Dave Haeffner',
    linkedinUsername: 'davehaeffner',
    linkedinUrl: 'https://www.linkedin.com/in/davehaeffner/',
    location: {
      country: 'United States',
      countryCode: 'US',
    },
    title: 'Selenium Expert',
    company: 'Elemental Selenium',
    enabled: true,
  },

  // Additional Notable QAs
  {
    id: 'alan-page',
    name: 'Alan Page',
    linkedinUsername: 'alanpage',
    linkedinUrl: 'https://www.linkedin.com/in/alanpage/',
    location: {
      country: 'United States',
      countryCode: 'US',
    },
    title: 'Director of Quality Engineering',
    company: 'ThoughtWorks',
    enabled: true,
  },
  {
    id: 'janet-gregory',
    name: 'Janet Gregory',
    linkedinUsername: 'janetgregoryca',
    linkedinUrl: 'https://www.linkedin.com/in/janetgregoryca/',
    location: {
      country: 'Canada',
      countryCode: 'CA',
    },
    title: 'Agile Testing Coach',
    company: 'DragonFire Inc',
    enabled: true,
  },
  {
    id: 'nikolay-advolodkin',
    name: 'Nikolay Advolodkin',
    linkedinUsername: 'nikolayadvolodkin',
    linkedinUrl: 'https://www.linkedin.com/in/nikolayadvolodkin/',
    location: {
      country: 'United States',
      countryCode: 'US',
    },
    title: 'Founder & CEO',
    company: 'Ultimate QA',
    enabled: true,
  },
  {
    id: 'kristin-jackvony',
    name: 'Kristin Jackvony',
    linkedinUsername: 'kristinjackvony',
    linkedinUrl: 'https://www.linkedin.com/in/kristinjackvony/',
    location: {
      country: 'United States',
      countryCode: 'US',
    },
    title: 'Engineering Manager',
    company: 'Guild Education',
    enabled: true,
  },
  {
    id: 'paul-grizzaffi',
    name: 'Paul Grizzaffi',
    linkedinUsername: 'pgrizzaffi',
    linkedinUrl: 'https://www.linkedin.com/in/pgrizzaffi/',
    location: {
      country: 'United States',
      countryCode: 'US',
    },
    title: 'Lead QA Automation Engineer',
    company: 'Sauce Labs',
    enabled: true,
  },
  {
    id: 'simon-stewart',
    name: 'Simon Stewart',
    linkedinUsername: 'shs96c',
    linkedinUrl: 'https://www.linkedin.com/in/shs96c/',
    location: {
      country: 'United Kingdom',
      countryCode: 'GB',
    },
    title: 'Creator of WebDriver',
    company: 'Independent',
    enabled: true,
  },
  {
    id: 'jim-evans',
    name: 'Jim Evans',
    linkedinUsername: 'jim-evans-selenium',
    linkedinUrl: 'https://www.linkedin.com/in/jim-evans-selenium/',
    location: {
      country: 'United States',
      countryCode: 'US',
    },
    title: 'Selenium Committer',
    company: 'Independent',
    enabled: true,
  },
];

/**
 * Get all enabled profiles
 */
export function getEnabledProfiles(): ProfileConfig[] {
  return SEED_PROFILES.filter(p => p.enabled);
}

/**
 * Get profile by ID
 */
export function getProfileById(id: string): ProfileConfig | undefined {
  return SEED_PROFILES.find(p => p.id === id);
}

/**
 * Get profiles by country
 */
export function getProfilesByCountry(countryCode: string): ProfileConfig[] {
  return SEED_PROFILES.filter(p => p.location.countryCode === countryCode && p.enabled);
}
