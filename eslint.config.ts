import ts from "typescript-eslint";


export default ts.config(
    ts.configs.recommended,
    {
        files: [
            "**/*.ts"
        ],
        rules: {
            "no-unused-vars": "warn",
            "no-console": "warn",
            "quotes": [
                "error",
                "double"
            ]
        }
    }
)

