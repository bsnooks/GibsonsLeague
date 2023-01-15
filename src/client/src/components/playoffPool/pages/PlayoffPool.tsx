import { Container, Image, Table } from "react-bootstrap";
import { FranchiseUtilities } from "../../../utilities/FranchiseAvatar";
import { FranchiseLink } from "../../franchise/controls";
import { GlobalLoading, GlobalError } from "../../ui";
import { usePlayoffPoolContext } from "../hooks";

interface PlayoffPoolProps {}

const PlayoffPool: React.FC<PlayoffPoolProps> = () => {
  const { pool, loading, error } = usePlayoffPoolContext();

  if (loading) return <GlobalLoading />;
  if (error || !pool) return <GlobalError apolloError={error} />;

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
                <th>Pos.</th>
                <th>Team</th>
                <th>Points</th>
                <th>GP</th>
                <th>PR</th>
              </tr>
            </thead>
            <tbody>
              {pool.teams.map((team, index) => {
                const avatar = new FranchiseUtilities().pickAvatarByFranchiseId(
                  team?.franchiseId
                );
                return (
                  <tr key={index}>
                    <td>{team.rank}.</td>
                    <td className="text-left">
                      <Image
                        roundedCircle
                        src={avatar}
                        style={{ width: "1.5rem", height: "1.5rem" }}
                      />
                      <FranchiseLink
                        franchiseId={team.franchiseId}
                        style={{ paddingLeft: "10px" }}
                      >
                        {team.name}
                      </FranchiseLink>
                    </td>
                    <td>
                      {Number(team?.points ?? 0).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td>{team.gamesPlayed}</td>
                    <td>{team.playersRemaining}</td>
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

export default PlayoffPool;

