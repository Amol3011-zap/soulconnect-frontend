import React from 'react';
import SearchResultItem from './SearchResultItem';

export default function SearchCategory({ label, items, onClose }) {
  if (!items || items.length === 0) return null;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{
        fontSize: 10, fontWeight: 700, color: '#F4C542',
        textTransform: 'uppercase', letterSpacing: '0.12em',
        padding: '0 12px', marginBottom: 4,
      }}>
        {label}
      </div>
      <div>
        {items.map(item => (
          <SearchResultItem key={item.id} item={item} onClose={onClose} />
        ))}
      </div>
    </div>
  );
}
