import { PRIVATE_ANSWER_ID, QuizTopic } from "@/types/invite";

export interface QuizOption {
  id: string;
  /** Translation key for the option label. */
  labelKey: string;
  emoji: string;
  /**
   * Options sharing a `group` are considered a "partial" match with each other
   * even when the exact id differs (e.g. two travel styles that are both
   * adventurous). Options without a group only match on exact id.
   */
  group?: string;
  /** A flexible option ("open to anything") partially matches every other option. */
  flexible?: boolean;
}

export interface QuizQuestion {
  topic: QuizTopic;
  questionKey: string;
  emoji: string;
  options: QuizOption[];
}

const privateOption: QuizOption = {
  id: PRIVATE_ANSWER_ID,
  labelKey: "invite.quiz.privateOption",
  emoji: "🤐",
};

export const quizQuestions: QuizQuestion[] = [
  {
    topic: "hobbies",
    questionKey: "invite.quiz.hobbies.question",
    emoji: "🎮",
    options: [
      { id: "tech_games", labelKey: "invite.quiz.hobbies.techGames", emoji: "🕹️", group: "indoor" },
      { id: "outdoors", labelKey: "invite.quiz.hobbies.outdoors", emoji: "🌳", group: "outdoor" },
      { id: "movies_series", labelKey: "invite.quiz.hobbies.moviesSeries", emoji: "🎬", group: "indoor" },
      { id: "sports", labelKey: "invite.quiz.hobbies.sports", emoji: "⚽", group: "outdoor" },
      { id: "bit_of_everything", labelKey: "invite.quiz.hobbies.bitOfEverything", emoji: "✨", flexible: true },
      privateOption,
    ],
  },
  {
    topic: "lifestyle",
    questionKey: "invite.quiz.lifestyle.question",
    emoji: "🌙",
    options: [
      { id: "early_bird", labelKey: "invite.quiz.lifestyle.earlyBird", emoji: "🌅", group: "routine" },
      { id: "night_owl", labelKey: "invite.quiz.lifestyle.nightOwl", emoji: "🌃", group: "spontaneous" },
      { id: "planner", labelKey: "invite.quiz.lifestyle.planner", emoji: "🗓️", group: "routine" },
      { id: "spontaneous", labelKey: "invite.quiz.lifestyle.spontaneous", emoji: "🎲", group: "spontaneous" },
      privateOption,
    ],
  },
  {
    topic: "pets",
    questionKey: "invite.quiz.pets.question",
    emoji: "🐾",
    options: [
      { id: "dog_person", labelKey: "invite.quiz.pets.dogPerson", emoji: "🐶", group: "pets" },
      { id: "cat_person", labelKey: "invite.quiz.pets.catPerson", emoji: "🐱", group: "pets" },
      { id: "all_animals", labelKey: "invite.quiz.pets.allAnimals", emoji: "🐾", flexible: true },
      { id: "not_really", labelKey: "invite.quiz.pets.notReally", emoji: "🙅", group: "noPets" },
      privateOption,
    ],
  },
  {
    topic: "kids",
    questionKey: "invite.quiz.kids.question",
    emoji: "👶",
    options: [
      { id: "want_someday", labelKey: "invite.quiz.kids.wantSomeday", emoji: "💫", group: "open" },
      { id: "want_soon", labelKey: "invite.quiz.kids.wantSoon", emoji: "❤️", group: "open" },
      { id: "not_sure", labelKey: "invite.quiz.kids.notSure", emoji: "🤔", flexible: true },
      { id: "dont_want", labelKey: "invite.quiz.kids.dontWant", emoji: "🙅", group: "closed" },
      privateOption,
    ],
  },
  {
    topic: "gym",
    questionKey: "invite.quiz.gym.question",
    emoji: "💪",
    options: [
      { id: "regular", labelKey: "invite.quiz.gym.regular", emoji: "🏋️", group: "active" },
      { id: "sometimes", labelKey: "invite.quiz.gym.sometimes", emoji: "🚶", flexible: true },
      { id: "not_my_thing", labelKey: "invite.quiz.gym.notMyThing", emoji: "🛋️", group: "chill" },
      privateOption,
    ],
  },
  {
    topic: "travel",
    questionKey: "invite.quiz.travel.question",
    emoji: "✈️",
    options: [
      { id: "backpacker", labelKey: "invite.quiz.travel.backpacker", emoji: "🎒", group: "adventurous" },
      { id: "comfort", labelKey: "invite.quiz.travel.comfort", emoji: "🏖️", group: "relaxed" },
      { id: "roadtrip", labelKey: "invite.quiz.travel.roadtrip", emoji: "🚗", group: "adventurous" },
      { id: "homebody", labelKey: "invite.quiz.travel.homebody", emoji: "🏠", group: "relaxed" },
      privateOption,
    ],
  },
  {
    topic: "whereToLive",
    questionKey: "invite.quiz.whereToLive.question",
    emoji: "🌍",
    options: [
      { id: "brasil", labelKey: "invite.quiz.whereToLive.brasil", emoji: "🇧🇷", group: "place" },
      { id: "outside", labelKey: "invite.quiz.whereToLive.outside", emoji: "🌐", group: "place" },
      { id: "open_to_both", labelKey: "invite.quiz.whereToLive.openToBoth", emoji: "🧭", flexible: true },
      privateOption,
    ],
  },
  {
    topic: "extraHabits",
    questionKey: "invite.quiz.extraHabits.question",
    emoji: "☕",
    options: [
      { id: "coffee_addict", labelKey: "invite.quiz.extraHabits.coffeeAddict", emoji: "☕", group: "caffeine" },
      { id: "foodie", labelKey: "invite.quiz.extraHabits.foodie", emoji: "🍜", group: "food" },
      { id: "gamer_at_night", labelKey: "invite.quiz.extraHabits.gamerAtNight", emoji: "🎧", group: "screen" },
      { id: "always_online", labelKey: "invite.quiz.extraHabits.alwaysOnline", emoji: "📱", group: "screen" },
      privateOption,
    ],
  },
];

export const getQuizQuestion = (topic: QuizTopic): QuizQuestion =>
  quizQuestions.find((q) => q.topic === topic)!;
