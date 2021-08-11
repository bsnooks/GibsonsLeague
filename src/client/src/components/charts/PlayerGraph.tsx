import React from 'react';
import { Maybe, Player, PlayerSeason } from '../../generated/graphql';
import { ResponsiveLine } from '@nivo/line'
import { useBaseTheme } from './theme';
import { CartesianMarkerProps } from '@nivo/core';

interface PlayerGraphProps {
    seasons: Maybe<Array<Maybe<PlayerSeason>>> | undefined;
    position: string;
    compareWith?: Maybe<Player>;
    usePpg: boolean;
    showGamesPlayed: boolean;
}

const PlayerGraph: React.FC<PlayerGraphProps> = ({ ...props }) => {

    const seasonRankData: { x: any | undefined; y: number | undefined; }[] = [];
    const gamesPlayedData: { x: any | undefined; y: number | undefined; }[] = [];
    props.seasons?.forEach((season) => {
        const y = props.usePpg ? season?.positionRankPpg : season?.positionRank;
        if (y && y > 0) {
            seasonRankData.push({
                "x": season?.year,
                "y": y
            });
        }
        if (props.showGamesPlayed) {
            gamesPlayedData.push({
                "x": season?.year,
                "y": season?.gamesPlayed
            });
        }
    });
    const data = [
        {
            "id": props.usePpg ? "Position Rank (ppg)" : "Position Rank",
            "data": seasonRankData
        },
    ];
    if (props.showGamesPlayed && gamesPlayedData) {
        data.push({
            "id": "GP",
            "data": gamesPlayedData
        });
    }

    if (props.compareWith) {
        
        const compareWithRankData: { x: number | undefined; y: number | undefined; }[] = [];
        const compareWithGamesPlayedData: { x: any | undefined; y: number | undefined; }[] = [];
        props.compareWith.seasons?.forEach((season) => {
            const y = props.usePpg ? season?.positionRankPpg : season?.positionRank;
            if (y && y > 0) {
                compareWithRankData.push({
                    "x": season?.year,
                    "y": y
                });
                if (props.showGamesPlayed) {
                    compareWithGamesPlayedData.push({
                        "x": season?.year,
                        "y": season?.gamesPlayed
                    });
                }
            }
        });
        data.push({
            "id": props.compareWith.name,
            "data": compareWithRankData
        });
        if (props.showGamesPlayed && gamesPlayedData) {
            data.push({
                "id": `${props.compareWith.name} GP`,
                "data": compareWithGamesPlayedData
            });
        }
    }

    const positionStarterThreshold = props.position === "RB" || props.position === "QB" ? 20 : props.position === "WR" ? 30 : props.position === "TE" ? 10 : undefined;

    const markers:CartesianMarkerProps[] = positionStarterThreshold ? [
        {
            axis: 'y',
            value: positionStarterThreshold,
            lineStyle: { strokeDasharray: '6, 6', stroke: '#b0413e', strokeWidth: 2 },
            legend: 'Starter',
            legendOrientation: 'vertical',
        }
    ] : [];

    const theme = useBaseTheme();

    return (
        <div style={{ width: '100%', height: 400 }}>
            <ResponsiveLine
                data={data}
                margin={{ top: 25, right: 20, bottom: 60, left: 55 }}
                colors={{ scheme: 'category10' }}
                xScale={{ type: 'linear', min: 'auto', max: 'auto' }}
                yScale={{ type: 'linear', min: 0, max: 'auto', stacked: false, reverse: false }}
                curve="monotoneX"
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Year',
                    legendOffset: 36,
                    legendPosition: 'middle',
                    format: tick => {
                        return  tick % 1 === 0 ? tick : "";
                    }
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Rank',
                    legendOffset: -40,
                    legendPosition: 'middle'
                }}
                pointSize={5}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={1}
                pointBorderColor={{ from: 'serieColor' }}
                pointLabelYOffset={-12}
                useMesh={true}
                isInteractive={true}
                legends={[
                    {
                        anchor: 'top',
                        direction: 'row',
                        justify: false,
                        itemDirection: 'left-to-right',
                        symbolSize: 10,
                        symbolShape: 'square',
                        itemWidth: 90,
                        itemHeight: 20,
                        translateY: -25,
                        translateX: -5,
                        toggleSerie: true
                    }
                ]}
                enableSlices={"x"}
                theme={theme}
                markers={markers}
            />
        </div>
    );
}

export default PlayerGraph;