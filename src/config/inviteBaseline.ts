import { InviteProfileConfig } from "@/types/invite";

// Hugo's baseline answers for the "you vs Hugo" compatibility check, plus the
// bio blocks shown in the "Conheça seu futuro algo…" section and the default
// date-type suggestions. This is the seed data for `/invite/profile` — Sprint 1
// keeps it here as a typed constant; Sprint 2 will hydrate it from Firestore
// (`profileAnswers/hugo`) instead, with this object as fallback/seed.
export const defaultInviteProfile: InviteProfileConfig = {
  bio: {
    role: {
      EN: "IT Support Specialist turning Full-Stack Developer",
      PT: "Especialista em TI virando Desenvolvedor Full-Stack",
    },
    city: {
      EN: "Based in Dublin, originally from Brazil",
      PT: "Vivendo em Dublin, brasileiro de origem",
    },
    techStack: ["React", "TypeScript", "Node.js", "Google Workspace", "Firebase"],
    vibe: {
      EN: "Star Wars nerd, curious builder, and a sucker for a good pun. Turns messy processes into simple ones for a living — and turns first dates into good stories, hopefully.",
      PT: "Nerd de Star Wars, curioso por natureza e viciado em trocadilho ruim. Transforma processo bagunçado em algo simples pra viver — e primeiro encontro em boa história, se tudo der certo.",
    },
    photos: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
    ],
  },
  baselineAnswers: {
    hobbies: "tech_games",
    lifestyle: "night_owl",
    pets: "dog_person",
    kids: "want_someday",
    gym: "regular",
    travel: "backpacker",
    whereToLive: "open_to_both",
    extraHabits: "coffee_addict",
  },
  baselineIntention: "youDecide",
  defaultDateTypes: {
    primary: "dinner",
    secondary: "games",
  },
};
