import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Grid3X3, LayoutList, X, ChevronDown } from 'lucide-react';
import { productApi } from '@/services/api';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { fadeUpVariants, staggerContainerVariants } from '@/lib/animations';
import { categories } from '@/data/mockData';
import { cn } from '@/lib/utils';
import type { Product, ProductFilters, SkinType, SkinConcern } from '@/types';

const skinTypes: { value: SkinType; label: string }[] = [
  { value: 'dry', label: 'Peau sèche' },
  { value: 'oily', label: 'Peau grasse' },
  { value: 'combination', label: 'Peau mixte' },
  { value: 'sensitive', label: 'Peau sensible' },
  { value: 'normal', label: 'Peau normale' },
];

const skinConcerns: { value: SkinConcern; label: string }[] = [
  { value: 'hydration', label: 'Hydratation' },
  { value: 'anti-aging', label: 'Anti-âge' },
  { value: 'brightening', label: 'Éclat' },
  { value: 'acne', label: 'Acné' },
  { value: 'sensitivity', label: 'Sensibilité' },
  { value: 'pores', label: 'Pores' },
  { value: 'dark-spots', label: 'Taches' },
  { value: 'firmness', label: 'Fermeté' },
];

const sortOptions = [
  { value: 'newest', label: 'Nouveautés' },
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
  { value: 'rating', label: 'Mieux notés' },
  { value: 'bestseller', label: 'Best-sellers' },
];

export default function Catalog() {
  const { category: categorySlug } = useParams();
  const [searchParams] = useSearchParams();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Filters state
  const [filters, setFilters] = useState<ProductFilters>({
    categories: categorySlug ? [categorySlug] : [],
    skinTypes: [],
    concerns: [],
    priceRange: [0, 1000],
    brands: [],
    rating: 0,
    sortBy: (searchParams.get('sort') as ProductFilters['sortBy']) || 'newest',
    search: searchParams.get('q') || '',
  });

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    const response = await productApi.getAll(1, 24, filters);
    setProducts(response.data);
    setTotalProducts(response.total);
    setIsLoading(false);
  }, [filters]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Update filters when URL params change
  useEffect(() => {
    const sort = searchParams.get('sort');
    const q = searchParams.get('q');
    
    setFilters(prev => ({
      ...prev,
      categories: categorySlug ? [categorySlug] : prev.categories,
      sortBy: (sort as ProductFilters['sortBy']) || prev.sortBy,
      search: q || prev.search,
    }));
  }, [searchParams, categorySlug]);

  const updateFilter = <K extends keyof ProductFilters>(
    key: K,
    value: ProductFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = (
    key: 'categories' | 'skinTypes' | 'concerns' | 'brands',
    value: string
  ) => {
    setFilters(prev => {
      const current = prev[key] as string[];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [key]: updated };
    });
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      skinTypes: [],
      concerns: [],
      priceRange: [0, 1000],
      brands: [],
      rating: 0,
      sortBy: 'newest',
      search: '',
    });
  };

  const activeFiltersCount = 
    filters.categories.length +
    filters.skinTypes.length +
    filters.concerns.length +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000 ? 1 : 0) +
    (filters.rating > 0 ? 1 : 0);

  const currentCategory = categorySlug 
    ? categories.find(c => c.slug === categorySlug) 
    : null;

  // Filter sidebar content
  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h4 className="font-medium mb-3">Catégories</h4>
        <div className="space-y-2">
          {categories.map(category => (
            <label key={category.id} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={filters.categories.includes(category.slug)}
                onCheckedChange={() => toggleArrayFilter('categories', category.slug)}
              />
              <span className="text-sm">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <h4 className="font-medium mb-3">Prix</h4>
        <Slider
          value={filters.priceRange}
          onValueChange={(value) => updateFilter('priceRange', value as [number, number])}
          max={1000}
          step={10}
          className="mb-4"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{filters.priceRange[0]} MAD</span>
          <span>{filters.priceRange[1]} MAD</span>
        </div>
      </div>

      {/* Skin types */}
      <div>
        <h4 className="font-medium mb-3">Type de peau</h4>
        <div className="space-y-2">
          {skinTypes.map(type => (
            <label key={type.value} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={filters.skinTypes.includes(type.value)}
                onCheckedChange={() => toggleArrayFilter('skinTypes', type.value)}
              />
              <span className="text-sm">{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Concerns */}
      <div>
        <h4 className="font-medium mb-3">Préoccupations</h4>
        <div className="space-y-2">
          {skinConcerns.map(concern => (
            <label key={concern.value} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={filters.concerns.includes(concern.value)}
                onCheckedChange={() => toggleArrayFilter('concerns', concern.value)}
              />
              <span className="text-sm">{concern.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="font-medium mb-3">Note minimale</h4>
        <div className="space-y-2">
          {[4, 3, 2, 1].map(rating => (
            <label key={rating} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={filters.rating === rating}
                onCheckedChange={() => updateFilter('rating', filters.rating === rating ? 0 : rating)}
              />
              <span className="text-sm">{rating}+ étoiles</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen mt-20">
      {/* Header */}
      <div className="bg-muted/30 border-b border-border ">
        <div className="container mx-auto px-4 py-8 ">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl text-center mx-auto"
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
              {currentCategory?.name || 'Tous nos produits'}
            </h1>
            <p className="text-muted-foreground">
              {currentCategory?.description || 'Découvrez notre sélection de produits naturels et efficaces'}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="sticky top-16 lg:top-20 z-30 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Filter button (mobile) */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filtres
                  {activeFiltersCount > 0 && (
                    <span className="ml-2 w-5 h-5 bg-botanical-600 text-white text-xs rounded-full flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>Filtres</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>

            {/* Results count */}
            <p className="text-sm text-muted-foreground hidden sm:block">
              {totalProducts} produit{totalProducts !== 1 ? 's' : ''}
            </p>

            {/* Sort & View */}
            <div className="flex items-center gap-2">
              {/* Sort dropdown */}
              <div className="relative">
                <select
                  value={filters.sortBy}
                  onChange={(e) => updateFilter('sortBy', e.target.value as ProductFilters['sortBy'])}
                  className="appearance-none bg-background border border-border rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-botanical-500"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
              </div>

              {/* View mode */}
              <div className="hidden sm:flex border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-2 transition-colors',
                    viewMode === 'grid' ? 'bg-botanical-600 text-white' : 'hover:bg-muted'
                  )}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-2 transition-colors',
                    viewMode === 'list' ? 'bg-botanical-600 text-white' : 'hover:bg-muted'
                  )}
                >
                  <LayoutList className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active filters */}
          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              <span className="text-sm text-muted-foreground">Filtres actifs:</span>
              {filters.categories.map(cat => {
                const category = categories.find(c => c.slug === cat);
                return (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-full text-xs"
                  >
                    {category?.name}
                    <button onClick={() => toggleArrayFilter('categories', cat)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              })}
              {filters.skinTypes.map(type => (
                <span
                  key={type}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-full text-xs"
                >
                  {skinTypes.find(t => t.value === type)?.label}
                  <button onClick={() => toggleArrayFilter('skinTypes', type)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <button
                onClick={clearFilters}
                className="text-xs text-botanical-600 hover:underline"
              >
                Tout effacer
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar filters (desktop) */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-40">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Filtres</h3>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-botanical-600 hover:underline"
                  >
                    Réinitialiser
                  </button>
                )}
              </div>
              <FilterContent />
            </div>
          </aside>

          {/* Products grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className={cn(
                'grid gap-6',
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              )}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-muted rounded-xl animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground mb-4">Aucun produit ne correspond à vos critères</p>
                <Button onClick={clearFilters} variant="outline">
                  Réinitialiser les filtres
                </Button>
              </div>
            ) : (
              <motion.div
                variants={staggerContainerVariants}
                initial="hidden"
                animate="visible"
                className={cn(
                  'grid gap-6',
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                )}
              >
                {products.map(product => (
                  <motion.div key={product.id} variants={fadeUpVariants}>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
