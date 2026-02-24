import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search as SearchIcon, X } from 'lucide-react';
import { productApi } from '@/services/api';
import { ProductCard } from '@/components/product/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { fadeUpVariants, staggerContainerVariants } from '@/lib/animations';
import type { Product } from '@/types';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(query);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    setHasSearched(true);
    const results = await productApi.search(searchTerm);
    setProducts(results);
    setIsLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery });
      performSearch(searchQuery);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchParams({});
    setProducts([]);
    setHasSearched(false);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Rechercher un produit
          </h1>
          <p className="text-muted-foreground mb-8">
            Trouvez le produit parfait pour vos besoins
          </p>

          {/* Search form */}
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par nom, catégorie..."
                className="w-full h-14 pl-12 pr-12 text-lg"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <Button 
              type="submit" 
              className="mt-4 w-full sm:w-auto bg-botanical-600 hover:bg-botanical-700"
              size="lg"
            >
              Rechercher
            </Button>
          </form>
        </motion.div>

        {/* Results */}
        {hasSearched && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium">
                {isLoading ? 'Recherche en cours...' : 
                  products.length > 0 ? 
                    `${products.length} résultat${products.length !== 1 ? 's' : ''} pour "${query}"` :
                    `Aucun résultat pour "${query}"`
                }
              </h2>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-muted rounded-xl animate-pulse" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <motion.div
                variants={staggerContainerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {products.map((product) => (
                  <motion.div key={product.id} variants={fadeUpVariants}>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                  <SearchIcon className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-2">Aucun résultat trouvé</h3>
                <p className="text-muted-foreground mb-6">
                  Essayez avec d'autres termes ou consultez nos catégories
                </p>
                <Button onClick={() => window.location.href = '/catalog'}>
                  Voir tous les produits
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Suggestions */}
        {!hasSearched && (
          <div className="max-w-2xl mx-auto">
            <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
              Recherches populaires
            </h3>
            <div className="flex flex-wrap gap-2">
              {['Sérum', 'Crème hydratante', 'Nettoyant', 'Masque', 'Huile'].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setSearchQuery(term);
                    setSearchParams({ q: term });
                    performSearch(term);
                  }}
                  className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-full text-sm transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
