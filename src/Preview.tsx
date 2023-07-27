import { useNavigate } from "react-router-dom";

const Preview = () => {
  const navigate = useNavigate();

  return (
    <div className="wrapperPreview">
      <div className="headline" onClick={() => navigate(`/0`)}>
        Family Dulle
      </div>
      <div className="subHeadline">präsentiert von eurem Moderator:</div>
      <div className="subSubHeadline">Will Birney</div>
    </div>
  );
};

export default Preview;
