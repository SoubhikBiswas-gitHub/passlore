export const FALLBACK_WORDS: string[] = [
  "able", "acid", "aged", "also", "arch", "army", "atom", "aunt", "away", "axis", "baby", "back", "bake",
  "ball", "band", "bank", "barn", "base", "bath", "beam", "bean", "bear", "bell", "belt", "bench", "berry",
  "bike", "bird", "blue", "boat", "body", "bold", "bolt", "bone", "book", "boot", "bowl", "brave", "bread",
  "brick", "bridge", "brook", "brush", "cabin", "cable", "cake", "calm", "camel", "camp", "canal", "candle",
  "canoe", "cape", "card", "cargo", "cart", "castle", "cave", "cedar", "chair", "chalk", "charm", "chess",
  "chief", "chime", "cider", "city", "clay", "cliff", "clock", "cloud", "clover", "coast", "cocoa", "comet",
  "coral", "cork", "corn", "cotton", "couch", "crane", "creek", "crisp", "crow", "crown", "cube", "cup",
  "curve", "daisy", "dance", "dawn", "deer", "delta", "desk", "dial", "dime", "dock", "dome", "door", "dove",
  "dream", "drift", "drum", "dune", "eagle", "earth", "easel", "echo", "elbow", "elm", "ember", "engine",
  "fable", "falcon", "farm", "fawn", "feast", "fern", "ferry", "field", "fig", "film", "finch", "fire",
  "flag", "flame", "flint", "flute", "foam", "fog", "forest", "fox", "frame", "frost", "fruit", "gable",
  "garden", "gate", "gem", "giant", "ginger", "glade", "globe", "glove", "goat", "gold", "goose", "grain",
  "grape", "grass", "gravel", "grove", "guitar", "gull", "hall", "hammer", "harbor", "harp", "hawk", "hazel",
  "heart", "hedge", "helm", "hill", "hinge", "hive", "honey", "hook", "horn", "horse", "hotel", "house",
  "iris", "iron", "island", "ivory", "ivy", "jacket", "jade", "jam", "jar", "jazz", "jelly", "jewel",
  "jungle", "kayak", "kettle", "kite", "kiwi", "knot", "ladder", "lake", "lamp", "lane", "lantern", "lark",
  "lava", "lawn", "leaf", "lemon", "lens", "lily", "lime", "linen", "lion", "lodge", "loft", "lotus",
  "lunar", "magnet", "mango", "maple", "marble", "market", "marsh", "mask", "meadow", "melon", "metal",
  "mint", "mirror", "mist", "moon", "moose", "moss", "motor", "mule", "music", "nest", "noble", "north",
  "novel", "oak", "oasis", "ocean", "olive", "onion", "opal", "orbit", "orchid", "otter", "oval", "owl",
  "paddle", "palm", "panda", "paper", "parade", "park", "parrot", "pasta", "peach", "pearl", "pebble",
  "pedal", "pencil", "pepper", "piano", "pier", "pilot", "pine", "pixel", "planet", "plum", "pocket", "poem",
  "polar", "pond", "poppy", "porch", "prism", "pulse", "puzzle", "quail", "quarry", "quartz", "quest",
  "quill", "rabbit", "radar", "radio", "rain", "ranch", "raven", "reef", "ribbon", "ridge", "river", "road",
  "robin", "rocket", "roof", "rope", "rose", "ruby", "saddle", "sage", "sail", "salmon", "sand", "satin",
  "scarf", "scout", "season", "seed", "shadow", "shell", "shore", "silk", "silver", "sketch", "sky", "slate",
  "sled", "slope", "snow", "sofa", "solar", "sonnet", "spark", "spice", "spoon", "spring", "spruce",
  "square", "stable", "star", "steam", "stone", "storm", "stream", "sugar", "summit", "swan", "table",
  "tango", "teapot", "tent", "thistle", "thunder", "tide", "tiger", "timber", "toast", "topaz", "torch",
  "tower", "trail", "train", "tree", "tulip", "tunnel", "turtle", "twig", "valley", "vapor", "velvet",
  "violet", "violin", "voyage", "wagon", "walnut", "walrus", "water", "wave", "wheat", "whale", "willow",
  "window", "winter", "wolf", "wood", "wool", "yacht", "yard", "yarn", "zebra", "zenith", "zinc"
]

let effWords: string[] | null = null
let effPromise: Promise<string[]> | null = null

export function loadEffWords(): Promise<string[]> {
  if (effWords) return Promise.resolve(effWords)
  if (!effPromise) {
    effPromise = import("./eff-long-wordlist")
      .then((mod) => {
        // hyphenated words would blur word boundaries in hyphen-joined passphrases
        effWords = mod.EFF_LONG_WORDS.filter((w) => w !== "undefined" && !w.includes("-"))
        return effWords
      })
      .catch((error) => {
        effPromise = null
        throw error
      })
  }
  return effPromise
}
