import React from "react";
import { Container, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { GlobalLoading, GlobalError } from "../../ui";
import { useRoster } from "../hooks";

interface RosterProps {}

const Roster: React.FC<RosterProps> = ({ ...props }) => {
  const { roster, loading, error } = useRoster();

  if (loading) return <GlobalLoading mode="component" />;
  if (error || !roster)
    return <GlobalError mode="component" apolloError={error} />;

  return (
    <Container>
      <section>
        <div className="section-title">
          <span>Roster</span>
        </div>
        <div className="section-body p-3">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th colSpan={2}></th>
                <th colSpan={3}>Fantasy</th>
                <th className="d-none d-md-table-cell" colSpan={2}>Passing</th>
                <th className="d-none d-md-table-cell" colSpan={2}>Rushing</th>
                <th className="d-none d-md-table-cell" colSpan={2}>Receiving</th>
                <th className="d-none d-md-table-cell" colSpan={3}>Extra</th>
              </tr>
              <tr>
                <th>Pos</th>
                <th>Player</th>
                <th>Team Fan Pts</th>
                <th>Season Fan Pts</th>
                <th>Starts</th>
                <th className="d-none d-md-table-cell">Yds</th>
                <th className="d-none d-md-table-cell">TD</th>
                <th className="d-none d-md-table-cell">Yds</th>
                <th className="d-none d-md-table-cell">TD</th>
                <th className="d-none d-md-table-cell">Yds</th>
                <th className="d-none d-md-table-cell">TD</th>
                <th className="d-none d-md-table-cell">Int</th>
                <th className="d-none d-md-table-cell">FL</th>
                <th className="d-none d-md-table-cell">2Pt</th>
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
                    <td className="d-none d-md-table-cell">{player.passYards}</td>
                    <td className="d-none d-md-table-cell">{player.passTDs}</td>
                    <td className="d-none d-md-table-cell">{player.rushYards}</td>
                    <td className="d-none d-md-table-cell">{player.rushTDs}</td>
                    <td className="d-none d-md-table-cell">{player.recYards}</td>
                    <td className="d-none d-md-table-cell">{player.recTDs}</td>
                    <td className="d-none d-md-table-cell">{player.interceptions}</td>
                    <td className="d-none d-md-table-cell">{player.fumblesLost}</td>
                    <td className="d-none d-md-table-cell">{player.twoPointConvert}</td>
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

export default Roster;
