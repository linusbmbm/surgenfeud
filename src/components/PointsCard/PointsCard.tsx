import { useEffect, useState } from "react";
import "./PointsCard.css";

declare module "react" {
  interface CSSProperties {
    "--points-before"?: number;
    "--points-after"?: number;
    "--counter-duration"?: string;
  }
}

interface Props {
  points: number;
}

const PointsCard = ({ points }: Props) => {
  const [pointsAfter, setPointsAfter] = useState<number>(0);
  const [pointsBefore, setPointsBefore] = useState<number>(0);

  useEffect(() => {
    setPointsBefore(pointsAfter);
    setPointsAfter(points);
  }, [points]);

  const counterDuration: string = `${
    Math.abs(pointsAfter - pointsBefore) / 20
  }s`;

  return (
    <div
      key={points}
      className="points-card"
      style={{
        "--points-before": pointsBefore,
        "--points-after": pointsAfter,
        "--counter-duration": counterDuration,
      }}
    ></div>
  );
};

export default PointsCard;
