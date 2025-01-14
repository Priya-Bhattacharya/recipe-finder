const searchBox = document.querySelector('.searchBox');
const searchBtn = document.querySelector('.searchBtn');
const recipeContainer = document.querySelector('.recipe-container');
const recipeDetails = document.querySelector('.recipe-details');
const recipeDetailsContent = document.querySelector('.recipe-details-content');
const recipeCloseBtn = document.querySelector('.recipe-close-btn');


const fetchRecipes = async (query) => {
  recipeContainer.innerHTML = "<h2>Fetching recipes....</h2>";
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const data = await response.json();


    console.log("Fetched Data:", data);



    if (data.meals) {
      recipeContainer.innerHTML = "";
      data.meals.forEach(meal => {
        const recipeDiv = document.createElement('div');
        recipeDiv.classList.add('recipe');
        recipeDiv.innerHTML = `
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
          <h3>${meal.strMeal}</h3>
          <p>${meal.strArea}</p>
          <p>${meal.strCategory}</p>
          <button type="button">View Recipe</button>
        `;

        recipeDiv.querySelector('button').addEventListener('click', () => {
          openRecipePopup(meal);
        });

        recipeContainer.appendChild(recipeDiv);
      });
    } else {
      recipeContainer.innerHTML = "<h2>No recipes found.</h2>";
    }
  } catch (error) {
    console.error("Error:", error);
    recipeContainer.innerHTML = "<h2>Error in Fetching Recipes...</h2>";
  }
};


const fetchIngredients = (meal) => {
  let ingredientsList = "";
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    if (ingredient) {
      const measure = meal[`strMeasure${i}`];
      ingredientsList += `<li>${measure} ${ingredient}</li>`;
    } else {
      break;
    }
  }
  return ingredientsList;
};

const openRecipePopup = (meal) => {
  recipeDetailsContent.innerHTML = `
    <h2 class="recipeName">${meal.strMeal}</h2>
    <h3>Ingredients:</h3>
    <ul class="ingredientList">${fetchIngredients(meal)}</ul>
    <div class="recipeInstructions">
      <h3>Instructions:</h3>
      <p>${meal.strInstructions}</p>
    </div>
  `;
  recipeDetails.style.display = "block";
};

recipeCloseBtn.addEventListener('click', () => {
  recipeDetails.style.display = "none";
});

// Search button 
searchBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const searchInput = searchBox.value.trim();
  if (!searchInput) {
    recipeContainer.innerHTML = "<h2>Type the meal in the search box.</h2>";
    return;
  }
  fetchRecipes(searchInput);
});
