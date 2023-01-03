import React, { useEffect, useState } from "react";
import { groupBy } from "lodash";
import { useLeagueContext } from "../../league/hooks";
import { useDraft } from "../hooks";
import { DraftCard } from "../controls";
import { GlobalError, GlobalLoading } from "../../ui";
import { Container } from "react-bootstrap";

interface DraftProps {}

const Draft: React.FC<DraftProps> = ({ ...props }) => {
  // state
  const [cards, setCards] = useState([]);
  
  // hooks
  const { season } = useLeagueContext();
  const { draftPicks, loading, error } = useDraft();

  useEffect(() => {
    const groupByKey = season ? "round" : "year";
    const years = groupBy(draftPicks, groupByKey);

    const list: any = [];
    const items =
      groupByKey === "year"
        ? Object.entries(years).reverse()
        : Object.entries(years);
    for (const [key, value] of items) {
      switch (groupByKey) {
        case "round":
          list.push(
            <DraftCard
              grouping={key}
              groupingLabel={`Round ${key}`}
              picks={value}
              includeFranchise={true}
              key={key}
            />
          );
          break;
        case "year":
        default:
          list.push(
            <DraftCard
              grouping={key}
              groupingLabel={key}
              groupingLink={`/season/${key}?t=draft`}
              picks={value}
              key={key}
            />
          );
          break;
      }
    }

    setCards(list);
  }, [draftPicks, season]);

  if (loading) return <GlobalLoading mode="component" />;
  if (error) return <GlobalError mode="component" apolloError={error} />;

  return (
    <Container>
      <section>
        <div className="section-title">
          <span>Draft</span>
        </div>
        <div className="section-body p-3">{cards}</div>
      </section>
    </Container>
  );
};

export default Draft;
