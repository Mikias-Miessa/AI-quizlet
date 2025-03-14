"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { RotateCcw, FileText, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLearningStore } from "@/lib/store";
import { Progress } from "@/components/ui/progress";

interface FlashcardsProps {
  cards: Array<{ term: string; definition: string }>;
  clearPDF: () => void;
}

export default function Flashcards({ cards, clearPDF }: FlashcardsProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completed, setCompleted] = useState<number[]>([]);
  const [rightSwipes, setRightSwipes] = useState(0);
  const [leftSwipes, setLeftSwipes] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const updateProgress = useLearningStore((state) => state.updateProgress);
  const updateScore = useLearningStore((state) => state.updateScore);

  // Motion values for drag
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5]);
  const background = useTransform(
    x,
    [-200, 0, 200],
    [
      "rgba(239, 68, 68, 0.2)", // Red background for incorrect
      "rgba(255, 255, 255, 0)",
      "rgba(34, 197, 94, 0.2)", // Green background for correct
    ]
  );

  // Scale effect based on drag
  const scale = useTransform(
    x,
    [-200, -150, 0, 150, 200],
    [0.8, 0.9, 1, 0.9, 0.8]
  );

  const handleDragEnd = (event: any, info: any) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset > 100 || velocity > 800) {
      // Dragged right - Correct
      setRightSwipes((prev) => {
        const newRightSwipes = prev + 1;
        // If this is the last card, calculate and set the final score
        if (currentIndex === cards.length - 1) {
          const score = newRightSwipes * 10;
          setFinalScore(score);
          updateScore("flashcards", score);
        }
        return newRightSwipes;
      });
      handleNext();
      updateProgress(
        "flashcards",
        ((completed.length + 1) / cards.length) * 100
      );
    } else if (offset < -100 || velocity < -800) {
      // Dragged left - Incorrect
      setLeftSwipes((prev) => prev + 1);
      handleNext();
    }
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
    if (!completed.includes(currentIndex)) {
      setCompleted([...completed, currentIndex]);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setCompleted([]);
    setRightSwipes(0);
    setLeftSwipes(0);
    setIsFinished(false);
    setFinalScore(0);
  };

  if (isFinished) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50  p-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center space-y-8">
            <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 ">
              Flashcards Complete!
            </h2>
            <div className="grid grid-cols-2 gap-8 mb-8">
              <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100  border-0">
                <div className="text-4xl font-bold text-green-600  mb-2">
                  {rightSwipes}
                </div>
                <div className="text-sm text-green-700 ">Cards you knew</div>
              </Card>
              <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100  border-0">
                <div className="text-4xl font-bold text-red-600  mb-2">
                  {leftSwipes}
                </div>
                <div className="text-sm text-red-700 ">Cards to review</div>
              </Card>
            </div>
            <div className="mb-8">
              <div className="text-2xl font-semibold mb-2">
                Final Score: {finalScore}%
              </div>
              <Progress value={finalScore} className="h-2 w-64 mx-auto" />
            </div>
            <div className="flex justify-center space-x-4">
              <Button
                onClick={handleReset}
                variant="outline"
                className="hover:scale-105 transition-transform"
              >
                <RotateCcw className="mr-2 h-4 w-4" /> Try Again
              </Button>
              <Button
                onClick={() => router.push("/learn")}
                className="hover:scale-105 transition-transform"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Modes
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-black p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-8">
          <Button
            onClick={() => router.push("/learn")}
            variant="ghost"
            className="mr-4 hover:scale-105 transition-transform"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Modes
          </Button>
          <h1 className="text-2xl font-bold flex-1 text-center bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
            Flashcards
          </h1>
          <div className="w-[100px]" />
        </div>

        <div className="text-center mb-8">
          <p className="text-muted-foreground">
            Swipe right if you know it, left if you need to review •{" "}
            {completed.length}/{cards.length} reviewed
          </p>
        </div>

        <div className="relative min-h-[400px] mb-8 perspective-1000">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              style={{ x, rotate, opacity, scale }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              className="absolute w-full"
              whileDrag={{ cursor: "grabbing" }}
            >
              <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6 }}
                style={{ background }}
                className="preserve-3d w-full relative"
              >
                <Card
                  className="p-8 cursor-pointer w-full min-h-[400px] flex items-center justify-center text-center absolute backface-hidden bg-white/80 backdrop-blur-sm border-0 shadow-lg"
                  onClick={handleCardClick}
                >
                  <div className="text-xl font-medium">
                    {cards[currentIndex].term}
                  </div>
                </Card>
                <Card
                  className="p-8 cursor-pointer w-full min-h-[400px] flex items-center justify-center text-center absolute backface-hidden bg-white/80 backdrop-blur-sm border-0 shadow-lg"
                  onClick={handleCardClick}
                  style={{ transform: "rotateY(180deg)" }}
                >
                  <div className="text-xl font-medium">
                    {cards[currentIndex].definition}
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center space-x-4 mt-8">
          <Button
            onClick={handleReset}
            variant="outline"
            className="hover:scale-105 transition-transform"
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </Button>
          <Button
            onClick={clearPDF}
            className="hover:scale-105 transition-transform"
          >
            <FileText className="mr-2 h-4 w-4" /> Try Another PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
