import { Container } from "react-bootstrap";
import Login from "../components/auth/Login";

interface LoginProps {}

const LoginPage: React.FC<LoginProps> = () => {
  return (
    <div className="page">
      <Container>
        <Login />
      </Container>
    </div>
  );
};

export default LoginPage;
