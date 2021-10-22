// Route-related
import { mainPage } from "routes";
import { useHistory } from "react-router";

// Common UI Components
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

// Styles
import { makeStyles } from "@mui/styles";

/**
 * Serves to redirect users back to Game Select Page.
 * Will render if route name is !== "/drinking-game" (controleld via App Component)
 * @param props 
 * @returns React.FC Component
 */
const GoBackToMainPage = (props: any) => {
    const history = useHistory();

    // Component styles
    const styles = makeStyles((theme: any) => ({
        root: {
            width: "100%",
            position: "fixed",
            bottom: "10px",
            left: 0,
            display: "flex",
            justifyContent: "center"
        }
    }))();

    const returnToMainPage = () => {
        history.push(mainPage)
    };

    return (
        <Box className={styles.root}>
            <Button variant="contained" onClick={returnToMainPage} color="secondary">
                Back to all games!
            </Button>
        </Box>
    );
}

export default GoBackToMainPage;