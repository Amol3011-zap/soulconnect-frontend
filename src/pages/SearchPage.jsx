import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search as SearchIcon, Eye, Clock } from 'lucide-react';
import api from '../services/api';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(query);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (query.trim()) {
      performSearch();
    }
  }, [query, selectedCategory]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const performSearch = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ q: query });
      if (selectedCategory) {
        params.append('category_id', selectedCategory);
      }
      const res = await api.get(`/search?${params}`);
      setResults(res.data);
    } catch (error) {
      console.error('Failed to search:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput, ...(selectedCategory && { category: selectedCategory }) });
    }
  };

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId);
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput, ...(categoryId && { category: categoryId }) });
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' }}>
      {/* Header */}
      <div style={{ padding: '48px 32px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 style={{ fontSize: '36px', fontWeight: '700', color: '#FFF', margin: '0 0 24px 0' }}>
              Search Emotion Library
            </h1>

            {/* Search Form */}
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px' }}>
              <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                background: 'rgba(34, 18, 73, 0.72)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
              }}>
                <SearchIcon size={20} style={{ color: 'rgba(255,255,255,0.5)' }} />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search guides..."
                  style={{
                    flex: 1,
                    background: 'none',
                    border: 'none',
                    color: '#FFF',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  padding: '12px 28px',
                  background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                Search
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '48px 32px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '32px' }}>
          {/* Sidebar Filters */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#A78BFA', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 16px 0' }}>
              Filter by Category
            </h3>

            <div style={{ display: 'grid', gap: '8px' }}>
              <button
                onClick={() => handleCategoryFilter('')}
                style={{
                  padding: '10px 12px',
                  background: !selectedCategory ? 'rgba(124, 58, 237, 0.2)' : 'rgba(255,255,255,0.05)',
                  border: !selectedCategory ? '1px solid rgba(124, 58, 237, 0.5)' : '1px solid rgba(255,255,255,0.1)',
                  color: !selectedCategory ? '#A78BFA' : 'rgba(255,255,255,0.6)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  textAlign: 'left',
                  fontWeight: '500',
                }}
              >
                All Categories
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryFilter(cat.id)}
                  style={{
                    padding: '10px 12px',
                    background: selectedCategory == cat.id ? 'rgba(124, 58, 237, 0.2)' : 'rgba(255,255,255,0.05)',
                    border: selectedCategory == cat.id ? '1px solid rgba(124, 58, 237, 0.5)' : '1px solid rgba(255,255,255,0.1)',
                    color: selectedCategory == cat.id ? '#A78BFA' : 'rgba(255,255,255,0.6)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    textAlign: 'left',
                    fontWeight: '500',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {loading ? (
              <div style={{ textAlign: 'center', padding: '48px', color: 'rgba(255,255,255,0.5)' }}>
                Searching...
              </div>
            ) : query.trim() === '' ? (
              <div style={{
                padding: '64px',
                textAlign: 'center',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                color: 'rgba(255,255,255,0.6)',
              }}>
                <p style={{ fontSize: '18px', margin: 0 }}>Enter a search term to get started</p>
              </div>
            ) : results.length === 0 ? (
              <div style={{
                padding: '64px',
                textAlign: 'center',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                color: 'rgba(255,255,255,0.6)',
              }}>
                <p style={{ fontSize: '18px', margin: 0 }}>No results found for "{query}"</p>
                <p style={{ fontSize: '14px', margin: '8px 0 0 0' }}>Try different keywords</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '16px' }}>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', margin: '0 0 16px 0' }}>
                  Found {results.length} {results.length === 1 ? 'result' : 'results'}
                </p>

                {results.map((guide, index) => (
                  <motion.div
                    key={guide.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: 8 }}
                    onClick={() => navigate(`/guides/${guide.slug}`)}
                    style={{
                      padding: '20px',
                      background: 'rgba(34, 18, 73, 0.72)',
                      backdropFilter: 'blur(24px)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#FFF', margin: '0 0 8px 0' }}>
                        {guide.title}
                      </h3>
                      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', margin: '0 0 12px 0', lineHeight: '1.5' }}>
                        {guide.excerpt || guide.meta_description || 'Evidence-based strategies for emotional wellness'}
                      </p>
                      <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                        <span>Category: {guide.category_name}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Eye size={12} />
                          {guide.view_count || 0} views
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
