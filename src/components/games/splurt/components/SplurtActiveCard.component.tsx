import { Box, Typography } from "@mui/material";

import { ISplurtCard, TSplurtCardFace } from "../types/splurt.types";

interface ISplurtActiveCardProps {
  card: ISplurtCard;
  activeFace: TSplurtCardFace;
  onFlipCard: () => void;
  isVisible: boolean;
}

const sharedFaceStyles = {
  position: "absolute",
  inset: 0,
  borderRadius: "28px",
  padding: { xs: "18px", md: "32px" },
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
  textAlign: "center",
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
} as const;

const SplurtActiveCard = ({
  card,
  activeFace,
  onFlipCard,
  isVisible,
}: ISplurtActiveCardProps) => {
  return (
    <Box
      aria-label="Flip current Splurt card"
      component="button"
      onClick={onFlipCard}
      sx={{
        width: { xs: 216, sm: 320, md: 360 },
        height: { xs: 272, sm: 430, md: 470 },
        border: 0,
        padding: 0,
        background: "transparent",
        cursor: "pointer",
        perspective: "1600px",
        transform: isVisible
          ? "translate(0, 0) scale(1) rotate(0deg)"
          : "translate(-34vw, -24vh) scale(0.25) rotate(-18deg)",
        opacity: isVisible ? 1 : 0,
        transition:
          "transform 420ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 420ms ease",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transition: "transform 360ms ease",
          transform: activeFace === "category" ? "rotateY(0deg)" : "rotateY(180deg)",
          borderRadius: "28px",
          boxShadow: "0 28px 70px rgba(0,0,0,0.28)",
        }}
      >
        <Box
          sx={{
            ...sharedFaceStyles,
            border: "3px solid rgba(255,255,255,0.65)",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,244,234,0.92))",
            color: "#3a134d",
          }}
        >
          <Typography variant="overline" sx={{ letterSpacing: "0.2em", mb: 0 }}>
            CATEGORY
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              lineHeight: 1.1,
              mb: 0,
              fontSize: { xs: "2.1rem", md: "3rem" },
            }}
          >
            {card.category}
          </Typography>
          <Typography
            variant="body1"
            sx={{ maxWidth: 200, mb: 0, fontSize: { xs: "0.9rem", md: "1rem" } }}
          >
            Tap card to reveal the matching word rule.
          </Typography>
        </Box>

        <Box
          sx={{
            ...sharedFaceStyles,
            transform: "rotateY(180deg)",
            border: "3px solid rgba(255,255,255,0.4)",
            background:
              "linear-gradient(180deg, rgba(67, 16, 96, 0.96), rgba(223, 0, 121, 0.92))",
            color: "#fff7fb",
          }}
        >
          <Typography variant="overline" sx={{ letterSpacing: "0.2em", mb: 0 }}>
            RULE
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              lineHeight: 1.15,
              mb: 0,
              fontSize: { xs: "2.1rem", md: "3rem" },
            }}
          >
            {card.rule}
          </Typography>
          <Typography
            variant="body1"
            sx={{ maxWidth: 200, mb: 0, fontSize: { xs: "0.9rem", md: "1rem" } }}
          >
            Say a word that fits both sides, then tap again to flip back.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SplurtActiveCard;
