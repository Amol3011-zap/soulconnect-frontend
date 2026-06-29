import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchInput({ value, onChange, onClear }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(168,85,247,0.35)',
      borderRadius: 16, padding: '12px 16px',
      marginBottom: 16,
      boxShadow: '0 0 0 3px rgba(124,58,237,0.08)',
    }}>
      <Search size={17} color="#A78BFA" style={{ flexShrink: 0 }} />
      <input
        autoFocus
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search people, circles, professionals, stories..."
        style={{
          flex: 1, background: 'none', border: 'none', outline: 'none',
          color: '#E2DEFF', fontSize: 14, fontFamily: 'Inter, sans-serif',
          caretColor: '#A855F7',
        }}
      />
      {value && (
        <button
          onClick={onClear}
          style={{
            background: 'rgba(255,255,255,0.08)', border: 'none',
            borderRadius: '50%', width: 20, height: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0, padding: 0,
          }}
        >
          <X size={12} color="#8A84B6" />
        </button>
      )}
    </div>
  );
}
