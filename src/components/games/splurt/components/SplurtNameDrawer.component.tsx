import React from "react";

import { Box, Button, Drawer, TextField, Typography } from "@mui/material";

import { TSplurtPlayer } from "../types/splurt.types";

const { useEffect, useState } = React as any;

interface ISplurtNameDrawerProps {
  open: boolean;
  onClose: () => void;
  player: TSplurtPlayer | null;
  currentName: string;
  defaultName: string;
  onSave: (value: string) => void;
}

const SplurtNameDrawer = ({
  open,
  onClose,
  player,
  currentName,
  defaultName,
  onSave,
}: ISplurtNameDrawerProps) => {
  const [draftName, setDraftName] = useState(currentName);

  useEffect(() => {
    setDraftName(currentName);
  }, [currentName, open]);

  const handleFocus = () => {
    if (draftName === defaultName) {
      setDraftName("");
    }
  };

  const handleSave = () => {
    const cleanedName = draftName.trim() || defaultName;
    onSave(cleanedName);
    onClose();
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: "#fff7fb",
          color: "#3a134d",
          borderTopLeftRadius: "24px",
          borderTopRightRadius: "24px",
        },
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 560,
          marginX: "auto",
          padding: { xs: 3, md: 4 },
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h4" sx={{ mb: 0 }}>
          {player === "playerOne" ? "Edit Player 1" : "Edit Player 2"}
        </Typography>

        <TextField
          autoFocus
          fullWidth
          value={draftName}
          onChange={(event: any) => setDraftName(event.target.value)}
          onFocus={handleFocus}
          variant="outlined"
          inputProps={{
            "aria-label":
              player === "playerOne" ? "Edit player 1 name" : "Edit player 2 name",
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "16px",
              backgroundColor: "rgba(255,255,255,0.96)",
            },
          }}
        />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 1.25,
          }}
        >
          <Button variant="contained" color="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="secondary" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default SplurtNameDrawer;
