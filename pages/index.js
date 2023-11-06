import React, { useEffect, useContext } from "react";
import Head from "next/head";
import RecipeList from "../components/recipe-collection/RecipeList";
import { getRecipes } from "./api/pre-render";
import SearchBar from "@/components/search-functionality/search-bar";
import { getViewRecipes } from "@/lib/view-recipes";
import { filterContext } from "@/components/search-functionality/filterContext";
import Description from '../components/description/description';
import Instructions from '../components/details/instructions/instructions';
import RecipeTags from '../components/tags/RecipeTags';
import HandleNetworkError from '../components/network-error/NetworkError'

const PAGE_SIZE = 48;

function Home({ visibleRecipes, count }) {
	const { filters , filteredRecipes, setFilteredRecipes, sortOption, setSortOption } = useContext(filterContext);

	useEffect(() => {
		setFilteredRecipes(visibleRecipes);
	}, []);

	const handleApplyFilters = async (filters, sort) => {
		const filtering = await getViewRecipes(0, PAGE_SIZE, filters, sort);
		setFilteredRecipes(filtering.recipes);
	};

	return (
		<div>
			<SearchBar
				applyFilters={handleApplyFilters}
				appliedFilters={filters}
				sortOption={sortOption}
				setSortOption={setSortOption}
			/>
			<RecipeList
				visibleRecipes={filteredRecipes}
				count={count}
				appliedFilters={filters}
				setRecipes={setFilteredRecipes}
			/>
		</div>
	);
}

export async function getStaticProps() {

	try {
		const { recipes, count } = await getRecipes(48);
		return {
			props: {
				visibleRecipes: recipes,
				count,
			},
			revalidate: 60,
		};
	} catch (error) {
		return {
			props: {
				error: "Failed to fetch data",
			},
		};
	}
}

export default Home;