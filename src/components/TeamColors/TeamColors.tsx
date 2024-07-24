import "./TeamColors.css";
import React, { useState } from "react";
import { CirclePicker } from "react-color";

interface Props {
  onSubmit: (newTeam1Color: string, newTeam2Color: string) => void;
  visibility: boolean;
}

const TeamColors = ({ onSubmit, visibility }: Props) => {
  const [newTeam1Color, setNewTeam1Color] = useState<string>("");
  const [newTeam2Color, setNewTeam2Color] = useState<string>("");

  const handleChangeCompleteTeam1Color = (color: any) => {
    setNewTeam1Color(color.hex);
  };

  const handleChangeCompleteTeam2Color = (color: any) => {
    setNewTeam2Color(color.hex);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(newTeam1Color, newTeam2Color);
  };

  if (!visibility) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="team-colors">
        <div className="team1-color">
          <CirclePicker
            colors={[
              "#FF0000",
              "#008000",
              "#0000FF",
              "#800080",
              "#FFA500",
              "#4169E1",
              "#FFFF00",
              "#40E0D0",
              "#FF1493",
            ]}
            circleSize={50}
            color={newTeam1Color}
            onChangeComplete={handleChangeCompleteTeam1Color}
          />
        </div>
        <div className="team2-color">
          <CirclePicker
            colors={[
              "#FF0000",
              "#008000",
              "#0000FF",
              "#800080",
              "#FFA500",
              "#4169E1",
              "#FFFF00",
              "#40E0D0",
              "#FF1493",
            ]}
            circleSize={50}
            color={newTeam2Color}
            onChangeComplete={handleChangeCompleteTeam2Color}
          />
        </div>
      </div>
      <button type="submit">Farben ändern</button>
    </form>
  );
};

export default TeamColors;
