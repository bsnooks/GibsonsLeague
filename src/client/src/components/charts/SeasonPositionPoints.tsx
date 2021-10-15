import React, { useState } from 'react';
import { Maybe, PlayerSeason } from '../../generated/graphql';
import { ResponsiveLine, Serie } from '@nivo/line'
import { ResponsiveSwarmPlot } from '@nivo/swarmplot'
import { useBaseTheme } from './theme';
import { groupBy } from 'lodash';

interface SeasonPositionPointsProps {
    comparisonSeasons: Maybe<Array<Maybe<PlayerSeason>>> | undefined;
    usePpg: boolean
}

const SeasonPositionPoints: React.FC<SeasonPositionPointsProps> = ({ ...props }) => {
    const data: Serie[] = [];
    const swarmData: any[] = [];
    const [maxPoints, setMaxPoints] = useState(0);
    const [filterFranchise] = useState<string[]>([]);
    const [focusFranchise, setFocusFranchise] = useState<string>();

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

            const comparisonSeasonsRanks = groupBy(positionSeasons, "primaryPosition");
            
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
                        
                        if (filterFranchise.length === 0 ||
                            (season?.endfranchise &&
                            filterFranchise.includes(season.endfranchise))) {
                            if (season?.points && season?.gamesPlayed && season?.gamesPlayed > 0) {
                                swarmData.push({
                                    "id": `${position}-${season.positionRank}`,
                                    "group": position,
                                    "points": season?.points,
                                    "gamesMissed": 17 - season?.gamesPlayed,
                                    "gamesPlayed": season?.gamesPlayed,
                                    "ppg": season?.gamesPlayed > 0 ? season?.points / season?.gamesPlayed : 0,
                                    "name": season?.name,
                                    "team": season?.endfranchise,
                                    "color": season?.endfranchisecolor,
                                });
                            }
                        }
                    }

                    if (season?.points && leaders[position as keyof ILeaders] < season?.points) {
                        leaders[position as keyof ILeaders] = season?.points;
                        if (season?.points > maxPoints) {
                            setMaxPoints(season?.points);
                        }
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
    const showLine = false;

    const palette : string[] = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#ffffff', '#000000']
    const team : string[] = [];
    const getColor = (data: any) => {
        if (focusFranchise && data.data.team !== focusFranchise) {
            return "#DDD";
        }
        if (data.data.color) {
            return data.data.color;
        }
        if (!team.includes(data.data.team)) {
            team.push(data.data.team);
        }
        if (!team.indexOf(data.data.team))
        {
            return "#CCC";
        }
        return palette[team.indexOf(data.data.team)];
    }

    const lineGraph = 
    <ResponsiveLine
    data={data}
    margin={{ top: 25, right: 20, bottom: 60, left: 55 }}
    colors={{ scheme: 'category10' }}
    xScale={{ type: 'point'}}
    yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
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

    return (
        <div>
            <div style={{ width: '100%', height: 800 }}>
                {showLine ? lineGraph : null}
                <ResponsiveSwarmPlot
                    data={swarmData}
                    groups={[ 'QB', 'RB', 'WR', 'TE' ]}
                    value="points"
                    valueScale={{ type: 'linear', min: 0, max: (maxPoints + 20), reverse: false }}
                    size={{ key: 'ppg', values: [ 4, 30 ], sizes: [ 5, 40 ] }}
                    forceStrength={4}
                    simulationIterations={100}
                    colors={getColor}
                    borderColor={{
                        from: 'color',
                        modifiers: [
                            [
                                'darker',
                                0.6
                            ],
                            [
                                'opacity',
                                0.5
                            ]
                        ]
                    }}margin={{ top: 80, right: 100, bottom: 80, left: 100 }}
                    axisTop={{
                        tickSize: 10,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Position',
                        legendPosition: 'middle',
                        legendOffset: -46
                    }}
                    axisRight={{
                        tickSize: 10,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Points',
                        legendPosition: 'middle',
                        legendOffset: 76
                    }}
                    axisBottom={{
                        tickSize: 10,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Position',
                        legendPosition: 'middle',
                        legendOffset: 46
                    }}
                    axisLeft={{
                        tickSize: 10,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Points',
                        legendPosition: 'middle',
                        legendOffset: -76
                    }}
                    tooltip={(input) => {
                        const data : any = input.data;
                        
                        return (
                            <div style={{backgroundColor: "#FFF", borderStyle: "solid", borderColor: `${input.color}`, borderWidth: "2px", padding: "5px"}}>
                                {`${input.id}: ${data.name} ${Number(input.data.points).toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} (${input.data.gamesPlayed} games)`}<br/>
                                {`${input.data.team ?? "Unowned"}`}
                            </div>
                        )
                    }}
                    onClick={(node, _) => {
                        if (focusFranchise === node.data.team) {
                            setFocusFranchise("");
                        } else {
                            setFocusFranchise(node.data.team);
                        }
                    }}
                />
            
            </div>
        </div>
    );
}

export default SeasonPositionPoints;