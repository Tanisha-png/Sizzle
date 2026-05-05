import { useEffect, useState } from "react";
import AddRecipeForm from "./components/AddRecipeForm";
import RecipeCard from "./components/RecipeCard";

function App() {
  const [showDashboard, setShowDashboard] = useState(false); // State to toggle views
  const [recipes, setRecipes] = useState<any[]>([]);
  const [externalRecipes, setExternalRecipes] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchRecipes = () => {
    fetch("/api/recipes")
      .then((res) => res.json())
      .then((data) => setRecipes(data))
      .catch((err) => console.error("Error:", err));
  };

  // Only fetch recipes once the user enters the dashboard
  useEffect(() => {
    if (showDashboard) {
      fetchRecipes();
    }
  }, [showDashboard]);

  const searchExternalAPI = async (query: string) => {
    if (!query) {
      setExternalRecipes([]);
      return;
    }

    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`,
      );
      const data = await response.json();

      if (data.meals) {
        const normalized = data.meals.map((meal: any) => ({
          _id: meal.idMeal,
          title: meal.strMeal,
          instructions: meal.strInstructions,
          ingredients: Object.keys(meal)
            .filter((key) => key.includes("strIngredient") && meal[key])
            .map((key) => meal[key]),
          isExternal: true,
        }));
        setExternalRecipes(normalized);
      } else {
        setExternalRecipes([]);
      }
    } catch (err) {
      console.error("API Error:", err);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    searchExternalAPI(value);
  };

  const handleSave = async (recipe: any) => {
    try {
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: recipe.title,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
        }),
      });

      if (response.ok) {
        alert(`${recipe.title} saved to your collection!`);
        fetchRecipes();
      }
    } catch (err) {
      console.error("Error saving recipe:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;

    try {
      const response = await fetch(`/api/recipes/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchRecipes();
      }
    } catch (err) {
      console.error("Error deleting recipe:", err);
    }
  };

  const filteredLocal = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const allResults = [...filteredLocal, ...externalRecipes];

  // --- LANDING PAGE VIEW ---
  if (!showDashboard) {
    return (
      <div style={styles.landingContainer}>
        <h1 style={styles.landingHeader}>SIZZLE</h1>
        <p style={styles.landingTagline}>
          Your high-contrast kitchen companion.
        </p>
        <button style={styles.cookBtn} onClick={() => setShowDashboard(true)}>
          Let's Cook
        </button>
      </div>
    );
  }

  // --- DASHBOARD VIEW ---
  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Sizzle Dashboard</h1>

      <AddRecipeForm onRecipeAdded={fetchRecipes} />

      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search global recipes..."
          value={searchTerm}
          onChange={handleSearchChange}
          style={styles.searchInput}
        />
      </div>

      <div style={styles.cardGrid}>
        {allResults.length > 0 ? (
          allResults.map((recipe) => (
            <RecipeCard
              key={recipe._id}
              recipe={recipe}
              onSave={handleSave}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <p style={{ color: "#aaa" }}>
            No recipes found. Try searching for 'Chicken' or 'Cake'.
          </p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
    maxWidth: "1200px",
    margin: "auto",
    backgroundColor: "#121212",
    minHeight: "100vh",
    color: "#fff",
    fontFamily: "Inter, sans-serif",
  },
  header: {
    textAlign: "center" as const,
    fontSize: "2.5rem",
    marginBottom: "30px",
    letterSpacing: "-1px",
  },
  searchContainer: { marginBottom: "30px" },
  searchInput: {
    width: "100%",
    padding: "12px 20px",
    borderRadius: "8px",
    border: "1px solid #333",
    backgroundColor: "#1e1e1e",
    color: "#fff",
    fontSize: "1rem",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "25px",
  },
  landingContainer: {
    height: "100vh",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
    color: "#fff",
  },
  landingHeader: {
    fontSize: "5rem",
    color: "#ff4d4d",
    letterSpacing: "5px",
    margin: 0,
  },
  landingTagline: { fontSize: "1.2rem", color: "#888", marginBottom: "30px" },
  cookBtn: {
    padding: "15px 40px",
    fontSize: "1.2rem",
    backgroundColor: "#ff4d4d",
    color: "#fff",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    fontWeight: "bold" as const,
  },
};

export default App;
