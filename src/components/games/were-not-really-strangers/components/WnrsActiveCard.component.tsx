import { Box, Typography } from "@mui/material";

import { IWnrsCard } from "../types/wnrs.types";

interface IWnrsActiveCardProps {
  card: IWnrsCard;
  eyebrow: string;
  isVisible: boolean;
}

const faceStylesByKind = {
  prompt: {
    background: "#fff7ef",
    color: "#3a134d",
    border: "4px solid rgba(255, 241, 227, 0.98)",
  },
  wildcard: {
    background: "#5e1766",
    color: "#fff7fb",
    border: "4px solid rgba(255, 208, 154, 0.65)",
  },
  final: {
    background: "#ffbf8f",
    color: "#5a145f",
    border: "4px solid rgba(255, 241, 227, 0.98)",
  },
} as const;

const WnrsActiveCard = ({ card, eyebrow, isVisible }: IWnrsActiveCardProps) => {
  const faceStyles = faceStylesByKind[card.kind];
  const isLongText = card.text.length > 120;

  return (
    <Box
      role="article"
      aria-label={`${eyebrow} card`}
      sx={{
        width: { xs: "min(92vw, 340px)", sm: 400, md: 460 },
        minHeight: { xs: 300, sm: 400, md: 440 },
        borderRadius: "28px",
        padding: { xs: "22px", md: "34px" },
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-start",
        textAlign: "left",
        gap: { xs: 1.5, md: 2 },
        boxShadow: "0 28px 70px rgba(0,0,0,0.28)",
        transform: isVisible
          ? "translateY(0) scale(1)"
          : "translateY(28px) scale(0.96)",
        opacity: isVisible ? 1 : 0,
        transition:
          "transform 360ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 360ms ease",
        ...faceStyles,
      }}
    >
      <Typography
        variant="overline"
        sx={{
          mb: 0,
          letterSpacing: "0.22em",
          fontWeight: 700,
          opacity: 0.8,
          textAlign: "left",
        }}
      >
        {eyebrow}
      </Typography>

      <Typography
        variant="h4"
        component="p"
        sx={{
          mb: 0,
          fontWeight: 700,
          lineHeight: 1.18,
          textAlign: "left",
          fontSize: isLongText
            ? { xs: "1.25rem", md: "1.7rem" }
            : { xs: "1.55rem", md: "2.15rem" },
        }}
      >
        {card.text}
      </Typography>

      <Typography
        variant="body2"
        sx={{ mb: 0, opacity: 0.7, textAlign: "left", alignSelf: "flex-end" }}
      >
        We're Not Really Strangers
      </Typography>
    </Box>
  );
};

export default WnrsActiveCard;
