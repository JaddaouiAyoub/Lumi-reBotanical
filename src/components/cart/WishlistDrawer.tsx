import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlistStore, useCartStore } from '@/stores';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { toast } from 'sonner';
import type { Product } from '@/types';

export function WishlistDrawer() {
  const navigate = useNavigate();
  const { items, isOpen, setIsOpen, removeItem } = useWishlistStore();
  const { addItem } = useCartStore();

  const handleAddToCart = (product: Product) => {
    addItem(product);
    toast.success(`${product.name} ajouté au panier`);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Ma Liste de Souhaits ({items.length})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4"
            >
              <Heart className="w-8 h-8 text-muted-foreground" />
            </motion.div>
            <h3 className="text-lg font-medium mb-2">Votre liste est vide</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Ajoutez vos produits préférés à votre liste de souhaits
            </p>
            <Button onClick={() => { setIsOpen(false); navigate('/catalog'); }}>
              Découvrir les produits
            </Button>
          </div>
        ) : (
          <>
            {/* Wishlist items */}
            <div className="flex-1 overflow-auto py-4 space-y-4">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-4 p-3 bg-muted/50 rounded-lg group"
                  >
                    {/* Product image */}
                    <div 
                      className="w-24 h-24 rounded-lg overflow-hidden bg-white flex-shrink-0 cursor-pointer"
                      onClick={() => { setIsOpen(false); navigate(`/product/${item.slug}`); }}
                    >
                      <img
                        src={item.images.find((img: {isMain: boolean, url: string}) => img.isMain)?.url || item.images[0]?.url}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Product info */}
                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex-1">
                        <h4 
                          className="font-medium text-sm line-clamp-2 cursor-pointer hover:text-botanical-600 transition-colors"
                          onClick={() => { setIsOpen(false); navigate(`/product/${item.slug}`); }}
                        >
                          {item.name}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">{item.category.name}</p>
                        
                        {/* Price */}
                        <div className="flex items-center gap-2 mt-2">
                          <span className="font-medium">{formatPrice(item.price)}</span>
                          {item.originalPrice && (
                            <span className="text-xs text-muted-foreground line-through">
                              {formatPrice(item.originalPrice)}
                            </span>
                          )}
                          {item.isOnSale && item.discount && (
                            <span className="text-xs bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded">
                              -{item.discount}%
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          size="sm"
                          onClick={() => handleAddToCart(item)}
                          className="flex-1 bg-botanical-600 hover:bg-botanical-700"
                        >
                          <ShoppingBag className="w-3.5 h-3.5 mr-1.5" />
                          Ajouter
                        </Button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 hover:bg-rose-100 hover:text-rose-600 rounded-lg transition-colors"
                        >
                          <Heart className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="border-t border-border pt-4">
              <Button 
                onClick={() => { setIsOpen(false); navigate('/catalog'); }}
                variant="outline"
                className="w-full"
              >
                Continuer les achats
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
