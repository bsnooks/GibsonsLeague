import React from 'react';
import { Franchise, Maybe } from '../../generated/graphql';
import ChampionRow from '../controls/ChampionRow';

interface ChampionsCardProps {
    franchises: Maybe<Franchise>[];
}

const ChampionsCard: React.FC<ChampionsCardProps> = ({ ...props }) => {

    const winners: any[]  = [];
    const seconders: any[] = [];
    props.franchises.forEach((franchise) => {
        franchise?.teams?.forEach((team) => {
            if (team?.champion) {
                winners.push({
                    year: team.year,
                    winner: franchise
                });
            }
            else if (team?.secondPlace) {
                seconders.push({
                    year: team.year,
                    second: franchise
                });
            }
        });
    });

    let merged = [];
    for(let i=0; i<winners.length; i++) {
        merged.push({
         ...winners[i], 
         ...(seconders.find((itmInner) => itmInner.year === winners[i].year))}
        );
      }

    return (
        <div className="champion-list">
            <div className="champion-headings">
                <div className="champion-col year">Year</div>
                <div className="champion-col team">Champion</div>
                <div className="champion-col second">Second Place</div>
            </div>
            {
                merged.slice().sort((a,b) => ((a?.year ?? 0) > (b?.year ?? 0)) ? -1 : 1).map((merge: any) => (
                    <ChampionRow key={merge.year} year={merge.year} winner={merge.winner} second={merge.second} />
                ))
            }
        </div>
    );
}

export default ChampionsCard;
