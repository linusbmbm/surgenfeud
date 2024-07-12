import "./ShotsCard.css";
import shotImage from "../../images/Shot.png";
import drinkingPersonImage from "../../images/DrinkingPerson.png";
import BlessLeftImage from "../../images/BlessLeft.png";
import BlessRightImage from "../../images/BlessRight.png";
import ShotType from "../../types/ShotType.enum";

interface Props {
  type: ShotType;
  num: number;
}

const PointsTextCard = ({ type, num }: Props) => {
  let shots = [];

  for (let shotCount = 0; shotCount < num; shotCount++) {
    shots.push(
      <div key={shotCount} className="shot">
        <img src={shotImage} height="40px" />
        {shotCount + 1}
      </div>
    );
  }

  return (
    <div className="shots-card">
      {type === ShotType.person ? (
        <img src={drinkingPersonImage} height="70px" />
      ) : type === ShotType.rest ? (
        <img src={BlessLeftImage} height="70px" />
      ) : null}
      {shots}
      {type === ShotType.rest ? (
        <img src={BlessRightImage} height="70px" />
      ) : null}
    </div>
  );
};

export default PointsTextCard;
