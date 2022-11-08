// @ts-nocheck
import React, { useState } from 'react';
import { Maybe, Player, PlayerSeason } from '../../generated/graphql';
import { ResponsiveLine } from '@nivo/line'
import { useBaseTheme } from './theme';
import { groupBy } from 'lodash';
import * as d3 from 'd3-shape'
import { Defs } from '@nivo/core';


interface PlayerPointsGraphProps {
    seasons: Maybe<Array<Maybe<PlayerSeason>>> | undefined;
    comparisonSeasons: Maybe<Array<Maybe<PlayerSeason>>> | undefined;
    position: string;
    compareWith?: Maybe<Player>;
    usePpg: boolean
}

const PlayerPointsGraph: React.FC<PlayerPointsGraphProps> = ({ ...props }) => {
    const xAxisLabel = props.usePpg ? "Points per Game" : "Points";
    const seasonPointsData: { x: number | undefined; y: number | undefined; }[] = [];
    const [maxY,setMaxY] = useState(0);

    const max = Math.max(props.comparisonSeasons.map((s) => s?.points)) + 10;
    const maxPpg = Math.max(props.comparisonSeasons.map((s) => s?.points / s?.gamesPlayed)) + 1;

    props.seasons?.forEach((season) => {
        if (season?.gamesPlayed === 0) {
            return;
        }

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

    const seasonLeadersData = [];
    if (props.comparisonSeasons) {
        const comparisonSeasonsRanks = groupBy(props.comparisonSeasons, "positionRank");
        for (const [rank, seasons] of Object.entries(comparisonSeasonsRanks)) {
            const seasonPointsCompareData: { x: number | undefined; y: number | undefined; }[] = [];
            seasons.forEach((season) => {
                if (season?.gamesPlayed === 0) {
                    return;
                }
                if (props.usePpg) {
                    if (season?.points && season?.gamesPlayed && season?.gamesPlayed > 0) {
                        seasonPointsCompareData.push({
                            "x": season?.year,
                            "y": parseFloat((season?.points / season?.gamesPlayed).toFixed(2)),
                        });
                    }
                }
                else {
                    seasonPointsCompareData.push({
                        "x": season?.year,
                        "y": season?.points,
                    });
                    if (season?.points > maxY){
                        setMaxY(season?.points);
                    }
                }
            });
            
            seasonLeadersData.push({
                "id": `${props.position}-${rank}`,
                "data": seasonPointsCompareData
            });
        }
    }

    if (props.compareWith) {
        const compareWithPointsData: { x: number | undefined; y: number | undefined; }[] = [];
        props.compareWith.seasons?.forEach((season) => {
            if (season?.gamesPlayed === 0) {
                return;
            }
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

    const AreaLayer = ({ _, xScale, yScale, innerHeight }) => {

        const top = seasonLeadersData[0];
        const bottom = seasonLeadersData[2];

        top.data.forEach((data, i) => {
            const y0 = bottom.data.filter(d => d.x === data.x)[0].y;
            data.y0 = y0;
            data.y1 = data.y;
        });

        const areaGenerator =
            d3.area()
                .x(d => xScale(d.x))
                .y0(d => Math.min(innerHeight, yScale(d.y0)))
                .y1(d => yScale(d.y1))
                .curve(d3.curveMonotoneX);

        return (
            <>
                <Defs
                    defs={[
                        {
                            id: 'pattern',
                            type: 'patternLines',
                            background: 'transparent',
                            color: '#3daff7',
                            lineWidth: 1,
                            spacing: 6,
                            rotation: -45,
                        },
                    ]}
                />
                <path
                    d={areaGenerator(top.data)}
                    fill="url(#pattern)"
                    fillOpacity={0.6}
                    stroke="#3daff7"
                    strokeWidth={2}
                />
            </>
        )
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
                    yScale={{ type: 'linear', min: 0, max: (props.usePpg ? maxPpg : max), stacked: false, reverse: false }}
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
                    enableSlices={"x"}
                    layers={[
                        'grid',
                        AreaLayer,
                        'markers',
                        'areas',
                        'lines',
                        'slices',
                        'axes',
                        'points',
                        'legends',
                    ]}
                    theme={theme}
                />
            </div>
        </div>
    );
}

export default PlayerPointsGraph;