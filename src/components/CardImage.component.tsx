import CardMedia from "@mui/material/CardMedia";
import Card from "@mui/material/Card";

const CardImage = (props: any) => {
  const { cardStyles, ...rest } = props;
  return (
    <Card sx={{...cardStyles, backgroundColor: "transparent"}}>
      <CardMedia {...rest} height={0} />
    </Card>
  );
};

export default CardImage;
