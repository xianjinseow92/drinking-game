import { Box, Button, InputBase, Typography } from "@mui/material";

import {
  IWnrsLevelMeta,
  TWnrsLevel,
  TWnrsPlayer,
  TWnrsPlayerNames,
} from "../types/wnrs.types";
import { playerColors } from "../utils/wnrs.players";

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
  width: "100%",
  borderRadius: "14px",
  backgroundColor: "rgba(255,255,255,0.96)",
  color: "#3a134d",
  fontWeight: 700,
  fontSize: "1rem",
  paddingX: 1.5,
  paddingY: 0.6,
  border: "3px solid transparent",
  "&.Mui-focused": { boxShadow: "0 0 0 3px rgba(255,255,255,0.5)" },
  "& input": { padding: 0 },
} as const;

const NameField = ({
  player,
  label,
  value,
  onChange,
}: {
  player: TWnrsPlayer;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0 }}>
    <Typography
      component="label"
      variant="overline"
      sx={{
        mb: 0,
        lineHeight: 1.2,
        letterSpacing: "0.18em",
        textAlign: "left",
        display: "flex",
        alignItems: "center",
        gap: 0.6,
      }}
    >
      <Box
        component="span"
        sx={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: playerColors[player].bg,
          flex: "0 0 auto",
        }}
      />
      {label}
    </Typography>
    <InputBase
      value={value}
      onChange={(event: any) => onChange(event.target.value)}
      onFocus={(event: any) => event.target.select()}
      inputProps={{ "aria-label": `${label} name`, maxLength: 16 }}
      sx={{ ...nameFieldStyles, borderColor: playerColors[player].bg }}
    />
  </Box>
);

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
        <NameField
          player="playerOne"
          label="Player 1"
          value={playerNames.playerOne}
          onChange={(value) => onPlayerNameChange("playerOne", value)}
        />
        <NameField
          player="playerTwo"
          label="Player 2"
          value={playerNames.playerTwo}
          onChange={(value) => onPlayerNameChange("playerTwo", value)}
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
