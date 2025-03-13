"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  RefreshCw,
  FileText,
} from "lucide-react";
import { TestQuestion } from "@/lib/schemas";
import QuizScore from "./score";
import { useLearningStore } from "@/lib/store";

interface TestProps {
  questions: TestQuestion[];
  clearPDF: () => void;
}

export default function Test({ questions, clearPDF }: TestProps) {
  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">No questions available</h2>
          <Button onClick={clearPDF}>
            <FileText className="mr-2 h-4 w-4" /> Try Another PDF
          </Button>
        </div>
      </div>
    );
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(string | boolean)[]>(() =>
    Array(questions.length).fill(null)
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<number>(0);
  const updateScore = useLearningStore((state) => state.updateScore);
  const updateProgress = useLearningStore((state) => state.updateProgress);

  const handleReset = () => {
    setCurrentIndex(0);
    setAnswers(Array(questions.length).fill(null));
    setIsSubmitted(false);
    setScore(0);
  };

  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Error loading question</h2>
          <Button onClick={handleReset} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" /> Reset Test
          </Button>
          <Button onClick={clearPDF} className="ml-4">
            <FileText className="mr-2 h-4 w-4" /> Try Another PDF
          </Button>
        </div>
      </div>
    );
  }

  const handleAnswer = (answer: string | boolean) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = () => {
    let correctAnswers = 0;
    questions.forEach((question, index) => {
      if (question.type === "multiple_choice") {
        if (question.answer === answers[index]) correctAnswers++;
      } else if (question.type === "true_false") {
        if (question.answer === answers[index]) correctAnswers++;
      } else if (question.type === "short_answer") {
        const userAnswer = ((answers[index] as string) || "")
          .toLowerCase()
          .trim();
        const correctAnswer = question.answer.toLowerCase().trim();
        const acceptableAnswers =
          question.acceptableAnswers?.map((a) => a.toLowerCase().trim()) || [];
        if (
          userAnswer === correctAnswer ||
          acceptableAnswers.includes(userAnswer)
        ) {
          correctAnswers++;
        }
      }
    });

    const finalScore = Math.round((correctAnswers / questions.length) * 100);
    setScore(finalScore);
    setIsSubmitted(true);
    localStorage.setItem("lastScore_test", finalScore.toString());
  };

  const renderQuestion = (question: TestQuestion) => {
    switch (question.type) {
      case "multiple_choice":
        return (
          <div className="space-y-4">
            {question.options.map((option, idx) => (
              <Button
                key={idx}
                onClick={() => handleAnswer(String.fromCharCode(65 + idx))}
                variant={
                  answers[currentIndex] === String.fromCharCode(65 + idx)
                    ? "secondary"
                    : "outline"
                }
                className="w-full justify-start text-left"
              >
                {String.fromCharCode(65 + idx)}. {option}
              </Button>
            ))}
          </div>
        );
      case "true_false":
        return (
          <div className="flex space-x-4">
            <Button
              onClick={() => handleAnswer(true)}
              variant={answers[currentIndex] === true ? "secondary" : "outline"}
            >
              True
            </Button>
            <Button
              onClick={() => handleAnswer(false)}
              variant={
                answers[currentIndex] === false ? "secondary" : "outline"
              }
            >
              False
            </Button>
          </div>
        );
      case "short_answer":
        return (
          <Input
            value={(answers[currentIndex] as string) || ""}
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder="Type your answer here..."
          />
        );
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <QuizScore correctAnswers={score} totalQuestions={questions.length} />
          <div className="flex justify-center space-x-4">
            <Button onClick={handleReset} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" /> Take Again
            </Button>
            <Button onClick={clearPDF}>
              <FileText className="mr-2 h-4 w-4" /> Try Another PDF
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <Progress
          value={(currentIndex / questions.length) * 100}
          className="mb-8"
        />

        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {questions[currentIndex].question}
          </h2>
          {renderQuestion(questions[currentIndex])}
        </Card>

        <div className="flex justify-between items-center">
          <Button onClick={handlePrevious} disabled={currentIndex === 0}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <span className="text-sm font-medium">
            {currentIndex + 1} / {questions.length}
          </span>
          <Button
            onClick={handleNext}
            disabled={answers[currentIndex] === null}
          >
            {currentIndex === questions.length - 1 ? "Submit" : "Next"}{" "}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
