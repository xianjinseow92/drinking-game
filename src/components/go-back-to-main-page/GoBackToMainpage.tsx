// Route-related
import { mainPage } from "routes";
import { useHistory } from "react-router";

// Common UI Components
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

/**
 * Serves to redirect users back to Game Select Page.
 * Will render if route name is !== "/drinking-game" (controleld via App Component)
 * @param props 
 * @returns React.FC Component
 */
const GoBackToMainPage = (props: any) => {
    const history = useHistory();

    const returnToMainPage = () => {
        history.push(mainPage)
    };

    return (
        <Box
            sx={{
                width: "100%",
                position: "fixed",
                top: { xs: "calc(env(safe-area-inset-top, 0px) + 8px)", md: "auto" },
                bottom: { xs: "auto", md: "10px" },
                left: 0,
                display: "flex",
                justifyContent: { xs: "flex-start", md: "center" },
                paddingX: { xs: 1, md: 0 },
                zIndex: 10,
                pointerEvents: "none"
            }}
        >
            <Button
                variant="contained"
                onClick={returnToMainPage}
                color="secondary"
                sx={{
                    pointerEvents: "auto",
                    borderRadius: "999px",
                    minHeight: { xs: 38, md: 48 },
                    minWidth: { xs: 0, md: "auto" },
                    paddingX: { xs: 1.5, md: 3 },
                    fontSize: { xs: "0.72rem", md: "0.9rem" }
                }}
            >
                <Box component="span" sx={{ display: { xs: "inline", md: "none" } }}>
                    Back
                </Box>
                <Box component="span" sx={{ display: { xs: "none", md: "inline" } }}>
                    Back to all games!
                </Box>
            </Button>
        </Box>
    );
}

export default GoBackToMainPage;
