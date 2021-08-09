import React from 'react';
import { Match, Maybe } from '../../generated/graphql';
import { ResponsiveLine } from '@nivo/line'
import { groupBy } from 'lodash';
import { useBaseTheme } from './theme';
import { ResponsiveBar } from '@nivo/bar';

interface FranchiseWeekPointsGraphProps {
    matches: Maybe<Array<Maybe<Match>>>,
    franchiseId: any
}

const FranchiseWeekPointsGraph: React.FC<FranchiseWeekPointsGraphProps> = ({ ...props }) => {
    const data = [];
    const barData = [];
    const years = groupBy(props.matches, "year");
    const weeks = groupBy(props.matches, "week");

    var weekKeys: string[] = Object.keys(weeks);
    weekKeys = weekKeys.map(i => 'Week ' + i)
    for (const year of Object.keys(years)) {
        const weekWins: { x: number; y: number; }[] = [];
        const yearData:any = {
            "year": year
        }
        for (const [, matches] of Object.entries(weeks)) {
            matches.filter(m => m?.year === parseInt(year) && (m?.winningFranchiseId === props.franchiseId || m?.losingFranchiseId === props.franchiseId) && m?.type === "Regular").forEach((match) => {
                if (match) {
                    if (match.winningFranchiseId === props.franchiseId) {
                        weekWins.push({
                            "x": match.week,
                            "y": match.winningTeamPoints
                        });
                        yearData[`Week ${match.week}`] = match.winningTeamPoints;
                    }
                    else {
                        weekWins.push({
                            "x": match.week,
                            "y": match.losingFranchisePoints
                        });
                        yearData[`Week ${match.week}`] = match.losingFranchisePoints;
                    }
                }
            });
        };
        data.push({
            "id": year,
            "data": weekWins,
        })
        barData.push(yearData);
    }

    const theme = useBaseTheme();
    console.log(barData);

    return (
        <div style={{ width: '100%', height: 400 }}>
            <ResponsiveLine
                data={data}
                margin={{ top: 25, right: 120, bottom: 60, left: 55 }}
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
                    legend: 'Week',
                    legendOffset: 36,
                    legendPosition: 'middle'
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Points',
                    legendOffset: -40,
                    legendPosition: 'middle'
                }}
                pointSize={5}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={1}
                pointBorderColor={{ from: 'serieColor' }}
                pointLabelYOffset={-12}
                useMesh={true}
                //enableSlices={'x'}
                legends={[
                    {
                        anchor: 'right',
                        direction: 'column',
                        justify: false,
                        itemDirection: 'left-to-right',
                        symbolSize: 10,
                        symbolShape: 'square',
                        itemWidth: 70,
                        itemHeight: 20,
                        translateY: 0,
                        translateX: 100,
                        toggleSerie: true
                    }
                ]}
                tooltip={(input) => {
                    return (
                        <div style={{ backgroundColor: "#FFF", borderStyle: "solid", borderColor: `${input.point.serieColor}`, borderWidth: "2px", padding: "5px" }}>
                            {`${input.point.serieId} (Week ${input.point.data.x}): ${input.point.data.y} ${input.point.data.y === 1 ? "point" : "points"}`}
                        </div>
                    )
                }}
                enableSlices={'x'}
                theme={theme}
            />
            <ResponsiveBar
                data={barData}
                keys={weekKeys}
                indexBy="year"
                margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                padding={0.3}
                valueScale={{ type: 'linear' }}
                indexScale={{ type: 'band', round: true }}
                colors={{ scheme: 'category10' }}
                borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Year',
                    legendPosition: 'middle',
                    legendOffset: 32
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Points',
                    legendPosition: 'middle',
                    legendOffset: -40
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                legends={[
                    {
                        dataFrom: 'keys',
                        anchor: 'bottom-right',
                        direction: 'column',
                        justify: false,
                        translateX: 120,
                        translateY: 0,
                        itemsSpacing: 2,
                        itemWidth: 100,
                        itemHeight: 20,
                        itemDirection: 'left-to-right',
                        itemOpacity: 0.85,
                        symbolSize: 20,
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemOpacity: 1
                                }
                            }
                        ]
                    }
                ]}
                theme={theme}
            />
        </div>
    );
}

export default FranchiseWeekPointsGraph;