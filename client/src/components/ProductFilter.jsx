import React from 'react';
import { SlidersHorizontal, ArrowUpDown, Check } from 'lucide-react';

export default function ProductFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  sortOption,
  onSortChange,
  inStockOnly,
  onToggleInStock,
  productCount,
}) {
  return (
    <div className="catalog-header" id="catalog-controls-container">
      {/* Title & Count */}
      <div className="catalog-title-wrap">
        <h2>
          Curated <span className="gradient-text-cyan">Innovations</span>
        </h2>
        <p style={{ fontSize: '0.86rem' }}>
          Displaying {productCount} bespoke luxury devices
        </p>
      </div>

      {/* Categories & Filter Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
          }}
        >
          {/* Category Pills */}
          <div className="filter-pills-row" id="category-pills-row">
            {categories.map((cat) => (
              <button
                key={cat}
                id={`filter-pill-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => onSelectCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort & In-stock toggle */}
          <div className="catalog-controls">
            {/* In-Stock Toggle */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.82rem',
                color: inStockOnly ? '#00f2fe' : '#94a3b8',
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              <input
                id="filter-in-stock-checkbox"
                type="checkbox"
                checked={inStockOnly}
                onChange={onToggleInStock}
                style={{ accentColor: '#00f2fe' }}
              />
              <span>In Stock Only</span>
            </label>

            {/* Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ArrowUpDown size={14} color="#94a3b8" />
              <select
                id="catalog-sort-select"
                className="sort-select"
                value={sortOption}
                onChange={(e) => onSortChange(e.target.value)}
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest Releases</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
