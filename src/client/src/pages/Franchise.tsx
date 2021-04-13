import React from 'react';
import { Col, Container, Jumbotron, Row } from 'react-bootstrap';
import { gql, useQuery } from '@apollo/client';
import GlobalLoading from '../components/GlobalLoading';
import { GibsonsLeagueQuery, GibsonsLeagueQueryFranchiseArgs } from '../generated/graphql';
import SeasonBadge from '../components/SeasonBadge';

export const GET_FRANCHISE = gql`
  query GibsonsLeagueQuery($id: Guid) {
    franchise(id: $id) {
      mainName
      picks(round: 1)
      {
        year
        playerName
      }
    }
  }
`;

interface FranchiseProps {
  history?: any;
  match: any;
}

const Franchise: React.FC<FranchiseProps> = ({ ...props }) => {

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
  if (!data.franchise) return <p>Not Found</p>;

  return (
    <Container>
      <Jumbotron fluid>
        <h1>{data.franchise.mainName}</h1>
        <SeasonBadge year={2020} place={1} franchiseId={props.match.params.id} />
        <SeasonBadge year={2019} place={6} franchiseId={props.match.params.id} />
        <SeasonBadge year={2018} place={10} franchiseId={props.match.params.id} />
        <SeasonBadge year={2017} place={6} franchiseId={props.match.params.id} />
        <SeasonBadge year={2016} place={7} franchiseId={props.match.params.id} />
        <SeasonBadge year={2015} place={9} franchiseId={props.match.params.id} />
        <SeasonBadge year={2014} place={4} franchiseId={props.match.params.id} />
        <SeasonBadge year={2013} place={10} franchiseId={props.match.params.id} />
        <SeasonBadge year={2012} place={8} franchiseId={props.match.params.id} />
        <SeasonBadge year={2011} place={8} franchiseId={props.match.params.id} />
        <SeasonBadge year={2010} place={5} franchiseId={props.match.params.id} />
        <SeasonBadge year={2009} place={6} franchiseId={props.match.params.id} />
        <SeasonBadge year={2008} place={2} franchiseId={props.match.params.id} />
        <SeasonBadge year={2007} place={1} franchiseId={props.match.params.id} />
        <SeasonBadge year={2006} place={9} franchiseId={props.match.params.id} />
        <SeasonBadge year={2005} place={7} franchiseId={props.match.params.id} />
        <SeasonBadge year={2004} place={9} franchiseId={props.match.params.id} />
        <SeasonBadge year={2003} place={8} franchiseId={props.match.params.id} />
        <SeasonBadge year={2002} place={7} franchiseId={props.match.params.id} />
      </Jumbotron>
      <Row>
        <Col>Record: 120-104-1</Col>
        <Col>Trades: 13</Col>
        <Col>Adds: 31413</Col>
        <Col>Drops: 31413</Col>
      </Row>

    </Container>
  );
}

export default Franchise;