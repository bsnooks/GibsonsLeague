// @ts-nocheck
import React from 'react';
import { DraftPick, Maybe } from '../../generated/graphql';
import { ResponsiveLine } from '@nivo/line'
import { ResponsiveScatterPlot } from '@nivo/scatterplot'
import { groupBy } from 'lodash';
import { useBaseTheme } from './theme';
import * as d3 from 'd3-shape'
import { Defs } from '@nivo/core';

interface DraftPositionGraphProps {
    picks?: Maybe<Maybe<DraftPick>>[],
}

const DraftPositionGraph: React.FC<DraftPositionGraphProps> = ({ ...props }) => {
    const data = [];
    const positions = groupBy(props.picks, "playerPrimaryPosition");
    
    for (const [position, positionValue] of Object.entries(positions)) {
        const posData: { x: number; y: number; name: string; round: number; pick: number; franchise: string; }[] = [];
        positionValue.forEach((pick) => {
            if (pick?.positionPick && pick?.playerPositionRank) {
                posData.push({
                    "x": pick?.positionPick,
                    "y": (pick?.playerPositionRank) ?? pick?.positionPick,
                    "name": pick.playerName,
                    "round": pick.round,
                    "pick": pick.pick,
                    "franchise": pick.franchiseName,
                });
            }
        });

        if (posData.length > 0) {
            data.push({
                "id": position,
                "data": posData,
            });
        }
    }

    data.forEach((position) => {
        const diffs = {
            position: position.id,
            good: position.data.map(p => p.y).filter(y => y <= 0).length / position.data.length * 100,
            ok: position.data.map(p => p.y).filter(y => y > 0 && y <= 5).length / position.data.length * 100,
            bad: position.data.map(p => p.y).filter(y => y > 5).length / position.data.length * 100,
        }
        console.log(diffs);
    });

    const theme = useBaseTheme();

    const AreaLayer = ({ points, xScale, yScale, innerHeight }) => {

        console.log("points", points);
        const areaGenerator =
            d3.line()
                .x(d => xScale(d.x))
                .y(d => yScale(d.y))
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
                    d={areaGenerator(points)}
                    fill="url(#pattern)"
                    fillOpacity={0.6}
                    stroke="#3daff7"
                    strokeWidth={2}
                />
            </>
        )
    }

    return (
        <div style={{ width: '100%', height: 400 }}>
            <ResponsiveScatterPlot
                data={data}
                margin={{ top: 25, right: 20, bottom: 60, left: 55 }}
                colors={{ scheme: 'category10' }}
                xScale={{ type: 'linear', min: 1, max: 'auto', stacked: false, reverse: false }}
                xFormat=">-.2f"
                yScale={{ type: 'linear', min: 1, max: 'auto', stacked: false, reverse: false }}
                yFormat=">-.2f"
                //curve="stepAfter"
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Positional Pick',
                    legendOffset: 36,
                    legendPosition: 'middle'
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Pick vs. Season Rank',
                    legendOffset: -40,
                    legendPosition: 'middle'
                }}
                // markers={[
                //     {
                //         axis: 'y',
                //         value: 0,
                //         lineStyle: { strokeDasharray: '6, 6', stroke: '#b0413e', strokeWidth: 2 },
                //     }
                // ]}
                // nodeSize={5}
                // pointColor={{ theme: 'background' }}
                // pointBorderWidth={1}
                // pointBorderColor={{ from: 'serieColor' }}
                // pointLabelYOffset={-12}
                useMesh={true}
                blendMode="multiply"
                legends={[
                    {
                        anchor: 'top',
                        direction: 'row',
                        justify: false,
                        itemDirection: 'left-to-right',
                        symbolSize: 10,
                        symbolShape: 'square',
                        itemWidth: 70,
                        itemHeight: 20,
                        translateY: -25,
                        translateX: -5,
                        toggleSerie: true,
                    }
                ]}
                layers={[
                    'grid',
                    'axes',
                    AreaLayer,
                    'nodes',
                    'markers',
                    'mesh',
                    'legends'
                  ]}
                theme={theme}
            />
        </div>
    );
}

export default DraftPositionGraph;
