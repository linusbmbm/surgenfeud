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
            circleSize={50}
            color={newTeam1Color}
            onChangeComplete={handleChangeCompleteTeam1Color}
          />
        </div>
        <div className="team2-color">
          <CirclePicker
            circleSize={50}
            color={newTeam2Color}
            onChangeComplete={handleChangeCompleteTeam2Color}
          />
        </div>
      </div>
      <input type="submit" value="Farben ändern" />
    </form>
  );
};

export default TeamColors;