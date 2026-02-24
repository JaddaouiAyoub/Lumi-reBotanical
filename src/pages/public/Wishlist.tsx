import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlistStore, useCartStore } from '@/stores';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { fadeUpVariants, staggerContainerVariants } from '@/lib/animations';
import type { Product } from '@/types';

export default function Wishlist() {
  const navigate = useNavigate();
  const { items, removeItem } = useWishlistStore();
  const { addItem } = useCartStore();

  const handleAddToCart = (product: Product) => {
    addItem(product);
    toast.success(`${product.name} ajouté au panier`);
  };

  const handleAddAllToCart = () => {
    items.forEach(item => addItem(item));
    toast.success('Tous les articles ont été ajoutés au panier');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
            <Heart className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-display font-bold mb-2">Votre liste est vide</h1>
          <p className="text-muted-foreground mb-6">
            Ajoutez vos produits préférés à votre liste de souhaits
          </p>
          <Button onClick={() => navigate('/catalog')}>
            Découvrir les produits
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-display font-bold">Ma Liste de Souhaits</h1>
            <p className="text-muted-foreground">{items.length} article{items.length !== 1 ? 's' : ''}</p>
          </div>
          <Button onClick={handleAddAllToCart} className="bg-botanical-600 hover:bg-botanical-700">
            <ShoppingBag className="w-4 h-4 mr-2" />
            Tout ajouter au panier
          </Button>
        </motion.div>

        {/* Items */}
        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {items.map((item) => (
            <motion.div
              key={item.id}
              variants={fadeUpVariants}
              className="group bg-card border border-border rounded-xl overflow-hidden"
            >
              {/* Image */}
              <div 
                className="relative aspect-square cursor-pointer"
                onClick={() => navigate(`/product/${item.slug}`)}
              >
                <img
                  src={item.images.find((img: {isMain: boolean, url: string}) => img.isMain)?.url || item.images[0]?.url}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {item.isOnSale && (
                  <span className="absolute top-3 left-3 bg-rose-500 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                    -{item.discount}%
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  {item.category.name}
                </p>
                <h3 
                  className="font-medium mb-2 cursor-pointer hover:text-botanical-600 transition-colors"
                  onClick={() => navigate(`/product/${item.slug}`)}
                >
                  {item.name}
                </h3>

                {/* Price */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="font-semibold">{formatPrice(item.price)}</span>
                  {item.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(item.originalPrice)}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleAddToCart(item)}
                    className="flex-1 bg-botanical-600 hover:bg-botanical-700"
                    size="sm"
                  >
                    <ShoppingBag className="w-4 h-4 mr-1.5" />
                    Ajouter
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    className="text-rose-500 border-rose-500 hover:bg-rose-50"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Continue shopping */}
        <div className="mt-12 text-center">
          <Button variant="outline" onClick={() => navigate('/catalog')}>
            Continuer les achats
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
