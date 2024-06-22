import "./PointsCard.css";

interface Props {
  points: number;
}

const PointsCard = ({ points }: Props) => {
  return <div className="pointsCard">{points}</div>;
};

export default PointsCard;
