import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import { FixedSizeList as List } from "react-window";

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Memoized book card component for better performance
const BookCard = React.memo(({ book }) => {
  console.time(`BookCard render - ${book.title}`);
  const result = (
    <div className="p-4 shadow border">
      <div className="text-lg font-semibold">{book.title}</div>
      <div className="text-sm text-gray-600">{book.author}</div>
      <p>Reading Status: {book.status}</p>
    </div>
  );
  console.timeEnd(`BookCard render - ${book.title}`);
  return result;
});

function ViewAll() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiTime, setApiTime] = useState(0);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  // Debounced search
  const debouncedSetSearch = useMemo(() => debounce(setSearch, 300), []);

  const fetchBooks = useCallback(async () => {
    console.time('API Call - Fetch Books');
    setLoading(true);
    const startTime = Date.now();
    try {
      // Only request needed fields
      const res = await axios.get(`${API_BASE_URL}/books?page=${page}&limit=${limit}&fields=title,author,status`);
      const endTime = Date.now();
      const duration = endTime - startTime;
      console.timeEnd('API Call - Fetch Books');
      setBooks(res.data.books);
      setTotal(res.data.total);
      setApiTime(duration);
    } catch (error) {
      console.error('API Error:', error);
      console.timeEnd('API Call - Fetch Books');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // Memoized filtered books to prevent unnecessary recalculations
  const filteredBooks = useMemo(() => {
    console.time('Filter Books');
    const filtered = books.filter(b =>
      b.title.toLowerCase().includes(search.toLowerCase())
    );
    console.timeEnd('Filter Books');
    return filtered;
  }, [books, search]);

  // Virtualized list row renderer
  const Row = ({ index, style }) => (
    <div style={style}>
      <BookCard book={filteredBooks[index]} />
    </div>
  );

  return (
    <div className="p-8">
      <div className="mb-4">
        <input
          type="text"
          placeholder="search book here.."
          className="border p-2 mb-4 w-full"
          onChange={e => debouncedSetSearch(e.target.value)}
        />
        {loading && <p className="text-blue-600">Loading books...</p>}
        {apiTime > 0 && <p className="text-sm text-gray-500">API Response: {apiTime}ms</p>}
      </div>
      <div className="mb-4 flex items-center gap-4">
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        <span>Page {page} / {Math.ceil(total / limit) || 1}</span>
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setPage(p => p + 1)}
          disabled={page >= Math.ceil(total / limit)}
        >
          Next
        </button>
      </div>
      {/* Virtualized list for large datasets */}
      <List
        height={600}
        itemCount={filteredBooks.length}
        itemSize={120}
        width={"100%"}
      >
        {Row}
      </List>
    </div>
  );
}

export default ViewAll;
