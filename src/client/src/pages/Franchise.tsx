import React from 'react';
import { Col, Container, Jumbotron, Row, Image } from 'react-bootstrap';
import { gql, useQuery } from '@apollo/client';
import GlobalLoading from '../components/GlobalLoading';
import { GibsonsLeagueQuery, GibsonsLeagueQueryFranchiseArgs } from '../generated/graphql';
import SeasonBadge from '../components/SeasonBadge';
import franchise1 from '../assets/images/2feaf03e-fb22-498e-ac8f-e596b6ba7810.png';
import franchise2 from '../assets/images/8e9f18ff-62c3-40e8-bb10-32f74cf4ee33.png';
import franchise3 from '../assets/images/40f7599b-e68f-4bf4-9553-bf7e10924635.png';
import franchise4 from '../assets/images/66fb98f4-89a7-45f9-893a-b41d71e6249d.png';
import franchise5 from '../assets/images/825928a9-7194-43aa-b7ae-fc78c2510b16.png';
import franchise6 from '../assets/images/4449259f-64af-44fd-9235-1facc0926234.png';
import franchise7 from '../assets/images/b2220d1a-ff75-4622-9757-09978901110f.png';
import franchise8 from '../assets/images/bbe2d0ad-54cf-4c22-be82-b2a5f262a157.png';
import franchise9 from '../assets/images/f483ecf1-cd17-4991-854b-e52dfc957b45.png';
import franchise10 from '../assets/images/f5908944-6efd-40eb-af54-6c53004e0e2f.png';

const avatars = [franchise1, franchise2, franchise3, franchise4, franchise5, franchise6, franchise7, franchise8, franchise9, franchise10];

function pickAvatarByFranchiseId(id: string) {

  return avatars.find(name => name.includes(id));
}

export const GET_FRANCHISE = gql`
  query GibsonsLeagueQuery($id: Guid) {
    franchise(id: $id) {
      mainName
      wins
      loses
      ties
      championships
      runnerUps
      teams
      {
        year
        standing
        champion
        secondPlace
      }
    }
  }
`;

interface FranchiseProps {
  history?: any;
  match: any;
  image?: string | any;
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

  const avatar = props.image || pickAvatarByFranchiseId(props.match.params.id);
  const franchise = data.franchise;

  return (
    <Container>
      <Jumbotron fluid>
        <Container>
          <Row>
            <Col md="auto">
              <Image rounded src={avatar} style={{ width: '18rem' }} />
            </Col>
            <Col>
              <h1>{franchise.mainName}</h1>
              {
                  franchise.teams?.map((team: any) => (
                    <SeasonBadge key={team.year}
                      year={team.year}
                      place={team.standing}
                      champion={team.champion}
                      runnerUp={team.secondPlace}
                      franchiseId={props.match.params.id} />
                  ))
              }
            </Col>
          </Row>
        </Container>
      </Jumbotron>
      <Row>
        <Col>Record: {franchise.wins}-{franchise.loses}-{franchise.ties}</Col>
        <Col>Championships: {franchise.championships}</Col>
        <Col>Runner Ups: {franchise.runnerUps}</Col>
        <Col>Trades: 13</Col>
        <Col>Adds: 31413</Col>
        <Col>Drops: 31413</Col>
      </Row>

    </Container>
  );
}

export default Franchise;