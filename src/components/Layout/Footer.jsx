import React from 'react'
import { Link } from 'react-router-dom'
import { Twitter, Linkedin, Github, MessageCircle, Mail } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const productLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Blog', path: '/blog' },
    { name: 'Careers', path: '/careers' },
  ]

  const resourceLinks = [
    { name: 'Docs', path: '/docs' },
    { name: 'API Docs', path: '/api-docs' },
    { name: 'Support', path: '/support' },
    { name: 'Status', path: '/status' },
  ]

  const socialLinks = [
    { name: 'Twitter', icon: Twitter, url: 'https://twitter.com/shinralabs' },
    { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com/company/shinralabs' },
    { name: 'GitHub', icon: Github, url: 'https://github.com/shinralabs' },
    { name: 'Discord', icon: MessageCircle, url: 'https://discord.gg/shinralabs' },
    { name: 'Email', icon: Mail, url: 'mailto:hello@shinralabs.com' },
  ]

  return (
    <footer className="border-t border-border-light bg-bg-secondary">
      <div className="container mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-text-primary font-bold text-lg">SHINRA Labs</span>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed">
              India's #1 Data Labeling Platform
            </p>
            <div className="space-y-1 text-text-tertiary text-sm">
              <p>© {currentYear} SHINRA Labs</p>
              <p className="flex items-center space-x-1">
                <span>Built with</span>
                <span className="text-red-500">❤️</span>
                <span>in India</span>
              </p>
            </div>
          </div>

          {/* Column 2: Product */}
          <div>
            <h3 className="text-text-primary font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-text-secondary hover:text-accent-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h3 className="text-text-primary font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-text-secondary hover:text-accent-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-accent-success/10 border border-accent-success/20">
              <div className="w-2 h-2 bg-accent-success rounded-full animate-pulse"></div>
              <span className="text-accent-success text-xs font-medium">
                All systems operational ✅
              </span>
            </div>
          </div>

          {/* Column 4: Social */}
          <div>
            <h3 className="text-text-primary font-semibold mb-4">Connect</h3>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-bg-tertiary hover:bg-accent-primary/10 hover:text-accent-primary transition-all group"
                    aria-label={social.name}
                  >
                    <Icon size={20} className="text-text-secondary group-hover:text-accent-primary transition-colors" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-border-color">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-text-tertiary text-sm">
              <Link to="/privacy" className="hover:text-accent-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-accent-primary transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="hover:text-accent-primary transition-colors">
                Cookie Policy
              </Link>
            </div>
            <div className="text-text-tertiary text-sm">
              Made with care for AI builders worldwide
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
