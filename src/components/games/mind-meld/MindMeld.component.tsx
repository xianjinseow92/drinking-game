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

  const startMindMeld = () => {
    setMindMeldStarted(true);
  };

  const goToReadRules = () => {
    const ohMaGodSound = new Howl({
      src: [ohMaGawd]
    });
    ohMaGodSound.play();
    setMindMeldStarted(false);
  };

  return (
    <PageLayout>
      {mindMeldStarted ? (
        <BeginMindMeld onClick={goToReadRules}/>
      ) : (
        <MildMeldRules onStart={startMindMeld} />
      )}
    </PageLayout>
  );
};

export default MeldMeld;
