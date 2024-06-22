import "./TeamName.css";
import React, { useState } from "react";

interface Props {
  onSubmit: (newTeam1Name: string, newTeam2Name: string) => void;
  visibility: boolean;
}

const TeamName = ({ onSubmit, visibility }: Props) => {
  const [newTeam1Name, setNewTeam1Name] = useState<string>("");
  const [newTeam2Name, setNewTeam2Name] = useState<string>("");

  const handleChangeTeam1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTeam1Name(String(event.target.value));
  };

  const handleChangeTeam2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTeam2Name(String(event.target.value));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(newTeam1Name, newTeam2Name);
  };

  if (!visibility) {
    return null;
  }

  return (
    <div className="teamName">
      <form onSubmit={handleSubmit}>
        <label>Team 1 Name:</label>
        <input type="text" value={newTeam1Name} onChange={handleChangeTeam1} />
        <label>Team 2 Name:</label>
        <input type="text" value={newTeam2Name} onChange={handleChangeTeam2} />
        <input type="submit" style={{ display: "none" }} />
      </form>
    </div>
  );
};

export default TeamName;
