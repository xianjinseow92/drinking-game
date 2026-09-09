import { KeyboardEvent } from "react";

import { Box, Typography } from "@mui/material";

import { IWnrsCard } from "../types/wnrs.types";

type TWnrsCardSize = "default" | "focus";

interface IWnrsActiveCardProps {
  card: IWnrsCard;
  eyebrow: string;
  isVisible: boolean;
  /** "focus" is the blown-up face used inside the overlay. */
  size?: TWnrsCardSize;
  /** When given, the whole card becomes the control that opens the overlay. */
  onClick?: () => void;
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

const sizeStyles = {
  default: {
    width: { xs: "min(92vw, 340px)", sm: 400, md: 460 },
    minHeight: { xs: 300, sm: 400, md: 440 },
    padding: { xs: "22px", md: "34px" },
  },
  focus: {
    width: { xs: "min(94vw, 460px)", sm: 460, md: 520 },
    minHeight: { xs: "min(60vh, 520px)", md: 540 },
    padding: { xs: "26px", md: "38px" },
  },
} as const;

const textSizes = {
  default: {
    long: { xs: "1.25rem", md: "1.7rem" },
    short: { xs: "1.55rem", md: "2.15rem" },
  },
  focus: {
    long: { xs: "1.45rem", md: "1.95rem" },
    short: { xs: "1.85rem", md: "2.45rem" },
  },
} as const;

const WnrsActiveCard = ({
  card,
  eyebrow,
  isVisible,
  size = "default",
  onClick,
}: IWnrsActiveCardProps) => {
  const faceStyles = faceStylesByKind[card.kind];
  const isLongText = card.text.length > 120;
  const isInteractive = Boolean(onClick);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!onClick || (event.key !== "Enter" && event.key !== " ")) {
      return;
    }
    event.preventDefault();
    onClick();
  };

  return (
    <Box
      data-testid="active-card"
      data-kind={card.kind}
      role={isInteractive ? "button" : "article"}
      aria-label={
        isInteractive ? `Focus card: ${card.text}` : `${eyebrow} card`
      }
      tabIndex={isInteractive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      sx={{
        ...sizeStyles[size],
        borderRadius: "28px",
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
          "transform 360ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 360ms ease, box-shadow 200ms ease",
        ...(isInteractive
          ? {
              cursor: "pointer",
              userSelect: "none",
              "&:hover": { boxShadow: "0 32px 80px rgba(0,0,0,0.38)" },
              "&:active": {
                transform: isVisible ? "translateY(0) scale(0.985)" : undefined,
              },
              "&:focus-visible": {
                outline: "3px solid #ffd166",
                outlineOffset: "4px",
              },
            }
          : {}),
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
        data-testid="active-card-text"
        variant="h4"
        component="p"
        sx={{
          mb: 0,
          fontWeight: 700,
          lineHeight: 1.18,
          textAlign: "left",
          fontSize: isLongText
            ? textSizes[size].long
            : textSizes[size].short,
        }}
      >
        {card.text}
      </Typography>

      <Typography
        variant="body2"
        sx={{ mb: 0, opacity: 0.7, textAlign: "left", alignSelf: "flex-end" }}
      >
        {isInteractive ? "Tap to focus" : "We're Not Really Strangers"}
      </Typography>
    </Box>
  );
};

export default WnrsActiveCard;
