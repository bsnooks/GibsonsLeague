import React, { Fragment, useEffect, useState } from 'react';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { GibsonsLeagueQuery, GibsonsLeagueQueryPlayersArgs, Player } from '../generated/graphql';
import { gql, useLazyQuery } from '@apollo/client';
import {useHistory} from 'react-router-dom';

export const GET_PLAYERS = gql`
  query GibsonsLeagueQuery($query: String) {
    players(query:$query) {
      name
      playerId
      position
    }
  }
`;

interface PlayerSearchProps {
}

export type PlayerResult = Player | string;

const PlayerSearch: React.FC<PlayerSearchProps> = () => {

    const history = useHistory();
    const [query, setQuery] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState<PlayerResult[]>([]);

    const handleSearch = (q:string) => {
        setQuery(q);
    };

    const handleSelection = (selection:any) => {

        if (selection && selection.length > 0) {
            console.log(selection[0].playerId);
            history.push(`/player/${selection[0].playerId}`);
        }
    }

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
            //const newOptions: TypeaheadModel[] = data.players.map((i) => (i?.name as TypeaheadModel));
            const newOptions = data.players as PlayerResult[];
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
            onChange={handleSelection}
            options={options}
            placeholder="Search for a player..."
            labelKey="name"
            renderMenuItemChildren={(option:any) => (
                <Fragment>
                    <span>{option.name} ({option.position})</span>
                </Fragment>
            )}
        />
);
}

export default PlayerSearch;