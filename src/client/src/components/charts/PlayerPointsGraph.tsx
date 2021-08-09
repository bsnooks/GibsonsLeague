import React from 'react';
import { Maybe, Player, PlayerSeason } from '../../generated/graphql';
import { ResponsiveLine } from '@nivo/line'
import { useBaseTheme } from './theme';
import { useState } from 'react';
import Switch from "react-switch";

interface PlayerPointsGraphProps {
    seasons: Maybe<Array<Maybe<PlayerSeason>>> | undefined;
    position: string;
    compareWith?: Maybe<Player>;
    usePpg: boolean
}

const PlayerPointsGraph: React.FC<PlayerPointsGraphProps> = ({ ...props }) => {
    const xAxisLabel = props.usePpg ? "Points per Game" : "Points";

    const seasonPointsData: { x: number | undefined; y: number | undefined; }[] = [];

    props.seasons?.forEach((season) => {

        if (props.usePpg) {
            if (season?.points && season?.gamesPlayed && season?.gamesPlayed > 0) {
                seasonPointsData.push({
                    "x": season?.year,
                    "y": parseFloat((season?.points / season?.gamesPlayed).toFixed(2)),
                });
            }
        }
        else {
            seasonPointsData.push({
                "x": season?.year,
                "y": season?.points,
            });
        }
    });

    const data = [
        {
            "id": xAxisLabel,
            "data": seasonPointsData
        }
    ];

    if (props.compareWith) {
        const compareWithPointsData: { x: number | undefined; y: number | undefined; }[] = [];
        props.compareWith.seasons?.forEach((season) => {
    
            if (props.usePpg) {
                if (season?.points && season?.gamesPlayed && season?.gamesPlayed > 0) {
                    compareWithPointsData.push({
                        "x": season?.year,
                        "y": parseFloat((season?.points / season?.gamesPlayed).toFixed(2)),
                    });
                }
            }
            else {
                compareWithPointsData.push({
                    "x": season?.year,
                    "y": season?.points,
                });
            }
        });
        data.push({
            "id": props.compareWith.name,
            "data": compareWithPointsData
        });
    }

    const theme = useBaseTheme();

    return (
        <div>
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
                        legendPosition: 'middle'
                    }}
                    axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: "Points",
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
                            itemWidth: 150,
                            itemHeight: 20,
                            translateY: -25,
                            translateX: -5,
                            toggleSerie: true
                        }
                    ]}
                    enableSlices={"x"}
                    theme={theme}
                />
            </div>
        </div>
    );
}

export default PlayerPointsGraph;