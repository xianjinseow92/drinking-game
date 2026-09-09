import { ReactNode } from "react";

import { Box, Modal, Typography } from "@mui/material";

import { IWnrsCard } from "../types/wnrs.types";
import WnrsActiveCard from "./WnrsActiveCard.component";

interface IWnrsCardOverlayProps {
  card: IWnrsCard | null;
  eyebrow: string;
  onClose: () => void;
  /** Optional line under the card: whose turn it is, who drew it, and so on. */
  children?: ReactNode;
}

/**
 * The focus view. One card, blown up, on a darkened room. Everything else
 * recedes so the two of them can sit with the question.
 */
const WnrsCardOverlay = ({
  card,
  eyebrow,
  onClose,
  children,
}: IWnrsCardOverlayProps) => (
  <Modal
    open={Boolean(card)}
    onClose={onClose}
    aria-labelledby="wnrs-enlarged-card"
    // Near-solid and blurred: the room behind should not read at all.
    BackdropProps={{
      sx: {
        backgroundColor: "rgba(20, 3, 27, 0.95)",
        backdropFilter: "blur(8px)",
      },
    }}
  >
    <Box
      onClick={onClose}
      sx={{
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: { xs: 1.75, md: 2 },
        padding: { xs: 2.5, md: 3 },
        overflowY: "auto",
        outline: "none",
      }}
    >
      {card && (
        <>
          <Box
            role="dialog"
            id="wnrs-enlarged-card"
            aria-label={`Enlarged card: ${card.text}`}
            onClick={(event: any) => event.stopPropagation()}
          >
            <WnrsActiveCard card={card} eyebrow={eyebrow} size="focus" isVisible />
          </Box>
          {children}
          <Typography
            variant="body2"
            sx={{ mb: 0, color: "rgba(255,247,251,0.75)" }}
          >
            Tap anywhere to close
          </Typography>
        </>
      )}
    </Box>
  </Modal>
);

export default WnrsCardOverlay;
