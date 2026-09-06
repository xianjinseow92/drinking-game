import { Box, Button, TextField, Typography } from "@mui/material";

import {
  IWnrsLevelMeta,
  TWnrsLevel,
  TWnrsPlayer,
  TWnrsPlayerNames,
} from "../types/wnrs.types";

interface IWnrsLevelSelectProps {
  levels: IWnrsLevelMeta[];
  playerNames: TWnrsPlayerNames;
  onPlayerNameChange: (player: TWnrsPlayer, value: string) => void;
  onSelectLevel: (level: TWnrsLevel) => void;
  onOpenRules: () => void;
}

const levelAccent: Record<TWnrsLevel, string> = {
  1: "#fff1dd",
  2: "#fde7f7",
  3: "#f2eef6",
};

const nameFieldStyles = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    backgroundColor: "rgba(255,255,255,0.94)",
    color: "#3a134d",
    fontWeight: 700,
  },
  "& .MuiInputLabel-root": { color: "#3a134d" },
} as const;

const WnrsLevelSelect = ({
  levels,
  playerNames,
  onPlayerNameChange,
  onSelectLevel,
  onOpenRules,
}: IWnrsLevelSelectProps) => {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 720,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: { xs: 1.25, md: 2 },
      }}
    >
      <Typography
        variant="h2"
        sx={{ mb: 0, fontSize: { xs: "2.1rem", md: "3.2rem" } }}
      >
        We're Not Really Strangers
      </Typography>
      <Typography
        variant="body1"
        sx={{ mb: 0, maxWidth: 520, fontSize: { xs: "0.95rem", md: "1rem" } }}
      >
        One of you draws and asks. The other answers. Skip a card and you take a sip.
      </Typography>

      <Box
        sx={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 1,
          paddingX: { xs: 0.5, md: 0 },
        }}
      >
        <TextField
          label="Player 1"
          value={playerNames.playerOne}
          onChange={(event: any) => onPlayerNameChange("playerOne", event.target.value)}
          onFocus={(event: any) => event.target.select()}
          size="small"
          inputProps={{ "aria-label": "Player 1 name", maxLength: 16 }}
          sx={nameFieldStyles}
        />
        <TextField
          label="Player 2"
          value={playerNames.playerTwo}
          onChange={(event: any) => onPlayerNameChange("playerTwo", event.target.value)}
          onFocus={(event: any) => event.target.select()}
          size="small"
          inputProps={{ "aria-label": "Player 2 name", maxLength: 16 }}
          sx={nameFieldStyles}
        />
      </Box>

      <Box
        sx={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" },
          gap: { xs: 1, md: 1.5 },
        }}
      >
        {levels.map((meta) => (
          <Box
            key={meta.level}
            component="button"
            type="button"
            aria-label={`Start level ${meta.level}: ${meta.name}`}
            onClick={() => onSelectLevel(meta.level)}
            sx={{
              border: "2px solid rgba(58, 19, 77, 0.18)",
              borderRadius: "20px",
              padding: { xs: 1.5, md: 2.5 },
              background: levelAccent[meta.level],
              color: "#3a134d",
              cursor: "pointer",
              textAlign: "left",
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
              minHeight: { xs: 0, sm: 190 },
              boxShadow: "0 14px 30px rgba(0,0,0,0.12)",
              transition: "transform 160ms ease, box-shadow 160ms ease",
              fontFamily: "inherit",
              "&:hover, &:focus-visible": {
                transform: "translateY(-3px)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.18)",
                outline: "none",
              },
            }}
          >
            <Typography
              variant="overline"
              sx={{ mb: 0, letterSpacing: "0.2em", textAlign: "left", lineHeight: 1.6 }}
            >
              Level {meta.level}
            </Typography>
            <Typography
              variant="h4"
              component="span"
              sx={{
                mb: 0,
                fontWeight: 800,
                textAlign: "left",
                fontSize: { xs: "1.5rem", md: "2.125rem" },
              }}
            >
              {meta.name}
            </Typography>
            <Typography
              variant="body2"
              sx={{ mb: 0, textAlign: "left", opacity: 0.85 }}
            >
              {meta.tagline}
            </Typography>
          </Box>
        ))}
      </Box>

      <Button
        variant="contained"
        color="secondary"
        onClick={onOpenRules}
        sx={{ borderRadius: "999px", minWidth: 120 }}
      >
        Rules
      </Button>
    </Box>
  );
};

export default WnrsLevelSelect;
