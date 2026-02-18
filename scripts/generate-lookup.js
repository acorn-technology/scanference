import { readFileSync, writeFileSync } from 'fs'

const TOPICS = [
  { topic: 'East, west, south and ____?', keyword: 'North' },
  { topic: '2 + 3 = ?', keyword: '5' },
  { topic: '10 - 7 = ?', keyword: '3' },
  { topic: '3 × 4 = ?', keyword: '12' },
  { topic: '20 ÷ 4 = ?', keyword: '5' },
  { topic: 'The square root of 9 is ____?', keyword: '3' },
  { topic: 'The capital of France is ____?', keyword: 'Paris' },
  { topic: 'The capital of Spain is ____?', keyword: 'Madrid' },
  { topic: 'The capital of Japan is ____?', keyword: 'Tokyo' },
  { topic: 'The largest ocean is the ____?', keyword: 'Pacific' },
  { topic: 'H2O is the chemical formula for ____?', keyword: 'Water' },
  { topic: 'The planet closest to the sun is ____?', keyword: 'Mercury' },
  { topic: 'The opposite of black is ____?', keyword: 'White' },
  { topic: 'The opposite of hot is ____?', keyword: 'Cold' },
  { topic: 'A dozen equals ____?', keyword: '12' },
  { topic: 'How many sides does a triangle have?', keyword: '3' },
  { topic: 'How many days are in a week?', keyword: '7' },
  { topic: 'How many months are in a year?', keyword: '12' },
  { topic: 'How many hours are in a day?', keyword: '24' },
  { topic: 'How many seconds in a minute?', keyword: '60' },
  { topic: 'Snow White and the ___ dwarfs?', keyword: '7' },
  { topic: 'A rainbow has ___ colours?', keyword: '7' },
  { topic: 'January, February, March — what comes next?', keyword: 'April' },
  { topic: 'Monday, Tuesday, Wednesday — what comes next?', keyword: 'Thursday' },
  { topic: 'Spring, summer, autumn and ____?', keyword: 'Winter' },
  { topic: 'The first letter of the alphabet is ____?', keyword: 'A' },
  { topic: 'The last letter of the alphabet is ____?', keyword: 'Z' },
  { topic: 'Ice is frozen ____?', keyword: 'Water' },
  { topic: 'The sun rises in the ____?', keyword: 'East' },
  { topic: 'A piano has 88 ____?', keyword: 'Keys' },
  { topic: 'You read a ____?', keyword: 'Book' },
  { topic: 'A spider has ___ legs?', keyword: '8' },
  { topic: 'An octopus has ___ arms?', keyword: '8' },
  { topic: 'Rome is the capital of ____?', keyword: 'Italy' },
  { topic: 'Berlin is the capital of ____?', keyword: 'Germany' },
  { topic: 'The tallest mountain in the world is Mount ____?', keyword: 'Everest' },
  { topic: 'The longest river in the world is the ____?', keyword: 'Nile' },
  { topic: 'How many continents are there?', keyword: '7' },
  { topic: '100 centimetres = 1 ____?', keyword: 'Metre' },
  { topic: '1000 grams = 1 ____?', keyword: 'Kilogram' },
  { topic: 'Water boils at ___ degrees Celsius?', keyword: '100' },
  { topic: 'Water freezes at ___ degrees Celsius?', keyword: '0' },
  { topic: 'The number after 99 is ____?', keyword: '100' },
  { topic: 'Half of 50 is ____?', keyword: '25' },
  { topic: 'The colour of a ripe banana is ____?', keyword: 'Yellow' },
  { topic: 'The colour of the sky on a clear day is ____?', keyword: 'Blue' },
  { topic: 'A triangle + a square = ___ sides in total?', keyword: '7' },
  { topic: '5 × 5 = ?', keyword: '25' },
  { topic: '100 - 1 = ?', keyword: '99' },
  { topic: 'The chemical symbol for gold is ____?', keyword: 'Au' },
]

const attendees = JSON.parse(readFileSync('public/attendees.json', 'utf8'))

// Shuffle the topic pool so assignments are random each run
const shuffledTopics = [...TOPICS].sort(() => Math.random() - 0.5)

const lookup = {}
let topicIndex = 0

for (let i = 0; i < attendees.length; i++) {
  for (let j = i + 1; j < attendees.length; j++) {
    const a = attendees[i]
    const b = attendees[j]
    const { topic, keyword } = shuffledTopics[topicIndex % shuffledTopics.length]
    lookup[`${a}+${b}`] = { topic, keyword }
    topicIndex++
  }
}

const pairCount = Object.keys(lookup).length
writeFileSync('public/lookup.json', JSON.stringify(lookup, null, 2) + '\n')
console.log(`Generated ${pairCount} unique pairs for ${attendees.length} attendees.`)
