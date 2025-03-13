import { z } from "zod";

export const questionSchema = z.object({
  question: z.string(),
  options: z
    .array(z.string())
    .length(4)
    .describe(
      "Four possible answers to the question. Only one should be correct. They should all be of equal lengths."
    ),
  answer: z
    .enum(["A", "B", "C", "D"])
    .describe(
      "The correct answer, where A is the first option, B is the second, and so on."
    ),
});

export type Question = z.infer<typeof questionSchema>;

export const questionsSchema = z.array(questionSchema).length(4);

export const flashcardSchema = z.object({
  term: z.string(),
  definition: z.string(),
});

export const matchingSchema = z.object({
  pairs: z
    .array(
      z.object({
        left: z.string(),
        right: z.string(),
      })
    )
    .min(4),
});

export const testQuestionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("multiple_choice"),
    question: z.string(),
    options: z.array(z.string()).length(4),
    answer: z.enum(["A", "B", "C", "D"]),
  }),
  z.object({
    type: z.literal("true_false"),
    question: z.string(),
    answer: z.boolean(),
  }),
  z.object({
    type: z.literal("short_answer"),
    question: z.string(),
    answer: z.string(),
    acceptableAnswers: z.array(z.string()).optional(),
  }),
]);

export type FlashCard = z.infer<typeof flashcardSchema>;
export type MatchingPairs = z.infer<typeof matchingSchema>;
export type TestQuestion = z.infer<typeof testQuestionSchema>;

export const learningMaterialSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("quiz"),
    questions: questionsSchema,
  }),
  z.object({
    type: z.literal("flashcards"),
    cards: z.array(flashcardSchema).min(4),
  }),
  z.object({
    type: z.literal("matching"),
    sets: z.array(matchingSchema).min(1),
  }),
  z.object({
    type: z.literal("test"),
    questions: z.array(testQuestionSchema).min(4),
  }),
]);
