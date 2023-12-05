import { useState, useEffect } from 'react';
import { Button } from '@mui/material';

import StyleIcon from '@mui/icons-material/Style';
import Ingredients from './ingredients/ingredients';
import Instructions from './instructions/instructions';
import Description from '../description/description';
import RecipeTags from '../tags/RecipeTags';
import RecipeBanner from './recipeBanner/recipeBanner';
import { getAllergens } from '../../lib/view-recipes';
import RecipeAllergens from '../allergens/allergens';
import Nutrition from './nutrition/nutrition';
import CookIcon from '../icons/CookIcon';
import ServingIcon from '../icons/ServingIcon';
import PrepIcon from '../icons/PrepIcon';

/**
 * Details Component
 *
 * @param {Object} props - Component properties
 * @param {Object} props.recipe - The recipe object containing various details.
 * @returns {JSX.Element} Details component
 */

function Details(props) {
  const { recipe } = props;

  const [toggleList, setToggleList] = useState(true);
  const [allergens, setAllergens] = useState([]);
  const [networkError, setNetworkError] = useState('');

  // Fetch allergens data from the server on component mount
  useEffect(() => {
    const callAllergens = async () => {
      try {
        const data = await getAllergens();
        setAllergens(data.allergens[0].allergens);
        return data.allergens[0].allergens;
      } catch (error) {
        setNetworkError(error);
        console.error(error);
      }
    };

    callAllergens();
  }, []);

  function toggleIngredients() {
    setToggleList(true);
  }

  function toggleInstructions() {
    setToggleList(false);
  }

  return (
    <>
      <div className="flex flex-col justify-between p-5 grid gap-2 xs:grid-cols-1 md:grid-cols-3 ">
        <div className="font-serif text-4xl text-center mb-5 xs:grid-cols-1 xs:block md:hidden">{recipe?.title}</div>
        {/* RecipeBanner component displaying recipe images */}

        <div className="md:mr-5 xs:col-span-1 md:col-span-1 top:10 ">
          <RecipeBanner images={recipe?.images} />
          <div className=" mt-10 container">
            <RecipeAllergens allergens={allergens} ingredients={recipe?.ingredients} />
          </div>
        </div>

        {/* Details about the recipe, including title, allergens, and other information */}
        <div className=" md:mt-0 md:ml-5 md:flex-grow xs:col-span-1 md:col-span-2">
          <div className="font-serif text-4xl text-center xs:hidden md:block">{recipe?.title}</div>
          <br />
          {/* Display allergens based on the provided allergens data */}
          {/* Display description of the recipe */}
          <p className=" ">
            <Description recipeId={recipe?._id} description={recipe?.description} />
          </p>
          {/* Display recipe details including cook time, prep time, and servings */}
          <div className="flex flex-col mt-5 md:flex-row md:space-x-4 md:space-y-0">
            <div className="flex items-center justify-center p-4 my-4 font-bold ">
              <CookIcon fill="#000000" width="35" height="35" />
              Cook time: {recipe?.cook} mins
            </div>

            <div className="flex items-center justify-center p-4 my-4 font-bold ">
              <PrepIcon fill="#000000" width="35" height="35" />
              Preparation time: {recipe?.prep} mins
            </div>

            <div className="flex items-center justify-center p-4 my-4 font-bold ">
              <ServingIcon width="25" height="25" fill="#000000" />
              Serves: {recipe?.servings}
            </div>
          </div>
          {/* Display recipe tags */}
          <div className="mt-5 flex flex-row items-center justify-center space-x-2">
            <StyleIcon />
            <RecipeTags tags={recipe?.tags} networkError={networkError} />
          </div>
          {/* Display nutrition information */}
          <div className="mt-5">
            <p className="font-sans font-bold text-center">Nutrition</p>
            <Nutrition nutritionList={recipe?.nutrition} />
          </div>
        </div>
      </div>

      {/* Responsive buttons for toggling between ingredients and instructions on small screens */}
      <div>
        <div className="block space-x-2 md:hidden text-center mb-5">
          <Button value="ingredients" variant={toggleList ? 'outlined' : 'text'} onClick={toggleIngredients}>
            Ingredients
          </Button>
          <Button value="instructions" variant={!toggleList ? 'outlined' : 'text'} onClick={toggleInstructions}>
            Instructions
          </Button>
        </div>

        {/* Display ingredients or instructions based on the toggle state */}
        <div className="grid gap-2 md:grid-cols-3">
          <div className={`md:block col-span-1 mb-5 ${toggleList ? 'xs:block' : 'xs:hidden'}`}>
            <p className="text-center text-lg font-bold md:block xs:hidden">Ingredients</p>
            <Ingredients ingredients={recipe?.ingredients} />
          </div>
          <div className={`md:block col-span-2 ${!toggleList ? 'xs:block' : 'xs:hidden'}`}>
            <p className="text-center  text-lg font-bold md:block xs:hidden">Instructions</p>
            <Instructions
              recipeId={recipe?._id}
              instructions={recipe?.instructions}
              description={recipe?.description}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Details;
