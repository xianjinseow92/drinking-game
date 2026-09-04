import {
  IWnrsCard,
  IWnrsLevelMeta,
  TWnrsLevel,
  TWnrsPromptsByLevel,
} from "../types/wnrs.types";

/**
 * All prompts below are original writing in the spirit of the
 * three-level "get to know you" card format. Nothing here is copied from a
 * published deck.
 */

export const wnrsLevels: IWnrsLevelMeta[] = [
  {
    level: 1,
    name: "Perception",
    tagline: "First impressions, gut reads, and what you assume about each other.",
  },
  {
    level: 2,
    name: "Connection",
    tagline: "The stories behind the surface. Go a little deeper.",
  },
  {
    level: 3,
    name: "Reflection",
    tagline: "What tonight changed. Say the thing you'd normally keep.",
  },
];

const buildPrompts = (level: TWnrsLevel, texts: string[]): IWnrsCard[] => {
  return texts.map((text, index) => ({
    id: `wnrs-l${level}-${String(index + 1).padStart(2, "0")}`,
    kind: "prompt",
    level,
    text,
  }));
};

export const wnrsPromptsByLevel: TWnrsPromptsByLevel = {
  1: buildPrompts(1, [
    "What was your very first impression of me, honestly?",
    "What do you think I was like as a kid?",
    "Guess my go-to comfort food. Then tell me why you picked it.",
    "What do you think I'm most proud of?",
    "Do I seem like someone who cries at movies? Explain your answer.",
    "What's one thing you assumed about me that turned out to be wrong?",
    "If you had to describe me in three words to a stranger, what would they be?",
    "What do you think I do when I can't fall asleep?",
    "Guess what kind of music I listen to when nobody is around.",
    "Do you think I'm more of a planner or a wing-it person?",
    "What do you think my biggest pet peeve is?",
    "What's something you think I'm secretly really good at?",
    "Where do you think I feel most like myself?",
    "What do you think I'd order first at a bar, and what does that say about me?",
    "Finish this sentence about me: 'You seem like the type of person who...'",
    "What do you think I worry about more than I should?",
  ]),
  2: buildPrompts(2, [
    "What's a compliment you received that you still think about?",
    "When was the last time you surprised yourself?",
    "What's something you've never told anyone at this table?",
    "What's a habit you picked up from your family that you've never questioned?",
    "Describe a moment you felt truly understood.",
    "What's a small thing someone did for you that you never forgot?",
    "What are you avoiding right now, and what would it take to face it?",
    "What's something you're proud of that nobody has ever congratulated you for?",
    "Who is one person you owe a thank-you to, and what would you say?",
    "What's a belief you held strongly five years ago that has softened?",
    "When do you feel most lonely, even around people?",
    "What's the kindest thing you've done that no one saw?",
    "What's a fear you have about the next year of your life?",
    "What do you need more of right now: rest, attention, or purpose?",
    "What part of yourself are you still learning to be gentle with?",
    "What's a version of you that people never get to meet?",
  ]),
  3: buildPrompts(3, [
    "What did you learn about me tonight that you didn't expect?",
    "What's something you want to say to me but haven't found the moment for?",
    "How do you think I see you, and how does that compare to how you see yourself?",
    "What's one thing you'd want me to remember from this conversation?",
    "What did I say tonight that stayed with you?",
    "Is there a question you wish I had asked you?",
    "What's something you appreciate about me that I probably underrate?",
    "What do you hope is different for you a year from now?",
    "What are you taking with you when you leave tonight?",
    "Tell me about a moment tonight when you felt closer to me.",
    "What's one thing you'd like us to do together that we haven't yet?",
    "How honest were you tonight, on a scale of one to ten? What held you back?",
    "What would you tell the version of you who walked in at the start?",
    "What's something about yourself you feel more at peace with than you did an hour ago?",
    "Describe me in one sentence, as if writing it in a letter to someone who's never met me.",
  ]),
};

export const wnrsWildcards: IWnrsCard[] = [
  "Swap seats with someone. Answer the next card from their point of view.",
  "Make eye contact with the person across from you for fifteen seconds. No talking.",
  "Everyone shares one thing they admire about the person to their left.",
  "Show the group the last photo you took. Tell the story behind it.",
  "Send a message to someone you've been meaning to reach out to. Right now.",
  "Say something you've been holding back tonight, or take a sip.",
  "Give the person to your right a compliment they'd never expect from you.",
  "Pick someone. They ask you any question they want, and you answer honestly.",
].map((text, index) => ({
  id: `wnrs-wild-${String(index + 1).padStart(2, "0")}`,
  kind: "wildcard",
  level: null,
  text,
}));

export const wnrsFinalCard: IWnrsCard = {
  id: "wnrs-final",
  kind: "final",
  level: null,
  text:
    "Write a short note to the person across from you. Something you noticed tonight, something you're grateful for, or something you hope for them. Fold it, hand it over, and ask them not to open it until they're home.",
};

export const WNRS_WILDCARDS_PER_LEVEL = 2;
