import { IntentionId } from "@/types/invite";

export interface IntentionOption {
  id: IntentionId;
  labelKey: string;
  emoji: string;
}

export const intentionOptions: IntentionOption[] = [
  { id: "getToKnow", labelKey: "invite.intentions.getToKnow", emoji: "🌱" },
  { id: "bigPlans", labelKey: "invite.intentions.bigPlans", emoji: "🚀" },
  { id: "funDate", labelKey: "invite.intentions.funDate", emoji: "🎉" },
  { id: "straightToPoint", labelKey: "invite.intentions.straightToPoint", emoji: "🎯" },
  { id: "youDecide", labelKey: "invite.intentions.youDecide", emoji: "🤝" },
  { id: "noIntention", labelKey: "invite.intentions.noIntention", emoji: "👀" },
];
