import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Instagram, 
  Facebook, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  CreditCard,
  Truck,
  ShieldCheck,
  Leaf
} from 'lucide-react';
import { fadeUpVariants, staggerContainerVariants } from '@/lib/animations';

export function Footer() {
  const footerLinks = {
    products: [
      { name: 'Soins Visage', href: '/catalog/soins-visage' },
      { name: 'Soins Corps', href: '/catalog/soins-corps' },
      { name: 'Soins Cheveux', href: '/catalog/soins-cheveux' },
      { name: 'Maquillage', href: '/catalog/maquillage' },
      { name: 'Parfums', href: '/catalog/parfums' },
      { name: 'Bien-être', href: '/catalog/bien-etre' },
    ],
    company: [
      { name: 'Notre Histoire', href: '/about' },
      { name: 'Nos Engagements', href: '/commitments' },
      { name: 'Nos Ingrédients', href: '/ingredients' },
      { name: 'Carrières', href: '/careers' },
      { name: 'Presse', href: '/press' },
    ],
    support: [
      { name: 'Contact', href: '/contact' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Livraison', href: '/shipping' },
      { name: 'Retours', href: '/returns' },
      { name: 'Guide des tailles', href: '/size-guide' },
    ],
    legal: [
      { name: 'CGV', href: '/terms' },
      { name: 'Politique de confidentialité', href: '/privacy' },
      { name: 'Mentions légales', href: '/legal' },
      { name: 'Cookies', href: '/cookies' },
    ],
  };

  const socialLinks = [
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Youtube', icon: Youtube, href: '#' },
  ];

  return (
    <footer className="bg-muted/50 border-t border-border">
      {/* Features bar */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <motion.div 
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { icon: Truck, title: 'Livraison gratuite', desc: 'Dès 500 MAD d\'achat' },
              { icon: ShieldCheck, title: 'Paiement sécurisé', desc: '100% sécurisé' },
              { icon: Leaf, title: 'Produits naturels', desc: 'Ingrédients bio' },
              { icon: CreditCard, title: 'Satisfait ou remboursé', desc: '30 jours pour retourner' },
            ].map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeUpVariants}
                className="flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-botanical-100 dark:bg-botanical-900/30 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-botanical-600" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <motion.div 
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8"
        >
          {/* Brand */}
          <motion.div variants={fadeUpVariants} className="col-span-2">
            <Link to="/" className="inline-block mb-4">
              <span className="font-display text-2xl font-semibold">Lumière</span>
              <span className="font-display text-lg font-light text-botanical-500 ml-1">Botanical</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              Des cosmétiques naturels et respectueux de votre peau, 
              formulés avec les meilleurs ingrédients botaniques.
            </p>
            
            {/* Contact info */}
            <div className="space-y-2 text-sm">
              <a href="mailto:contact@lumiere-botanical.ma" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="w-4 h-4" />
                contact@lumiere-botanical.ma
              </a>
              <a href="tel:+212522123456" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <Phone className="w-4 h-4" />
                +212 522 123 456
              </a>
              <p className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                Casablanca, Maroc
              </p>
            </div>
          </motion.div>

          {/* Products */}
          <motion.div variants={fadeUpVariants}>
            <h4 className="font-medium mb-4">Produits</h4>
            <ul className="space-y-2">
              {footerLinks.products.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div variants={fadeUpVariants}>
            <h4 className="font-medium mb-4">L'entreprise</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div variants={fadeUpVariants}>
            <h4 className="font-medium mb-4">Aide</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div variants={fadeUpVariants}>
            <h4 className="font-medium mb-4">Newsletter</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Inscrivez-vous pour recevoir nos offres exclusives.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Votre email"
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-botanical-500"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-botanical-600 text-white rounded-lg text-sm font-medium hover:bg-botanical-700 transition-colors"
              >
                S'inscrire
              </button>
            </form>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Lumière Botanical. Tous droits réservés.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            {/* Legal links */}
            <div className="flex items-center gap-4 text-sm">
              {footerLinks.legal.map((link, index) => (
                <span key={link.name} className="flex items-center gap-4">
                  <Link 
                    to={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                  {index < footerLinks.legal.length - 1 && (
                    <span className="text-border">|</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
