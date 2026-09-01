import { Search, SlidersHorizontal } from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Popular' },
  { value: 'price_low', label: 'Lowest Price' },
  { value: 'price_high', label: 'Highest Price' },
];

export default function DesignFilters({ filters, categories, onChange }) {
  const update = (patch) => onChange({ ...filters, ...patch, page: 1 });

  return (
    <div className="card-surface p-4 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => update({ search: e.target.value })}
            placeholder="Search by design name or keyword…"
            className="input-field pl-10"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={filters.category}
            onChange={(e) => update({ category: e.target.value })}
            className="input-field w-auto min-w-[10rem]"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name} ({cat.designCount})</option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              value={filters.minPrice}
              onChange={(e) => update({ minPrice: e.target.value })}
              placeholder="Min $"
              className="input-field w-24"
            />
            <span className="text-ink/30">–</span>
            <input
              type="number"
              min="0"
              value={filters.maxPrice}
              onChange={(e) => update({ maxPrice: e.target.value })}
              placeholder="Max $"
              className="input-field w-24"
            />
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-ink/40" />
            <select
              value={filters.sort}
              onChange={(e) => update({ sort: e.target.value })}
              className="input-field w-auto"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
