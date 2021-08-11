import React from 'react';
import { DraftPick, Maybe } from '../../generated/graphql';
import { ResponsiveLine, Serie } from '@nivo/line'
import { groupBy } from 'lodash';
import { useBaseTheme } from './theme';

interface DraftPositionGraphProps {
    picks?: Maybe<Maybe<DraftPick>>[],
}

const DraftPositionGraph: React.FC<DraftPositionGraphProps> = ({ ...props }) => {
    const data = [];
    const positions = groupBy(props.picks, "playerPosition");
    
    for (const [position, positionValue] of Object.entries(positions)) {
        const posData: { x: number; y: number; name: string; round: number; pick: number; franchise: string; }[] = [];
        positionValue.forEach((pick) => {
            if (pick?.positionPick && pick?.playerPositionRank) {
                posData.push({
                    "x": pick?.positionPick,
                    "y": (pick?.playerPositionRank - pick?.positionPick) ?? 0,
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

    return (
        <div style={{ width: '100%', height: 400 }}>
            <ResponsiveLine
                data={data}
                margin={{ top: 25, right: 20, bottom: 60, left: 55 }}
                colors={{ scheme: 'category10' }}
                xScale={{ type: 'linear' }}
                yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
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
                markers={[
                    {
                        axis: 'y',
                        value: 0,
                        lineStyle: { strokeDasharray: '6, 6', stroke: '#b0413e', strokeWidth: 2 },
                    }
                ]}
                pointSize={5}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={1}
                pointBorderColor={{ from: 'serieColor' }}
                pointLabelYOffset={-12}
                useMesh={true}
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
                tooltip={(input) => {
                    const data : any = input.point.data;
                    const text = `${input.point.serieId}${input.point.data.x}: ${data.name} (Round ${data.round} Pick ${data.pick} by ${data.franchise}) = ${input.point.data.y}`;
                    return (
                        <div style={{backgroundColor: "#FFF", borderStyle: "solid", borderColor: `${input.point.serieColor}`, borderWidth: "2px", padding: "5px"}}>
                            {text}
                        </div>
                    )
                }}
                theme={theme}
            />
        </div>
    );
}

export default DraftPositionGraph;