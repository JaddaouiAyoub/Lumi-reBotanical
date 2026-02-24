import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Leaf, Heart, Star } from 'lucide-react';
import { productApi } from '@/services/api';
import { ProductCard } from '@/components/product/ProductCard';
import { CategoryCard } from '@/components/product/CategoryCard';
import { Button } from '@/components/ui/button';
import { fadeUpVariants, staggerContainerVariants, heroTextVariants } from '@/lib/animations';
import { categories } from '@/data/mockData';
import type { Product } from '@/types';

// Hero Section
function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1920&h=1080&fit=crop"
          alt="Lumière Botanical"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainerVariants}
          className="max-w-2xl"
        >
          <motion.div variants={heroTextVariants} className="mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-botanical-100 dark:bg-botanical-900/30 text-botanical-700 dark:text-botanical-300 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Nouvelle Collection 2024
            </span>
          </motion.div>

          <motion.h1 
            variants={heroTextVariants}
            className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6"
          >
            Révélez votre{' '}
            <span className="text-gradient">beauté naturelle</span>
          </motion.h1>

          <motion.p 
            variants={heroTextVariants}
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg"
          >
            Des cosmétiques premium formulés avec les meilleurs ingrédients botaniques 
            pour sublimer votre peau naturellement.
          </motion.p>

          <motion.div 
            variants={heroTextVariants}
            className="flex flex-wrap gap-4"
          >
            <Button 
              asChild
              size="lg"
              className="bg-botanical-600 hover:bg-botanical-700 text-white px-8"
            >
              <Link to="/catalog">
                Découvrir
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button 
              asChild
              variant="outline"
              size="lg"
            >
              <Link to="/categories">
                Nos catégories
              </Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div 
            variants={staggerContainerVariants}
            className="flex gap-8 mt-12 pt-8 border-t border-border/50"
          >
            {[
              { value: '50+', label: 'Produits' },
              { value: '10K+', label: 'Clients' },
              { value: '4.8', label: 'Note moyenne' },
            ].map((stat) => (
              <motion.div key={stat.label} variants={fadeUpVariants}>
                <p className="text-3xl font-display font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-foreground/30 rounded-full flex justify-center pt-2"
        >
          <motion.div className="w-1.5 h-1.5 bg-foreground/50 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// Categories Section
function CategoriesSection() {
  return (
    <section className="section-padding bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainerVariants}
          className="text-center mb-12"
        >
          <motion.span variants={fadeUpVariants} className="text-botanical-600 font-medium text-sm uppercase tracking-wider">
            Nos Collections
          </motion.span>
          <motion.h2 variants={fadeUpVariants} className="text-3xl md:text-4xl font-display font-bold mt-2">
            Explorez nos univers
          </motion.h2>
          <motion.p variants={fadeUpVariants} className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Des soins adaptés à chaque besoin, formulés avec passion et expertise
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainerVariants}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {categories.map((category, index) => (
            <motion.div key={category.id} variants={fadeUpVariants}>
              <CategoryCard category={category} index={index} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Bestsellers Section
function BestsellersSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      const data = await productApi.getBestsellers(4);
      setProducts(data);
      setIsLoading(false);
    };
    loadProducts();
  }, []);

  return (
    <section className="section-padding">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainerVariants}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
        >
          <div>
            <motion.span variants={fadeUpVariants} className="text-botanical-600 font-medium text-sm uppercase tracking-wider">
              Best-sellers
            </motion.span>
            <motion.h2 variants={fadeUpVariants} className="text-3xl md:text-4xl font-display font-bold mt-2">
              Les préférés de nos clients
            </motion.h2>
            <motion.p variants={fadeUpVariants} className="text-muted-foreground mt-4 max-w-xl">
              Découvrez les produits les plus aimés par notre communauté
            </motion.p>
          </div>
          <motion.div variants={fadeUpVariants} className="mt-4 md:mt-0">
            <Button asChild variant="outline">
              <Link to="/catalog?sort=bestseller">
                Voir tous les best-sellers
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-muted rounded-xl animate-pulse" />
              ))
            : products.map((product) => (
                <motion.div key={product.id} variants={fadeUpVariants}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
        </motion.div>
      </div>
    </section>
  );
}

// New Arrivals Section
function NewArrivalsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      const data = await productApi.getNewArrivals(4);
      setProducts(data);
      setIsLoading(false);
    };
    loadProducts();
  }, []);

  return (
    <section className="section-padding bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainerVariants}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
        >
          <div>
            <motion.span variants={fadeUpVariants} className="text-botanical-600 font-medium text-sm uppercase tracking-wider">
              Nouveautés
            </motion.span>
            <motion.h2 variants={fadeUpVariants} className="text-3xl md:text-4xl font-display font-bold mt-2">
              Découvrez nos nouveautés
            </motion.h2>
            <motion.p variants={fadeUpVariants} className="text-muted-foreground mt-4 max-w-xl">
              Les derniers produits ajoutés à notre collection
            </motion.p>
          </div>
          <motion.div variants={fadeUpVariants} className="mt-4 md:mt-0">
            <Button asChild variant="outline">
              <Link to="/catalog?sort=newest">
                Voir toutes les nouveautés
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-muted rounded-xl animate-pulse" />
              ))
            : products.map((product) => (
                <motion.div key={product.id} variants={fadeUpVariants}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
        </motion.div>
      </div>
    </section>
  );
}

// Features Section
function FeaturesSection() {
  const features = [
    {
      icon: Leaf,
      title: '100% Naturel',
      description: 'Des ingrédients botaniques soigneusement sélectionnés pour leur efficacité.',
    },
    {
      icon: Heart,
      title: 'Cruelty-Free',
      description: 'Nos produits ne sont jamais testés sur les animaux.',
    },
    {
      icon: Star,
      title: 'Qualité Premium',
      description: 'Des formules concentrées pour des résultats visibles.',
    },
  ];

  return (
    <section className="section-padding">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainerVariants}
          className="grid md:grid-cols-3 gap-8"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={fadeUpVariants}
              className="text-center p-8 rounded-2xl bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-botanical-100 dark:bg-botanical-900/30 flex items-center justify-center">
                <feature.icon className="w-8 h-8 text-botanical-600" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Newsletter Section
function NewsletterSection() {
  return (
    <section className="section-padding bg-botanical-600 text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainerVariants}
          className="max-w-2xl mx-auto text-center"
        >
          <motion.h2 variants={fadeUpVariants} className="text-3xl md:text-4xl font-display font-bold mb-4">
            Rejoignez notre communauté
          </motion.h2>
          <motion.p variants={fadeUpVariants} className="text-botanical-100 mb-8">
            Inscrivez-vous à notre newsletter pour recevoir nos offres exclusives, 
            nos conseils beauté et nos nouveautés en avant-première.
          </motion.p>
          <motion.form variants={fadeUpVariants} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <Button 
              type="submit"
              className="bg-white text-botanical-600 hover:bg-white/90 px-8"
            >
              S'inscrire
            </Button>
          </motion.form>
          <motion.p variants={fadeUpVariants} className="text-xs text-botanical-200 mt-4">
            En vous inscrivant, vous acceptez notre politique de confidentialité.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

// Main Home Page
export default function Home() {
  return (
    <div className="space-y-0">
      <HeroSection />
      <CategoriesSection />
      <BestsellersSection />
      <NewArrivalsSection />
      <FeaturesSection />
      <NewsletterSection />
    </div>
  );
}
