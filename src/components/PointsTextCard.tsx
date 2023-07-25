interface Props {
  points: number;
  text: string;
}

const PointsTextCard = ({ points, text }: Props) => {
  return (
    <div className="pointsTextCard">
      {text}:<br />
      {points}
    </div>
  );
};

export default PointsTextCard;
