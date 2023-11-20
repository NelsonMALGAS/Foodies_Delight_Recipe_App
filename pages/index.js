import { useEffect, useContext, useState } from "react";
import Head from "next/head";
import RecipeList from "../components/recipe-collection/RecipeList";
import { getRecipes } from "./api/pre-render";
import SearchBar from "@/components/search-functionality/search-bar";
import { getViewRecipes } from "@/lib/view-recipes";
import { filterContext } from "@/components/search-functionality/filterContext";
import HandleError from "../components/error/Error";
import Animation from "@/components/skeletonCard/loadingAnimation/LoadingAnimation";
import CardSkeleton from "@/components/skeletonCard/skeleton";

const PAGE_SIZE = 48;

function Home(props) {
	const { visibleRecipes, count } = props;
	const { filters, filteredRecipes, setFilteredRecipes, sortOption  } = useContext(filterContext);

	const [remainingRecipes, setRemainingRecipes] = useState(count);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const runLoad = async () => {
			try {
				setLoading(true);
				if (JSON.stringify(filters) === "{}" && sortOption === "") {
					setFilteredRecipes(visibleRecipes);
				} else {
					await handleApplyFilters(filters, sortOption);
				}
			} finally {
				setLoading(false);
			}
		};
		runLoad();
	}, [filters]);

	const handleApplyFilters = async (filters) => {
		const filtering = await getViewRecipes(0, PAGE_SIZE, filters, sortOption);
		setFilteredRecipes(filtering?.recipes);
		setRemainingRecipes(filtering?.totalRecipes);
	};

	return (
		<div>
			<Head>
				<title>Foodie's Delight</title>
				<meta
					name="description"
					content="Welcome to Foodie's Delight, the ultimate companion for culinary enthusiasts and gastronomic adventurers! Unleash your inner chef and explore a world of delectable delights with our intuitive and feature-packed recipe app."
				/>
			</Head>
			<SearchBar
				applyFilters={handleApplyFilters}
				appliedFilters={filters}
				count={remainingRecipes}
			/>
			{loading ? (
				<>
					<CardSkeleton />
					<Animation />
				</>
			) : (!filteredRecipes )? (
				<HandleError>No recipes found!!</HandleError>
			) : (
				<RecipeList
					visibleRecipes={filteredRecipes}
					count={remainingRecipes}
					appliedFilters={filters}
					setRecipes={setFilteredRecipes}
				/>
			)}
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
			revalidate: 600,
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
