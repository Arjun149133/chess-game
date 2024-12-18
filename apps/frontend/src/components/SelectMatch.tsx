"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGameStore } from "@/store/gameStore";

const SelectMatch = () => {
  const game = useGameStore((state) => state.game);
  const setGame = useGameStore((state) => state.setGame);

  const handleSelect = (value: string) => {
    setGame({ ...game, game_type: value });
  };

  return (
    <div>
      <Select onValueChange={handleSelect}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Match Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="CLASSICAL">CLASSICAL | 10 Min</SelectItem>
          <SelectItem value="RAPID">RAPID | 5 Min</SelectItem>
          <SelectItem value="BLITZ">BLITZ | 3 Min</SelectItem>
          <SelectItem value="BULLET">BULLET | 1 Min</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectMatch;
