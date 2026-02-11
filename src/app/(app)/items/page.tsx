'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { convertToUrl, getRarityClass } from '@/utils/utils';
import { ModalComponent } from '@/components/PlannerForm/ModalComponent';
import { Input } from '@/components/ui/input';
import { useDebounce } from 'use-debounce';

interface Item {
  id: number;
  name: string;
  attributes_description: string;
  bg_description: string;
  icon: string;
  icon_middle: string;
  icon_small: string;
  rarity: number;
}

export default function ItemList() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 200);
  const [selectedRarity, setSelectedRarity] = useState<number | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  // Modal state
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };
  const handleItemClick = (item: Item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  useEffect(() => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    fetch(`${basePath}/data/items_minified.json`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch items');
        return res.json();
      })
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        item.attributes_description.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
      const matchesRarity = selectedRarity === 'all' || item.rarity === selectedRarity;
      return matchesSearch && matchesRarity;
    });
  }, [items, debouncedSearchQuery, selectedRarity]);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredItems, currentPage]);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const rarities = useMemo(() => {
    const uniqueRarities = Array.from(new Set(items.map(item => item.rarity))).sort((a, b) => b - a);
    return uniqueRarities;
  }, [items]);

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <div className="text-[rgb(var(--text-secondary))]">Loading items...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <div className="text-[rgb(var(--text-secondary))]">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6 space-y-4">
        <Input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => {
            setCurrentPage(1);
            setSearchQuery(e.target.value);
          }}
          className="w-full px-4 py-2 bg-base-200 text-primary rounded-lg border border-base-300 focus:outline-none focus:ring-2 focus:ring-base-300"
        />

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedRarity('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${selectedRarity === 'all'
              ? 'bg-[rgb(var(--base-300))] text-[rgb(var(--text-primary))]'
              : 'bg-[rgb(var(--base-200))] text-[rgb(var(--text-secondary))]'
              }`}
          >
            All
          </button>
          {rarities.map((rarity) => (
            <button
              key={rarity}
              onClick={() => setSelectedRarity(rarity)}
              className={`px-4 py-2 rounded-lg transition-colors ${selectedRarity === rarity
                ? 'bg-[rgb(var(--base-300))] text-[rgb(var(--text-primary))]'
                : 'bg-[rgb(var(--base-200))] text-[rgb(var(--text-secondary))]'
                }`}
            >
              {rarity}★
            </button>
          ))}
        </div>

        <p className="text-[rgb(var(--text-secondary))] text-sm">
          Showing {filteredItems.length} of {items.length} items
        </p>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-3 py-2 bg-[rgb(var(--base-200))] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[rgb(var(--base-300))] transition-colors"
            >
              First
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 bg-[rgb(var(--base-200))] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[rgb(var(--base-300))] transition-colors"
            >
              Previous
            </button>

            {/* Page numbers */}
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                  // Show first page, last page, current page, and pages around current
                  if (page === 1 || page === totalPages) return true;
                  if (Math.abs(page - currentPage) <= 1) return true;
                  return false;
                })
                .map((page, idx, arr) => {
                  // Add ellipsis for gaps
                  const prevPage = arr[idx - 1];
                  const showEllipsis = prevPage && page - prevPage > 1;

                  return (
                    <div key={page} className="flex gap-1 items-center">
                      {showEllipsis && (
                        <span className="px-2 text-[rgb(var(--text-secondary))]">...</span>
                      )}
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg transition-colors ${currentPage === page
                          ? 'bg-[rgb(var(--base-300))] text-[rgb(var(--text-primary))] font-semibold'
                          : 'bg-[rgb(var(--base-200))] text-[rgb(var(--text-secondary))] hover:bg-[rgb(var(--base-300))]'
                          }`}
                      >
                        {page}
                      </button>
                    </div>
                  );
                })}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 bg-[rgb(var(--base-200))] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[rgb(var(--base-300))] transition-colors"
            >
              Next
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 bg-[rgb(var(--base-200))] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[rgb(var(--base-300))] transition-colors"
            >
              Last
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedItems.map((item) => (
          <div
            key={item.id}
            className="bg-[rgb(var(--base-200))] rounded-lg p-4 border border-[rgb(var(--base-300))] hover:border-[rgb(var(--text-secondary))] transition-colors"
          >
            <div className="flex items-start gap-4 mb-3">
              <button
                onClick={() => handleItemClick(item)}
                className={`
                  ${getRarityClass(item.rarity)}
                  w-16 h-16 rounded-lg flex-shrink-0 overflow-hidden
                  cursor-pointer hover:opacity-80 transition-opacity
                `}
              >
                <Image
                  src={convertToUrl(item.icon_middle)}
                  alt={item.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </button>
              <div className="flex-1 min-w-0">
                <h3 className="text-[rgb(var(--text-primary))] font-semibold mb-1 line-clamp-2">
                  {item.name}
                </h3>
                <p className="text-[rgb(var(--text-secondary))] text-sm">
                  {item.rarity}★ Rarity
                </p>
              </div>
            </div>

            <p className="text-[rgb(var(--text-secondary))] text-sm italic mb-3">
              {item.bg_description}
            </p>

            <div className="text-[rgb(var(--text-primary))] text-sm whitespace-pre-line">
              {item.attributes_description}
            </div>
          </div>
        ))}
      </div>

      <ModalComponent show={showModal} onClose={handleCloseModal}>
        {selectedItem && (
          <div className="max-w-2xl">
            <div className="flex items-start gap-6 mb-6">
              <div className={`
                ${getRarityClass(selectedItem.rarity)}
                w-32 h-32 rounded-lg flex-shrink-0 overflow-hidden
              `}>
                <Image
                  src={convertToUrl(selectedItem.icon)}
                  alt={selectedItem.name}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-[rgb(var(--text-primary))] mb-2">
                  {selectedItem.name}
                </h2>
                <p className="text-[rgb(var(--text-secondary))] mb-1">
                  ID: {selectedItem.id}
                </p>
                <p className="text-[rgb(var(--text-secondary))]">
                  Rarity: {selectedItem.rarity}★
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-[rgb(var(--text-primary))] mb-2">
                  Description
                </h3>
                <p className="text-[rgb(var(--text-secondary))] italic">
                  {selectedItem.bg_description}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[rgb(var(--text-primary))] mb-2">
                  Attributes
                </h3>
                <div className="text-[rgb(var(--text-primary))] whitespace-pre-line">
                  {selectedItem.attributes_description}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[rgb(var(--text-primary))] mb-2">
                  Icons
                </h3>
                <div className="flex gap-4">
                  <div className="text-center">
                    <Image
                      src={convertToUrl(selectedItem.icon_small)}
                      alt="Small icon"
                      width={32}
                      height={32}
                      className="rounded mb-1"
                    />
                    <p className="text-xs text-[rgb(var(--text-secondary))]">Small</p>
                  </div>
                  <div className="text-center">
                    <Image
                      src={convertToUrl(selectedItem.icon_middle)}
                      alt="Medium icon"
                      width={64}
                      height={64}
                      className="rounded mb-1"
                    />
                    <p className="text-xs text-[rgb(var(--text-secondary))]">Medium</p>
                  </div>
                  <div className="text-center">
                    <Image
                      src={convertToUrl(selectedItem.icon)}
                      alt="Large icon"
                      width={128}
                      height={128}
                      className="rounded mb-1"
                    />
                    <p className="text-xs text-[rgb(var(--text-secondary))]">Large</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </ModalComponent>
    </div>
  );
}