import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './recipes.css';
import { useLocation } from 'react-router-dom';
const Recipes = () => {
  const location = useLocation();
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(location.state?.selectedRecipe || null); // Check for pre-selected recipe
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("https://thenaanstop.onrender.com/recipes");
        setRecipes(response.data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
      setIsLoading(false);
    };
    fetchRecipes();
  }, []);

  const openRecipeModal = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const closeRecipeModal = () => {
    setSelectedRecipe(null);
  };

  // Filter recipes based on the search term and selected category
  const filteredRecipes = recipes
    .filter((recipe) =>
      recipe.dishName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((recipe) => selectedCategory === '' || recipe.categorie === selectedCategory);

  return (
    
    <div className="recipes-container">
      
      <h1 className="recipes-title">All Recipes</h1>

      {/* Search bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍 Search recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Category filter buttons */}
      <div className="category-buttons">
        <button
          className={selectedCategory === '' ? 'active' : ''}
          onClick={() => setSelectedCategory('')}
        >
          <span>All</span>
        </button>
        <button
          className={selectedCategory === 'Veg' ? 'active' : ''}
          onClick={() => setSelectedCategory('Veg')}
        >
          <span>Veg</span>
        </button>
        <button
          className={selectedCategory === 'Non-Veg' ? 'active' : ''}
          onClick={() => setSelectedCategory('Non-Veg')}
        >
          <span>Non Veg</span>
        </button>
        <button
          className={selectedCategory === 'Eggetarian' ? 'active' : ''}
          onClick={() => setSelectedCategory('Eggetarian')}
        >
          <span>Eggetarian</span>
        </button>
      </div>

      {isLoading ? (
        <div className="loading-animation">
          <div className="dot-spinner">
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
          </div>
        </div>
      ) : (
        <div className="recipes-list">
          {filteredRecipes.map((recipe) => (
            <div key={recipe._id} className="recipe-card" onClick={() => openRecipeModal(recipe)}>
              <img src={recipe.imageUr || 'placeholder.jpg'} alt={recipe.dishName} className="recipe-image" />
              <div className="recipe-content">
                <h2 className="recipe-name">{recipe.dishName}</h2>
                <p><strong>Category:</strong> {recipe.categorie}</p>
                <p><strong>Cooking Time:</strong> {recipe.cookingTime} minutes</p>
                <p><strong>Difficulty:</strong> {recipe.difficulty}</p>
                <p className="recipe-description">{recipe.instructions.slice(0, 100)}...</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedRecipe && (
        <div className="modal-overlay" onClick={closeRecipeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeRecipeModal}>&times;</button>
            <h2 className='overlay-dishName'>{selectedRecipe.dishName}</h2>
            <img src={selectedRecipe.imageUr || 'placeholder.jpg'} alt={selectedRecipe.dishName} className="modal-image" />
            <p><strong>Category:</strong> {selectedRecipe.categorie}</p>
            <p><strong>Cooking Time:</strong> {selectedRecipe.cookingTime} minutes</p>
            <p><strong>Servings:</strong> {selectedRecipe.servings}</p>
            <p><strong>Difficulty:</strong> {selectedRecipe.difficulty}</p>
            <p><strong>Ingredients:</strong> {selectedRecipe.ingredients.join(', ')}</p>
            <p><strong>Instructions:</strong> {selectedRecipe.instructions}</p>
            <p><strong>Author:</strong> {selectedRecipe.author}</p>
            
            {/* Display YouTube video preview in modal if yt_link exists */}
            {selectedRecipe.yt_link && (
              <div className="yt-preview-box">
                <iframe
                  width="100%"
                  height="315"
                  src={`https://www.youtube.com/embed/${selectedRecipe.yt_link.split("v=")[1]}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Recipes;
