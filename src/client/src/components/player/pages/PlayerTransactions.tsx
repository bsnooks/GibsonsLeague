import React from "react";
import { Container } from "react-bootstrap";
import { PlayerSeasonCard } from "../controls";
import { usePlayerContext } from "../hooks";

interface PlayerTransactionsProps {
  history?: any;
  match: any;
  image?: string | any;
}

const PlayerTransactions: React.FC<PlayerTransactionsProps> = ({
  ...props
}) => {
  const { player } = usePlayerContext();

  if (!player) return null;

  return (
    <Container>
      <section>
        <div className="section-title">
          <span>Transactions</span>
        </div>
        <div className="section-body p-3">
          {player.seasons?.map((playerSeason) => {
            return (
              <PlayerSeasonCard
                key={playerSeason?.year}
                playerSeason={playerSeason}
              />
            );
          })}
        </div>
      </section>
    </Container>
  );
};

export default PlayerTransactions;
