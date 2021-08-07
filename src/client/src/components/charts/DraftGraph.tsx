import React from 'react';
import { DraftPick, Maybe } from '../../generated/graphql';
import { ResponsiveLine, Serie } from '@nivo/line'
import { groupBy } from 'lodash';
import { useBaseTheme } from './theme';

interface DraftGraphProps {
    picks?: Maybe<Maybe<DraftPick>>[],
}

const DraftGraph: React.FC<DraftGraphProps> = ({ ...props }) => {
    const data: Serie[] = [];
    const positions = groupBy(props.picks, "playerPosition");
    const keeperCounts = [];
    
    for (const [position, positionValue] of Object.entries(positions)) {

        const rounds = groupBy(positionValue, "round");
        const posData = [];
        for (const [round, roundValue] of Object.entries(rounds)) {
            const roundPositionPick = roundValue.map(v => v?.positionPick ?? 0);            
            const minPick = Math.min(...roundPositionPick);
            const ignorePositions = ["DE", "LB", "S", "LB, DE", "K"];
            if (minPick >= 1 && !ignorePositions.includes(position) && keeperCounts.filter(k => k.position === position).length == 0) {
                keeperCounts.push({
                    "position": position,
                    "numberKept": Math.min(...roundPositionPick) - 1
                })
            }

            posData.push({
                "x": parseInt(round),
                "y": Math.max(...roundPositionPick),
            });
        }
        data.push({
            "id": position,
            "data": posData,
        })
    }
    for (const position of Object.keys(positions)) {
        const d = keeperCounts.filter(r => r?.position === position);
        let numberKept: number = 0;
        if (d && d.length > 0) {
            numberKept = d[0].numberKept;
        }

        const e = data.filter(r => r?.id === position);
        if (e && e.length > 0) {
            e[0].data.unshift({
                "x": 0,
                "y": numberKept,
            });
        }
    }

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
                    legend: 'Round',
                    legendOffset: 36,
                    legendPosition: 'middle'
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Players Picked',
                    legendOffset: -40,
                    legendPosition: 'middle'
                }}
                pointSize={10}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={2}
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
                    const text = input.point.data.x === 0 ?
                        `${input.point.serieId}: ${input.point.data.y} kept`:
                        `Round ${input.point.data.x} (${input.point.serieId}): ${input.point.data.y} taken`;
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

export default DraftGraph;