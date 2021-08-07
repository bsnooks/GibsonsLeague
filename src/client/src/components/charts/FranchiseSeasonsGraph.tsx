import React from 'react';
import { Match, Maybe } from '../../generated/graphql';
import { ResponsiveLine } from '@nivo/line'
import { groupBy } from 'lodash';
import { useBaseTheme } from './theme';

interface FranchiseSeasonsGraphProps {
    matches: Maybe<Array<Maybe<Match>>>,
    franchiseId: any
}

const FranchiseSeasonsGraph: React.FC<FranchiseSeasonsGraphProps> = ({ ...props }) => {
    const data = [];
    const years = groupBy(props.matches, "year");
    const weeks = groupBy(props.matches, "week");

    
    for (const year of Object.keys(years)) {
        const weekWins = [{
            "x": 0,
            "y": 0
        }]
        
        var wins = 0;
        for (const [, matches] of Object.entries(weeks)) {
            // eslint-disable-next-line
            matches.filter(m => m?.year === parseInt(year) && (m?.winningFranchiseId === props.franchiseId || m?.losingFranchiseId === props.franchiseId) && m?.type === "Regular").forEach((match) => {
                if (match) {
                    if (match.winningFranchiseId === props.franchiseId) {
                        wins = wins + 1;
                    }
                    weekWins.push({
                            "x": match.week,
                            "y": wins
                        });
                }
            });
        };
        data.push({
            "id": year,
            "data": weekWins,
        })
    }

    const theme = useBaseTheme();

    return (
        <div style={{ width: '100%', height: 400 }}>
            <ResponsiveLine
                data={data}
                margin={{ top: 25, right: 120, bottom: 60, left: 55 }}
                colors={{ scheme: 'category10' }}
                xScale={{ type: 'linear' }}
                yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
                curve="monotoneX"
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
                    legend: 'Wins',
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
                enableSlices={'x'}
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
                        <div style={{backgroundColor: "#FFF", borderStyle: "solid", borderColor: `${input.point.serieColor}`, borderWidth: "2px", padding: "5px"}}>
                            {`${input.point.serieId} (Week ${input.point.data.x}): ${input.point.data.y} ${input.point.data.y === 1 ? "win" : "wins"}`}
                        </div>
                    )
                }}
                theme={theme}
            />
        </div>
    );
}

export default FranchiseSeasonsGraph;