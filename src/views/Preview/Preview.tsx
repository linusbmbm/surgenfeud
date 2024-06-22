import "./Preview.css";
import { useNavigate } from "react-router-dom";

const Preview = () => {
  const navigate = useNavigate();

  const textRow1: string[] = ["F", "A", "M", "I", "L", "Y"];
  const textRow2: string[] = ["D", "U", "L", "L", "E"];

  return (
    <div className="preview" onClick={() => navigate(`/0`)}>
      <div className="game-name">Surgen Feud</div>
      <div className="host-presents">präsentiert von eurem Moderator:</div>
      <div className="host-name">Will Birney</div>
    </div>
  );
};

export default Preview;
