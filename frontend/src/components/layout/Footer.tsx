import React from 'react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="bg-slate-900/95 backdrop-blur-sm border-t border-amber-400/20 mt-auto"
    >
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Quote Section */}
        <div className="text-center mb-12">
          <blockquote className="text-lg italic text-slate-400">
            "Rewiring human connection, one conversation at a time."
          </blockquote>
        </div>

        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 120 120" className="w-5 h-5 fill-slate-900">
                  <rect x="45" y="57" width="30" height="6" rx="3"/>
                  <circle cx="45" cy="60" r="6" fill="none" stroke="currentColor" strokeWidth="3"/>
                  <circle cx="75" cy="60" r="6" fill="none" stroke="currentColor" strokeWidth="3"/>
                </svg>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                Bridge
              </span>
            </div>
            <p className="text-slate-400 mb-6 max-w-md">
              Bridge, derived from the concept of "neural bridging," is an AI+BCI platform that turns 
              your communication challenges into lasting neural improvements.
            </p>
            <div className="text-slate-500 text-sm mb-6">© 2025 Bridge AI</div>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {[
                { icon: 'fab fa-linkedin-in', href: '#', label: 'LinkedIn' },
                { icon: 'fab fa-x-twitter', href: '#', label: 'Twitter' },
                { icon: 'fab fa-youtube', href: '#', label: 'YouTube' },
                { icon: 'fab fa-github', href: '#', label: 'GitHub' }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-amber-400/10 border border-amber-400/30 rounded-lg flex items-center justify-center text-slate-400 hover:bg-amber-400 hover:text-slate-900 transition-colors duration-200"
                >
                  <i className={social.icon}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-amber-400 font-semibold mb-4">Platform</h4>
            <ul className="space-y-3">
              <li><a href="/demo.html" className="text-slate-400 hover:text-amber-400 transition-colors duration-200">Neural Training</a></li>
              <li><a href="#" className="text-slate-400 hover:text-amber-400 transition-colors duration-200">BCI Technology</a></li>
              <li><a href="#" className="text-slate-400 hover:text-amber-400 transition-colors duration-200">Success Stories</a></li>
              <li><a href="#" className="text-slate-400 hover:text-amber-400 transition-colors duration-200">Developer API</a></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-amber-400 font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              <li><a href="mailto:investors@bridge-ai.com" className="text-slate-400 hover:text-amber-400 transition-colors duration-200">Investors</a></li>
              <li><a href="mailto:hello@bridge-ai.com" className="text-slate-400 hover:text-amber-400 transition-colors duration-200">Contact us</a></li>
              <li><a href="mailto:careers@bridge-ai.com" className="text-slate-400 hover:text-amber-400 transition-colors duration-200">Careers</a></li>
              <li><a href="mailto:press@bridge-ai.com" className="text-slate-400 hover:text-amber-400 transition-colors duration-200">Press kit</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-amber-400/20 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-slate-500 text-sm">
            Transforming human communication through neuroscience and AI
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-slate-500 hover:text-amber-400 transition-colors duration-200 text-sm">Privacy policy</a>
            <a href="#" className="text-slate-500 hover:text-amber-400 transition-colors duration-200 text-sm">Terms of service</a>
            <a href="#" className="text-slate-500 hover:text-amber-400 transition-colors duration-200 text-sm">Security</a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;