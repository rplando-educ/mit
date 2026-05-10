import { IoSearch } from 'react-icons/io5';

export default function SearchBar({ value, onChange, placeholder = 'Search places, addresses, or notes' }) {
  return (
    <label className="flex min-h-11 items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <IoSearch />
      <input
        className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}
