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
  padding: { xs: "18px", md: "30px" },
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  textAlign: "left",
  gap: { xs: 1, md: 1.5 },
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
} as const;

const getRuleParts = (rule: string) => {
  const letterRuleMatch = rule.match(/^(Beginning with|Ending with) ([A-Z]+)$/);

  if (letterRuleMatch) {
    return {
      lead: letterRuleMatch[1],
      emphasis: letterRuleMatch[2],
    };
  }

  return {
    lead: rule,
    emphasis: null,
  };
};

const SplurtActiveCard = ({
  card,
  activeFace,
  onFlipCard,
  isVisible,
}: ISplurtActiveCardProps) => {
  const ruleParts = getRuleParts(card.rule);

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
            border: "4px solid rgba(255, 241, 227, 0.98)",
            background: "#ffbf8f",
            color: "#5a145f",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              lineHeight: 1.02,
              mb: 0,
              fontSize: { xs: "2.05rem", md: "3.35rem" },
              maxWidth: "100%",
              marginTop: { xs: 0.5, md: 1 },
            }}
          >
            {card.category}
          </Typography>
        </Box>

        <Box
          sx={{
            ...sharedFaceStyles,
            transform: "rotateY(180deg)",
            border: "4px solid rgba(255, 208, 154, 0.65)",
            background: "#5e1766",
            color: "#fff7fb",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              lineHeight: 1.05,
              mb: 0,
              fontSize: { xs: "1.7rem", md: "2.65rem" },
              maxWidth: "100%",
            }}
          >
            {ruleParts.lead}
          </Typography>
          {ruleParts.emphasis ? (
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                lineHeight: 1,
                mb: 0,
                fontSize: { xs: "5.1rem", md: "7.8rem" },
                alignSelf: "center",
                marginTop: { xs: 1, md: 2 },
              }}
            >
              {ruleParts.emphasis}
            </Typography>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
};

export default SplurtActiveCard;
