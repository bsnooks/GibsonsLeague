import { DraftPick, PlayerTransaction } from "../generated/graphql";

export class DraftPickGrader {
    gradeDraftPick = (pick: DraftPick | null): DraftPickGrade | null => {
        if (!pick) return null;

        const positionStarterThreshold = pick.playerPosition === "RB" || pick.playerPosition === "QB" ? 20 : pick.playerPosition === "WR" ? 30 : pick.playerPosition === "TE" ? 10 : undefined;
        
        if (!positionStarterThreshold) return null;
        if (!pick.playerPositionRank) return null;

        const percentDiff = (pick.playerPositionRank - pick.positionPick) / ((pick.playerPositionRank + pick.positionPick) / 2) * 100;
        const asterisk = false;

        if  (percentDiff < -50)
        {
            return {
                grade: 'A+',
                asterisk: asterisk ? '*' : null,
            };
        }
        else if  (percentDiff < -25)
        {
            return {
                grade: 'A',
                asterisk: asterisk ? '*' : null,
            };
        }
        else if  (percentDiff < 10)
        {
            return {
                grade: 'B',
                asterisk: asterisk ? '*' : null,
            };
        }
        else if  (percentDiff < 30)
        {
            return {
                grade: 'C',
                asterisk: asterisk ? '*' : null,
            };
        }
        else if  (percentDiff < 75)
        {
            return {
                grade: 'D',
                asterisk: asterisk ? '*' : null,
            };
        }

        return {
            grade: 'Bust',
            asterisk: asterisk ? '*' : null,
        };
    }
    
    gradeKeeper = (keeper: PlayerTransaction | null): DraftPickGrade | null => {
        if (!keeper) return null;

        const positionStarterThreshold = keeper.position === "RB" || keeper.position === "QB" ? 20 : keeper.position === "WR" ? 30 : keeper.position === "TE" ? 10 : undefined;

        if (!positionStarterThreshold) return null;

        const aPlusRange = Math.floor(positionStarterThreshold * 0.25);
        const aRange = Math.floor(positionStarterThreshold * 0.50);
        const bRange = Math.ceil(positionStarterThreshold * 0.75);
        const cRange = positionStarterThreshold;
        const dRange = Math.ceil(positionStarterThreshold * 1.25);

        if  (keeper.positionRank && keeper.positionRank <= aPlusRange)
        {
            return {
                grade: 'A+'
            };
        }
        else if ((keeper.positionRank && keeper.positionRank <= aRange))
        {
            return {
                grade: 'A'
            };
        }
        else if ((keeper.positionRank && keeper.positionRank <= bRange))
        {
            return {
                grade: 'B'
            };
        }
        else if ((keeper.positionRank && keeper.positionRank <= cRange))
        {
            return {
                grade: 'C'
            };
        }
        else if ((keeper.positionRank && keeper.positionRank <= dRange))
        {
            return {
                grade: 'D'
            };
        }

        return {
            grade: 'Bust'
        };
    }
}

export interface DraftPickGrade {
    grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'Bust';
    explaination?: string;
    asterisk?: '*' | null;
}