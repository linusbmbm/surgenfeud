import { useEffect, useState } from "react";
import "./PointsFillCard.css";

declare module "react" {
  interface CSSProperties {
    "--points-before-percent"?: number;
    "--points-before-percent-gradient"?: number;
    "--points-after-percent"?: number;
    "--points-after-percent-gradient"?: number;
    "--counter-duration"?: string;
    "--fill-color-red"?: number;
    "--fill-color-green"?: number;
    "--fill-color-blue"?: number;
    "--points-before"?: number;
    "--points-after"?: number;
  }
}

interface Props {
  points: number;
  color: [number, number, number];
}

const PointsFillCard = ({ points, color }: Props) => {
  const [pointsBefore, setPointsBefore] = useState<number>(0);
  const [pointsBeforePercent, setPointsBeforePercent] = useState<number>(0);
  const [pointsBeforePercentGradient, setPointsBeforePercentGradient] =
    useState<number>(0);
  const [pointsAfter, setPointsAfter] = useState<number>(0);
  const [pointsAfterPercent, setPointsAfterPercent] = useState<number>(0);
  const [pointsAfterPercentGradient, setPointsAfterPercentGradient] =
    useState<number>(0);

  useEffect(() => {
    setPointsBefore(pointsAfter);
    setPointsBeforePercent(
      pointsAfter === 0 ? pointsAfter / 2 - 5 : pointsAfter / 2
    );
    setPointsBeforePercentGradient(
      pointsAfter === 0 ? pointsAfter / 2 : pointsAfter / 2 + 5
    );
    setPointsAfter(points);
    setPointsAfterPercent(points / 2);
    setPointsAfterPercentGradient(
      points / 2 + (points >= 200 || points === 0 ? 0 : 5)
    );
  }, [points]);

  const counterDuration: string = `${
    Math.abs(pointsAfter - pointsBefore) / 20
  }s`;

  return (
    <div
      key={points}
      className="points-fill-card-number"
      style={{
        "--points-before-percent": pointsBeforePercent,
        "--points-before-percent-gradient": pointsBeforePercentGradient,
        "--points-after-percent": pointsAfterPercent,
        "--points-after-percent-gradient": pointsAfterPercentGradient,
        "--counter-duration": counterDuration,
        "--fill-color-red": color[0],
        "--fill-color-green": color[1],
        "--fill-color-blue": color[2],
        "--points-before": pointsBefore,
        "--points-after": pointsAfter,
      }}
    ></div>
  );
};

export default PointsFillCard;
