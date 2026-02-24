import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Trash2, Minus, Plus, ArrowRight, Heart } from 'lucide-react';
import { useCartStore, useWishlistStore } from '@/stores';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { fadeUpVariants, staggerContainerVariants } from '@/lib/animations';

export default function Cart() {
  const navigate = useNavigate();
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    getSubtotal, 
    getTotal, 
    getItemCount,
    toggleItemSelection,
    selectAll
  } = useCartStore();
  const { addItem: addToWishlist } = useWishlistStore();

  const subtotal = getSubtotal();
  const total = getTotal();
  const itemCount = getItemCount();
  const selectedItems = items.filter(item => item.selected);

  const handleMoveToWishlist = (product: typeof items[0]['product']) => {
    addToWishlist(product);
    removeItem(product.id);
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
            <ShoppingBag className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-display font-bold mb-2">Votre panier est vide</h1>
          <p className="text-muted-foreground mb-6">
            Découvrez nos produits et ajoutez-les à votre panier
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-display font-bold">Mon Panier</h1>
          <p className="text-muted-foreground">{itemCount} article{itemCount !== 1 ? 's' : ''}</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2 space-y-4"
          >
            {/* Select all */}
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedItems.length === items.length}
                  onChange={(e) => selectAll(e.target.checked)}
                  className="w-4 h-4 rounded border-border"
                />
                <span className="text-sm">Tout sélectionner</span>
              </label>
              <button
                onClick={() => items.forEach(item => removeItem(item.product.id))}
                className="text-sm text-rose-600 hover:underline"
              >
                Tout supprimer
              </button>
            </div>

            {/* Items */}
            {items.map((item) => (
              <motion.div
                key={item.product.id}
                variants={fadeUpVariants}
                className={`flex gap-4 p-4 bg-card border rounded-xl transition-colors ${
                  item.selected ? 'border-botanical-600' : 'border-border'
                }`}
              >
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={item.selected}
                  onChange={() => toggleItemSelection(item.product.id)}
                  className="mt-2 w-4 h-4 rounded border-border"
                />

                {/* Image */}
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <img
                    src={item.product.images.find(img => img.isMain)?.url || item.product.images[0]?.url}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 
                        className="font-medium hover:text-botanical-600 cursor-pointer"
                        onClick={() => navigate(`/product/${item.product.slug}`)}
                      >
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{item.product.weight}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatPrice(item.product.price * item.quantity)}</p>
                      {item.product.originalPrice && (
                        <p className="text-sm text-muted-foreground line-through">
                          {formatPrice(item.product.originalPrice * item.quantity)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    {/* Quantity */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleMoveToWishlist(item.product)}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                        title="Déplacer vers les favoris"
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="p-2 hover:bg-rose-100 hover:text-rose-600 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:sticky lg:top-24 h-fit"
          >
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold">Récapitulatif</h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Sous-total ({selectedItems.length} article{selectedItems.length !== 1 ? 's' : ''})</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Livraison</span>
                  <span>{subtotal >= 500 ? 'Gratuite' : formatPrice(29)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>TVA (20%)</span>
                  <span>{formatPrice(subtotal * 0.2)}</span>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Taxes incluses
                </p>
              </div>

              <Button
                onClick={() => navigate('/checkout')}
                disabled={selectedItems.length === 0}
                className="w-full bg-botanical-600 hover:bg-botanical-700"
                size="lg"
              >
                Passer la commande
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              {/* Free shipping progress */}
              {subtotal < 500 && (
                <div className="bg-botanical-50 dark:bg-botanical-900/20 rounded-lg p-4">
                  <p className="text-sm text-center text-botanical-700 dark:text-botanical-300">
                    Plus que {formatPrice(500 - subtotal)} pour la livraison gratuite !
                  </p>
                  <div className="mt-2 h-2 bg-botanical-200 dark:bg-botanical-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((subtotal / 500) * 100, 100)}%` }}
                      className="h-full bg-botanical-600 rounded-full"
                    />
                  </div>
                </div>
              )}

              <Button
                variant="outline"
                onClick={() => navigate('/catalog')}
                className="w-full"
              >
                Continuer les achats
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
