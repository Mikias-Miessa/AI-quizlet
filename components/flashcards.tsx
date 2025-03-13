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
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  FileText,
  ArrowLeft,
} from "lucide-react";
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
      "rgba(239, 68, 68, 0.1)",
      "rgba(255, 255, 255, 0)",
      "rgba(34, 197, 94, 0.1)",
    ]
  );

  const handleDragEnd = (event: any, info: any) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset > 100 || velocity > 800) {
      // Dragged right - Correct
      setRightSwipes((prev) => prev + 1);
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
      // Calculate and save final score
      const finalScore = Math.round((rightSwipes / cards.length) * 100);
      updateScore("flashcards", finalScore);
      setIsFinished(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
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
  };

  if (isFinished) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center space-y-8">
            <h2 className="text-3xl font-bold mb-6">Flashcards Complete!</h2>
            <div className="grid grid-cols-2 gap-8 mb-8">
              <Card className="p-6 bg-green-50 dark:bg-green-900/20">
                <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {rightSwipes}
                </div>
                <div className="text-sm text-green-700 dark:text-green-300">
                  Cards you knew
                </div>
              </Card>
              <Card className="p-6 bg-red-50 dark:bg-red-900/20">
                <div className="text-4xl font-bold text-red-600 dark:text-red-400 mb-2">
                  {leftSwipes}
                </div>
                <div className="text-sm text-red-700 dark:text-red-300">
                  Cards to review
                </div>
              </Card>
            </div>
            <div className="mb-8">
              <div className="text-2xl font-semibold mb-2">
                Final Score: {Math.round((rightSwipes / cards.length) * 100)}%
              </div>
              <Progress
                value={Math.round((rightSwipes / cards.length) * 100)}
                className="h-2 w-64 mx-auto"
              />
            </div>
            <div className="flex justify-center space-x-4">
              <Button onClick={handleReset} variant="outline">
                <RotateCcw className="mr-2 h-4 w-4" /> Try Again
              </Button>
              <Button onClick={() => router.push("/learn")}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Modes
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-8">
          <Button
            onClick={() => router.push("/learn")}
            variant="ghost"
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Modes
          </Button>
          <h1 className="text-2xl font-bold flex-1 text-center">Flashcards</h1>
          <div className="w-[100px]" />
        </div>

        <div className="text-center mb-8">
          <p className="text-muted-foreground">
            Swipe right if you know it, left if you don't • {completed.length}/
            {cards.length} reviewed
          </p>
        </div>

        <div className="relative min-h-[400px] mb-8 perspective-1000">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              style={{ x, rotate, opacity }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              className="absolute w-full"
            >
              <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6 }}
                style={{ background }}
                className="preserve-3d w-full relative"
              >
                <Card
                  className="p-8 cursor-pointer w-full min-h-[400px] flex items-center justify-center text-center absolute backface-hidden"
                  onClick={handleCardClick}
                >
                  <div className="text-xl font-medium">
                    {cards[currentIndex].term}
                  </div>
                </Card>
                <Card
                  className="p-8 cursor-pointer w-full min-h-[400px] flex items-center justify-center text-center absolute backface-hidden"
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

        <div className="flex justify-between items-center">
          <Button onClick={handlePrevious} disabled={currentIndex === 0}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <span className="text-sm font-medium">
            {currentIndex + 1} / {cards.length}
          </span>
          <Button
            onClick={handleNext}
            disabled={currentIndex === cards.length - 1}
          >
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="flex justify-center space-x-4 mt-8">
          <Button onClick={handleReset} variant="outline">
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </Button>
          <Button onClick={clearPDF}>
            <FileText className="mr-2 h-4 w-4" /> Try Another PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
