import connectToDatabase from "../../database/dataLayer";


export async function getRecipes(limit = 48) {
  try {
    const database = await connectToDatabase();
    const collection = database.collection("recipes");

    const documents = await collection.find({}).limit(limit).toArray();
    const number = await collection.countDocuments();

    return { recipes: documents, count: number };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Data fetching failed");
  }
}
