import { Box } from "@mui/material";

import { TWnrsPlayer } from "../types/wnrs.types";
import { playerColors } from "../utils/wnrs.players";

interface IWnrsPlayerTagProps {
  player: TWnrsPlayer;
  name: string;
  size?: "sm" | "md";
}

const WnrsPlayerTag = ({ player, name, size = "md" }: IWnrsPlayerTagProps) => {
  const colors = playerColors[player];

  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        verticalAlign: "middle",
        borderRadius: "999px",
        background: colors.bg,
        color: colors.text,
        fontWeight: 800,
        lineHeight: 1,
        paddingX: size === "sm" ? 0.9 : 1.2,
        height: size === "sm" ? 22 : 30,
        fontSize: size === "sm" ? "0.82em" : "0.95em",
        maxWidth: "12ch",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
    >
      {name}
    </Box>
  );
};

export default WnrsPlayerTag;
