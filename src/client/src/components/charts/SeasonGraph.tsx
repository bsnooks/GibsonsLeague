import React from 'react';
import { Match, Maybe } from '../../generated/graphql';
import { ResponsiveLine } from '@nivo/line'
import { groupBy } from 'lodash';
import { useBaseTheme } from './theme';

interface SeasonGraphProps {
    matches: Maybe<Array<Maybe<Match>>>
}

const SeasonGraph: React.FC<SeasonGraphProps> = ({ ...props }) => {
    const data = [];
    const winners = groupBy(props.matches, "winningFranchise");
    const weeks = groupBy(props.matches, "week");

    
    for (const franchise of Object.keys(winners)) {
        const weekWins = [{
            "x": 0,
            "y": 0
        }]
        
        var wins = 0;
        for (const [, matches] of Object.entries(weeks)) {
            // eslint-disable-next-line
            matches.filter(m => (m?.winningFranchise === franchise || m?.losingFranchise === franchise) && m.type === "Regular").forEach((match) => {
                if (match) {
                    if (match.winningFranchise === franchise) {
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
            "id": franchise,
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

export default SeasonGraph;