import { useEffect, useState } from "react";
import AddRecipeForm from "./components/AddRecipeForm";

function App() {
  const [recipes, setRecipes] = useState<any[]>([]);

  const fetchRecipes = () => {
    fetch("/api/recipes")
      .then((res) => res.json())
      .then((data) => setRecipes(data))
      .catch((err) => console.error("Error:", err));
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <div style={{ padding: "40px", maxWidth: "600px", margin: "auto" }}>
      <h1>Sizzle Recipe Dashboard</h1>

      {/* Our new Form */}
      <AddRecipeForm onRecipeAdded={fetchRecipes} />

      <hr />

      {recipes.length > 0 ? (
        <ul>
          {recipes.map((recipe) => (
            <li key={recipe._id} style={{ marginBottom: "15px" }}>
              <strong>{recipe.title}</strong>
              <p style={{ fontSize: "0.9em", color: "#666" }}>
                {recipe.instructions}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No recipes found. Start cooking!</p>
      )}
    </div>
  );
}

export default App;
