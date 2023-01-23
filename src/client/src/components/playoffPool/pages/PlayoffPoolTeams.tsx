// @ts-nocheck
import { useEffect, useState } from "react";
import { Container, Image, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { groupBy } from "lodash";
import { FranchiseUtilities } from "../../../utilities/FranchiseAvatar";
import { FranchiseLink } from "../../franchise/controls";
import { GlobalLoading, GlobalError } from "../../ui";
import { usePlayoffPoolContext } from "../hooks";
import { PlayoffPoolPlayer } from "../models/PlayoffPool";

interface PlayoffPoolTeamsProps {}

const PlayoffPoolTeams: React.FC<PlayoffPoolTeamsProps> = () => {
  const [players, setPlayers] = useState<PlayoffPoolPlayer[]>([]);

  // hooks
  const { pool, loading, error } = usePlayoffPoolContext();

  useEffect(() => {
    if (!pool?.players) return;

    const copy = [...pool.players];
    setPlayers(
      copy.sort((a, b) => ((a?.points ?? 0) > (b?.points ?? 0) ? -1 : 1))
    );
  }, [pool?.players]);

  const groups = groupBy(players, "franchiseId");

  if (loading) return <GlobalLoading />;
  if (error || !pool) return <GlobalError apolloError={error} />;

  const cards = [];
  for (const [franchiseId, group] of Object.entries(groups)) {
    const avatar = new FranchiseUtilities().pickAvatarByFranchiseId(
      franchiseId
    );

    const teamName = pool.teams.filter((t) => t.franchiseId === franchiseId)[0]
      .name;

    const card = (
      <>
        <div className="section-title">
          <TeamWrapper>
            <Image
              roundedCircle
              src={avatar}
              style={{ width: "1.5rem", height: "1.5rem" }}
            />
            <FranchiseLink
              franchiseId={franchiseId}
              style={{ paddingLeft: "10px" }}
            >
              <TeamNameWrapper>{teamName}</TeamNameWrapper>
            </FranchiseLink>
          </TeamWrapper>
        </div>
        <div className="section-body p-3">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Pick</th>
                <th>Name</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {group.sort((a, b) => ((a?.pick ?? 0) > (b?.pick ?? 0) ? 1 : -1)).map((player, index) => {
                return (
                  <tr key={index}>
                    <td>{`${
                      player.pick % 8 === 0
                        ? player.pick / 8
                        : Math.ceil(player.pick / 8)
                    }.${player.pick % 8 === 0 ? 8 : player.pick % 8}`}</td>
                    <td className="text-left">
                      <Link to={`/player/${player.playerId}`}>
                        <PlayerWrapper eliminated={player.eliminated}>
                          {player.name}
                        </PlayerWrapper>
                      </Link>
                    </td>
                    <td>
                      {Number(player?.points ?? 0).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </>
    );

    cards.push(card);
  }

  return (
    <Container>
      <section>{cards}</section>
    </Container>
  );
};

export default PlayoffPoolTeams;

const PlayerWrapper = styled.div`
  white-space: nowrap;
  text-overflow: ellipsis;
  text-decoration: ${(props) =>
    props.eliminated ? "line-through" : "default"}; ;
`;
const TeamWrapper = styled.div`
  display: flex;
`;
const TeamNameWrapper = styled.div`
  white-space: nowrap;
  text-overflow: ellipsis;
`;
