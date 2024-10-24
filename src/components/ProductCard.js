import React from 'react';

const ProductCard = ({ product }) => {
    return (
        <div className="product-card">
            <img src={product.image} alt={product.title} />
            <h3>{product.title}</h3>
            <p>${product.price}</p>
            <div className="button-container">
                <button>Add to Cart</button>
                <button>View Details</button>
            </div>
        </div>
    );
};

export default ProductCard;
