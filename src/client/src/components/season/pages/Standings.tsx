import React from "react";
import { Container, Table, Image } from "react-bootstrap";
import { FranchiseUtilities } from "../../../utilities/FranchiseAvatar";
import { FranchiseLink } from "../../franchise/controls";
import { useLeagueContext } from "../../league/hooks";

interface StandingsProps {}

const Standings: React.FC<StandingsProps> = ({ ...props }) => {
  const { season } = useLeagueContext();

  if (!season?.teams) return null;

  return (
    <Container>
      <section>
        <div className="section-title">
          <span>Standings</span>
        </div>
        <div className="section-body p-3">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Team</th>
                <th>W-L-T</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {season.teams.map((team, index) => {
                const avatar = new FranchiseUtilities().pickAvatarByFranchiseId(
                  team?.franchiseId
                );
                return (
                  <tr key={index}>
                    <td>{index + 1}.</td>
                    <td className="text-left">
                      <Image
                        roundedCircle
                        src={avatar}
                        style={{ width: "1.5rem", height: "1.5rem" }}
                      />
                      <FranchiseLink
                        franchiseId={team?.franchiseId ?? ""}
                        style={{ paddingLeft: "10px" }}
                      >
                        {team?.franchiseName}
                      </FranchiseLink>
                    </td>
                    <td>{`${team?.wins}-${team?.loses}-${team?.ties}`}</td>
                    <td>
                      {Number(team?.points ?? 0).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </section>
    </Container>
  );
};

export default Standings;
