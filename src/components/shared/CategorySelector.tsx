'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { ChevronDown, Plus, Search, X } from 'lucide-react';
import { HabitIcon } from './HabitIcon';

interface Category {
  _id: string;
  name: string;
  icon: string;
  color: string;
  isDefault: boolean;
  description?: string;
}

interface CategorySelectorProps {
  selectedCategory: Category | null;
  onCategorySelect: (category: Category) => void;
  onCreateCategory: () => void;
  categories: Category[];
  disabled?: boolean;
  placeholder?: string;
}

export default function CategorySelector({
  selectedCategory,
  onCategorySelect,
  onCreateCategory,
  categories,
  disabled = false,
  placeholder = 'Select a category'
}: CategorySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Separate default and custom categories
  const defaultCategories = categories.filter(cat => cat.isDefault);
  const customCategories = categories.filter(cat => !cat.isDefault);

  // Filter categories based on search
  const filteredDefault = defaultCategories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCustom = customCategories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const allFilteredCategories = [...filteredDefault, ...filteredCustom];
  const hasResults = allFilteredCategories.length > 0;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Reset highlighted index when search changes
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [searchQuery]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && itemRefs.current[highlightedIndex]) {
      itemRefs.current[highlightedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      });
    }
  }, [highlightedIndex]);

  const handleCategorySelect = (category: Category) => {
    onCategorySelect(category);
    setIsOpen(false);
    setSearchQuery('');
    setHighlightedIndex(-1);
  };

  const handleCreateCategory = () => {
    onCreateCategory();
    setIsOpen(false);
    setSearchQuery('');
    setHighlightedIndex(-1);
  };

  const handleClearSelection = () => {
    onCategorySelect(null as any);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    const itemCount = allFilteredCategories.length;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < itemCount - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev > 0 ? prev - 1 : itemCount - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < itemCount) {
          handleCategorySelect(allFilteredCategories[highlightedIndex]);
        } else if (highlightedIndex === itemCount) {
          handleCreateCategory();
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSearchQuery('');
        setHighlightedIndex(-1);
        break;
      case 'Tab':
        setIsOpen(false);
        setSearchQuery('');
        break;
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full min-h-[48px] px-4 py-3 bg-[#0a0f1d]/80 backdrop-blur-md border rounded-xl outline-none transition-all text-left font-medium text-sm flex items-center justify-between gap-3 ${
          isOpen ? 'border-sky-500 ring-1 ring-sky-500/50 bg-[#0a0f1d]/95' : 'border-slate-800'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-slate-700 cursor-pointer'}`}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {selectedCategory ? (
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border shadow-lg"
              style={{
                backgroundColor: `${selectedCategory.color}15`,
                borderColor: `${selectedCategory.color}30`,
                boxShadow: `0 0 20px ${selectedCategory.color}20`
              }}
            >
              <HabitIcon icon={selectedCategory.icon} color={selectedCategory.color} size={16} />
            </div>
            <span className="text-slate-100 truncate">{selectedCategory.name}</span>
          </div>
        ) : (
          <span className="text-slate-500">{placeholder}</span>
        )}
        <div className="flex items-center gap-2">
          {selectedCategory && (
            <button
              type="button"
              className="touch-target -mr-2 flex items-center justify-center hover:bg-slate-800 rounded-lg transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleClearSelection();
              }}
            >
              <X className="w-4 h-4 text-slate-400 hover:text-slate-200" />
            </button>
          )}
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`} />
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute z-50 w-full mt-2 bg-[#0a0f1d]/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl max-h-[70dvh] sm:max-h-80 overflow-hidden flex flex-col"
          role="listbox"
        >
          {/* Search Bar */}
          <div className="p-3 border-b border-slate-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full min-h-[48px] pl-10 pr-10 py-2.5 bg-slate-950/60 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 outline-none transition-all"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-1 top-1/2 -translate-y-1/2 touch-target flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors"
                  type="button"
                  aria-label="Clear category search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Categories List */}
          <div className="flex-1 overflow-y-auto scroll-momentum scrollbar-thin">
            {!hasResults ? (
              <div className="py-12 text-center">
                <Search className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                <p className="text-slate-400 font-medium">No categories found</p>
                <p className="text-slate-500 text-sm mt-1">Try a different search term</p>
              </div>
            ) : (
              <>
                {/* Default Categories */}
                {filteredDefault.length > 0 && (
                  <div className="p-2">
                    <div className="px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Default Categories
                    </div>
                    {filteredDefault.map((category, index) => {
                      const isHighlighted = highlightedIndex === index;
                      const isSelected = selectedCategory?._id === category._id;

                      return (
                        <button
                          key={category._id}
                          ref={el => { itemRefs.current[index] = el; }}
                          type="button"
                          onClick={() => handleCategorySelect(category)}
                          onMouseEnter={() => setHighlightedIndex(index)}
                          className={`w-full min-h-[52px] px-3 py-2.5 rounded-xl flex items-center gap-3 transition-all ${
                            isHighlighted
                              ? 'bg-slate-800/80 ring-1 ring-sky-500/30'
                              : isSelected
                              ? 'bg-sky-500/10 border border-sky-500/20'
                              : 'hover:bg-slate-900/60'
                          }`}
                          role="option"
                          aria-selected={isSelected}
                        >
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border shadow-md"
                            style={{
                              backgroundColor: `${category.color}15`,
                              borderColor: `${category.color}30`,
                              boxShadow: isHighlighted ? `0 0 15px ${category.color}25` : undefined
                            }}
                          >
                            <HabitIcon icon={category.icon} color={category.color} size={14} />
                          </div>
                          <div className="flex-1 min-w-0 text-left">
                            <div className={`text-sm font-medium truncate ${
                              isSelected ? 'text-sky-400' : 'text-slate-200'
                            }`}>
                              {category.name}
                            </div>
                            {category.description && (
                              <div className="text-xs text-slate-500 truncate">
                                {category.description}
                              </div>
                            )}
                          </div>
                          {isSelected && (
                            <div className="w-2 h-2 rounded-full bg-sky-500 flex-shrink-0 shadow-lg shadow-sky-500/50" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Custom Categories */}
                {filteredCustom.length > 0 && (
                  <div className={`p-2 ${filteredDefault.length > 0 ? 'border-t border-slate-800' : ''}`}>
                    <div className="px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      My Categories
                    </div>
                    {filteredCustom.map((category, index) => {
                      const actualIndex = filteredDefault.length + index;
                      const isHighlighted = highlightedIndex === actualIndex;
                      const isSelected = selectedCategory?._id === category._id;

                      return (
                        <button
                          key={category._id}
                          ref={el => { itemRefs.current[actualIndex] = el; }}
                          type="button"
                          onClick={() => handleCategorySelect(category)}
                          onMouseEnter={() => setHighlightedIndex(actualIndex)}
                          className={`w-full min-h-[52px] px-3 py-2.5 rounded-xl flex items-center gap-3 transition-all ${
                            isHighlighted
                              ? 'bg-slate-800/80 ring-1 ring-sky-500/30'
                              : isSelected
                              ? 'bg-sky-500/10 border border-sky-500/20'
                              : 'hover:bg-slate-900/60'
                          }`}
                          role="option"
                          aria-selected={isSelected}
                        >
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border shadow-md"
                            style={{
                              backgroundColor: `${category.color}15`,
                              borderColor: `${category.color}30`,
                              boxShadow: isHighlighted ? `0 0 15px ${category.color}25` : undefined
                            }}
                          >
                            <HabitIcon icon={category.icon} color={category.color} size={14} />
                          </div>
                          <div className="flex-1 min-w-0 text-left">
                            <div className={`text-sm font-medium truncate ${
                              isSelected ? 'text-sky-400' : 'text-slate-200'
                            }`}>
                              {category.name}
                            </div>
                            {category.description && (
                              <div className="text-xs text-slate-500 truncate">
                                {category.description}
                              </div>
                            )}
                          </div>
                          {isSelected && (
                            <div className="w-2 h-2 rounded-full bg-sky-500 flex-shrink-0 shadow-lg shadow-sky-500/50" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Create Custom Category Button */}
          <div className="p-3 border-t border-slate-800">
            <button
              type="button"
              onClick={handleCreateCategory}
              onMouseEnter={() => setHighlightedIndex(allFilteredCategories.length)}
              className={`w-full touch-target px-4 bg-gradient-to-r from-sky-500/10 to-purple-600/10 border border-sky-500/20 hover:border-sky-500/40 rounded-xl flex items-center justify-center gap-2 transition-all text-sky-400 hover:text-sky-300 font-bold text-xs uppercase tracking-wider ${
                highlightedIndex === allFilteredCategories.length ? 'ring-1 ring-sky-500/30 bg-sky-500/15' : ''
              }`}
            >
              <Plus className="w-4 h-4" />
              Create Custom Category
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
