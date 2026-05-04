import { useEffect, useState } from "react";
import AddRecipeForm from "./components/AddRecipeForm";

function App() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState(""); // New search state

  const fetchRecipes = () => {
    fetch("/api/recipes")
      .then((res) => res.json())
      .then((data) => setRecipes(data))
      .catch((err) => console.error("Error:", err));
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  // Filter recipes based on the search input
  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Sizzle Dashboard</h1>

      <AddRecipeForm onRecipeAdded={fetchRecipes} />

      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search recipes (e.g. 'Shrimp')..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      <div style={styles.cardGrid}>
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
            <div key={recipe._id} style={styles.card}>
              <h2 style={styles.cardTitle}>{recipe.title}</h2>
              <div style={styles.badgeContainer}>
                {recipe.ingredients?.map((ing: string, i: number) => (
                  <span key={i} style={styles.badge}>
                    {ing}
                  </span>
                ))}
              </div>
              <p style={styles.instructions}>{recipe.instructions}</p>
              <button style={styles.saveBtn}>Save for Later</button>
            </div>
          ))
        ) : (
          <p style={{ color: "#aaa" }}>No recipes match your search.</p>
        )}
      </div>
    </div>
  );
}

// Clean, high-contrast styles
const styles = {
  container: {
    padding: "40px",
    maxWidth: "900px",
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
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "#1e1e1e",
    border: "1px solid #333",
    borderRadius: "12px",
    padding: "20px",
    transition: "transform 0.2s",
    display: "flex",
    flexDirection: "column" as const,
  },
  cardTitle: { margin: "0 0 10px 0", color: "#ff4d4d" }, // Sizzle Red
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
    fontSize: '0.95rem', 
    color: '#ddd', 
    lineHeight: '1.8', // Increased for better readability
    flexGrow: 1,
    whiteSpace: 'pre-wrap', // This preserves line breaks from your database
    borderTop: '1px solid #333', // Subtle separator
    paddingTop: '15px',
    marginTop: '15px'
  },
  sectionTitle: {
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    color: '#ff4d4d',
    letterSpacing: '1px',
    marginBottom: '5px',
    display: 'block'
  },
  saveBtn: {
    marginTop: "15px",
    padding: "10px",
    backgroundColor: "transparent",
    border: "1px solid #ff4d4d",
    color: "#ff4d4d",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default App;
