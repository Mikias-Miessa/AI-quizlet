"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, RefreshCw, ArrowLeft, Timer } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useLearningStore } from "@/lib/store";

interface MatchingProps {
  pairs: Array<{ left: string; right: string }>;
  clearPDF: () => void;
}

export default function Matching({ pairs, clearPDF }: MatchingProps) {
  const router = useRouter();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [shuffledPairs, setShuffledPairs] = useState<
    Array<{ id: string; content: string; side: "left" | "right" }>
  >([]);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const updateScore = useLearningStore((state) => state.updateScore);

  const isCompleted = matchedPairs.length === pairs.length * 2;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const shuffleCards = () => {
    const cards = [
      ...pairs.map((pair, idx) => ({
        id: `left-${idx}`,
        content: pair.left,
        side: "left" as const,
      })),
      ...pairs.map((pair, idx) => ({
        id: `right-${idx}`,
        content: pair.right,
        side: "right" as const,
      })),
    ];
    return cards.sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    setShuffledPairs(shuffleCards());
  }, []);

  const handleCardClick = (cardId: string) => {
    if (matchedPairs.includes(cardId)) return;

    if (!selectedCard) {
      setSelectedCard(cardId);
      return;
    }

    const firstCard = selectedCard.split("-");
    const secondCard = cardId.split("-");

    if (firstCard[1] === secondCard[1] && firstCard[0] !== secondCard[0]) {
      setMatchedPairs([...matchedPairs, selectedCard, cardId]);
      toast.success("Match found!");

      if (matchedPairs.length + 2 === pairs.length * 2) {
        setIsActive(false);
        const timeScore = Math.max(100 - Math.floor(timer / 5), 0); // Convert time to score (lower time = higher score)
        updateScore("matching", timer);
        toast.success(`Completed in ${formatTime(timer)}!`);
      }
    } else {
      toast.error("Not a match. Try again!");
    }
    setSelectedCard(null);
  };

  const handleReset = () => {
    setSelectedCard(null);
    setMatchedPairs([]);
    setShuffledPairs(shuffleCards());
    setTimer(0);
    setIsActive(true);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={() => router.push("/learn")}
            variant="ghost"
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Modes
          </Button>
          <h1 className="text-2xl font-bold">Matching Game</h1>
          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4" />
            <span className="font-mono">{formatTime(timer)}</span>
          </div>
        </div>

        <p className="text-center text-muted-foreground mb-8">
          Match the related pairs • {matchedPairs.length / 2} out of{" "}
          {pairs?.length || 0} pairs matched
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <AnimatePresence>
            {shuffledPairs.map((card) => (
              <motion.div
                key={card.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  className={`p-4 h-32 flex items-center justify-center text-center cursor-pointer transition-colors
                    ${
                      matchedPairs.includes(card.id)
                        ? "bg-green-100 dark:bg-green-900"
                        : selectedCard === card.id
                        ? "bg-blue-100 dark:bg-blue-900"
                        : ""
                    }`}
                  onClick={() => handleCardClick(card.id)}
                >
                  <p className="text-sm">{card.content}</p>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="flex justify-center space-x-4">
          {isCompleted && (
            <Button onClick={() => router.push("/learn")} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Modes
            </Button>
          )}
          <Button onClick={handleReset} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" /> Reset Game
          </Button>
          <Button onClick={clearPDF}>
            <FileText className="mr-2 h-4 w-4" /> Try Another PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
