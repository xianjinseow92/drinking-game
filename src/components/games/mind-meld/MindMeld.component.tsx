import { useState } from "react";
import { Howl } from "howler";

// Audio
import ohMaGawd from "assets/audio/ohmyGODD.mp3";

// Layout
import PageLayout from "layout/PageLayout.component";

// Components
import MildMeldRules from "./MildMeldRules.component";
import BeginMindMeld from "./BeginMindMeld.component";

const MeldMeld = (props: any) => {
  const [mindMeldStarted, setMindMeldStarted] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(5); // default countdown time is 5

  const startMindMeld = () => {
    setMindMeldStarted(true);
  };

  const goToReadRules = () => {
    const ohMaGodSound = new Howl({
      src: [ohMaGawd],
      html5: true,
    });
    ohMaGodSound.play();
    setMindMeldStarted(false);
  };

  return (
    <PageLayout>
      {mindMeldStarted ? (
        <BeginMindMeld
          onClick={goToReadRules}
          countdownSeconds={countdownSeconds}
          setCountdownSeconds={setCountdownSeconds}
        />
      ) : (
        <MildMeldRules
          onStart={startMindMeld}
          countdownSeconds={countdownSeconds}
        />
      )}
    </PageLayout>
  );
};

export default MeldMeld;
