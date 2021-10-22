import { Box, Container } from "@mui/material";

const PageLayout = (props: any) => {
  return (
    <Container
      component="section"
      sx={{ width: "100%", height: "100%", ...props?.sx }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {props.children}
      </Box>
    </Container>
  );
};

export default PageLayout;
