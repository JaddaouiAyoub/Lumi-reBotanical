import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  ShoppingBag, 
  Star, 
  Check, 
  ChevronLeft, 
  ChevronRight,
  Share2,
  Truck,
  ShieldCheck,
  Leaf,
  Minus,
  Plus
} from 'lucide-react';
import { productApi } from '@/services/api';
import { useCartStore, useWishlistStore } from '@/stores';
import { formatPrice, getStarArray } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductCard } from '@/components/product/ProductCard';
import { fadeUpVariants, staggerContainerVariants } from '@/lib/animations';
import { toast } from 'sonner';
import type { Product } from '@/types';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const { addItem } = useCartStore();
  const { isInWishlist, toggleItem } = useWishlistStore();

  useEffect(() => {
    const loadProduct = async () => {
      if (!slug) return;
      setIsLoading(true);
      
      const data = await productApi.getBySlug(slug);
      if (data) {
        setProduct(data);
        const related = await productApi.getRelated(data.id, 4);
        setRelatedProducts(related);
      }
      setIsLoading(false);
    };
    
    loadProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-3 border-botanical-200 border-t-botanical-600 rounded-full" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Produit non trouvé</h1>
          <Button onClick={() => navigate('/catalog')}>
            Retour au catalogue
          </Button>
        </div>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const stars = getStarArray(product.rating);
  const currentImage = product.images[currentImageIndex];

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(`${product.name} ajouté au panier`);
  };

  const handleToggleWishlist = () => {
    toggleItem(product);
    toast.success(inWishlist ? 'Retiré des favoris' : 'Ajouté aux favoris');
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Accueil</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/catalog" className="hover:text-foreground transition-colors">Produits</Link>
            <ChevronRight className="w-4 h-4" />
            <Link 
              to={`/catalog/${product.category.slug}`} 
              className="hover:text-foreground transition-colors"
            >
              {product.category.name}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product details */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Main image */}
            <div 
              className="relative aspect-square rounded-2xl overflow-hidden bg-muted cursor-zoom-in"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={currentImage?.url}
                  alt={currentImage?.alt}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`w-full h-full object-cover transition-transform duration-200 ${
                    isZoomed ? 'scale-150' : 'scale-100'
                  }`}
                  style={isZoomed ? {
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                  } : {}}
                />
              </AnimatePresence>

              {/* Navigation arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && (
                  <span className="bg-botanical-600 text-white text-xs font-medium px-3 py-1.5 rounded-full">
                    Nouveau
                  </span>
                )}
                {product.isOnSale && (
                  <span className="bg-rose-500 text-white text-xs font-medium px-3 py-1.5 rounded-full">
                    -{product.discount}%
                  </span>
                )}
                {product.isBestseller && (
                  <span className="bg-gold-500 text-white text-xs font-medium px-3 py-1.5 rounded-full">
                    Best-seller
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex 
                        ? 'border-botanical-600' 
                        : 'border-transparent hover:border-muted'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Category & Brand */}
            <div className="flex items-center gap-2 text-sm">
              <Link 
                to={`/catalog/${product.category.slug}`}
                className="text-botanical-600 font-medium hover:underline"
              >
                {product.category.name}
              </Link>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{product.brand}</span>
            </div>

            {/* Name */}
            <h1 className="text-3xl md:text-4xl font-display font-bold">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5">
                {stars.map((star, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
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
                {product.rating} ({product.reviewCount} avis)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-semibold">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {product.isOnSale && product.discount && (
                <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-sm font-medium">
                  Économisez {formatPrice(product.originalPrice! - product.price)}
                </span>
              )}
            </div>

            {/* Short description */}
            <p className="text-muted-foreground leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Benefits */}
            <div className="flex flex-wrap gap-2">
              {product.benefits.slice(0, 3).map((benefit, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 text-sm bg-muted px-3 py-1.5 rounded-full"
                >
                  <Check className="w-4 h-4 text-botanical-600" />
                  {benefit}
                </span>
              ))}
            </div>

            {/* Skin types */}
            <div>
              <span className="text-sm font-medium mb-2 block">Convient à:</span>
              <div className="flex flex-wrap gap-2">
                {product.skinTypes.map((type) => (
                  <span
                    key={type}
                    className="text-sm border border-border px-3 py-1.5 rounded-full capitalize"
                  >
                    {type === 'all' ? 'Tous types' : type}
                  </span>
                ))}
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border">
              {/* Quantity */}
              <div className="flex items-center border border-border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to cart */}
              <Button
                onClick={handleAddToCart}
                size="lg"
                className="flex-1 bg-botanical-600 hover:bg-botanical-700"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Ajouter au panier
              </Button>

              {/* Wishlist */}
              <Button
                variant="outline"
                size="lg"
                onClick={handleToggleWishlist}
                className={inWishlist ? 'border-rose-500 text-rose-500' : ''}
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
              </Button>

              {/* Share */}
              <Button variant="outline" size="lg">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
              {[
                { icon: Truck, text: 'Livraison gratuite dès 500 MAD' },
                { icon: ShieldCheck, text: 'Paiement sécurisé' },
                { icon: Leaf, text: 'Ingrédients naturels' },
              ].map((feature) => (
                <div key={feature.text} className="text-center">
                  <feature.icon className="w-6 h-6 mx-auto mb-2 text-botanical-600" />
                  <p className="text-xs text-muted-foreground">{feature.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              {['description', 'ingredients', 'how-to-use', 'reviews'].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-botanical-600 data-[state=active]:bg-transparent py-4 px-6"
                >
                  {tab === 'description' && 'Description'}
                  {tab === 'ingredients' && 'Ingrédients'}
                  {tab === 'how-to-use' && 'Mode d\'emploi'}
                  {tab === 'reviews' && `Avis (${product.reviewCount})`}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="description" className="mt-8">
              <div className="max-w-3xl">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="ingredients" className="mt-8">
              <div className="max-w-3xl">
                <h3 className="font-semibold mb-4">Ingrédients clés</h3>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {product.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Leaf className="w-4 h-4 text-botanical-600" />
                      <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="how-to-use" className="mt-8">
              <div className="max-w-3xl">
                <h3 className="font-semibold mb-4">Conseils d'utilisation</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.howToUse}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-8">
              <div className="max-w-3xl">
                {product.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {product.reviews.map((review) => (
                      <div key={review.id} className="border-b border-border pb-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                            <span className="font-medium">{review.userName[0]}</span>
                          </div>
                          <div>
                            <p className="font-medium">{review.userName}</p>
                            <div className="flex items-center gap-2">
                              <div className="flex gap-0.5">
                                {getStarArray(review.rating).map((star, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${
                                      star === 'full' ? 'fill-gold-400 text-gold-400' : 'text-muted-foreground'
                                    }`}
                                  />
                                ))}
                              </div>
                              {review.verified && (
                                <span className="text-xs text-botanical-600">Achat vérifié</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <h4 className="font-medium mb-2">{review.title}</h4>
                        <p className="text-muted-foreground text-sm">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Aucun avis pour le moment.</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-display font-bold mb-8">Produits similaires</h2>
            <motion.div
              variants={staggerContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {relatedProducts.map((product) => (
                <motion.div key={product.id} variants={fadeUpVariants}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
