'use client';

import { Globe, Instagram, Linkedin, Twitter } from 'lucide-react';

const currentYear = new Date().getFullYear();

const socialLinks = [
  {
    name: 'Instagram',
    icon: Instagram,
    href: 'https://www.instagram.com/join.jumbo/',
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    href: 'https://linkedin.com/company/joinjumbo/',
  },
  {
    name: 'Twitter',
    icon: Twitter,
    href: 'https://twitter.com/joinjumbo',
  },
  {
    name: 'Website',
    icon: Globe,
    href: 'https://joinjumbo.com',
  },
];

export function Footer() {
  return (
    <footer className='border-t border-border bg-card/50'>
      <div className='px-8 py-4'>
        <div className='flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0'>
          <div className='flex flex-col items-center md:items-start space-y-2'>
            <h2 className='text-xl font-semibold text-foreground'>Jumbo</h2>
            <p className='text-muted-foreground'>
              © {currentYear} Jumbo. All rights reserved.
            </p>
          </div>

          <div className='flex items-center space-x-4'>
            {socialLinks.map(social => (
              <a
                key={social.name}
                href={social.href}
                target='_blank'
                rel='noopener noreferrer'
                className='p-2 text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-lg hover:bg-accent'
                aria-label={social.name}
              >
                <social.icon className='w-5 h-5' />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
