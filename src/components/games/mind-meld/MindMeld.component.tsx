import { useState } from "react";

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
