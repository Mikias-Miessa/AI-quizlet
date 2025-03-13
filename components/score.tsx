import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QuizScoreProps {
  correctAnswers: number; // This is now the percentage (25, 50, 75, 100)
  totalQuestions: number;
}

export default function QuizScore({
  correctAnswers,
  totalQuestions,
}: QuizScoreProps) {
  // Convert percentage to actual count
  const actualCorrectCount = Math.round(
    (correctAnswers / 100) * totalQuestions
  );

  const getMessage = () => {
    if (correctAnswers === 100) return "Perfect score! Congratulations!";
    if (correctAnswers >= 80) return "Great job! You did excellently!";
    if (correctAnswers >= 60) return "Good effort! You're on the right track.";
    if (correctAnswers >= 40)
      return "Not bad, but there's room for improvement.";
    return "Keep practicing, you'll get better!";
  };

  return (
    <Card className="w-full">
      <CardContent className="space-y-4 p-8">
        <div className="text-center">
          <p className="text-4xl font-bold">{correctAnswers}%</p>
          <p className="text-sm text-muted-foreground">
            {actualCorrectCount} out of {totalQuestions} correct
          </p>
        </div>
        <p className="text-center font-medium">{getMessage()}</p>
      </CardContent>
    </Card>
  );
}
