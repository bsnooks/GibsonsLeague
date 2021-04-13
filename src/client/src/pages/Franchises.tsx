import React from 'react';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { gql, useQuery } from '@apollo/client';
import GlobalLoading from '../components/GlobalLoading';
import { GibsonsLeagueQuery } from '../generated/graphql';
import { LinkContainer } from 'react-router-bootstrap';

export const GET_FRANCHISES = gql`
  query GibsonsLeagueQuery {
    franchises {
      franchiseId
      mainName
    }
  }
`;

interface FranchisesProps { }

const Franchises: React.FC<FranchisesProps> = () => {
    const {
        data,
        loading,
        error
    } = useQuery<GibsonsLeagueQuery>(GET_FRANCHISES);

    if (loading) return <GlobalLoading />;
    if (error || !data) return <p>ERROR</p>;

    return (
        <Container>
            <section className="card-columns">
                {
                    data.franchises?.map((franchise: any) => (
                        <Card style={{ width: '18rem' }} key={franchise.franchiseId}>
                            <Card.Body>
                                <Card.Title>{franchise.mainName}</Card.Title>
                                <Card.Text>
                                </Card.Text>
                                <LinkContainer to={`/franchise/${franchise.franchiseId}`} key={franchise.franchiseId}>
                                    <Button variant="primary">View</Button>
                                </LinkContainer>
                            </Card.Body>
                        </Card>
                    ))
                }
            </section>
        </Container>
    );
}

export default Franchises;