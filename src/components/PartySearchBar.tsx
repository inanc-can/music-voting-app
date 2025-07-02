"use client";
import { useDebouncedCallback } from "use-debounce";
import { useState } from "react";

interface PartySearchBarProps {
  placeholder: string;
  onSearchChange: (query: string) => void;
  initialValue?: string;
  onLoadingChange?: (loading: boolean) => void;
}

export default function PartySearchBar({ 
  placeholder, 
  onSearchChange, 
  initialValue = "",
  onLoadingChange
}: PartySearchBarProps) {
  const [inputValue, setInputValue] = useState(initialValue);
  
  const handleSearch = useDebouncedCallback((term: string) => {
    onSearchChange(term);
  }, 300);

  const clearSearch = () => {
    setInputValue("");
    onSearchChange("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Show loading immediately when user types
    if (value.length > 0) {
      onLoadingChange?.(true);
    }
    
    handleSearch(value);
  };

  return (
    <div className="relative flex flex-1 flex-shrink-0 ">
      <label htmlFor="party-search" className="sr-only">
        Search
      </label>
      <input
        className="peer bg-white block w-full rounded-md border border-gray-200 py-[12px] pl-10 text-sm outline-2 placeholder:text-gray-500 text-gray-900"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        id="party-search"
      />
      {inputValue && (
        <button
          onClick={clearSearch}
          className="absolute inset-y-0 right-0 flex items-center pr-3"
          aria-label="Clear search"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
