import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { GlobalLoading, GlobalError } from "../../ui";
import { PlayerGameCard } from "../controls";
import { usePlayerGames } from "../hooks";
import { groupBy } from 'lodash';

interface PlayerGamesProps {
  history?: any;
  match: any;
  image?: string | any;
}

const PlayerGames: React.FC<PlayerGamesProps> = ({
  ...props
}) => {
  // state
  const [cards, setCards] = useState([]);

  // hooks
  const { games, loading, error } = usePlayerGames();

  useEffect(() => {
    if (!games) return;
    const years = groupBy(games, "year");
    const list: any = [];
    for (const [year, yearGames] of Object.entries(years).reverse()) {
      list.push(<PlayerGameCard year={parseInt(year)} games={yearGames} />);
    }
    
    setCards(list);
  }, [games]);

  if (loading) return <GlobalLoading />;
  if (error || !games) return <GlobalError apolloError={error} />;

  return (
    <Container>
      {cards}
    </Container>
  );
};

export default PlayerGames;