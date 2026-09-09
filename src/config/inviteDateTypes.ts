import { DateTypeId } from "@/types/invite";

export interface DateTypeOption {
  id: DateTypeId;
  labelKey: string;
  descriptionKey: string;
  emoji: string;
}

export const dateTypeOptions: DateTypeOption[] = [
  { id: "hiking", labelKey: "invite.dateType.hiking.label", descriptionKey: "invite.dateType.hiking.desc", emoji: "🥾" },
  { id: "dinner", labelKey: "invite.dateType.dinner.label", descriptionKey: "invite.dateType.dinner.desc", emoji: "🍽️" },
  { id: "pub", labelKey: "invite.dateType.pub.label", descriptionKey: "invite.dateType.pub.desc", emoji: "🍺" },
  { id: "party", labelKey: "invite.dateType.party.label", descriptionKey: "invite.dateType.party.desc", emoji: "🎶" },
  { id: "games", labelKey: "invite.dateType.games.label", descriptionKey: "invite.dateType.games.desc", emoji: "🎲" },
  { id: "climbing", labelKey: "invite.dateType.climbing.label", descriptionKey: "invite.dateType.climbing.desc", emoji: "🧗" },
  { id: "adventure", labelKey: "invite.dateType.adventure.label", descriptionKey: "invite.dateType.adventure.desc", emoji: "🗺️" },
  { id: "cinema", labelKey: "invite.dateType.cinema.label", descriptionKey: "invite.dateType.cinema.desc", emoji: "🎬" },
  { id: "netflix", labelKey: "invite.dateType.netflix.label", descriptionKey: "invite.dateType.netflix.desc", emoji: "🛋️" },
  { id: "gameNight", labelKey: "invite.dateType.gameNight.label", descriptionKey: "invite.dateType.gameNight.desc", emoji: "🕹️" },
  { id: "youDecide", labelKey: "invite.dateType.youDecide.label", descriptionKey: "invite.dateType.youDecide.desc", emoji: "🤷" },
  { id: "other", labelKey: "invite.dateType.other.label", descriptionKey: "invite.dateType.other.desc", emoji: "💡" },
];
