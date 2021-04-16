import React from 'react';
import { Container } from 'react-bootstrap';
import { gql, useQuery } from '@apollo/client';
import GlobalLoading from '../components/GlobalLoading';
import { GibsonsLeagueQuery } from '../generated/graphql';
import FranchiseCard from '../components/FranchiseCard';

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
        <Container fluid>
            <section className="d-flex flex-wrap justify-content-center">
                {
                    data.franchises?.map((franchise: any) => (
                        <FranchiseCard key={franchise.franchiseId}
                            franchiseId={franchise.franchiseId} 
                            mainName={franchise.mainName}   />
                    ))
                }
            </section>
        </Container>
    );
}

export default Franchises;