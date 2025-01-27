import { useEffect, useState } from "react";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";


export const AnagramCard = ({ result }) => {
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
    <CardContent>
      <div className="flex flex-wrap gap-2 mb-2">
        {shuffledBlocks.map((block, index) => (
          <div
            key={index}
            className="bg-gray-100 px-3 py-1.5 rounded-md hover:bg-gray-200 transition-colors select-none"
          >
            {block.text}
          </div>
        ))}
      </div>
      <Button
        onClick={() => setRevealAnswer(!revealAnswer)}
        variant="outline"
        className="w-full mt-4"
      >
        {revealAnswer ? "Hide" : "Reveal"} Answer
      </Button>
      {revealAnswer && (
        <>
          <p className="text-sm text-gray-500 my-2">Solution</p>
          <div className="flex flex-wrap gap-1">
            {result.blocks?.map((block, index) => (
              <div
                key={index}
                className="bg-gray-100 px-2 py-1.5 rounded-md hover:bg-gray-200 transition-colors select-none"
              >
                {block.text}
              </div>
            ))}
          </div>
        </>
      )}
    </CardContent>
  );
};
