export const useBaseTheme = () => ({
    background: '#FFFFFF',
    textColor: '#333333',
    fontSize: 11,
    axis: {
        domain: {
            line: {
                stroke: '#777777',
                strokeWidth: 1
            }
        },
        ticks: {
            line: {
                stroke: '#777777',
                strokeWidth: 0
            }
        }
    },
    grid: {
        line: {
            stroke: '#EEEEEE',
            strokeWidth: 1
        }
    },
    tooltip: {
        container: {
            background: '#fff',
            padding: '8px 21px',
            border: '1px solid transparent',
            borderRadius: '3px',
            boxShadow: "0 2px 8px rgb(0 0 0 / 25%)",
        },
    },
});

export const POSITION_COLOR_PALETTE = [
    '#525ED1',
    '#ED8721',
    '#FFD35C',
    '#00B6DE',
    '#7F82A3',
    '#292F66',
    '#8F161A',
    '#FFDFBF',
    '#EDAE00',
    '#B2E9F5',
];

export const POSITION_COLOR_MAP = {
    'QB': {
        label: 'QB',
        color: POSITION_COLOR_PALETTE[0]
    },
    'RB': {
        label: 'RB',
        color: POSITION_COLOR_PALETTE[1]
    },
    'WR': {
        label: 'WR',
        color: POSITION_COLOR_PALETTE[2]
    },
    'TE': {
        label: 'TE',
        color: POSITION_COLOR_PALETTE[3]
    },
    'K': {
        label: 'K',
        color: POSITION_COLOR_PALETTE[4]
    },
    'DE': {
        label: 'DE',
        color: POSITION_COLOR_PALETTE[6]
    },
    'DT': {
        label: 'DT',
        color: POSITION_COLOR_PALETTE[6]
    },
    'LB': {
        label: 'LB',
        color: POSITION_COLOR_PALETTE[6]
    },
    'C': {
        label: 'C',
        color: POSITION_COLOR_PALETTE[6]
    },
    'S': {
        label: 'S',
        color: POSITION_COLOR_PALETTE[6]
    },
    'LB, DE': {
        label: 'LB, DE',
        color: POSITION_COLOR_PALETTE[6]
    }
}
