import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Star, Check } from 'lucide-react';
import { useCartStore, useWishlistStore } from '@/stores';
import { formatPrice, getStarArray } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { toast } from 'sonner';
import type { Product } from '@/types';

interface QuickViewModalProps {
  product?: Product | null;
  isOpen?: boolean;
  onClose?: () => void;
}

// Global state for quick view
let quickViewProduct: Product | null = null;
let quickViewOpen = false;
const listeners: Set<() => void> = new Set();

export function openQuickView(product: Product) {
  quickViewProduct = product;
  quickViewOpen = true;
  listeners.forEach(fn => fn());
}

export function closeQuickView() {
  quickViewOpen = false;
  listeners.forEach(fn => fn());
}

export function QuickViewModal({ product: propProduct, isOpen: propIsOpen, onClose }: QuickViewModalProps = {}) {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const { addItem } = useCartStore();
  const { isInWishlist, toggleItem } = useWishlistStore();

  // Use props if provided, otherwise use global state
  const [localProduct, setLocalProduct] = useState<Product | null>(quickViewProduct);
  const [localIsOpen, setLocalIsOpen] = useState(quickViewOpen);

  // Subscribe to global state changes
  useState(() => {
    const update = () => {
      setLocalProduct(quickViewProduct);
      setLocalIsOpen(quickViewOpen);
    };
    listeners.add(update);
    return () => listeners.delete(update);
  });

  const product = propProduct ?? localProduct;
  const isOpen = propIsOpen ?? localIsOpen;
  const handleClose = onClose ?? closeQuickView;

  if (!product) return null;

  const stars = getStarArray(product.rating);
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(`${product.name} ajouté au panier`);
    handleClose();
  };

  const handleToggleWishlist = () => {
    toggleItem(product);
    toast.success(inWishlist ? 'Retiré des favoris' : 'Ajouté aux favoris');
  };

  const handleViewDetails = () => {
    handleClose();
    navigate(`/product/${product.slug}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Images */}
          <div className="relative bg-muted">
            <div className="aspect-square">
              <img
                src={product.images[currentImageIndex]?.url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnail navigation */}
            {product.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
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
              {product.isBestseller && (
                <span className="bg-gold-500 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                  Best-seller
                </span>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="p-6 lg:p-8 flex flex-col">
            <div className="flex-1">
              {/* Category */}
              <p className="text-sm text-botanical-600 font-medium mb-2">
                {product.category.name}
              </p>

              {/* Name */}
              <h2 className="text-2xl font-display font-semibold mb-2">
                {product.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-0.5">
                  {stars.map((star, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        star === 'full'
                          ? 'fill-gold-400 text-gold-400'
                          : star === 'half'
                          ? 'fill-gold-400/50 text-gold-400'
                          : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  ({product.reviewCount} avis)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl font-semibold">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* Short description */}
              <p className="text-muted-foreground mb-6">
                {product.shortDescription}
              </p>

              {/* Benefits */}
              <div className="space-y-2 mb-6">
                {product.benefits.slice(0, 3).map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-botanical-600" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              {/* Skin types */}
              <div className="flex flex-wrap gap-2 mb-6">
                {product.skinTypes.map((type) => (
                  <span
                    key={type}
                    className="text-xs bg-muted px-2.5 py-1 rounded-full capitalize"
                  >
                    {type === 'all' ? 'Tous types' : type}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-border">
              {/* Quantity */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Quantité</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-botanical-600 hover:bg-botanical-700"
                  size="lg"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Ajouter au panier
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleToggleWishlist}
                  className={inWishlist ? 'text-rose-500 border-rose-500' : ''}
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
                </Button>
              </div>

              <Button
                variant="ghost"
                onClick={handleViewDetails}
                className="w-full"
              >
                Voir les détails complets
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
