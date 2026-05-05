import { useEffect, useState } from "react";
import AddRecipeForm from "./components/AddRecipeForm";

function App() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [externalRecipes, setExternalRecipes] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchRecipes = () => {
    fetch("/api/recipes")
      .then((res) => res.json())
      .then((data) => setRecipes(data))
      .catch((err) => console.error("Error:", err));
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

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

  //? --- NEW: Handle Delete ---
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
            <div key={recipe._id} style={styles.card}>
              <h2 style={styles.cardTitle}>
                {recipe.title}
                {recipe.isExternal && <span style={styles.apiTag}>Global</span>}
              </h2>

              <span style={styles.sectionTitle}>Ingredients</span>
              <div style={styles.badgeContainer}>
                {recipe.ingredients?.map((ing: string, i: number) => (
                  <span key={i} style={styles.badge}>
                    {ing}
                  </span>
                ))}
              </div>

              <span style={styles.sectionTitle}>Instructions</span>
              <p style={styles.instructions}>{recipe.instructions}</p>

              {/* Updated Button Group */}
              <div style={styles.buttonGroup}>
                <button
                  style={styles.saveBtn}
                  onClick={() =>
                    recipe.isExternal ? handleSave(recipe) : null
                  }
                  disabled={!recipe.isExternal}
                >
                  {recipe.isExternal ? "Save to My Collection" : "Saved"}
                </button>

                {!recipe.isExternal && (
                  <button
                    style={styles.deleteBtn}
                    onClick={() => handleDelete(recipe._id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
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
  card: {
    backgroundColor: "#1e1e1e",
    border: "1px solid #333",
    borderRadius: "12px",
    padding: "20px",
    display: "flex",
    flexDirection: "column" as const,
  },
  cardTitle: {
    margin: "0 0 10px 0",
    color: "#ff4d4d",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  apiTag: {
    fontSize: "0.6rem",
    backgroundColor: "#ff4d4d",
    color: "#fff",
    padding: "2px 6px",
    borderRadius: "4px",
    textTransform: "uppercase" as const,
  },
  badgeContainer: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "5px",
    marginBottom: "15px",
  },
  badge: {
    backgroundColor: "#333",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "0.75rem",
    color: "#bbb",
  },
  instructions: {
    fontSize: "0.95rem",
    color: "#ddd",
    lineHeight: "1.8",
    flexGrow: 1,
    whiteSpace: "pre-wrap" as const,
    borderTop: "1px solid #333",
    paddingTop: "15px",
    marginTop: "15px",
  },
  sectionTitle: {
    fontSize: "0.8rem",
    textTransform: "uppercase" as const,
    color: "#ff4d4d",
    letterSpacing: "1px",
    marginBottom: "5px",
    display: "block",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
    marginTop: "15px",
  },
  saveBtn: {
    padding: "10px",
    backgroundColor: "transparent",
    border: "1px solid #ff4d4d",
    color: "#ff4d4d",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold" as const,
    flex: 2,
  },
  deleteBtn: {
    padding: "10px",
    backgroundColor: "transparent",
    border: "1px solid #444",
    color: "#888",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold" as const,
    flex: 1,
  },
};

export default App;
