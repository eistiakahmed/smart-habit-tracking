'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Tag, TrendingUp, Star, Eye, DollarSign, ShoppingBag } from 'lucide-react';
import { api } from '@/lib/api';

interface MarketplaceProps {
  userId: string;
}

export function Marketplace({ userId }: MarketplaceProps) {
  const [listings, setListings] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    category: '',
    rarity: '',
    sortBy: 'rating'
  });
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  useEffect(() => {
    loadListings();
  }, [filters]);

  const loadListings = async () => {
    try {
      setLoading(true);
      const response = await api.searchMarketplace(filters);
      setListings(response.listings || []);
    } catch (error) {
      console.error('Failed to load marketplace:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (listingId: string) => {
    setPurchasing(listingId);
    try {
      await api.purchaseListing(listingId);
      // Refresh listings
      loadListings();
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setPurchasing(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShoppingCart className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900">Habit Marketplace</h2>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="grid grid-cols-3 gap-4">
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="p-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Categories</option>
            <option value="HEALTH">Health & Fitness</option>
            <option value="PRODUCTIVITY">Productivity</option>
            <option value="WELLNESS">Wellness</option>
            <option value="LEARNING">Learning</option>
          </select>

          <select
            value={filters.rarity}
            onChange={(e) => setFilters({ ...filters, rarity: e.target.value })}
            className="p-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Rarities</option>
            <option value="COMMON">Common</option>
            <option value="RARE">Rare</option>
            <option value="EPIC">Epic</option>
            <option value="LEGENDARY">Legendary</option>
          </select>

          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
            className="p-2 border border-gray-300 rounded-lg"
          >
            <option value="rating">Top Rated</option>
            <option value="price">Price: Low to High</option>
            <option value="sales">Most Popular</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 rounded-lg h-64"></div>
          ))
        ) : (
          listings.map((listing) => (
            <MarketplaceCard
              key={listing.id}
              listing={listing}
              onPurchase={() => handlePurchase(listing.id)}
              isPurchasing={purchasing === listing.id}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface MarketplaceCardProps {
  listing: any;
  onPurchase: () => void;
  isPurchasing: boolean;
}

function MarketplaceCard({ listing, onPurchase, isPurchasing }: MarketplaceCardProps) {
  const rarityColors: Record<string, string> = {
    COMMON: 'bg-gray-100 text-gray-700',
    RARE: 'bg-blue-100 text-blue-700',
    EPIC: 'bg-purple-100 text-purple-700',
    LEGENDARY: 'bg-yellow-100 text-yellow-700',
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'COMMON': return 1;
      case 'RARE': return 2;
      case 'EPIC': return 3;
      case 'LEGENDARY': return 4;
      default: return 1;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative">
        {/* Listing Header */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className={`px-2 py-1 rounded text-xs font-semibold ${rarityColors[listing.rarity]}`}>
              {listing.rarity}
            </span>
            <div className="flex items-center gap-1">
              {[...Array(getRarityIcon(listing.rarity))].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-yellow-400" />
              ))}
            </div>
          </div>
          <h3 className="font-semibold text-gray-900">{listing.title}</h3>
          <div className="text-sm text-gray-600">{listing.category}</div>
        </div>

        {/* Listing Body */}
        <div className="p-4">
          <p className="text-sm text-gray-700 mb-4 line-clamp-2">{listing.description}</p>

          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {listing.stats.views}
            </div>
            <div className="flex items-center gap-1">
              <ShoppingBag className="w-3 h-3" />
              {listing.stats.sales}
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {listing.stats.rating.toFixed(1)}⭐
            </div>
          </div>

          {/* Tags */}
          {listing.tags && listing.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {listing.tags.slice(0, 3).map((tag: string, i: number) => (
                <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">
                {listing.price.toLocaleString()}
              </span>
            </div>
            <span className="text-sm text-gray-600">{listing.currency}</span>
          </div>

          {/* Purchase Button */}
          <button
            onClick={onPurchase}
            disabled={isPurchasing || listing.status !== 'ACTIVE'}
            className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
          >
            {isPurchasing ? 'Processing...' : listing.status === 'ACTIVE' ? 'Purchase' : 'Not Available'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
