import { useNavigate } from "react-router-dom";

declare module "react" {
  interface CSSProperties {
    "--jumpNr"?: number;
  }
}

const Preview = () => {
  const navigate = useNavigate();

  const textRow1: string[] = ["F", "A", "M", "I", "L", "Y"];
  const textRow2: string[] = ["D", "U", "L", "L", "E"];

  return (
    <div className="wrapperPreview" onClick={() => navigate(`/0`)}>
      <div className="headline" style={{ whiteSpace: "pre" }}>
        {textRow1.map((letter, index) => (
          <span key={index} style={{ "--jumpNr": index + 1 }}>
            {letter}
          </span>
        ))}
        <br />
        {textRow2.map((letter, index) => (
          <span key={index} style={{ "--jumpNr": index + 7 }}>
            {letter}
          </span>
        ))}
      </div>
      <div className="subHeadline">präsentiert von eurem Moderator:</div>
      <div className="subSubHeadline">Will Birney</div>
    </div>
  );
};

export default Preview;
