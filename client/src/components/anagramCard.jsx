import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const AnagramResult = ({ result }) => {
  const [shuffledBlocks, setShuffledBlocks] = useState([]);
  const [revealAnswer, setRevealAnswer] = useState(false);

  useEffect(() => {
    if (result.blocks) {
      setShuffledBlocks(shuffleArray(result.blocks));
    }
  }, [result.blocks]);

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {shuffledBlocks.map((block, index) => (
          <Badge key={index} variant="secondary" className="text-sm py-1 px-2.5">
            {block.text}
          </Badge>
        ))}
      </div>
      <Button
        onClick={() => setRevealAnswer(!revealAnswer)}
        variant="outline"
        className="w-full"
      >
        {revealAnswer ? "Hide" : "Reveal"} Answer
      </Button>
      {revealAnswer && (
        <div className="mt-4">
          <p className="text-sm font-medium text-muted-foreground mb-2">
            Solution
          </p>
          <div className="flex flex-wrap gap-2">
            {result.blocks?.map((block, index) => (
              <Badge
                key={index}
                variant="default"
                className="text-sm py-1 px-2"
              >
                {block.text}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
