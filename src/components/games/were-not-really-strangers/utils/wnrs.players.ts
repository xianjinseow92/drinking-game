import { TWnrsPlayer } from "../types/wnrs.types";

/**
 * One identity colour per player, used everywhere that player's name
 * appears (turn line, sip chip, name fields, history) so the colour alone
 * tells you who is who.
 */
export const playerColors: Record<TWnrsPlayer, { bg: string; text: string; soft: string }> = {
  playerOne: { bg: "#ffd166", text: "#3a134d", soft: "rgba(255, 209, 102, 0.22)" },
  playerTwo: { bg: "#c4b5ff", text: "#3a134d", soft: "rgba(196, 181, 255, 0.24)" },
};
