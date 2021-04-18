import React from 'react';
import { Container, Jumbotron, Row, Col } from 'react-bootstrap';
import { gql, useQuery } from '@apollo/client';
import GlobalLoading from '../components/GlobalLoading';
import { GibsonsLeagueQuery, GibsonsLeagueQueryFranchiseArgs } from '../generated/graphql';
import { Link } from 'react-router-dom';

export const GET_FRANCHISE = gql`
  query GibsonsLeagueQuery($id: Int) {
    player(id: $id) {
      name
      position
      transactions(limit: 50)
      {
        transactionId
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

  if (loading) return <GlobalLoading mode="page" />;
  if (error || !data) return <p>ERROR</p>;
  if (!data.player) return <p>Not Found</p>;

  const player = data.player;

  let previousYear = 1900;
  const transactions = player.transactions?.map((transaction) =>
  {
    if (!transaction)
    {
      return null;
    }
    const year = new Date(transaction.date).getFullYear();
    const transactionRow =
      transaction.type === "Traded" ?
        (
          <Row key={transaction.date}>
            <Col>
              <Link to={`/trade/${transaction?.transactionId}`}>
                {transaction.description} on {(new Date(transaction.date).toLocaleDateString())}
              </Link>
            </Col>
          </Row>
        )
        :
        transaction.type === "DraftPicked" ?
        (
          <Row key={transaction.date}>
           <Col>
            <Link to={`/draft/${year}`}>
              {transaction.description} on {(new Date(transaction.date).toLocaleDateString())}
            </Link>
            </Col>
          </Row>
        )
        :
        (
          <Row key={transaction.date}>
            <Col>
              {transaction.description} on {(new Date(transaction.date).toLocaleDateString())}
            </Col>
          </Row>
        );

    if (year !== previousYear)
    {
      previousYear = new Date(transaction.date).getFullYear();
      return (<React.Fragment key={transaction.date}>
        <Row style={{backgroundColor: "#CCC"}}>
          <Col><b>{previousYear}</b></Col>
        </Row>
        {transactionRow}
      </React.Fragment>)
    }
    
    return transactionRow;
  });

  return (
    <Container>
      <Jumbotron fluid>
          <h1>{player.name} ({player.position})</h1>
      </Jumbotron>  
      <section>
        <h1>Transactions</h1>
        <div className="d-flex flex-wrap justify-content-center">
            <Container>
                {transactions}
            </Container>
        </div>
      </section>    

    </Container>
  );
}

export default Player;