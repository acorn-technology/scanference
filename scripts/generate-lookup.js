import { readFileSync, writeFileSync } from 'fs'

const attendees = JSON.parse(readFileSync('public/attendees.json', 'utf8'))

const lookup = {}

for (const scanner of attendees) {
  for (const scanned of attendees) {
    if (scanner === scanned) continue
    lookup[`${scanner}+${scanned}`] = `You've been matched with ${scanned}!`
  }
}

writeFileSync('public/lookup.json', JSON.stringify(lookup, null, 2) + '\n')
console.log(`Generated ${Object.keys(lookup).length} pairings for ${attendees.length} attendees.`)
