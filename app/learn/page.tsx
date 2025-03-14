"use client";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Brain, Library, ListChecks, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { useLearningStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

export default function LearnPage() {
  const router = useRouter();
  const pdfContent = useLearningStore((state) => state.pdfContent);
  const fileName = useLearningStore((state) => state.fileName);
  const learningProgress = useLearningStore((state) => state.learningProgress);
  const clearPDF = useLearningStore((state) => state.clearPDF);

  const handleNewPDF = () => {
    clearPDF();
    router.push("/");
  };

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
      title: "Interactive Quiz",
      description:
        "Test your knowledge with AI-generated multiple choice questions",
      icon: <Brain className="h-8 w-8 text-blue-500" />,
      color: "bg-blue-50 dark:bg-blue-950",
      benefits: [
        "Immediate feedback",
        "Track your progress",
        "Adaptive difficulty",
      ],
    },
    {
      id: "flashcards",
      title: "Smart Flashcards",
      description: "Master concepts through spaced repetition learning",
      icon: <Library className="h-8 w-8 text-purple-500" />,
      color: "bg-purple-50 dark:bg-purple-950",
      benefits: [
        "Personalized review intervals",
        "Visual learning aids",
        "Key concept focus",
      ],
    },
    {
      id: "matching",
      title: "Concept Matching",
      description: "Connect related ideas and strengthen understanding",
      icon: <ListChecks className="h-8 w-8 text-green-500" />,
      color: "bg-green-50 dark:bg-green-950",
      benefits: [
        "Pattern recognition",
        "Relationship building",
        "Time-based challenges",
      ],
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
        {/* Header Section with New PDF Button */}
        <div className="text-center mb-16 relative">
          <div className="absolute right-0 top-0">
            <Button
              onClick={handleNewPDF}
              variant="outline"
              className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <FileText className="h-4 w-4" />
              <span>Choose Another PDF</span>
            </Button>
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
            Your Learning Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
            Currently studying: <span className="font-medium">{fileName}</span>
          </p>
          <div className="max-w-xl mx-auto">
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Choose from our AI-powered learning modes to maximize your
              understanding
            </p>
          </div>
        </div>

        {/* Learning Modes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {learningModes.map((mode) => (
            <Card
              key={mode.id}
              className={`
                group hover:shadow-xl transition-all duration-300 cursor-pointer 
                border-0 shadow-md hover:-translate-y-1 relative overflow-hidden
              `}
              onClick={() => router.push(`/learn/${mode.id}`)}
            >
              <div className="p-8">
                {/* Mode Icon */}
                <div
                  className={`${mode.color} rounded-2xl p-4 inline-block mb-6`}
                >
                  {mode.icon}
                </div>

                {/* Mode Title & Description */}
                <h2 className="text-2xl font-semibold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {mode.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {mode.description}
                </p>

                {/* Benefits List */}
                <ul className="space-y-2 mb-6">
                  {mode.benefits.map((benefit, index) => (
                    <li
                      key={index}
                      className="flex items-center text-sm text-gray-500"
                    >
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2" />
                      {benefit}
                    </li>
                  ))}
                </ul>

                {/* Progress Section */}
                {learningProgress[mode.id]?.lastScore !== undefined && (
                  <div className="space-y-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Last Attempt</span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
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

                {/* Start Button */}
                <Button className="w-full mt-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
                  Start Learning
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Tips Section */}
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Learning Tips
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            For best results, we recommend starting with the Quiz mode to assess
            your knowledge, then using Flashcards for memorization, and finally
            Concept Matching to reinforce connections between ideas.
          </p>
        </div>
      </div>
    </div>
  );
}
