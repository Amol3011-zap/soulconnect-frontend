import React from 'react';

export default function FormInput({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon,
  autoFocus,
  onShowPassword,
  showPassword,
}) {
  const isPassword = type === 'password';

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-gray-100">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
            {icon}
          </div>
        )}
        <input
          type={isPassword && showPassword ? 'text' : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={`w-full ${icon ? 'pl-12' : 'pl-4'} pr-4 py-3.5 rounded-xl border-2 text-gray-900 placeholder-gray-400 focus:outline-none transition-all ${
            error
              ? 'border-red-300 bg-red-50'
              : 'border-gray-200 bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-100'
          }`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={onShowPassword}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        )}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
