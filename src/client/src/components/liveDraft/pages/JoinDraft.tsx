import { Container } from "react-bootstrap";
import { useAuthContext } from "../../auth/hooks/useAuthContext";

interface JoinDraftProps {}

const JoinDraft: React.FC<JoinDraftProps> = () => {
  const { username } = useAuthContext();

  return (
    <Container>
      <section>
        <div className="section-title">
          <span>Live Drafts</span>
        </div>
        <div className="section-body p-3">
          {username && `Welcome ${username}`}
        </div>
      </section>
    </Container>
  );
};

export default JoinDraft;
