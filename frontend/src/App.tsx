import { useEffect, useState } from "react";
import AddRecipeForm from "./components/AddRecipeForm";
import RecipeCard from "./components/RecipeCard";
import sizzleVideo from "./assets/sizzle.mp4";

function App() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isDashboardExiting, setIsDashboardExiting] = useState(false); // New state for reverse transition
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
    if (showDashboard) {
      fetchRecipes();
    }
  }, [showDashboard]);

  // --- Transition Handlers ---
  const handleEnterApp = () => {
    setIsExiting(true);
    setTimeout(() => {
      setShowDashboard(true);
      setIsExiting(false); // Reset landing state for future returns
    }, 500);
  };

  const handleBackToLanding = () => {
    setIsDashboardExiting(true); // Trigger dashboard exit animation
    setTimeout(() => {
      setShowDashboard(false);
      setIsDashboardExiting(false); // Reset state after transition
    }, 500);
  };

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

  //? --- LANDING PAGE VIEW ---
  if (!showDashboard) {
    return (
      <div
        style={styles.landingContainer}
        className={isExiting ? "landing-exit" : ""}
      >
        <video autoPlay loop muted playsInline style={styles.videoBackground}>
          <source src={sizzleVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div style={styles.videoOverlay}></div>

        <div style={styles.contentWrapper}>
          <h1 style={styles.landingHeader}>SIZZLE</h1>
          <p style={styles.landingTagline}>
            Your high-contrast kitchen companion.
          </p>
          <button style={styles.cookBtn} onClick={handleEnterApp}>
            Let's Cook
          </button>
        </div>
      </div>
    );
  }

  //? --- DASHBOARD VIEW ---
  return (
    <div
      style={styles.container}
      className={isDashboardExiting ? "dashboard-exit" : "dashboard-enter"}
    >
      <div style={styles.navHeader}>
        <button style={styles.backBtn} onClick={handleBackToLanding}>
          ← Back to Kitchen
        </button>
        <h1 style={styles.header}>Sizzle Dashboard</h1>
      </div>

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
  navHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative" as const,
    marginBottom: "30px",
  },
  backBtn: {
    position: "absolute" as const,
    left: 0,
    backgroundColor: "transparent",
    color: "#ff4d4d",
    border: "1px solid #ff4d4d",
    padding: "8px 16px",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "bold" as const,
    transition: "all 0.2s ease",
  },
  header: {
    textAlign: "center" as const,
    fontSize: "2.5rem",
    margin: 0,
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
    position: "relative" as const,
    height: "100vh",
    width: "100vw",
    margin: 0,
    padding: 0,
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  videoBackground: {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    width: "100vw",
    height: "100vh",
    zIndex: 0,
    transform: "translateX(-50%) translateY(-50%)",
    objectFit: "cover" as const,
    filter: "brightness(0.5)",
  },
  videoOverlay: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 1,
  },
  contentWrapper: {
    position: "relative" as const,
    zIndex: 2,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    textAlign: "center" as const,
    width: "100%",
  },
  landingHeader: {
    fontSize: "7rem",
    color: "#ff4d4d",
    letterSpacing: "12px",
    margin: "0",
    fontWeight: "900" as const,
    lineHeight: "1",
  },
  landingTagline: {
    fontSize: "1.4rem",
    color: "#eee",
    marginTop: "40px",
    marginBottom: "40px",
    maxWidth: "600px",
    fontWeight: "300" as const,
    letterSpacing: "1px",
  },
  cookBtn: {
    padding: "18px 60px",
    fontSize: "1.3rem",
    backgroundColor: "#ff4d4d",
    color: "#fff",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    fontWeight: "bold" as const,
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)",
  },
};

export default App;
