// ── SoulConnect Stories Mock Database ────────────────────────────────────────
// 30 users, 15 story templates, generates 90 stories, 40 replies

/* ─── Users ──────────────────────────────────────────────────────────────────── */
export const USERS_DB = [
  { id: 'u1',  name: 'Priya Sharma',    verified: false },
  { id: 'u2',  name: 'Arjun Mehta',     verified: false },
  { id: 'u3',  name: 'Kavya Nair',      verified: false },
  { id: 'u4',  name: 'Rohan Desai',     verified: false },
  { id: 'u5',  name: 'Ananya Singh',    verified: false },
  { id: 'u6',  name: 'Vikram Rao',      verified: false },
  { id: 'u7',  name: 'Meera Pillai',    verified: false },
  { id: 'u8',  name: 'Siddharth Kumar', verified: false },
  { id: 'u9',  name: 'Ishaan Gupta',    verified: false },
  { id: 'u10', name: 'Tanya Bose',      verified: false },
  { id: 'u11', name: 'Riya Malhotra',   verified: false },
  { id: 'u12', name: 'Aditya Joshi',    verified: false },
  { id: 'u13', name: 'Nisha Verma',     verified: false },
  { id: 'u14', name: 'Karan Patel',     verified: false },
  { id: 'u15', name: 'Shreya Iyer',     verified: false },
  { id: 'u16', name: 'Abhishek Das',    verified: false },
  { id: 'u17', name: 'Pooja Reddy',     verified: false },
  { id: 'u18', name: 'Manav Khanna',    verified: false },
  { id: 'u19', name: 'Divya Menon',     verified: false },
  { id: 'u20', name: 'Rahul Saxena',    verified: false },
  { id: 'u21', name: 'Simran Kaur',     verified: false },
  { id: 'u22', name: 'Akash Tiwari',    verified: false },
  { id: 'u23', name: 'Deepa Nambiar',   verified: false },
  { id: 'u24', name: 'Nikhil Bajaj',    verified: false },
  { id: 'u25', name: 'Anjali Roy',      verified: false },
  { id: 'u26', name: 'Varun Mishra',    verified: false },
  { id: 'u27', name: 'Preeti Shah',     verified: false },
  { id: 'u28', name: 'Harsh Aggarwal',  verified: false },
  { id: 'u29', name: 'Ritika Choudhary',verified: false },
  { id: 'u30', name: 'Saurabh Pandey',  verified: false },
];

/* ─── Story Templates ────────────────────────────────────────────────────────── */
const STORY_TEMPLATES = [
  {
    title: 'The day I finally asked for help',
    category: 'Anxiety',
    categoryColor: '#3B82F6',
    mood: 'Hopeful',
    moodEmoji: '🌤',
    tags: ['anxiety', 'therapy', 'courage'],
    content: `For two years I pretended I was fine. I'd wake up at 3am with my heart pounding, convinced something terrible was about to happen, but I told everyone at work that I was just a little tired. I smiled through meetings, answered emails instantly, and kept every deadline. From the outside, I was the picture of someone who had it together.

Inside, I was drowning. Simple things like going to a grocery store or answering a phone call from an unknown number would send me into a spiral. I'd rehearse conversations for hours before having them. I'd cancel plans and then feel crushing guilt. I couldn't remember what calm felt like.

The day I finally asked for help was a Tuesday. My hands were shaking so badly I could barely type. My therapist picked up on the second ring and her voice was so steady and kind that I just started crying. I told her everything — all the things I'd been hiding. She didn't flinch. She just said, "Thank you for telling me. That took so much courage."

I've been in therapy for four months now. I won't tell you it fixed everything overnight. But I will tell you that last weekend I went to a crowded market and only had to do three breathing exercises instead of eight. That's progress. That's real. If you're hiding too — you don't have to anymore. There are people ready to hold the door open for you.`,
  },
  {
    title: 'Six months sober and still learning to feel',
    category: 'Growth',
    categoryColor: '#10B981',
    mood: 'Proud',
    moodEmoji: '😊',
    tags: ['sobriety', 'healing', 'identity'],
    content: `I didn't think I had a drinking problem. People with problems lost jobs and families. I still had mine. But I was drinking a bottle of wine every night alone on my couch, telling myself I deserved it after a hard day. Every day was a hard day. That was the first red flag I ignored.

Six months ago I poured the last bottle down the sink. My hands were shaking. I sat on the kitchen floor and cried for forty minutes because I had no idea who I was without the ritual. Wine was how I celebrated, how I grieved, how I dealt with boredom, loneliness, success. It had become the punctuation mark at the end of every sentence of my life.

What nobody warned me about sobriety is that you have to learn to feel everything raw again. Every emotion lands differently without that buffer. The joy is bigger and sharper. So is the sadness. I cried at a dog food commercial last month and felt genuinely embarrassed, and then genuinely grateful that I could feel something that fully.

I'm still learning who I am. I like morning runs now, something I never thought I'd say. I sleep differently, more deeply. My skin looks different. But more than any of that — I'm present. When I hug my sister now, I'm actually there. If you're wrestling with something similar, please know: the person on the other side of the habit is still you. Just clearer.`,
  },
  {
    title: 'Grief taught me what love really means',
    category: 'Grief',
    categoryColor: '#6366F1',
    mood: 'Sad',
    moodEmoji: '🌧',
    tags: ['loss', 'grief', 'love', 'healing'],
    content: `My mother died on a Wednesday morning in October. She'd been sick for a while, so everyone kept telling me I had "time to prepare." I want to tell you something: there is no preparation for your mother's last breath. There is no dress rehearsal for the moment the world rearranges itself permanently.

For three months after she was gone, I moved through my days like someone walking underwater. I ate food but couldn't taste it. I had conversations I don't remember. I went to her house and sat in her chair and smelled the fabric until I couldn't smell her anymore. That was the day I understood what grief really is — it's love with nowhere to go.

Slowly, I started letting that love find new places to land. I started cooking her recipes. Not perfectly, not the way she made them, but the act of chopping onions the way she taught me felt like a conversation. I started calling her friends, the ones she talked about for years, and they'd tell me stories about her I'd never heard. She became more real, somehow, not less.

Grief doesn't end. I'm not going to tell you it does. But it changes shape. It moves from a sharp knife to something more like a stone you carry — heavy some days, barely noticeable others. And in the carrying, you find out how much you loved someone. That knowledge is a gift. A painful, irreplaceable gift.`,
  },
  {
    title: 'Burnout broke me — then rebuilt me',
    category: 'Burnout',
    categoryColor: '#F97316',
    mood: 'Grateful',
    moodEmoji: '🙏',
    tags: ['burnout', 'work', 'rest', 'recovery'],
    content: `I used to wear my busyness like a badge. Twelve-hour days, back-to-back meetings, emails at midnight. I genuinely believed productivity was the same thing as worth. That if I stopped moving, I would somehow disappear or become irrelevant. I ran on adrenaline and caffeine and the validation of being needed.

Then one day I couldn't get out of bed. Not metaphorically — literally. I lay there for four hours staring at the ceiling, my body refusing to cooperate. My doctor called it burnout. I called it failure. The distinction matters, because failure implies you could have done better, and I had already been doing everything I possibly could. That's the trap of burnout — it catches the ones who care too much.

I took six weeks off work. The first two were the hardest. I didn't know how to exist without a task. I'd sit in silence and feel genuinely panicked by the absence of urgency. Slowly, slowly, I started to find things that had nothing to do with productivity. Long walks. Cooking meals from scratch. Reading books I'd had on my shelf for three years. Calling my grandmother.

I went back to work changed. I leave at 5:30. I don't answer emails on weekends. My manager thought I'd lost my drive, but what I'd actually found was my life. I'm more creative now, more present, more useful to my team. Rest is not the enemy of ambition. It's the engine it runs on.`,
  },
  {
    title: 'Learning to be alone without being lonely',
    category: 'Relationships',
    categoryColor: '#A855F7',
    mood: 'Peaceful',
    moodEmoji: '🌸',
    tags: ['solitude', 'self-love', 'relationships', 'healing'],
    content: `I'd never lived alone before. I went from my parents' house to college dorms to a relationship that lasted seven years. When that relationship ended, I found myself in an apartment with my own name on the lease for the first time in my life, sitting on the floor eating takeout from the container, and I felt a terror so complete I couldn't breathe.

I was afraid of the silence. Afraid of what I'd find if I stopped filling the space with another person's noise. For months I slept with the TV on and called friends at every possible moment. I couldn't sit with myself. I didn't know how.

The shift came so gradually I almost missed it. One Saturday I woke up early and made myself coffee and sat on my balcony and watched the city wake up. And I thought — this is nice. This exact moment, with no one needing anything from me, with nothing to perform or maintain. I was genuinely, quietly okay.

Now I take myself to dinner sometimes. I see films alone and don't check my phone. I've learned what I actually like — not what I like because someone else likes it, not what I order because it's what we always got. My therapist said solitude is a practice, and she was right. You get better at it. And then one day you realize you're not lonely at all. You're just someone who finally knows themselves.`,
  },
  {
    title: 'Finding gratitude in the wreckage',
    category: 'Gratitude',
    categoryColor: '#F4C542',
    mood: 'Hopeful',
    moodEmoji: '✨',
    tags: ['gratitude', 'perspective', 'resilience'],
    content: `The year I lost my job, my relationship ended, and my apartment flooded — all within eight weeks of each other — a well-meaning person told me to "look for the silver lining." I wanted to scream. There is nothing more enraging than someone offering optimism when you are standing in literal water in your socks.

But here's the thing — four years later, I understand what they were trying to say, even if the timing was wrong. Not that everything happens for a reason (I don't believe that anymore), but that the wreckage creates a kind of clearing. When everything you thought defined you is gone, you discover what was underneath all along.

I lost the job I'd been miserable in for three years but was too scared to leave. The relationship ending freed both of us from a story that had run its course. The apartment flooding meant I had to move to a smaller place in a different neighborhood, where I met the friends who are still in my life today. None of this means the bad things were secretly good. They were just bad things that made room.

Gratitude, I've learned, isn't about pretending the hard things didn't hurt. It's about holding both — the pain and the possibility — at the same time. I'm grateful for what I have. I'm also allowed to grieve what I lost. Both can be true. Usually both are true.`,
  },
  {
    title: 'What no one tells you about recovering from depression',
    category: 'Depression',
    categoryColor: '#6366F1',
    mood: 'Hopeful',
    moodEmoji: '🌱',
    tags: ['depression', 'recovery', 'mental health'],
    content: `No one told me that recovery from depression isn't a straight line. I thought once I started medication and therapy I'd feel better progressively — like a graph going up and to the right. What actually happened was more like a seismograph in an earthquake zone. Days when I could shower and eat breakfast and feel genuinely okay, followed by days when getting to the kitchen felt like summiting Everest.

No one told me that some days you'll feel almost like yourself and that will be terrifying, because you've built an identity around being the person who is struggling. Who are you if you're not in the worst of it anymore? That's a question that surprised me.

No one told me how much energy recovery takes. Depression is exhausting, yes, but so is the work of coming out of it. Therapy dredges up things you buried for good reasons. Medication adjustments mess with your sleep and your appetite and your sense of self. There were weeks where I'd worked so hard on getting better that I was too tired to enjoy the improvement.

But here's what I want to tell you: it does get better. Slowly, non-linearly, with setbacks and plateaus and surprising good days. The person I am now could not have imagined existing in the darkness I was in eighteen months ago. If you're in it right now — that darkness is not the whole truth of you. There is more to your story. Please stay to find out what it is.`,
  },
  {
    title: 'My anxiety is not my identity',
    category: 'Anxiety',
    categoryColor: '#3B82F6',
    mood: 'Peaceful',
    moodEmoji: '🌸',
    tags: ['anxiety', 'identity', 'healing', 'mindfulness'],
    content: `For years I introduced myself to my own anxiety as if it were the most important thing about me. "I can't do that because I have anxiety." "Sorry I cancelled — my anxiety is really bad today." I wasn't wrong, exactly — my anxiety was genuinely affecting my life in significant ways. But somewhere along the line, it became not just a thing I had but a thing I was.

The first time my therapist said, "You are not your anxiety," I almost argued with her. It felt like she was minimizing something real. But she explained it differently. She said that anxiety is a signal, not a sentence. It's your nervous system sending an alarm. The alarm is real and it matters. But you are the person hearing the alarm, not the alarm itself.

That distinction changed something in me. I started noticing when I was observing my anxiety versus when I was inhabiting it. "I am feeling anxious" instead of "I am an anxious person." It sounds small. It isn't. That tiny shift in language created a tiny gap between me and the feeling, and in that gap I started finding choices.

I still have anxiety. It still shows up in places I wish it wouldn't. But I no longer let it write my biography. I go to things even when I'm nervous. I say yes and feel afraid and do it anyway. The anxiety comes along, but it's not driving anymore. I am. That is the difference. That is everything.`,
  },
  {
    title: 'Meditation didn\'t fix me — it taught me to be with myself',
    category: 'Meditation',
    categoryColor: '#2DD4BF',
    mood: 'Peaceful',
    moodEmoji: '🧘',
    tags: ['meditation', 'mindfulness', 'presence', 'practice'],
    content: `I came to meditation expecting a cure. My therapist recommended it, three different books recommended it, and frankly I'd tried everything else. I sat down on a cushion on the floor of my bedroom and closed my eyes and waited to feel peaceful. What I felt instead was immediately aware of how loud my fridge was, how uncomfortable my knees were, and how many unread emails were sitting in my inbox.

I gave up after nine minutes and decided meditation wasn't for me. This continued for about six months, until I finally found a teacher who told me something that changed how I understood the whole practice. He said: "The goal is not to stop thinking. The goal is to notice that you're thinking, and gently return." That's it. That's the whole practice.

Once I understood that the wandering mind wasn't failure — that it was, in fact, the very thing you were training against — everything shifted. Every time my mind drifted to my inbox and I brought it back to my breath, that was a repetition. Like a bicep curl, but for attention. I wasn't doing it wrong. I was doing it exactly right.

Six months of ten minutes a day changed my relationship with my own mind. I'm less reactive. When something upsets me now, there's a beat — a small breath of space — before I respond. I'm not enlightened. I'm not even particularly calm. But I'm present in a way I wasn't before. And presence, it turns out, was what I needed all along.`,
  },
  {
    title: 'I stopped people-pleasing and everything changed',
    category: 'Growth',
    categoryColor: '#10B981',
    mood: 'Proud',
    moodEmoji: '💪',
    tags: ['people-pleasing', 'boundaries', 'self-worth', 'growth'],
    content: `The first time I said no to someone without immediately offering an explanation or apology, I felt so guilty I almost threw up. I'd been asked to volunteer for something I genuinely had no capacity for, and instead of my usual "of course, I'd love to, let me rearrange my entire life," I said, "I can't do that right now." Period. Full stop.

The person said, "Oh, okay," and moved on. No disaster. No damaged relationship. No catastrophe. I stood there waiting for the fallout and it simply didn't come.

That was the moment I understood: I had been paying an enormous price for a threat that mostly existed in my imagination. All those years of saying yes when I meant no, of making myself smaller so others wouldn't be uncomfortable, of performing agreeable, pleasant, easy — the toll was enormous. I was exhausted from being a character instead of a person.

People-pleasing doesn't come from kindness, I learned. It comes from fear. Fear of rejection, of conflict, of being seen as difficult or selfish. Real generosity comes from choice, not from terror. When I started saying no to things I couldn't genuinely give myself to, the yes I said to other things became so much more real. My relationships became more honest. I became someone I actually recognized. That's worth every moment of discomfort.`,
  },
  {
    title: 'The night I called the helpline',
    category: 'Depression',
    categoryColor: '#6366F1',
    mood: 'Hopeful',
    moodEmoji: '🌟',
    tags: ['crisis', 'support', 'courage', 'mental health'],
    content: `I want to tell this story because I wish someone had told it to me. There was a night — I won't give you the details, but you probably understand the shape of it — when I was alone and I couldn't see forward. Not even one step. The future had gone completely dark.

I almost didn't call. I told myself I wasn't "bad enough." That the helpline was for people in real danger, not just people who were sad and lost. That I would be wasting someone's time. These are lies that depression tells you with great conviction.

I called. The person who answered had a voice like warm water. She didn't try to solve anything or recite facts at me. She just asked me to tell her what was happening, and she listened. Really listened. She said my name. She said, "I'm glad you called." Those four words — I'm glad you called — I held onto them like a rope.

Nothing was fixed that night. I still had all the same problems the next morning. But I had made it through the night. And the next night was easier, and then easier again. Recovery didn't start with a dramatic moment of clarity. It started with one phone call from a person who thought they weren't "bad enough" for help. If that sounds like you: you are always bad enough, which is to say, you always deserve help. Please call. They are glad when you do.`,
  },
  {
    title: 'How self-care became more than bubble baths',
    category: 'Self Care',
    categoryColor: '#EC4899',
    mood: 'Peaceful',
    moodEmoji: '🌸',
    tags: ['self-care', 'wellness', 'boundaries', 'healing'],
    content: `Social media made me believe that self-care was candles and facemasks and journaling in a beautifully lit room. I bought the candles. I bought the facemask. I opened a beautiful journal and stared at the blank page and felt worse because I was clearly doing it wrong.

Real self-care, the kind that actually changes something, is rarely photogenic. It's going to bed when you're tired instead of scrolling for two more hours. It's declining the invitation you don't have the capacity for. It's calling the dentist you've been putting off for eight months. It's eating something with vegetables even when you want a bag of chips. It's telling the truth in a conversation instead of saying what's easiest.

I started keeping a different kind of list. Not a to-do list — a "I took care of myself today by" list. Some days the entry was: drank enough water, went outside for fifteen minutes, texted a friend back. Small, unglamorous things. But I noticed that on the days I did those things consistently, I felt more stable. More like myself.

The most meaningful self-care I practice now is protecting my attention. Not letting every emergency be mine to solve. Not reading the news right before bed. Choosing what I spend my limited energy on with some intentionality. I still love a good candle. But I know now that the candle is a treat, not a treatment. The treatment is quieter and slower and so much more important.`,
  },
  {
    title: 'Overthinking almost stole my life — here\'s what helped',
    category: 'Overthinking',
    categoryColor: '#8B5CF6',
    mood: 'Hopeful',
    moodEmoji: '☀️',
    tags: ['overthinking', 'mindfulness', 'anxiety', 'habits'],
    content: `My mind was a 24-hour news channel I couldn't turn off. Every scenario analyzed from seventeen angles. Every conversation replayed and dissected. Every decision suspended in an endless loop of what-ifs. I could spend three hours deciding where to eat dinner, consider all possible outcomes, and still feel like I'd made the wrong choice.

The worst part was that I believed this was intelligence. Being thorough. Being careful. It took a long time to understand that it was fear wearing the costume of reason.

The first thing that helped was a question: "Will this matter in five years?" Not as a way to dismiss things — some things genuinely will matter in five years — but as a filter. Most of the things I was agonizing over at 2am were not in that category. The email I should have worded differently. The offhand remark I made at a party. Whether I looked strange at the coffee shop. These did not require the analysis I was giving them.

The second thing was learning to tolerate uncertainty. This sounds obvious but it isn't. Overthinking is fundamentally an intolerance of not knowing. I started practicing sitting with open questions — not resolving them, just being with them. I still overthink sometimes. But I notice it faster now. And when I notice it, I have a choice. That choice is everything.`,
  },
  {
    title: 'What my burnout taught me about ambition',
    category: 'Burnout',
    categoryColor: '#F97316',
    mood: 'Grateful',
    moodEmoji: '🙏',
    tags: ['burnout', 'ambition', 'work-life balance', 'self-worth'],
    content: `I was so ambitious it became its own kind of poverty. I was chasing something — success, stability, proof of worth — and I was so focused on the destination that I didn't notice I'd spent the last three years not having a single meal where I wasn't also checking something on my phone.

Burnout came not in a dramatic collapse but in a slow withdrawal of everything that made me me. The creativity dried up first. Then the motivation. Then the ability to find joy in things I used to love. I'd lie in bed trying to summon the feelings I used to have about my work and finding only a flat, grey nothing.

My therapist asked me what I was working so hard for. I said success, financial security, to prove I could. She asked what I would do if I achieved those things. I had no answer. I'd never thought past the goal to the life beyond it.

That question undid something in me. I started thinking about what I actually wanted my daily life to feel like — not my resume, not my LinkedIn profile, but the texture of an ordinary Thursday. I wanted mornings that weren't frantic. Evenings that weren't consumed. Work I felt something about. I started making choices in service of that life instead of the abstract achievement. My career is fine. My life is better. The ambition is still there, but now it knows what it's actually for.`,
  },
  {
    title: 'Finding my way back to myself after a toxic relationship',
    category: 'Relationships',
    categoryColor: '#A855F7',
    mood: 'Hopeful',
    moodEmoji: '🌱',
    tags: ['toxic relationship', 'healing', 'identity', 'self-worth'],
    content: `When you're in a toxic relationship, you don't usually know it while you're in it. You just know you feel worse about yourself than you used to. That your opinions seem to matter less. That you apologize constantly for things that aren't your fault. That the person you were before has gotten quieter and quieter until you can barely hear them.

I left after two and a half years. The leaving itself was not the hard part — or rather, it was hard, but it was finite. The aftermath was longer and stranger. I'd been so focused on surviving the relationship that I hadn't noticed how much of myself I'd given up to do so. I didn't trust my own perceptions. I second-guessed every instinct. I'd been told what I thought and felt were wrong often enough that I'd started to believe it.

Healing from this looks like small acts of reclamation. Making a decision — any decision — and trusting it. Stating an opinion without immediately softening it into nothing. Spending time with people who reflect back a version of you that you recognize. Slowly, slowly, the person I was before began to come back, though not exactly the same. Shaped differently by what I'd been through.

I am gentler with myself now than I've ever been. I know what it feels like to lose yourself, so I take much better care of her. If you're finding your way back to yourself — it's possible. Slow, nonlinear, sometimes terrifying. But possible. You're still in there.`,
  },
];

/* ─── Generate 90 Stories ────────────────────────────────────────────────────── */
const REACTION_POOLS = [
  { understand: 287, sendingSupport: 143, notAlone: 98, stayStrong: 76 },
  { understand: 156, sendingSupport: 82, notAlone: 54, stayStrong: 41 },
  { understand: 342, sendingSupport: 198, notAlone: 115, stayStrong: 89 },
  { understand: 94,  sendingSupport: 47,  notAlone: 28,  stayStrong: 22 },
  { understand: 203, sendingSupport: 108, notAlone: 67,  stayStrong: 53 },
  { understand: 58,  sendingSupport: 31,  notAlone: 18,  stayStrong: 12 },
  { understand: 389, sendingSupport: 201, notAlone: 132, stayStrong: 97 },
  { understand: 127, sendingSupport: 63,  notAlone: 44,  stayStrong: 33 },
  { understand: 241, sendingSupport: 119, notAlone: 79,  stayStrong: 62 },
  { understand: 73,  sendingSupport: 38,  notAlone: 21,  stayStrong: 16 },
  { understand: 315, sendingSupport: 167, notAlone: 108, stayStrong: 82 },
  { understand: 112, sendingSupport: 59,  notAlone: 37,  stayStrong: 27 },
  { understand: 178, sendingSupport: 92,  notAlone: 61,  stayStrong: 47 },
  { understand: 264, sendingSupport: 138, notAlone: 89,  stayStrong: 71 },
  { understand: 47,  sendingSupport: 25,  notAlone: 14,  stayStrong: 10 },
];

function msAgo(days, hours = 0) {
  return new Date(Date.now() - (days * 86400000 + hours * 3600000)).toISOString();
}

function timeLabel(isoString) {
  const diff = Date.now() - new Date(isoString).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'just now';
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d === 1) return '1d ago';
  return `${d}d ago`;
}

function readTime(content) {
  const words = content.split(/\s+/).length;
  const mins = Math.ceil(words / 200);
  return `${mins} min read`;
}

export const STORIES_DB = [];

let storyCounter = 1;

STORY_TEMPLATES.forEach((template, tIdx) => {
  USERS_DB.forEach((user, uIdx) => {
    const storyIdx = tIdx * 30 + uIdx;
    const daysAgo = Math.floor(storyIdx / 3) % 30;
    const hoursAgo = (storyIdx % 3) * 7;
    const createdAt = msAgo(daysAgo, hoursAgo);
    const reactions = REACTION_POOLS[(tIdx + uIdx) % REACTION_POOLS.length];
    const isAnon = storyIdx % 4 === 0;

    STORIES_DB.push({
      id: `s${storyCounter++}`,
      title: template.title,
      category: template.category,
      categoryColor: template.categoryColor,
      mood: template.mood,
      moodEmoji: template.moodEmoji,
      tags: template.tags,
      content: template.content,
      preview: template.content.slice(0, 220).trim() + '…',
      authorId: user.id,
      authorName: isAnon ? 'Anonymous Soul' : user.name,
      isAnon,
      createdAt,
      time: timeLabel(createdAt),
      readTime: readTime(template.content),
      understand: reactions.understand + (uIdx % 7),
      sendingSupport: reactions.sendingSupport + (uIdx % 5),
      notAlone: reactions.notAlone + (uIdx % 4),
      stayStrong: reactions.stayStrong + (uIdx % 3),
      replyCount: Math.floor((tIdx + uIdx) % 45) + 2,
    });
  });
});

/* ─── Generate 40 Replies ────────────────────────────────────────────────────── */
const REPLY_CONTENTS = [
  "Thank you for sharing this. I've been feeling the exact same way and couldn't find the words. You just gave them to me.",
  "Reading this made me cry in the best possible way. You are so brave and so seen.",
  "I went through something very similar and I want you to know it does get lighter. Not gone, but lighter. Sending you so much warmth.",
  "This is exactly what I needed to read today. I've been hiding too and this gave me courage.",
  "You put into words something I've carried silently for years. Thank you, from the bottom of my heart.",
  "The part about the small victories hit me so hard. That's where it actually lives — in the tiny, unglamorous wins.",
  "I'm a therapist and I share stories like yours with my clients (anonymously) because they capture what I can never quite explain in clinical language. Thank you.",
  "This made me feel less alone than I have in months. I hope that means something to you.",
  "I shared this with my sister. She called me crying. You helped both of us today.",
  "Sometimes I think no one understands what this feels like. You do. Thank you for being here.",
  "Still thinking about this an hour later. Some stories just land in a part of you that needed them. This was one of those.",
  "Three years in and I'm still learning. Your words just added something real to that process. Thank you.",
  "The bravery it takes to write something like this honestly — I see it. I honor it.",
  "You described my exact experience with a clarity I've never had. I'm going to come back to this when I forget that I'm not alone.",
  "I don't have big words. Just: thank you. From someone who needed this more than they knew.",
  "Sending you so much love. This took courage and it will reach people who need it in ways you may never know.",
  "I saved this to read again on the hard days. You wrote something that will outlast the moment you wrote it in.",
  "This resonates so deeply. The part about feeling like you had to hide — I lived that for so long.",
  "You are not alone in this. Not even a little. And your willingness to share it makes someone else feel less alone too.",
  "I've been sitting with this for a few minutes before responding because it deserved more than a quick reaction. Thank you for writing it.",
];

const REPLY_AUTHORS = [
  { id: 'u5', name: 'Ananya Singh' },
  { id: 'u9', name: 'Ishaan Gupta' },
  { id: 'u13', name: 'Nisha Verma' },
  { id: 'u17', name: 'Pooja Reddy' },
  { id: 'u21', name: 'Simran Kaur' },
  { id: 'u25', name: 'Anjali Roy' },
  { id: 'u29', name: 'Ritika Choudhary' },
  { id: 'u3', name: 'Kavya Nair' },
  { id: 'u7', name: 'Meera Pillai' },
  { id: 'u11', name: 'Riya Malhotra' },
];

export const REPLIES_DB = [];

// Spread 40 replies across first 15 stories
let replyCounter = 1;
for (let i = 0; i < 40; i++) {
  const storyIndex = i % 15; // stories s1 through s15
  const storyId = `s${storyIndex + 1}`;
  const author = REPLY_AUTHORS[i % REPLY_AUTHORS.length];
  const isAnon = i % 5 === 0;
  const daysAgo = Math.floor(i / 5);
  const hoursAgo = (i % 8) * 2;

  REPLIES_DB.push({
    id: `r${replyCounter++}`,
    storyId,
    authorId: isAnon ? null : author.id,
    authorName: isAnon ? 'Anonymous Soul' : author.name,
    isAnon,
    content: REPLY_CONTENTS[i % REPLY_CONTENTS.length],
    createdAt: msAgo(daysAgo, hoursAgo),
  });
}
