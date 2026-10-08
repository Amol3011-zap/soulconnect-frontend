/**
 * DEV-ONLY sample lotuses for trying the Feel Pond UI without a backend.
 * Imported dynamically behind import.meta.env.DEV, so production builds never
 * include or show these. They are written as generic example feelings, not
 * real people.
 */
const now = Date.now();
const h = (n) => now - n * 3600 * 1000;

let LOTUSES = [
  { id: 'l1', text: 'Everyone my age seems sorted except me.', problems: ['career', 'self_doubt'], felt: 4, createdAt: h(1) },
  { id: 'l2', text: '3am and my brain will not stop replaying things.', problems: ['anxiety', 'sleep'], felt: 7, createdAt: h(2) },
  { id: 'l3', text: 'I smile at work and cry in the car.', problems: ['burnout', 'career'], felt: 5, createdAt: h(3) },
  { id: 'l4', text: 'Miss someone I cannot text anymore.', problems: ['heartbreak'], felt: 9, responders: 3, createdAt: h(4) },
  { id: 'l5', text: 'New city, no one to call on weekends.', problems: ['loneliness'], felt: 6, createdAt: h(5) },
  { id: 'l6', text: 'I doubt every decision I make.', problems: ['self_doubt'], felt: 3, createdAt: h(6) },
  { id: 'l7', text: 'My parents want a life for me that I do not want.', problems: ['family', 'feeling_lost'], felt: 5, createdAt: h(8) },
  { id: 'l8', text: 'It has been a year and I still set a plate for her.', problems: ['grief'], felt: 2, createdAt: h(10) },
  { id: 'l9', text: 'We live together but feel like strangers.', problems: ['relationships', 'loneliness'], felt: 3, createdAt: h(12) },
  { id: 'l10', text: 'Scared to switch jobs, scared to stay.', problems: ['career', 'anxiety'], felt: 4, createdAt: h(14) },
  { id: 'g1', text: 'It is okay to not have it all figured out yet.', problems: ['career', 'feeling_lost', 'self_doubt'], guide: true, felt: 0, createdAt: h(20) },
  { id: 'g2', text: 'Rest is not a reward. You are allowed to stop.', problems: ['burnout', 'sleep'], guide: true, felt: 0, createdAt: h(22) },
];

// Extra generic lines so "Show other lotuses" can be tried with a busier pond.
const EXTRA = [
  ['My manager only notices my mistakes.', ['career']],
  ['I cancel plans and then feel lonely.', ['loneliness', 'anxiety']],
  ['Cannot switch off even on holidays.', ['burnout']],
  ['Feel like a fraud in every meeting.', ['self_doubt', 'career']],
  ['Everyone expects me to be the strong one.', ['family', 'burnout']],
  ['I keep checking if they viewed my story.', ['heartbreak', 'anxiety']],
  ['Graduated a year ago and still no direction.', ['feeling_lost', 'career']],
  ['Sleep at 4, wake at 11, feel guilty all day.', ['sleep']],
  ['Moved back home and feel like a kid again.', ['family', 'feeling_lost']],
  ['Every Sunday night my chest gets tight.', ['anxiety', 'career']],
  ['Friends are busy with their own lives now.', ['loneliness']],
  ['I compare my chapter one with their chapter ten.', ['self_doubt']],
];
LOTUSES = LOTUSES.concat(EXTRA.map(([text, problems], i) => ({
  id: `x${i}`, text, problems, felt: i % 4, responders: i % 5 === 0 ? 0 : 1, createdAt: h(24 + i * 3),
})));

export function getMockLotuses() {
  return LOTUSES.map(l => ({ ...l }));
}

export function addMockLotus({ text, problems, customLabel }) {
  const lotus = {
    id: `mine-${Date.now()}`,
    text,
    problems,
    customLabel: customLabel || null,
    felt: 0,
    mine: true,
    createdAt: Date.now(),
  };
  LOTUSES = [lotus, ...LOTUSES];
  return lotus;
}
