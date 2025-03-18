// app/components/SearchBar.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

interface SearchBarProps {
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = "Buscar..." }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get("query") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set("query", query);
      params.set("page", "1"); // Resetear la página a 1 al buscar
    } else {
      params.delete("query");
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <div className="flex items-center border border-gray-300 rounded-lg shadow-sm">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2 text-sm text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 text-gray-500 hover:text-gray-700"
        >
          <FaSearch />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;