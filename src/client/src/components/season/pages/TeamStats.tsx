import React from "react";
import { Container, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { GlobalLoading, GlobalError } from "../../ui";
import { useTeamStats } from "../hooks";

interface TeamStatsProps {}

const TeamStats: React.FC<TeamStatsProps> = ({ ...props }) => {
  const { roster, loading, error } = useTeamStats();

  if (loading) return <GlobalLoading mode="component" />;
  if (error || !roster)
    return <GlobalError mode="component" apolloError={error} />;

  return (
    <Container>
      <section>
        <div className="section-title">
          <span>Team Stats</span>
        </div>
        <div className="section-body p-3">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th colSpan={2}></th>
                <th colSpan={3}>Fantasy</th>
                <th colSpan={2}>Passing</th>
                <th colSpan={2}>Rushing</th>
                <th colSpan={2}>Receiving</th>
                <th colSpan={3}>Extra</th>
              </tr>
              <tr>
                <th>Pos</th>
                <th>Player</th>
                <th>Team Fan Pts</th>
                <th>Season Fan Pts</th>
                <th>Starts</th>
                <th>Yds</th>
                <th>TD</th>
                <th>Yds</th>
                <th>TD</th>
                <th>Yds</th>
                <th>TD</th>
                <th>Int</th>
                <th>FL</th>
                <th>2Pt</th>
              </tr>
            </thead>
            <tbody>
              {roster.map((player) => {
                return (
                  <tr key={player.playerId}>
                    <td>{player.player?.primaryPosition}</td>
                    <td>
                      <Link to={`/player/${player.playerId}`}>
                        {player.player?.name}
                      </Link>{" "}
                      - {player.player?.nflTeam}
                    </td>
                    <td>
                      <b>{player.teamPoints.toFixed(2)}</b>
                    </td>
                    <td>{player.seasonPoints.toFixed(2)}</td>
                    <td>{player.gamesStarted}</td>
                    {/* <td>{`${(
                      (player.gamesStarted /
                        (player.gamesBenched + player.gamesStarted)) *
                      100
                    ).toFixed(0)}%`}</td> */}
                    <td>{player.passYards}</td>
                    <td>{player.passTDs}</td>
                    <td>{player.rushYards}</td>
                    <td>{player.rushTDs}</td>
                    <td>{player.recYards}</td>
                    <td>{player.recTDs}</td>
                    <td>{player.interceptions}</td>
                    <td>{player.fumblesLost}</td>
                    <td>{player.twoPointConvert}</td>
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

export default TeamStats;
