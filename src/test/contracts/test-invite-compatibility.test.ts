import { describe, expect, test } from "vitest";
import { compareQuizAnswers, computeCompatibility } from "@/lib/compatibility";
import { PRIVATE_ANSWER_ID, QuizAnswers } from "@/types/invite";

const baseline: QuizAnswers = {
  hobbies: "tech_games",
  lifestyle: "night_owl",
  pets: "dog_person",
  gym: "regular",
  travel: "backpacker",
};

describe("compareQuizAnswers", () => {
  test("returns match when guest picks the exact same option as Hugo", () => {
    const result = compareQuizAnswers({ hobbies: "tech_games" }, { hobbies: "tech_games" });
    expect(result).toEqual([
      { topic: "hobbies", guestAnswer: "tech_games", hugoAnswer: "tech_games", level: "match" },
    ]);
  });

  test("returns partial when options share a compatibility group", () => {
    const result = compareQuizAnswers({ lifestyle: "planner" }, { lifestyle: "early_bird" });
    expect(result[0].level).toBe("partial");
  });

  test("returns partial when either side picked a flexible option", () => {
    const result = compareQuizAnswers({ pets: "all_animals" }, { pets: "dog_person" });
    expect(result[0].level).toBe("partial");
  });

  test("returns mismatch when options are unrelated", () => {
    const result = compareQuizAnswers({ pets: "not_really" }, { pets: "dog_person" });
    expect(result[0].level).toBe("mismatch");
  });

  test("returns neutral when the guest prefers to answer in person", () => {
    const result = compareQuizAnswers({ kids: PRIVATE_ANSWER_ID }, { kids: "want_someday" });
    expect(result[0].level).toBe("neutral");
  });

  test("returns neutral when the guest never answered a baseline topic", () => {
    const result = compareQuizAnswers({}, { kids: "want_someday" });
    expect(result[0].level).toBe("neutral");
  });
});

describe("computeCompatibility", () => {
  test("scores 100 when every rated topic and the intention match", () => {
    const result = computeCompatibility(baseline, baseline, "youDecide", "youDecide");
    expect(result.score).toBe(100);
    expect(result.summaryBucket).toBe("great");
  });

  test("scores 0 when everything mismatches", () => {
    const mismatched: QuizAnswers = {
      hobbies: "outdoors",
      pets: "not_really",
    };
    const result = computeCompatibility(mismatched, { hobbies: "tech_games", pets: "dog_person" });
    expect(result.score).toBe(0);
    expect(result.summaryBucket).toBe("curious");
  });

  test("falls back to a neutral mystery score when every answer is private", () => {
    const allPrivate: QuizAnswers = { hobbies: PRIVATE_ANSWER_ID, pets: PRIVATE_ANSWER_ID };
    const result = computeCompatibility(allPrivate, { hobbies: "tech_games", pets: "dog_person" });
    expect(result.score).toBe(50);
    expect(result.summaryBucket).toBe("mystery");
  });

  test("excludes neutral categories from the score instead of penalizing them", () => {
    const guest: QuizAnswers = { hobbies: "tech_games", pets: PRIVATE_ANSWER_ID };
    const result = computeCompatibility(guest, { hobbies: "tech_games", pets: "dog_person" });
    expect(result.score).toBe(100);
  });

  test("gives partial credit for a shared compatibility group", () => {
    const result = computeCompatibility({ lifestyle: "planner" }, { lifestyle: "early_bird" });
    expect(result.score).toBe(50);
    expect(result.summaryBucket).toBe("good");
  });
});
