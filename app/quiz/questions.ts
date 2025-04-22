export const questions: {
  id: string
  question: string
  options: { value: string; label: string }[]
}[] = [
  {
    id: "lateNight",
    question:
      "It's 11pm on a weeknight and you hear an unexpected noise outside. How do you react?",
    options: [
      { value: "investigate", label: "Step outside immediately to investigate." },
      { value: "callSomeone", label: "Call someone to check before stepping out." },
      { value: "stayGuarded", label: "Stay inside but watch through the window." },
      { value: "ignore", label: "Ignore it and stay inside." },
    ],
  },
  {
    id: "schoolyard",
    question:
      "On touring a local primary school, what would make you enroll on the spot?",
    options: [
      { value: "facilities", label: "State-of-the-art facilities." },
      { value: "teachers", label: "Outstanding and experienced teachers." },
      { value: "classSize", label: "Small class sizes for individual attention." },
      { value: "extracurriculars", label: "A wide range of extracurriculars." },
    ],
  },
  {
    id: "sunshine",
    question:
      "You plan a weekend BBQ—how many sunny days per month would you expect?",
    options: [
      { value: "verySunny", label: "Over 25 sunny days/month (best case)." },
      { value: "mostlySunny", label: "20-25 sunny days/month." },
      { value: "someSunny", label: "15-20 sunny days/month." },
      { value: "fewSunny", label: "Under 15 sunny days/month." },
    ],
  },
  {
    id: "storms",
    question:
      "Heavy storms roll through a few times a year—charming or dealbreaker?",
    options: [
      { value: "loveStorms", label: "I love them—bring it on!" },
      { value: "fineWithStorms", label: "I'm fine with occasional storms." },
      { value: "annoyed", label: "They're annoying but manageable." },
      { value: "dealbreaker", label: "Frequent storms would be a dealbreaker." },
    ],
  },
  {
    id: "eveningWalks",
    question:
      "For evening strolls, do you prefer busy lit streets or quiet dim lanes?",
    options: [
      { value: "brightBusy", label: "Brightly lit, busier streets." },
      { value: "moderate", label: "Moderately lit and quiet." },
      { value: "quiet", label: "Quiet, dimly lit lanes." },
      { value: "noWalks", label: "I avoid evening walks." },
    ],
  },
  {
    id: "kidsCommunity",
    question:
      "For families with young children, which matters most?",
    options: [
      { value: "playgrounds", label: "Local playgrounds everywhere." },
      { value: "events", label: "Regular community events." },
      { value: "cafes", label: "Child-friendly cafés nearby." },
      { value: "neighbours", label: "Trusted neighbours looking out for each other." },
    ],
  },
  {
    id: "healthcare",
    question:
      "Is having a clinic or pharmacy just minutes away essential?",
    options: [
      { value: "essential", label: "Within 5 min walk—a must." },
      { value: "highlyDesirable", label: "Within 10 min walk." },
      { value: "acceptableDrive", label: "5-10 min drive is okay." },
      { value: "notPriority", label: "Not a priority—even further is fine." },
    ],
  },
  {
    id: "friendlyNeighbours",
    question:
      "How much do you value neighbours who wave hello or host block parties?",
    options: [
      { value: "blockParties", label: "Hosts block parties and socials." },
      { value: "waveHello", label: "Always waves hello." },
      { value: "occasionalChat", label: "Occasional friendly chats." },
      { value: "keepToSelf", label: "Prefer to keep to myself." },
    ],
  },
  {
    id: "priceStability",
    question:
      "Would you pay a 10% premium if property values stayed rock-solid?",
    options: [
      { value: "payPremium", label: "Yes—I pay the premium for stability." },
      { value: "smallPremium", label: "Maybe a small premium (~5%)." },
      { value: "noPremium", label: "No—price matters more than stability." },
      { value: "avoid", label: "I avoid high-priced markets altogether." },
    ],
  },
  {
    id: "greenSpaces",
    question:
      "How important are nearby parks, trails, or sports fields?",
    options: [
      { value: "mustHave", label: "They're absolute must haves." },
      { value: "veryNice", label: "Very nice to have." },
      { value: "welcome", label: "Welcome but not a priority." },
      { value: "notCare", label: "I don't care about green spaces." },
    ],
  },
]