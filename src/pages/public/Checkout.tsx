import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, CreditCard, Truck, Check, Lock } from 'lucide-react';
import { useCartStore } from '@/stores';
import { orderApi } from '@/services/api';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


export default function Checkout() {
  const navigate = useNavigate();
  const { getSubtotal, getTotal, getSelectedItems, clearCart } = useCartStore();
  
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  
  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    postalCode: '',
    country: 'Maroc',
  });

  const selectedItems = getSelectedItems();
  const subtotal = getSubtotal();
  const total = getTotal();

  // Redirect if no items selected
  if (selectedItems.length === 0 && step !== 'confirmation') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold mb-4">Votre panier est vide</h1>
          <p className="text-muted-foreground mb-6">
            Ajoutez des produits à votre panier pour continuer
          </p>
          <Button onClick={() => navigate('/catalog')}>
            Découvrir les produits
          </Button>
        </div>
      </div>
    );
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
    window.scrollTo(0, 0);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create order
    const order = await orderApi.create({
      items: selectedItems.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: item.product.price,
        total: item.product.price * item.quantity,
      })),
      shippingAddress: {
        firstName: shippingData.firstName,
        lastName: shippingData.lastName,
        email: shippingData.email,
        phone: shippingData.phone,
        address1: shippingData.address1,
        address2: shippingData.address2,
        city: shippingData.city,
        state: '',
        postalCode: shippingData.postalCode,
        country: shippingData.country,
      },
      billingAddress: {
        firstName: shippingData.firstName,
        lastName: shippingData.lastName,
        email: shippingData.email,
        phone: shippingData.phone,
        address1: shippingData.address1,
        address2: shippingData.address2,
        city: shippingData.city,
        state: '',
        postalCode: shippingData.postalCode,
        country: shippingData.country,
      },
      paymentMethod: { type: 'card' },
      subtotal,
      shipping: subtotal >= 500 ? 0 : 29,
      tax: subtotal * 0.2,
      discount: 0,
      total,
      status: 'pending',
    });

    setOrderNumber(order.orderNumber);
    clearCart();
    setStep('confirmation');
    setIsProcessing(false);
    window.scrollTo(0, 0);
  };

  // Progress steps
  const steps = [
    { id: 'shipping', label: 'Livraison' },
    { id: 'payment', label: 'Paiement' },
    { id: 'confirmation', label: 'Confirmation' },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => step === 'payment' ? setStep('shipping') : navigate('/cart')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Retour
          </button>
          <h1 className="text-3xl font-display font-bold">Finaliser la commande</h1>
        </motion.div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            {steps.map((s, index) => (
              <div key={s.id} className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm
                  ${step === s.id ? 'bg-botanical-600 text-white' : ''}
                  ${steps.findIndex(st => st.id === step) > index ? 'bg-botanical-600 text-white' : ''}
                  ${steps.findIndex(st => st.id === step) < index ? 'bg-muted text-muted-foreground' : ''}
                `}>
                  {steps.findIndex(st => st.id === step) > index ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className={`
                  ml-2 text-sm hidden sm:block
                  ${step === s.id ? 'text-foreground font-medium' : 'text-muted-foreground'}
                `}>
                  {s.label}
                </span>
                {index < steps.length - 1 && (
                  <div className="w-8 sm:w-16 h-0.5 bg-muted mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {step === 'shipping' && (
              <motion.form
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleShippingSubmit}
                className="bg-card border border-border rounded-xl p-6 space-y-6"
              >
                <h2 className="text-xl font-semibold">Adresse de livraison</h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom *</Label>
                    <Input
                      id="firstName"
                      required
                      value={shippingData.firstName}
                      onChange={(e) => setShippingData({ ...shippingData, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom *</Label>
                    <Input
                      id="lastName"
                      required
                      value={shippingData.lastName}
                      onChange={(e) => setShippingData({ ...shippingData, lastName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={shippingData.email}
                      onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={shippingData.phone}
                      onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address1">Adresse *</Label>
                  <Input
                    id="address1"
                    required
                    value={shippingData.address1}
                    onChange={(e) => setShippingData({ ...shippingData, address1: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address2">Complément d'adresse</Label>
                  <Input
                    id="address2"
                    value={shippingData.address2}
                    onChange={(e) => setShippingData({ ...shippingData, address2: e.target.value })}
                  />
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Ville *</Label>
                    <Input
                      id="city"
                      required
                      value={shippingData.city}
                      onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Code postal *</Label>
                    <Input
                      id="postalCode"
                      required
                      value={shippingData.postalCode}
                      onChange={(e) => setShippingData({ ...shippingData, postalCode: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Pays *</Label>
                    <Input
                      id="country"
                      required
                      value={shippingData.country}
                      disabled
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-botanical-600 hover:bg-botanical-700" size="lg">
                  Continuer vers le paiement
                </Button>
              </motion.form>
            )}

            {step === 'payment' && (
              <motion.form
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handlePaymentSubmit}
                className="bg-card border border-border rounded-xl p-6 space-y-6"
              >
                <h2 className="text-xl font-semibold">Paiement</h2>

                {/* Payment methods */}
                <div className="space-y-3">
                  <label className="flex items-center gap-4 p-4 border border-botanical-600 rounded-lg cursor-pointer bg-botanical-50 dark:bg-botanical-900/20">
                    <input type="radio" name="payment" defaultChecked className="w-4 h-4" />
                    <CreditCard className="w-5 h-5" />
                    <span className="flex-1">Carte bancaire</span>
                  </label>
                  <label className="flex items-center gap-4 p-4 border border-border rounded-lg cursor-pointer opacity-50">
                    <input type="radio" name="payment" disabled className="w-4 h-4" />
                    <Truck className="w-5 h-5" />
                    <span className="flex-1">Paiement à la livraison</span>
                    <span className="text-xs text-muted-foreground">Bientôt disponible</span>
                  </label>
                </div>

                {/* Card form */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Numéro de carte *</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardHolder">Titulaire de la carte *</Label>
                    <Input
                      id="cardHolder"
                      placeholder="NOM PRÉNOM"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Date d'expiration *</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/AA"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Lock className="w-4 h-4" />
                  <span>Paiement 100% sécurisé</span>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-botanical-600 hover:bg-botanical-700" 
                  size="lg"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Traitement en cours...
                    </span>
                  ) : (
                    `Payer ${formatPrice(total)}`
                  )}
                </Button>
              </motion.form>
            )}

            {step === 'confirmation' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-card border border-border rounded-xl p-8 text-center"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-botanical-100 dark:bg-botanical-900/30 flex items-center justify-center">
                  <Check className="w-10 h-10 text-botanical-600" />
                </div>
                <h2 className="text-2xl font-display font-bold mb-2">
                  Commande confirmée !
                </h2>
                <p className="text-muted-foreground mb-6">
                  Merci pour votre commande. Nous vous avons envoyé un email de confirmation.
                </p>
                <div className="bg-muted rounded-lg p-4 mb-6">
                  <p className="text-sm text-muted-foreground">Numéro de commande</p>
                  <p className="text-xl font-mono font-semibold">{orderNumber}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={() => navigate('/')}>
                    Continuer les achats
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/catalog')}>
                    Voir mes commandes
                  </Button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order summary */}
          {step !== 'confirmation' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:sticky lg:top-24 h-fit"
            >
              <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                <h2 className="text-lg font-semibold">Récapitulatif de la commande</h2>

                {/* Items */}
                <div className="space-y-3 max-h-60 overflow-auto">
                  {selectedItems.map((item) => (
                    <div key={item.product.id} className="flex gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={item.product.images.find(img => img.isMain)?.url || item.product.images[0]?.url}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">Qté: {item.quantity}</p>
                        <p className="text-sm font-medium">{formatPrice(item.product.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Sous-total</span>
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
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
