import React from 'react';
import { Maybe, PlayerSeason } from '../../generated/graphql';
import { ResponsiveLine, Serie } from '@nivo/line'
import { useBaseTheme } from './theme';
import { groupBy } from 'lodash';

interface SeasonPositionPointsProps {
    comparisonSeasons: Maybe<Array<Maybe<PlayerSeason>>> | undefined;
    usePpg: boolean
}

const SeasonPositionPoints: React.FC<SeasonPositionPointsProps> = ({ ...props }) => {
    const data: Serie[] = [];

    interface ILeaders {
        QB: number,
        RB: number,
        TE: number,
        WR: number
    };

    const leaders: ILeaders = {
        QB: 0,
        RB: 0,
        TE: 0,
        WR: 0
    };

    if (props.comparisonSeasons) {
        const comparisonSeasonsPosition = groupBy(props.comparisonSeasons, "positionRank");
        for (const [rank, positionSeasons] of Object.entries(comparisonSeasonsPosition)) {

            const comparisonSeasonsRanks = groupBy(positionSeasons, "position");
            
            const seasonPointsCompareData: { x: string | undefined; y: number | undefined; name: string | undefined }[] = [];
            for (const [position, seasons] of Object.entries(comparisonSeasonsRanks)) {
                seasons.forEach((season) => {
                    if (props.usePpg) {
                        if (season?.points && season?.gamesPlayed && season?.gamesPlayed > 0) {
                            seasonPointsCompareData.push({
                                "x": position,
                                "y": parseFloat((season?.points / season?.gamesPlayed).toFixed(2)),
                                "name": season?.name,
                            });
                        }
                    }
                    else {
                        seasonPointsCompareData.push({
                            "x": position,
                            "y": season?.points,
                            "name": season?.name,
                        });
                    }

                    if (season?.points && leaders[position as keyof ILeaders] < season?.points) {
                        leaders[position as keyof ILeaders] = season?.points;
                    }
                });
            }
                
            data.push({
                "id": rank,
                "data": seasonPointsCompareData
            });
        }
    }

    const theme = useBaseTheme();

    return (
        <div>
            <div style={{ width: '100%', height: 400 }}>
                <ResponsiveLine
                    data={data}
                    margin={{ top: 25, right: 20, bottom: 60, left: 55 }}
                    colors={{ scheme: 'category10' }}
                    xScale={{ type: 'point'}}
                    yScale={{ type: 'linear', min: 0, max: 'auto', stacked: false, reverse: false }}
                    curve="monotoneX"
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Position',
                        legendOffset: 36,
                        legendPosition: 'middle',
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
                    tooltip={(input) => {
                        const data : any = input.point.data;
                        const leaderDiff = parseFloat(input.point.data.y.toString()) / leaders[input.point.data.x as keyof ILeaders] * 100;
                        const leaderDiffString = leaderDiff < 100 ? ` - ${Number(leaderDiff).toLocaleString('en-US', { maximumFractionDigits: 1 })}% of leader` : "";
                        
                        return (
                            <div style={{backgroundColor: "#FFF", borderStyle: "solid", borderColor: `${input.point.serieColor}`, borderWidth: "2px", padding: "5px"}}>
                                {`${input.point.data.x}-${input.point.serieId}: ${data.name}${leaderDiffString}`}
                            </div>
                        )
                    }}
                    theme={theme}
                />
            </div>
        </div>
    );
}

export default SeasonPositionPoints;