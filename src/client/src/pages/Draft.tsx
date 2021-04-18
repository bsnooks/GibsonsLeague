import React from 'react';
import { Container, Jumbotron } from 'react-bootstrap';
import { gql, useQuery } from '@apollo/client';
import GlobalLoading from '../components/GlobalLoading';
import GlobalError from '../components/GlobalError';
import { DraftPick, GibsonsLeagueQuery, GibsonsLeagueQueryDraftArgs } from '../generated/graphql';
import { groupBy } from 'lodash';
import DraftRoundCard from '../components/DraftRoundCard';

export const GET_FRANCHISE = gql`
  query GibsonsLeagueQuery($year: Int) {
    draft(year: $year)
    {
      picks
      {
        round
        pick
        playerId
        playerName
        playerPosition
        franchiseId
        franchiseName
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
  
  const rounds = groupBy(data.draft.picks, "round");

  const cards: any = [];
  for(const[key, value] of Object.entries(rounds))
  {
    cards.push(<DraftRoundCard round={key} picks={value} />);
  }

  return (
    <Container fluid>
      <Jumbotron>
          <h1>{props.match.params.year}</h1>
      </Jumbotron>  
      <section>
        <div className="d-flex flex-wrap justify-content-center">
          {cards}
        </div>
      </section>

    </Container>
  );
}

export default Trade;