"use client";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Brain, Library, ListChecks, GraduationCap } from "lucide-react";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { useLearningStore } from "@/lib/store";

export default function LearnPage() {
  const router = useRouter();
  const pdfContent = useLearningStore((state) => state.pdfContent);
  const fileName = useLearningStore((state) => state.fileName);
  const learningProgress = useLearningStore((state) => state.learningProgress);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0
      ? `${mins} min${mins > 1 ? "s" : ""}`
      : `${secs} sec${secs !== 1 ? "s" : ""}`;
  };

  const learningModes = [
    {
      id: "quiz",
      title: "Quiz",
      description: "Test your knowledge with multiple choice questions",
      icon: <Brain className="h-8 w-8 text-blue-500" />,
      color: "bg-blue-50 dark:bg-blue-950",
    },
    {
      id: "flashcards",
      title: "Flashcards",
      description: "Learn through spaced repetition",
      icon: <Library className="h-8 w-8 text-purple-500" />,
      color: "bg-purple-50 dark:bg-purple-950",
    },
    {
      id: "matching",
      title: "Matching",
      description: "Match related concepts",
      icon: <ListChecks className="h-8 w-8 text-green-500" />,
      color: "bg-green-50 dark:bg-green-950",
    },
    {
      id: "test",
      title: "Test",
      description: "Take a comprehensive test",
      icon: <GraduationCap className="h-8 w-8 text-amber-500" />,
      color: "bg-amber-50 dark:bg-amber-950",
    },
  ];

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!pdfContent) {
        router.push("/");
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [pdfContent, router]);

  if (!pdfContent || !fileName) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-black">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
            Choose Your Learning Mode
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Currently studying: <span className="font-medium">{fileName}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {learningModes.map((mode) => (
            <Card
              key={mode.id}
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-md hover:-translate-y-1"
              onClick={() => router.push(`/learn/${mode.id}`)}
            >
              <div className="p-8">
                <div
                  className={`${mode.color} rounded-2xl p-4 inline-block mb-6`}
                >
                  {mode.icon}
                </div>
                <h2 className="text-2xl font-semibold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {mode.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {mode.description}
                </p>
                {learningProgress[mode.id]?.lastScore !== undefined && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Last Score</span>
                      <span className="font-medium">
                        {mode.id === "matching"
                          ? formatTime(learningProgress[mode.id].lastScore ?? 0)
                          : `${learningProgress[mode.id].lastScore}%`}
                      </span>
                    </div>
                    {mode.id !== "matching" && (
                      <Progress
                        value={learningProgress[mode.id].lastScore}
                        className="h-2"
                      />
                    )}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
