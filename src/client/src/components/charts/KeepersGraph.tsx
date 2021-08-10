import React from 'react';
import { Maybe, PlayerTransaction } from '../../generated/graphql';
import { useBaseTheme } from './theme';
import { ResponsiveBar } from '@nivo/bar';
import { groupBy } from 'lodash';

interface KeepersGraphProps {
    keepers: Maybe<Array<Maybe<PlayerTransaction>>> | undefined;
    groupBy: string
}

const KeepersGraph: React.FC<KeepersGraphProps> = ({ ...props }) => {
    const franchises = groupBy(props.keepers, props.groupBy);

    const barData = [];
    var keeperKeys: string[] = ["1", "2", "3", "4", "5"];
    
    for (const [franchiseName, keepers] of Object.entries(franchises)) {
        const franchiseData:any = {
            "key": franchiseName,
        }
        keepers.forEach((keeper, i) => {
            if (keeper) {
                franchiseData[`${i+1}`] = keeper.seasonPoints;
                franchiseData[`${i+1}-name`] = keeper.name;
                franchiseData[`${i+1}-data`] = keeper;
            }
        });
        barData.push(franchiseData);
    }
    const theme = useBaseTheme();

    return (
        <div style={{ width: '100%', height: 400 }}>
            <ResponsiveBar
                data={barData}
                keys={keeperKeys}
                indexBy={"key"}
                margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
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
                    legend: `${props.groupBy}`,
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
                theme={theme}
                tooltip={(input) => {
                    const keeper = input.data[`${input.id}-data`];
                    return (
                        <div style={{ backgroundColor: "#FFF", borderStyle: "solid", borderColor: `${input.color}`, borderWidth: "2px", padding: "5px" }}>
                            {`${keeper.name}: ${keeper.seasonPoints} (${keeper.position}-${keeper.positionRank})`}
                        </div>
                    )
                }}
            />
        </div>
    );
}

export default KeepersGraph;