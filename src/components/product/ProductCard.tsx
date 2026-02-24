import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';
import { useWishlistStore, useCartStore } from '@/stores';
import { formatPrice, getStarArray } from '@/lib/utils';
import { openQuickView } from './QuickViewModal';
import { toast } from 'sonner';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  showQuickView?: boolean;
}

export function ProductCard({ product, showQuickView = true }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { isInWishlist, toggleItem } = useWishlistStore();
  const { addItem } = useCartStore();

  const inWishlist = isInWishlist(product.id);
  const stars = getStarArray(product.rating);
  const mainImage = product.images.find(img => img.isMain)?.url || product.images[0]?.url;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success(`${product.name} ajouté au panier`);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
    toast.success(inWishlist ? 'Retiré des favoris' : 'Ajouté aux favoris');
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openQuickView(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group"
    >
      <Link to={`/product/${product.slug}`}>
        {/* Image container */}
        <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-muted mb-4">
          <motion.img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.08 : 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <span className="bg-botanical-600 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                Nouveau
              </span>
            )}
            {product.isOnSale && (
              <span className="bg-rose-500 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                -{product.discount}%
              </span>
            )}
            {product.isBestseller && !product.isNew && !product.isOnSale && (
              <span className="bg-gold-500 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                Best-seller
              </span>
            )}
          </div>

          {/* Quick actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-3 left-3 right-3 flex gap-2"
          >
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 bg-white text-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-botanical-600 hover:text-white transition-colors shadow-lg"
            >
              <ShoppingBag className="w-4 h-4" />
              Ajouter
            </button>
            {showQuickView && (
              <button
                onClick={handleQuickView}
                className="w-10 h-10 flex items-center justify-center bg-white text-foreground rounded-lg hover:bg-botanical-600 hover:text-white transition-colors shadow-lg"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={handleToggleWishlist}
              className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors shadow-lg ${
                inWishlist 
                  ? 'bg-rose-500 text-white' 
                  : 'bg-white text-foreground hover:bg-rose-500 hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
            </button>
          </motion.div>
        </div>

        {/* Info */}
        <div className="space-y-1">
          {/* Category */}
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            {product.category.name}
          </p>

          {/* Name */}
          <h3 className="font-medium text-foreground group-hover:text-botanical-600 transition-colors line-clamp-2">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex gap-0.5">
              {stars.map((star, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    star === 'full'
                      ? 'fill-gold-400 text-gold-400'
                      : star === 'half'
                      ? 'fill-gold-400/50 text-gold-400'
                      : 'text-muted-foreground'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 pt-1">
            <span className="font-semibold">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
