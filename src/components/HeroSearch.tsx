import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

const HeroSearch = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/sirketler?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Şirket adı ile ara..."
          className="h-14 w-full rounded-2xl border-2 border-primary-foreground/20 bg-primary-foreground/10 pl-14 pr-32 text-base text-primary-foreground placeholder:text-primary-foreground/40 backdrop-blur-sm transition-all focus:border-accent focus:bg-primary-foreground/15 focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground transition-all hover:bg-accent/90 hover:shadow-lg"
        >
          Ara
        </button>
      </div>
    </form>
  );
};

export default HeroSearch;
