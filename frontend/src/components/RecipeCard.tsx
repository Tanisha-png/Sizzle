interface RecipeCardProps {
    recipe: any;
    onSave: (recipe: any) => void;
    onDelete: (id: string) => void;
    onEdit: (recipe: any) => void;
}

const RecipeCard = ({ recipe, onSave, onDelete, onEdit }: RecipeCardProps) => {
    return (
        <div style={styles.card} className="recipe-card">
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

            <div style={styles.buttonGroup}>
             {/* If it's a global recipe, show the Save button */ }
            {recipe.isExternal ? (
                <button style={styles.saveBtn} onClick={() => onSave(recipe)}>
                Save to My Collection
                </button>
            ) : (
                //? If it's a local recipe, show Edit and Delete buttons */
                <>
                <button
                    style={styles.editBtn}
                    onClick={() => onEdit(recipe)}
                >
                    Edit
                </button>
                <button
                    style={styles.deleteBtn}
                    onClick={() => onDelete(recipe._id)}
                >
                    Delete
                </button>
                </>
            )}
            </div>
        </div>
    );
    };

    const styles = {
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
    buttonGroup: { display: "flex", gap: "10px", marginTop: "15px" },
    saveBtn: {
        padding: "10px",
        backgroundColor: "transparent",
        border: "1px solid #ff4d4d",
        color: "#ff4d4d",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold" as const,
        flex: 1,
    },
    editBtn: {
        padding: "10px",
        backgroundColor: "#333",
        border: "1px solid #444",
        color: "#fff",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold" as const,
        flex: 1,
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

export default RecipeCard;
