import React from 'react';
import { Container, Jumbotron, Tab, Tabs } from 'react-bootstrap';
import { gql, useQuery } from '@apollo/client';
import GlobalLoading from '../components/GlobalLoading';
import GlobalError from '../components/GlobalError';
import { GibsonsLeagueQuery, GibsonsLeagueQueryDraftArgs } from '../generated/graphql';
import { groupBy } from 'lodash';
import DraftRoundCard from '../components/cards/DraftRoundCard';
import KeeperCard from '../components/cards/KeeperCard';

export const GET_FRANCHISE = gql`
  query GibsonsLeagueQuery($year: Int) {
    transactions(year: $year, type: KEPT)
    {
      franchiseId
      franchiseName
      playerId
      name
      position
      primaryPosition
      year
    }
    draft(year: $year)
    {
      picks
      {
        round
        pick
        positionPick
        playerId
        playerName
        playerPosition
        playerPrimaryPosition
        franchiseId
        franchiseName
        playerPositionRank
        playerPositionRankPpg
      }
    }
  }
`;

interface TradeProps {
  history?: any;
  match: any;
  image?: string | any;
}

const Trade: React.FC<TradeProps> = ({ ...props }) => {

  const {
    data,
    loading,
    error
  } = useQuery<GibsonsLeagueQuery, GibsonsLeagueQueryDraftArgs>(
    GET_FRANCHISE,
    {
      variables: {
        year: props.match.params.year
      }
    }
  );

  if (loading) return <GlobalLoading mode="page" />;
  if (error || !data || !data.draft || !data.draft.picks) return <GlobalError mode="page" apolloError={error} />;


  const keepers = groupBy(data.transactions, "franchiseName");

  const keeperCards: any = [];
  for (const [key, value] of Object.entries(keepers)) {
    if (value && value.length > 0) {
      const franchiseId = value[0]?.franchiseId;
      keeperCards.push(<KeeperCard grouping={key} groupingLink={`/franchise/${franchiseId}`}  keepers={value} />);
    }
  }

  const rounds = groupBy(data.draft.picks, "round");

  const cards: any = [];
  for (const [key, value] of Object.entries(rounds)) {
    cards.push(<DraftRoundCard round={key} picks={value} />);
  }

  return (
    <Container>
      <Jumbotron>
        <h1>{`${props.match.params.year} Draft`}</h1>
      </Jumbotron>
      <Tabs defaultActiveKey="picks">
        <Tab eventKey="keepers" title="Keepers">
          <section>
            <div className="d-flex flex-wrap justify-content-center">
              {keeperCards}
            </div>
          </section>
        </Tab>
        <Tab eventKey="picks" title="Picks">
          <section>
            <div className="d-flex flex-wrap justify-content-center">
              {cards}
            </div>
          </section>
        </Tab>
      </Tabs>

    </Container>
  );
}

export default Trade;