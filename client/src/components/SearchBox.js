/**
 * Component for searching GitHub users.
 */
// Component for searching GitHub users
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SearchBox.css';

const SearchBox = () => {
    // State management for search functionality
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Handle search form submission
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        
        setLoading(true);
        try {
            // Make API call to search users
            const response = await fetch(`http://localhost:5000/api/search/users/${encodeURIComponent(query)}`);
            const data = await response.json();
            console.log('Search results:', data);
            setResults(data.items || []);
        } catch (error) {
            console.error('Search error:', error);
            setResults([]);
        }
        setLoading(false);
    };

    return (
        <div className="search-container">
            {/* Search form */}
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search GitHub users..."
                    required
                    minLength={1}
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>
            
            {/* Loading indicator */}
            {loading && <div className="loader">Loading...</div>}
            
            {/* Search results */}
            <div className="results">
                {results.length > 0 ? (
                    results.map(user => (
                        <div 
                            key={user.id} 
                            className="user-card"
                            onClick={() => navigate(`/user/${user.login}`)}
                        >
                            <img src={user.avatar_url} alt={user.login} />
                            <h3>{user.login}</h3>
                        </div>
                    ))
                ) : (
                    query && !loading && <p>No users found</p>
                )}
            </div>
        </div>
    );
};

export default SearchBox;
