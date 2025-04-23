export const questions: {
  id: string
  question: string
  options: { value: string; label: string }[]
}[] = [
  {
    id: "lateNightSecurity",
    question:
      "You return home late at night and notice your front door slightly ajar. What do you do?",
    options: [
      { value: "secureImmediately", label: "Secure the door immediately and inspect the premises." },
      { value: "callFriend", label: "Call a friend or neighbour before going inside." },
      { value: "walkAway", label: "Walk away and call the police from a safe distance." },
      { value: "ignore", label: "Assume it's nothing and enter as usual." },
    ],
  },
  {
    id: "neighbourhoodAlerts",
    question:
      "You hear about a string of vehicle break-ins in nearby streets. How concerned are you?",
    options: [
      { value: "veryConcerned", label: "Very concerned, I'd avoid parking on the street." },
      { value: "someConcern", label: "Somewhat concerned, I might install a security camera." },
      { value: "mildConcern", label: "A mild concern but not a dealbreaker." },
      { value: "unconcerned", label: "Unconcerned, crime happens everywhere." },
    ],
  },
  {
    id: "strangerEncounter",
    question:
      "You spot an unfamiliar person loitering near your home during the day. What's your reaction?",
    options: [
      { value: "immediatelyReport", label: "Report them to police immediately." },
      { value: "observeCautiously", label: "Observe from a distance and stay alert." },
      { value: "ignoreUnless", label: "Ignore unless they approach the house." },
      { value: "approachFriendly", label: "Approach and ask if they need help." },
    ],
  },
  {
    id: "floodingRisk",
    question:
      "Heavy seasonal rains cause flooding in some areas. What level of flood risk would you tolerate?",
    options: [
      { value: "noRisk", label: "No risk, I need high ground and flood mitigation." },
      { value: "lowRisk", label: "Low risk, minor flooding is manageable." },
      { value: "occasionalRisk", label: "Occasional risk with flood barriers in place." },
      { value: "anyRisk", label: "I'm fine even if it floods occasionally." },
    ],
  },
  {
    id: "bushfireSeason",
    question:
      "During bushfire season, air quality and safety can drop. What's your tolerance?",
    options: [
      { value: "avoidBushfireProne", label: "Avoid bushfire prone suburbs entirely." },
      { value: "preparedOnly", label: "Willing if strong emergency plans exist." },
      { value: "moderateRisk", label: "Moderate risk is acceptable with insurance." },
      { value: "lowConcern", label: "Low concern, I trust local authorities." },
    ],
  },
  {
    id: "stormFrequency",
    question:
      "Frequent storms can disrupt power and travel. What frequency is acceptable?",
    options: [
      { value: "rareStorms", label: "Rare storms, only prefer calm weather." },
      { value: "seasonalStorms", label: "Seasonal storms are fine if warned in advance." },
      { value: "frequentStorms", label: "Frequent storms but minimal damage." },
      { value: "loveStorms", label: "I enjoy watching storms up close." },
    ],
  },
  {
    id: "playgroundAccess",
    question:
      "How important is having playgrounds, parks, and family spaces within walking distance?",
    options: [
      { value: "mustHave", label: "Must have multiple playgrounds within 5 min walk." },
      { value: "veryImportant", label: "Very important, one decent park nearby." },
      { value: "niceToHave", label: "Nice to have but not essential." },
      { value: "notNeeded", label: "Not needed, I prefer urban amenities." },
    ],
  },
  {
    id: "schoolCatchment",
    question:
      "Which best describes your priority for local school quality?",
    options: [
      { value: "topRanked", label: "Top ranked schools within the catchment." },
      { value: "goodReputation", label: "Schools with a strong reputation." },
      { value: "adequateOptions", label: "Several adequate schools nearby." },
      { value: "notImportant", label: "School quality isn't a priority." },
    ],
  },
  {
    id: "communityEvents",
    question:
      "Do regular family friendly community events influence your choice?",
    options: [
      { value: "essential", label: "Essential, I want block parties and fairs." },
      { value: "desirable", label: "Desirable but not mandatory." },
      { value: "occasional", label: "Occasional events are fine." },
      { value: "irrelevant", label: "I don't attend community events." },
    ],
  },
  {
    id: "publicTransport",
    question:
      "How critical is having reliable public transport (bus, train) within walking distance?",
    options: [
      { value: "within5min", label: "Station or major stop within 5 min walk." },
      { value: "within15min", label: "Public transport within 15 min walk." },
      { value: "shortDrive", label: "5-10 min drive to nearest station." },
      { value: "notPriority", label: "Not a priority, I'll drive everywhere." },
    ],
  },
]