import React from 'react';
import { Container, Jumbotron, Row, Col } from 'react-bootstrap';
import { gql, useQuery } from '@apollo/client';
import GlobalLoading from '../components/GlobalLoading';
import { GibsonsLeagueQuery, GibsonsLeagueQueryFranchiseArgs } from '../generated/graphql';

export const GET_FRANCHISE = gql`
  query GibsonsLeagueQuery($id: Int) {
    player(id: $id) {
      name
      position
      transactions
      {
        date
        description
        type
        franchiseName
      }
    }
  }
`;

interface PlayerProps {
  history?: any;
  match: any;
  image?: string | any;
}

const Player: React.FC<PlayerProps> = ({ ...props }) => {

  const {
    data,
    loading,
    error
  } = useQuery<GibsonsLeagueQuery, GibsonsLeagueQueryFranchiseArgs>(
    GET_FRANCHISE,
    { variables: { id: props.match.params.id } }
  );

  if (loading) return <GlobalLoading />;
  if (error || !data) return <p>ERROR</p>;
  if (!data.player) return <p>Not Found</p>;

  const player = data.player;

  return (
    <Container>
      <Jumbotron fluid>
          <h1>{player.name}</h1>
      </Jumbotron>  
      <section>
        <h1>Transactions</h1>
        <div className="d-flex flex-wrap justify-content-center">
            <Container>
                {
                    player.transactions?.map((transaction: any) => (
                        <Row key={transaction.date}><Col>{transaction.franchiseName} - {transaction.description} {(new Date(transaction.date).toLocaleDateString())}</Col></Row>
                    ))
                }
            </Container>
        </div>
      </section>    

    </Container>
  );
}

export default Player;