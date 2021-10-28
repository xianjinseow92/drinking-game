import HashLoader from "react-spinners/HashLoader";
import PageLayout from "layout/PageLayout.component";
import theme from "styles/theme";

const LoadingSpinner = (props: any) => {
    return (
        <PageLayout>
            <HashLoader size={70} color={theme.palette.secondary.main} />
        </PageLayout>
    )
};

export default LoadingSpinner;