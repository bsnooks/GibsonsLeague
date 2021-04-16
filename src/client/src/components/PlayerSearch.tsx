import React, { Fragment, useEffect, useState } from 'react';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { AsyncTypeahead, TypeaheadModel } from 'react-bootstrap-typeahead';
import { GibsonsLeagueQuery, GibsonsLeagueQueryPlayersArgs } from '../generated/graphql';
import { gql, useLazyQuery } from '@apollo/client';

export const GET_PLAYERS = gql`
  query GibsonsLeagueQuery($query: String) {
    players(query:$query) {
      name
      playerId
    }
  }
`;

interface PlayerSearchProps {
}

const PlayerSearch: React.FC<PlayerSearchProps> = () => {

    const [query, setQuery] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState<TypeaheadModel[]>([]);

    const handleSearch = (q:string) => {
        setQuery(q);
    };

    const [execQuery, {called, loading, data}] = useLazyQuery <GibsonsLeagueQuery, GibsonsLeagueQueryPlayersArgs>(
        GET_PLAYERS
    );

    useEffect(() => {
        setIsLoading(called && loading);
    }, [loading, called]);

    useEffect(() => {
        if (query.length > 2)
        {
            (() => {
                execQuery({ variables: { query: query } });
            })();
        }
    }, [execQuery, query]);

    useEffect(() => {
        if (data && data.players)
        {
            const newOptions: TypeaheadModel[] = data.players.map((i) => (i?.name as TypeaheadModel));
            setOptions(newOptions);
        }
    }, [data]);


    // Bypass client-side filtering by returning `true`. Results are already
    // filtered by the search endpoint, so no need to do it again.
    const filterBy = () => true;

    return (
        <AsyncTypeahead
            filterBy={filterBy}
            id="async-example"
            isLoading={isLoading}
            minLength={3}
            onSearch={handleSearch}
            options={options}
            placeholder="Search for a player..."
            renderMenuItemChildren={(option:any) => (
                <Fragment>
                    <span>{option}</span>
                </Fragment>
            )}
        />
);
}

export default PlayerSearch;