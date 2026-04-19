import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Dream11ProSelector() {
  const [input, setInput] = useState("");
  const [teams, setTeams] = useState([]);
  const [toss, setToss] = useState("bat");
  const [pitch, setPitch] = useState("balanced");

  const parsePlayers = () => {
    return input.split("\n").map(line => {
      const [name, role, team] = line.split(",");
      return { name: name?.trim(), role: role?.trim(), team: team?.trim() };
    }).filter(p => p.name);
  };

  const getByRole = (players, role) => players.filter(p => p.role === role);

  const generateTeams = () => {
    const players = parsePlayers();

    let generated = [];

    for (let i = 0; i < 6; i++) {
      let wk = shuffle(getByRole(players, "WK")).slice(0, 1);
      let bat = shuffle(getByRole(players, "BAT")).slice(0, 4);
      let ar = shuffle(getByRole(players, "AR")).slice(0, 2);
      let bowl = shuffle(getByRole(players, "BOWL")).slice(0, 4);

      let team = [...wk, ...bat, ...ar, ...bowl];

      // Toss logic
      if (toss === "bat") {
        team = team.sort((a, b) => a.team.localeCompare(b.team));
      }

      // Pitch logic
      if (pitch === "spin") {
        team = team.sort((a, b) => (a.role === "BOWL" ? -1 : 1));
      }

      const captain = team[Math.floor(Math.random() * team.length)];
      const viceCaptain = team[Math.floor(Math.random() * team.length)];

      generated.push({ team, captain, viceCaptain });
    }

    setTeams(generated);
  };

  const shuffle = (arr) => [...arr].sort(() => 0.5 - Math.random());

  return (
    <div className="p-6 grid gap-4">
      <h1 className="text-3xl font-bold">Dream11 GL AI Pro Generator</h1>

      <textarea
        className="border p-2 rounded"
        rows={6}
        placeholder="Format:\nPlayer Name, Role(WK/BAT/AR/BOWL), Team"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <div className="flex gap-4">
        <select onChange={(e) => setToss(e.target.value)} className="border p-2">
          <option value="bat">Batting First</option>
          <option value="chase">Chasing</option>
        </select>

        <select onChange={(e) => setPitch(e.target.value)} className="border p-2">
          <option value="balanced">Balanced Pitch</option>
          <option value="spin">Spin Friendly</option>
          <option value="pace">Pace Friendly</option>
        </select>
      </div>

      <Button onClick={generateTeams}>Generate GL Teams</Button>

      <div className="grid md:grid-cols-2 gap-4">
        {teams.map((t, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <h2 className="font-bold">GL Team {i + 1}</h2>
              <ul className="text-sm mt-2">
                {t.team.map((p, idx) => (
                  <li key={idx}>{p.name} ({p.role})</li>
                ))}
              </ul>
              <p className="mt-2">C: {t.captain?.name}</p>
              <p>VC: {t.viceCaptain?.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
