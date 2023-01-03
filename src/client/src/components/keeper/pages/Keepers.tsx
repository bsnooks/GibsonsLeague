import React, { useEffect, useState } from "react";
import { groupBy } from "lodash";
import { useLeagueContext } from "../../league/hooks";
import { useKeepers } from "../hooks";
import { KeeperCard } from "../controls";
import { GlobalError, GlobalLoading } from "../../ui";
import { Col, Container, Row } from "react-bootstrap";
import SectionInfoBox from "../../controls/SectionInfoBox";

interface KeepersProps {}

const Keepers: React.FC<KeepersProps> = ({ ...props }) => {
  // state
  const [cards, setCards] = useState([]);
  const [positions, setPositions] = useState<{ [name: string]: number }>({});

  // hooks
  const { season, franchise } = useLeagueContext();
  const { keepers, loading, error } = useKeepers();

  useEffect(() => {
    const groupedPositions = groupBy(keepers, "position");
    const map : { [name: string]: number } = {};
    
    for (const [key, value] of Object.entries(groupedPositions)) {
      map[key] = value.length;
    }
    setPositions(map);

    const groupByKey = season ? "franchiseName" : "year";
    const years = groupBy(keepers, groupByKey);

    const list: any = [];
    for (const [key, value] of Object.entries(years).reverse()) {
        switch (groupByKey) {
            case "franchiseName":
              list.push(<KeeperCard grouping={key} groupingLink={undefined} keepers={value} key={key} />);
                break;
            case "year":
            default:
              list.push(<KeeperCard grouping={key} groupingLink={`/season/${key}?t=keepers`} keepers={value} key={key} />);
                break;
        }
    }

    setCards(list);
  }, [keepers, season]);

  if (loading) return <GlobalLoading mode="component" />;
  if (error) return <GlobalError mode="component" apolloError={error} />;

  return (
    <Container>
      <section>
        {season && !franchise ? (
          <>
            <div className="section-title">
              <span>Total</span>
            </div>
            <div className="section-body p-3">
              <Row>
                <Col>
                  <SectionInfoBox
                    title="QB's Kept"
                    info={positions["QB"]}
                  />
                </Col>
                <Col>
                  <SectionInfoBox
                    title="RB's Kept"
                    info={positions["RB"]}
                  />
                </Col>
                <Col>
                  <SectionInfoBox
                    title="WR's Kept"
                    info={positions["WR"]}
                  />
                </Col>
                <Col>
                  <SectionInfoBox
                    title="TE's Kept"
                    info={"TE" in positions ? positions["TE"] : 0}
                  />
                </Col>
              </Row>
            </div>
          </>
        ) : null}
        <div className="section-title">
          <span>Keepers</span>
        </div>
        <div className="section-body p-3">{cards}</div>
      </section>
    </Container>
  );
};

export default Keepers;
