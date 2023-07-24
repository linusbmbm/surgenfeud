interface Props {
  points: number;
  teamName: string;
}

const PointsTeamCard = ({ points, teamName }: Props) => {
  return (
    <div className="pointsTeamCard">
      {teamName}:<br />
      {points}
    </div>
  );
};

export default PointsTeamCard;
