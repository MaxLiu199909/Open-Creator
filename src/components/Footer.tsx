import React from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, Instagram, Youtube, Mail, ExternalLink } from 'lucide-react';

export default function Footer() {
  const socialLinks = [
    { icon: <Github size={20} />, label: 'GitHub', href: '#' },
    { icon: <Twitter size={20} />, label: 'Twitter', href: '#' },
    { icon: <Instagram size={20} />, label: 'Instagram', href: '#' },
    { icon: <Youtube size={20} />, label: 'YouTube', href: '#' },
  ];

  const navLinks = [
    { label: 'About Us', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Terms', href: '#' },
    { label: 'Privacy', href: '#' },
  ];

  return (
    <footer className="relative mt-32 border-t border-white/10">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/5 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-8 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
              OpenCreator
            </h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Empowering creators with AI-driven tools to bring their visions to life.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <motion.a
                    href={link.href}
                    className="text-white/60 hover:text-white text-sm flex items-center gap-2 transition-colors"
                    whileHover={{ x: 4 }}
                  >
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <motion.a
              href="mailto:hello@opencreator.ai"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-3 transition-colors"
              whileHover={{ x: 4 }}
            >
              <Mail size={16} />
              hello@opencreator.ai
            </motion.a>
            <p className="text-white/40 text-sm">
              123 AI Street<br />
              San Francisco, CA 94105
            </p>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-white mb-4">Stay Updated</h4>
            <div className="relative group">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10
                         text-white placeholder-white/40 text-sm
                         focus:outline-none focus:ring-2 focus:ring-purple-500/30
                         group-hover:border-purple-500/30 transition-all"
              />
              <motion.button
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md
                         text-white/40 hover:text-purple-400 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ExternalLink size={16} />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                className="text-white/60 hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label={social.label}
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} OpenCreator. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}