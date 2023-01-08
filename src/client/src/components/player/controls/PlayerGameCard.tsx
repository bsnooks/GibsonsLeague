// @ts-nocheck
import React, { useEffect, useState } from "react";
import { Image, Table } from "react-bootstrap";
import { PlayerWeek } from "../../../generated/graphql";
import { faChair, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FranchiseUtilities } from "../../../utilities/FranchiseAvatar";
import { FranchiseLink } from "../../franchise/controls";

interface PlayerSeasonCardProps {
  year: number;
  games: PlayerWeek[];
}

export const PlayerGameCard: React.FC<PlayerSeasonCardProps> = ({
  ...props
}) => {
  const [rows, setRows] = useState([]);
  // const avatar = game.franchiseId
  //   ? new FranchiseUtilities().pickAvatarByFranchiseId(game.franchiseId)
  //   : null;
  useEffect(() => {
    if (!props.games) return;

    const list: any = [];

    props.games.forEach((game) => {
      const avatar = game.franchiseId
        ? new FranchiseUtilities().pickAvatarByFranchiseId(game.franchiseId)
        : null;
      list.push(
        <tr>
          <td>{game.week}</td>
          <td>
            {avatar && (
              <Image
                src={avatar}
                roundedCircle
                style={{
                  width: "1.5rem",
                  height: "1.5rem",
                  marginRight: "8px",
                }}
              />
            )}
            <FranchiseLink franchiseId={game.franchiseId}>
              {game.franchiseName}
            </FranchiseLink>
          </td>
          <td>
            {game.franchiseId && game.started && <FontAwesomeIcon icon={faPlay} title="Started" />}
            {game.franchiseId && !game.started && <FontAwesomeIcon icon={faChair} title="Benched" />}
          </td>
          <td>{game.points.toFixed(2)}</td>
          <td className="d-none d-md-table-cell">{game.passYards}</td>
          <td className="d-none d-md-table-cell">{game.passTDs}</td>
          <td className="d-none d-md-table-cell">{game.rushYards}</td>
          <td className="d-none d-md-table-cell">{game.rushTDs}</td>
          <td className="d-none d-md-table-cell">{game.recYards}</td>
          <td className="d-none d-md-table-cell">{game.recTDs}</td>
          <td className="d-none d-md-table-cell">{game.interceptions}</td>
          <td className="d-none d-md-table-cell">{game.fumblesLost}</td>
          <td className="d-none d-md-table-cell">{game.twoPointConvert}</td>
        </tr>
      );
    });

    setRows(list);
  }, [props.games]);

  return (
    <section>
      <div className="section-title">
        <span>{props.year}</span>
      </div>
      <div className="section-body p-3">
        <Table bordered hover>
          <thead>
            <tr>
              <th colSpan={1}></th>
              <th colSpan={3}>Fantasy</th>
              <th className="d-none d-md-table-cell" colSpan={2}>Passing</th>
              <th className="d-none d-md-table-cell" colSpan={2}>Rushing</th>
              <th className="d-none d-md-table-cell" colSpan={2}>Receiving</th>
              <th className="d-none d-md-table-cell" colSpan={3}>Extra</th>
            </tr>
            <tr>
              <th>Week</th>
              <th>Team</th>
              <th>Status</th>
              <th>Fan Pts</th>
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
          <tbody>{rows}</tbody>
        </Table>
      </div>
    </section>
  );
};
