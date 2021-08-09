import React, { Fragment, useEffect, useState } from 'react';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { GibsonsLeagueQuery, GibsonsLeagueQueryPlayersArgs, Player } from '../../generated/graphql';
import { gql, useLazyQuery } from '@apollo/client';

export const GET_PLAYERS = gql`
  query GibsonsLeagueQuery($query: String, $position: String) {
    players(query:$query,position:$position) {
      name
      playerId
      position
    }
  }
`;

interface PlayerSearchProps {
    handleSelection: (selection:any) => void;
    position?: string;
}

export type PlayerResult = Player | string;

const PlayerSearch: React.FC<PlayerSearchProps> = ({ ...props }) => {

    const [query, setQuery] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState<PlayerResult[]>([]);
    const [typeahead, setTypeahead] = useState<any | null>(null);

    const handleSearch = (q:string) => {
        setQuery(q);
    };

    const handleSelection = (selection:any) => {

        if (selection && selection.length > 0) {
            if (typeahead) {
                typeahead.clear();
            }
            props.handleSelection(selection);
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
                execQuery({ variables: { query: query, position: props.position } });
            })();
        }
    }, [execQuery, query, props.position]);

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
            ref={(ref) => setTypeahead(ref)}
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