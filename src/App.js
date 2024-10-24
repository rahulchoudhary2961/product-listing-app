import React, { useEffect, useState } from 'react';
import ProductList from './components/ProductList';
import SearchBar from './components/SearchBar';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import { fetchProducts } from './utils/api';

const App = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [visibleCount, setVisibleCount] = useState(10);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [sortOption, setSortOption] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await fetchProducts();
                setProducts(data);
                setFilteredProducts(data);
            } catch (error) {
                setError('Failed to fetch products. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    useEffect(() => {
        let results = products;

        // Apply filters
        if (categoryFilter) {
            results = results.filter(product => product.category === categoryFilter);
        }

        // Sort products
        if (sortOption === 'lowToHigh') {
            results.sort((a, b) => a.price - b.price);
        } else if (sortOption === 'highToLow') {
            results.sort((a, b) => b.price - a.price);
        }

        // Search functionality
        if (searchTerm) {
            results = results.filter(product =>
                product.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredProducts(results);
    }, [searchTerm, categoryFilter, sortOption, products]);

    const handleLoadMore = () => {
        setVisibleCount(prev => Math.min(prev + 10, filteredProducts.length));
    };

    return (
        <div>
            <Navbar />
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <select onChange={(e) => setCategoryFilter(e.target.value)} value={categoryFilter}>
                <option value="">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="jewelery">Jewelry</option>
                <option value="men's clothing">Men's Clothing</option>
                <option value="women's clothing">Women's Clothing</option>
            </select>
            <select onChange={(e) => setSortOption(e.target.value)} value={sortOption}>
                <option value="">Sort by</option>
                <option value="lowToHigh">Price: Low to High</option>
                <option value="highToLow">Price: High to Low</option>
            </select>
            {loading ? (
                <Loader />
            ) : (
                <>
                    {error && <p className="error-message">{error}</p>}
                    <ProductList products={filteredProducts.slice(0, visibleCount)} />
                    {visibleCount < filteredProducts.length && (
                        <button onClick={handleLoadMore}>Load More</button>
                    )}
                </>
            )}
        </div>
    );
};

export default App;
