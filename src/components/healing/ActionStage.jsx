import React, { useState } from 'react';

const ACTION_DATA = {
  anxiety: {
    actions: [
      { icon: '🌬️', title: '4-7-8 Breathing', desc: 'Inhale 4s · Hold 7s · Exhale 8s · Repeat 4 rounds', minutes: 3 },
      { icon: '🖐️', title: '5-4-3-2-1 Grounding', desc: 'Name 5 things you see, 4 hear, 3 touch, 2 smell, 1 taste', minutes: 5 },
      { icon: '✍️', title: 'Worry Dump', desc: 'Write every worry without stopping. Then close the notebook.', minutes: 7 },
      { icon: '🚶', title: 'Walk Without Phone', desc: '10 minutes outside, no headphones. Notice the world around you.', minutes: 10 },
    ],
    plan: [
      { week: 'Week 1', label: 'Stabilise', days: [
        'Day 1: Learn box breathing (4-4-4-4). Practice 3 rounds.',
        'Day 2: Write your top 3 worries and rate each 1–10 in likelihood.',
        'Day 3: Try 5-4-3-2-1 grounding during one anxious moment.',
        'Day 4: Take a 10-minute walk with no phone.',
        'Day 5: Write what your anxiety is trying to protect you from.',
        'Day 6: Rest. Do one thing that makes you feel safe.',
        'Day 7: Reflect — what reduced your anxiety most this week?',
      ]},
      { week: 'Week 2', label: 'Understand', days: [
        'Day 8: Track anxiety triggers for one full day.',
        'Day 9: Write the worst-case scenario — then the most likely one.',
        'Day 10: Try progressive muscle relaxation (tense, hold, release each muscle).',
        'Day 11: Limit news/social media to 20 minutes.',
        'Day 12: Call or message one person who calms you.',
        'Day 13: Spend 10 minutes in silence — no screens, no noise.',
        'Day 14: Journal: "What is anxiety costing me? What would peace feel like?"',
      ]},
      { week: 'Week 3', label: 'Build', days: [
        'Day 15: Create a morning routine: water, 5 min breathe, 10 min walk.',
        'Day 16: Do one thing you\'ve been avoiding because of anxiety.',
        'Day 17: Write a "evidence log" — times you worried and it was okay.',
        'Day 18: Cold shower for 30 seconds at the end of your normal shower.',
        'Day 19: Meditate for 5 minutes using a guided app.',
        'Day 20: Cook or prepare one healthy meal with intention.',
        'Day 21: Celebrate — list 5 things you did this month despite anxiety.',
      ]},
      { week: 'Week 4', label: 'Strengthen', days: [
        'Day 22: Set a "worry window" — 15 min/day. Outside it, defer worries.',
        'Day 23: Write your personal "calm plan" for when anxiety peaks.',
        'Day 24: Exercise for 20 minutes — anxiety lives in the body.',
        'Day 25: Tell someone you trust about your anxiety journey.',
        'Day 26: Identify one belief driving your anxiety. Reframe it.',
        'Day 27: Create a "safe space" — physical or mental — you can return to.',
        'Day 28–30: Practice your full routine. Reflect on who you\'ve become.',
      ]},
    ],
  },
  depression: {
    actions: [
      { icon: '🌞', title: 'Sunlight First', desc: 'Stand near a window or step outside for 5 minutes upon waking.', minutes: 5 },
      { icon: '💧', title: 'Hydrate & Eat', desc: 'Drink a full glass of water. Eat something, even if small.', minutes: 5 },
      { icon: '📞', title: 'Reach One Person', desc: 'Text one person. Even "thinking of you" counts.', minutes: 2 },
      { icon: '🛏️', title: 'Body Scan Rest', desc: 'Lie down. Slowly relax each part of your body from feet upward.', minutes: 10 },
    ],
    plan: [
      { week: 'Week 1', label: 'Anchor', days: [
        'Day 1: Pick one tiny anchor: make your bed, drink water, open curtains.',
        'Day 2: Eat one nourishing meal today, no matter how small.',
        'Day 3: Step outside for 5 minutes. Natural light helps your brain.',
        'Day 4: Write 3 things that exist — not "good" things, just things. The sun. Your hands.',
        'Day 5: Text or call one person you trust.',
        'Day 6: Watch or listen to something that has ever made you feel alive.',
        'Day 7: Write: "This week I showed up for myself by ___."',
      ]},
      { week: 'Week 2', label: 'Move', days: [
        'Day 8: Walk for 10 minutes outside. Movement is medicine.',
        'Day 9: Do one thing you used to enjoy, even if you feel nothing doing it.',
        'Day 10: Take a shower. Put on clean clothes. Care for your body.',
        'Day 11: Write about what depression has stolen from you. Name it.',
        'Day 12: Make one social plan — even coffee with one person.',
        'Day 13: Rest intentionally. Not avoidance — conscious restoration.',
        'Day 14: Reflect: "What small thing made today slightly better?"',
      ]},
      { week: 'Week 3', label: 'Connect', days: [
        'Day 15: Share how you\'re really feeling with one person.',
        'Day 16: Try a new simple activity: cook, draw, read, garden.',
        'Day 17: Write a letter to your future self about who you\'re becoming.',
        'Day 18: Help someone else in a small way. Purpose feeds recovery.',
        'Day 19: Spend 10 minutes in nature without your phone.',
        'Day 20: Write what depression has taught you about yourself.',
        'Day 21: Celebrate — you have shown up for 3 weeks.',
      ]},
      { week: 'Week 4', label: 'Rise', days: [
        'Day 22: Start a consistent sleep schedule — same bed time, same wake time.',
        'Day 23: Create a simple morning ritual that belongs to you.',
        'Day 24: Write your values — what matters to you when you feel like yourself.',
        'Day 25: Do one brave thing you\'ve been putting off.',
        'Day 26: Reduce one thing draining you: a commitment, a relationship, a habit.',
        'Day 27: Write how far you\'ve come since Day 1.',
        'Day 28–30: Continue your rituals. You are not who you were on Day 1.',
      ]},
    ],
  },
  loneliness: {
    actions: [
      { icon: '💌', title: 'Write a Letter', desc: 'Write to someone you miss. You don\'t have to send it.', minutes: 10 },
      { icon: '☕', title: 'Be Among People', desc: 'Go somewhere with others: café, park, library. Just exist with them.', minutes: 30 },
      { icon: '🎵', title: 'Share a Song', desc: 'Send someone a song that made you think of them.', minutes: 2 },
      { icon: '🌿', title: 'Tend Something Living', desc: 'Water a plant. Feed an animal. Connection starts small.', minutes: 5 },
    ],
    plan: [
      { week: 'Week 1', label: 'Reach', days: [
        'Day 1: Text one person you haven\'t spoken to in a while.',
        'Day 2: Go somewhere with people — even sitting in a café counts.',
        'Day 3: Write about what loneliness actually feels like for you.',
        'Day 4: Find one community online that shares your interest.',
        'Day 5: Call someone. Not text — voice.',
        'Day 6: Do one thing in public that you usually do alone.',
        'Day 7: Write about a time you felt truly seen and connected.',
      ]},
      { week: 'Week 2', label: 'Open', days: [
        'Day 8: Join one group — class, club, volunteer, community.',
        'Day 9: Share something real about yourself with one person.',
        'Day 10: Ask someone a question that goes beyond "how are you?"',
        'Day 11: Write about the kind of friendships you want to build.',
        'Day 12: Attend an event — workshop, meetup, spiritual gathering.',
        'Day 13: Practice self-companionship: take yourself somewhere you enjoy.',
        'Day 14: Write: "What kind of friend am I? What kind do I want to be?"',
      ]},
      { week: 'Week 3', label: 'Deepen', days: [
        'Day 15: Have one real conversation — not small talk.',
        'Day 16: Be vulnerable with someone you\'re beginning to trust.',
        'Day 17: Write about what makes you a good friend or companion.',
        'Day 18: Invite someone to do something together.',
        'Day 19: Show up for someone else — a small act of care.',
        'Day 20: Explore a spiritual community or group that resonates with you.',
        'Day 21: Celebrate — you have been actively building connection.',
      ]},
      { week: 'Week 4', label: 'Belong', days: [
        'Day 22: Commit to one ongoing social activity weekly.',
        'Day 23: Write your vision for your social life in one year.',
        'Day 24: Tell one person what they mean to you.',
        'Day 25: Practice self-love — you are your own first companion.',
        'Day 26: Identify one pattern that keeps you isolated. Name it.',
        'Day 27: Write to your future self — the connected version of you.',
        'Day 28–30: Continue showing up. Connection builds through consistency.',
      ]},
    ],
  },
  anger_management: {
    actions: [
      { icon: '🌬️', title: 'Cool Breath', desc: 'Inhale through nose (4s), exhale slowly through mouth (8s). 5 rounds.', minutes: 3 },
      { icon: '🚶', title: 'Walk It Out', desc: 'Leave the room. Walk for 5 minutes before responding.', minutes: 5 },
      { icon: '✍️', title: 'Anger Letter', desc: 'Write everything you want to say — all of it. Then put it away.', minutes: 10 },
      { icon: '🧊', title: 'Cold Water Reset', desc: 'Hold cold water on your wrists and face. Your nervous system cools.', minutes: 2 },
    ],
    plan: [
      { week: 'Week 1', label: 'Pause', days: [
        'Day 1: Identify your top 3 anger triggers. Write them honestly.',
        'Day 2: Practice the "10-second pause" before reacting to anything irritating.',
        'Day 3: Write what anger feels like in your body. Where does it live?',
        'Day 4: Try cool breathing during one moment of frustration.',
        'Day 5: Write about what anger has cost you. Be honest.',
        'Day 6: Take a long walk when you feel the heat rising.',
        'Day 7: Reflect: "What was underneath the anger this week?"',
      ]},
      { week: 'Week 2', label: 'Understand', days: [
        'Day 8: Journal: "When I feel disrespected, I usually ___."',
        'Day 9: Write about the earliest memory of feeling this angry.',
        'Day 10: Practice saying "I feel ___" instead of "You always ___."',
        'Day 11: Exercise hard — run, punch a pillow, lift weights. Move it out.',
        'Day 12: Write a letter to someone you\'re angry at. Don\'t send it.',
        'Day 13: Identify one person you can call when anger peaks.',
        'Day 14: Write: "What does this anger want me to protect?"',
      ]},
      { week: 'Week 3', label: 'Express', days: [
        'Day 15: Have one difficult conversation using "I" statements.',
        'Day 16: Write your personal anger warning signs — the early signals.',
        'Day 17: Apologise for one past outburst, if safe and appropriate.',
        'Day 18: Practice leaving the room gracefully before erupting.',
        'Day 19: Write what healthy anger expression looks like for you.',
        'Day 20: Find a physical outlet: sport, martial arts, dance.',
        'Day 21: Celebrate — you have been choosing response over reaction.',
      ]},
      { week: 'Week 4', label: 'Transform', days: [
        'Day 22: Write your personal "anger plan" — what you do when triggered.',
        'Day 23: Practice compassion for the person who triggers you most.',
        'Day 24: Write the story you tell yourself about why people make you angry.',
        'Day 25: Set one new boundary in a relationship that keeps angering you.',
        'Day 26: Write about who you want to be under pressure.',
        'Day 27: Tell someone who has seen your growth what you\'re working on.',
        'Day 28–30: Review your anger log. See the growth. You are not your past.',
      ]},
    ],
  },
  marriage_problems: {
    actions: [
      { icon: '🕯️', title: 'Evening Check-in', desc: 'Ask your partner: "How are you really?" and listen fully for 5 minutes.', minutes: 10 },
      { icon: '✍️', title: 'Gratitude Write', desc: 'Write 3 things you appreciate about your partner, right now.', minutes: 5 },
      { icon: '📵', title: 'Phone-Free Time', desc: 'One hour tonight with phones in another room. Just you two.', minutes: 60 },
      { icon: '💬', title: 'One Honest Thing', desc: 'Share one feeling you haven\'t said this week. Gently.', minutes: 10 },
    ],
    plan: [
      { week: 'Week 1', label: 'Reconnect', days: [
        'Day 1: Write what you love and respect about your partner, honestly.',
        'Day 2: Have one conversation that doesn\'t involve logistics or children.',
        'Day 3: Do one small, unexpected act of kindness for your partner.',
        'Day 4: Write about when you felt most connected in this relationship.',
        'Day 5: Ask your partner: "What do you need from me most right now?"',
        'Day 6: Spend one hour together doing something you both enjoy.',
        'Day 7: Write: "What do I need to take responsibility for in this marriage?"',
      ]},
      { week: 'Week 2', label: 'Communicate', days: [
        'Day 8: Learn your partner\'s love language. How do they feel loved?',
        'Day 9: Practice one "I feel ___" statement instead of criticism.',
        'Day 10: Write what you\'ve been afraid to say. Consider saying it gently.',
        'Day 11: Listen to your partner for 10 minutes without interrupting or fixing.',
        'Day 12: Write about patterns in your conflicts. What loops keep repeating?',
        'Day 13: Plan one future thing to look forward to together.',
        'Day 14: Write: "What does a healthy version of this marriage look like?"',
      ]},
      { week: 'Week 3', label: 'Repair', days: [
        'Day 15: Offer a genuine apology for one thing, without defensiveness.',
        'Day 16: Ask your partner to share their experience of the marriage honestly.',
        'Day 17: Create a weekly ritual: dinner without phones, morning coffee, walks.',
        'Day 18: Write about the marriage you promised each other at the beginning.',
        'Day 19: Do something that was meaningful to your partner when you first met.',
        'Day 20: Have one conversation about your shared vision for the future.',
        'Day 21: Write: "What would change if I showed up as my best self in this marriage?"',
      ]},
      { week: 'Week 4', label: 'Commit', days: [
        'Day 22: Consider couples counselling — seeing it as strength, not failure.',
        'Day 23: Write your vows again — not the wedding ones, the real ones.',
        'Day 24: Create one new shared tradition, however small.',
        'Day 25: Tell your partner one specific thing you love about them.',
        'Day 26: Discuss one dream you had for this relationship you haven\'t given up on.',
        'Day 27: Write a letter to your future selves as a couple.',
        'Day 28–30: Continue small daily acts. Marriages are rebuilt in the ordinary moments.',
      ]},
    ],
  },
  grief_loss: {
    actions: [
      { icon: '🕯️', title: 'Light a Candle', desc: 'Sit with a candle for 5 minutes. Let yourself remember.', minutes: 5 },
      { icon: '✍️', title: 'Write to Them', desc: 'Write a letter to who or what you\'ve lost. Say everything.', minutes: 15 },
      { icon: '📸', title: 'Hold a Memory', desc: 'Look at one photo or hold one object that connects you to them.', minutes: 5 },
      { icon: '🌿', title: 'Go Outside', desc: 'Take a slow walk. Let grief move through your body, not against it.', minutes: 15 },
    ],
    plan: [
      { week: 'Week 1', label: 'Feel', days: [
        'Day 1: Allow yourself to cry or feel without numbing it today.',
        'Day 2: Write about who or what you\'ve lost and what they meant to you.',
        'Day 3: Tell one person about your grief. Not to be fixed — just heard.',
        'Day 4: Do one thing that honours their memory.',
        'Day 5: Write about your favourite memory with them.',
        'Day 6: Rest. Grief is exhausting. You are allowed to rest.',
        'Day 7: Write: "What I want people to know about what I\'ve lost."',
      ]},
      { week: 'Week 2', label: 'Remember', days: [
        'Day 8: Create a small memorial — a corner, a jar, a playlist — that holds them.',
        'Day 9: Write about what they taught you without meaning to.',
        'Day 10: Share a story about them with someone who knew them.',
        'Day 11: Write the letter you never got to send.',
        'Day 12: Do something they would have wanted you to enjoy.',
        'Day 13: Notice where grief lives in your body. Put a hand there.',
        'Day 14: Write: "What they would say to me right now if they could."',
      ]},
      { week: 'Week 3', label: 'Carry', days: [
        'Day 15: Continue daily life, gently. Grief and life coexist.',
        'Day 16: Find one way to keep them present without being consumed.',
        'Day 17: Write about who you are becoming through this grief.',
        'Day 18: Connect with others who have experienced similar loss.',
        'Day 19: Do one thing that is just for you — joy without guilt.',
        'Day 20: Write a promise to yourself about how you\'ll honour their legacy.',
        'Day 21: Celebrate — not their loss, but your survival.',
      ]},
      { week: 'Week 4', label: 'Integrate', days: [
        'Day 22: Write about what grief has taught you about love.',
        'Day 23: Give yourself permission to laugh and enjoy without guilt.',
        'Day 24: Create something in their honour — plant, write, build, give.',
        'Day 25: Write about the version of you that existed before this loss.',
        'Day 26: Acknowledge: I am still here. That means something.',
        'Day 27: Write a letter to yourself from six months in the future.',
        'Day 28–30: Grief doesn\'t end — but it changes shape. You will carry it more gently.',
      ]},
    ],
  },
  relationship_breakup: {
    actions: [
      { icon: '📵', title: 'No Contact Today', desc: 'Don\'t check their profile or messages for the next 24 hours.', minutes: 0 },
      { icon: '✍️', title: 'Feel It Fully', desc: 'Write everything you feel. Don\'t explain or justify — just feel.', minutes: 10 },
      { icon: '☎️', title: 'Call Your Person', desc: 'Phone a close friend. Ask them to simply listen.', minutes: 20 },
      { icon: '🚶', title: 'Move Your Body', desc: 'Walk, run, cry it out. Heartbreak is physical — move it through.', minutes: 20 },
    ],
    plan: [
      { week: 'Week 1', label: 'Survive', days: [
        'Day 1: Today you just survive. Eat something. Drink water. Sleep.',
        'Day 2: Write everything you feel — no filter, no judgment.',
        'Day 3: Remove their photos from your home screen. Not forever — just now.',
        'Day 4: Call one friend and be honest about how you\'re doing.',
        'Day 5: Write what you\'re grieving — the person or the future you imagined?',
        'Day 6: Do one thing that is entirely for you. A small pleasure.',
        'Day 7: Write: "What I deserve in a relationship." Don\'t hold back.',
      ]},
      { week: 'Week 2', label: 'Understand', days: [
        'Day 8: Begin (gentle) no contact. Unfollow if needed for your healing.',
        'Day 9: Write about what the relationship gave you and what it cost you.',
        'Day 10: Reconnect with one interest or hobby you may have neglected.',
        'Day 11: Write about patterns: does this breakup remind you of others?',
        'Day 12: Spend time with people who remind you of who you are.',
        'Day 13: Write about what you brought to the relationship that was beautiful.',
        'Day 14: Write: "What I am learning about myself through this pain."',
      ]},
      { week: 'Week 3', label: 'Reclaim', days: [
        'Day 15: Do something you wanted to do but didn\'t in the relationship.',
        'Day 16: Redecorate one corner of your space to feel like yours.',
        'Day 17: Write your own story — not the one that ended, the one beginning.',
        'Day 18: Let yourself feel angry, sad, relieved — all of it is valid.',
        'Day 19: Be around people who love you without condition.',
        'Day 20: Write what freedom you\'re discovering on the other side.',
        'Day 21: Celebrate — you are 3 weeks in. That is strength.',
      ]},
      { week: 'Week 4', label: 'Rebuild', days: [
        'Day 22: Write your core values — what you\'ll never compromise on again.',
        'Day 23: Identify what you need to heal before entering another relationship.',
        'Day 24: Do something that makes you feel attractive and alive.',
        'Day 25: Write a compassionate letter to yourself from your future.',
        'Day 26: Spend one full day without thinking about them — notice what fills the space.',
        'Day 27: Write: "Who I am becoming because of this."',
        'Day 28–30: You are becoming someone who knows themselves better. That is not nothing.',
      ]},
    ],
  },
  work_career_stress: {
    actions: [
      { icon: '📋', title: 'List What\'s Real', desc: 'Write what is actually in your control at work. Focus only on that.', minutes: 5 },
      { icon: '⏱️', title: 'Pomodoro Reset', desc: '25 min focused work, 5 min complete rest. One cycle — right now.', minutes: 30 },
      { icon: '🚪', title: 'Close Work Tab', desc: 'For the next hour: no work email, messages, or tasks. A real break.', minutes: 60 },
      { icon: '✍️', title: 'Write Your Vision', desc: 'What does meaningful work look like for you? Write it without limits.', minutes: 10 },
    ],
    plan: [
      { week: 'Week 1', label: 'Boundary', days: [
        'Day 1: Write exactly what is stressing you at work. Be specific.',
        'Day 2: Identify what is in your control and what is not. Separate them.',
        'Day 3: Leave work on time today. No guilt.',
        'Day 4: Write what you\'d do if this job disappeared tomorrow.',
        'Day 5: Tell one trusted person what you\'re really feeling about work.',
        'Day 6: Take one full morning or afternoon off work this weekend.',
        'Day 7: Write: "What does sustainable work look like for me?"',
      ]},
      { week: 'Week 2', label: 'Focus', days: [
        'Day 8: Implement a "deep work" block — 90 min per day of real focus.',
        'Day 9: Say no to one request that is beyond your capacity.',
        'Day 10: Write about what gives you energy at work vs. what drains you.',
        'Day 11: Have one honest conversation with a manager or colleague.',
        'Day 12: Identify one task to delegate, drop, or defer.',
        'Day 13: Plan one non-work activity that fully absorbs you.',
        'Day 14: Write: "What would I work on if I were truly free to choose?"',
      ]},
      { week: 'Week 3', label: 'Restore', days: [
        'Day 15: Create a "shutdown ritual" — a signal that work is done for the day.',
        'Day 16: Exercise before or during the workday. It changes your state.',
        'Day 17: Write about what career success means to you — not society.',
        'Day 18: Learn one new skill that excites you, even 20 minutes.',
        'Day 19: Reconnect with your "why" — what drew you to this work originally.',
        'Day 20: Have lunch away from your desk, without your phone.',
        'Day 21: Celebrate — you are building healthier work patterns.',
      ]},
      { week: 'Week 4', label: 'Align', days: [
        'Day 22: Write your ideal workday in detail — time, energy, tasks, people.',
        'Day 23: Take one concrete step toward a role or change you want.',
        'Day 24: Set one professional boundary that protects your wellbeing.',
        'Day 25: Write about your strengths — what you uniquely bring.',
        'Day 26: Review your calendar: does it reflect your priorities?',
        'Day 27: Write a career vision for 3 years from now.',
        'Day 28–30: Your work should serve your life, not replace it. Hold that.',
      ]},
    ],
  },
  financial_stress: {
    actions: [
      { icon: '📊', title: 'One Number', desc: 'Write down your current balance or one specific worry. Name the number.', minutes: 5 },
      { icon: '✂️', title: 'One Cut Today', desc: 'Cancel or pause one expense you don\'t truly need right now.', minutes: 10 },
      { icon: '✍️', title: 'Fear to Facts', desc: 'Write your financial fear — then write what is actually factually true.', minutes: 10 },
      { icon: '📞', title: 'Ask for Help', desc: 'Call one person, service, or resource about your financial situation.', minutes: 15 },
    ],
    plan: [
      { week: 'Week 1', label: 'Clarity', days: [
        'Day 1: Write every financial stressor. Get them out of your head.',
        'Day 2: Write your actual income and expenses — one clear list.',
        'Day 3: Identify one expense to cut without it affecting your wellbeing.',
        'Day 4: Write the difference between your financial fear and financial reality.',
        'Day 5: Research one resource, scheme, or support available to you.',
        'Day 6: Rest from financial thinking today. One day off is okay.',
        'Day 7: Write: "What would financial peace feel like day-to-day?"',
      ]},
      { week: 'Week 2', label: 'Plan', days: [
        'Day 8: Create a simple budget — income minus essential expenses.',
        'Day 9: Write about how money stress is affecting your relationships and sleep.',
        'Day 10: Explore one side income possibility, however small.',
        'Day 11: Reach out to a financial counsellor or advisory service.',
        'Day 12: Identify one financial habit that is hurting you. One change.',
        'Day 13: Write about what money represents to you beyond numbers.',
        'Day 14: Write: "What would I do if money weren\'t a constraint?"',
      ]},
      { week: 'Week 3', label: 'Stabilise', days: [
        'Day 15: Build one small financial habit: save ₹10/day, track spending.',
        'Day 16: Write about your relationship with money — where did it come from?',
        'Day 17: Celebrate one small financial win, however modest.',
        'Day 18: Write a note of appreciation for what you do have.',
        'Day 19: Learn one financial concept: compound interest, budgeting, investing.',
        'Day 20: Write about someone you admire who came through financial hardship.',
        'Day 21: Celebrate — you are facing this, not hiding from it.',
      ]},
      { week: 'Week 4', label: 'Build', days: [
        'Day 22: Set one financial goal for the next 3 months. Write it clearly.',
        'Day 23: Write your vision of financial stability — specific and vivid.',
        'Day 24: Create one small emergency fund habit, even if just ₹50 a week.',
        'Day 25: Write a letter to your future financially stable self.',
        'Day 26: Share your financial goals with one person who will support you.',
        'Day 27: Write: "Who I am beyond my financial situation."',
        'Day 28–30: Money is a chapter, not a character. You are so much more.',
      ]},
    ],
  },
  panic_attacks: {
    actions: [
      { icon: '🌬️', title: 'Box Breathing', desc: 'Inhale 4s, hold 4s, exhale 4s, hold 4s. Repeat until calm.', minutes: 5 },
      { icon: '🖐️', title: 'Ground Right Now', desc: 'Feel your feet on the floor. Name 5 things you can see.', minutes: 3 },
      { icon: '🧊', title: 'Ice Cube Hold', desc: 'Hold an ice cube. The physical sensation interrupts the panic loop.', minutes: 2 },
      { icon: '✍️', title: 'Write After', desc: 'After a panic attack, write what triggered it. Find the pattern.', minutes: 10 },
    ],
    plan: [
      { week: 'Week 1', label: 'Safety', days: [
        'Day 1: Write your full panic attack experience — from first sign to aftermath.',
        'Day 2: Learn box breathing and practice it before you need it.',
        'Day 3: Create your personal "panic kit" — cold water, affirmation card, music.',
        'Day 4: Identify your earliest panic triggers. Write them.',
        'Day 5: Practice grounding (5-4-3-2-1) once per day, unprompted.',
        'Day 6: Tell one trusted person what happens to you during a panic attack.',
        'Day 7: Write: "I have survived every panic attack I have ever had."',
      ]},
      { week: 'Week 2', label: 'Understand', days: [
        'Day 8: Learn what is happening in your body during panic — it is not dangerous.',
        'Day 9: Track when panic hits: time, place, what you were thinking before.',
        'Day 10: Practice diaphragmatic breathing for 5 minutes each morning.',
        'Day 11: Write the story your mind tells during panic. Then the facts.',
        'Day 12: Try "interoceptive exposure" — do something that produces mild physical sensations to show you they\'re safe.',
        'Day 13: Rest and reduce caffeine or stimulants today.',
        'Day 14: Write: "What panic is really afraid of for me."',
      ]},
      { week: 'Week 3', label: 'Challenge', days: [
        'Day 15: Do one thing you\'ve been avoiding because of fear of panic.',
        'Day 16: Write your "before panic" body signals. Know the early warning.',
        'Day 17: Practice staying in a mild panic situation instead of escaping.',
        'Day 18: Journal: "The panic never killed me. It passes every time."',
        'Day 19: Create a panic response script — what you say to yourself when it starts.',
        'Day 20: Speak with a therapist familiar with CBT or exposure therapy.',
        'Day 21: Celebrate — you have been learning to live fully despite panic.',
      ]},
      { week: 'Week 4', label: 'Freedom', days: [
        'Day 22: Go somewhere you\'ve avoided. Bring your toolkit. Breathe.',
        'Day 23: Write about the life you want to live when panic no longer limits you.',
        'Day 24: Practice the mantra: "This is uncomfortable, not dangerous. It will pass."',
        'Day 25: Review your panic journal — what patterns do you see?',
        'Day 26: Write a letter to the part of you that panics. With compassion.',
        'Day 27: Write your vision of a life no longer ruled by fear.',
        'Day 28–30: You are not your panic. You are the one who breathes through it.',
      ]},
    ],
  },
  ptsd_trauma: {
    actions: [
      { icon: '🌿', title: 'Safe Place Visualise', desc: 'Close your eyes. Picture a place where you feel completely safe. Stay 5 minutes.', minutes: 5 },
      { icon: '🖐️', title: 'Ground in Body', desc: 'Feel your feet. Press your back to the chair. Name what is real right now.', minutes: 3 },
      { icon: '✍️', title: 'Write Today Only', desc: 'Write about today — not the past. What is happening right now, this moment?', minutes: 10 },
      { icon: '🎵', title: 'Regulation Playlist', desc: 'Play music that makes you feel calm and present. Let it anchor you.', minutes: 15 },
    ],
    plan: [
      { week: 'Week 1', label: 'Safety First', days: [
        'Day 1: Write about what "safe" means to you — physically, emotionally, relationally.',
        'Day 2: Create a personal safe space: a physical corner or a visualised place.',
        'Day 3: Practice grounding: feet on floor, 5 senses check, 3 times today.',
        'Day 4: Write about one person, place, or time where you feel most yourself.',
        'Day 5: Reduce one stressor in your environment today.',
        'Day 6: Rest and sleep — trauma heals in safety, not urgency.',
        'Day 7: Write: "The things that help me feel safe are ___."',
      ]},
      { week: 'Week 2', label: 'Regulate', days: [
        'Day 8: Learn one somatic technique: cold water on face, butterfly hug, humming.',
        'Day 9: Write about how trauma shows up day-to-day for you (flashbacks, avoidance, etc).',
        'Day 10: Create a "window of tolerance" plan — what pulls you back when you\'re overwhelmed.',
        'Day 11: Spend 10 minutes in nature. Let your nervous system soften.',
        'Day 12: Connect with one person who feels safe to you.',
        'Day 13: Write about a moment when you felt like yourself despite the trauma.',
        'Day 14: Write: "What my nervous system needs right now."',
      ]},
      { week: 'Week 3', label: 'Process', days: [
        'Day 15: Begin working with a trauma-informed therapist if not already.',
        'Day 16: Write about the strengths you\'ve developed because of what you survived.',
        'Day 17: Create one ritual that marks safety — morning tea, evening walk, lighting a candle.',
        'Day 18: Write about who you were before the trauma. Remember that person.',
        'Day 19: Give yourself permission to be "just okay" today — nothing more required.',
        'Day 20: Do one thing that brings you genuine pleasure. You are allowed joy.',
        'Day 21: Write: "What I am proud of myself for carrying."',
      ]},
      { week: 'Week 4', label: 'Integrate', days: [
        'Day 22: Write about what you want your life to feel like in a year.',
        'Day 23: Identify one trauma response (avoidance, hypervigilance) and explore it with curiosity.',
        'Day 24: Write about what trauma has taught you about your own strength.',
        'Day 25: Tell your story — however much or little you choose — to someone safe.',
        'Day 26: Write: "I am more than what happened to me."',
        'Day 27: Create a vision board or list of who you are becoming.',
        'Day 28–30: Healing from trauma is non-linear. Every step forward is real.',
      ]},
    ],
  },
  lack_of_confidence: {
    actions: [
      { icon: '✍️', title: 'Write 10 Wins', desc: 'Write 10 things you\'ve done in your life that took courage or skill.', minutes: 10 },
      { icon: '🪞', title: 'Mirror Work', desc: 'Look yourself in the eyes for 1 minute. Say one kind thing. Mean it.', minutes: 2 },
      { icon: '🎯', title: 'Do One Scary Thing', desc: 'Do one small thing you\'ve been afraid to do. Right now.', minutes: 15 },
      { icon: '📵', title: 'Off Social', desc: 'Stay off social media for 24 hours. Notice how you feel.', minutes: 0 },
    ],
    plan: [
      { week: 'Week 1', label: 'Foundation', days: [
        'Day 1: Write about where your self-doubt comes from. When did it begin?',
        'Day 2: List 10 things you are genuinely good at — no disclaimers.',
        'Day 3: Do one small thing outside your comfort zone.',
        'Day 4: Write a letter to yourself the way you\'d write to a best friend.',
        'Day 5: Avoid one comparison habit (social media, conversations).',
        'Day 6: Do something that makes you feel competent and capable.',
        'Day 7: Write: "The version of me I want to become is ___."',
      ]},
      { week: 'Week 2', label: 'Evidence', days: [
        'Day 8: Start a "win log" — write one success per day, however small.',
        'Day 9: Identify one area where you\'ve grown in the last year.',
        'Day 10: Ask someone who loves you what they admire about you.',
        'Day 11: Do one thing you usually avoid because of self-doubt.',
        'Day 12: Write your 5 core values — who are you when you\'re at your best?',
        'Day 13: Stop one self-critical thought and replace it with a neutral truth.',
        'Day 14: Write: "What I would try if I knew I couldn\'t fail."',
      ]},
      { week: 'Week 3', label: 'Act', days: [
        'Day 15: Dress intentionally today. How you present yourself affects how you feel.',
        'Day 16: Speak in one situation where you\'d normally stay silent.',
        'Day 17: Take on one challenge that stretches you slightly beyond comfort.',
        'Day 18: Write about a role model — what qualities do you admire? You have seeds of them.',
        'Day 19: Practice "act as if" — how would a confident version of you act today?',
        'Day 20: Celebrate one brave thing you did this week.',
        'Day 21: Write: "Confidence I am building through evidence, not waiting for."',
      ]},
      { week: 'Week 4', label: 'Own', days: [
        'Day 22: Write your personal strengths statement — own it completely.',
        'Day 23: Seek one opportunity that your old self would have passed on.',
        'Day 24: Stop apologising for things that don\'t require apology.',
        'Day 25: Write about who you\'re becoming.',
        'Day 26: Share your work, opinion, or presence with the world in some way.',
        'Day 27: Write to the version of you who didn\'t believe in themselves yet.',
        'Day 28–30: Confidence is not a feeling. It is a practice. You are practising.',
      ]},
    ],
  },
  sleep_problems: {
    actions: [
      { icon: '📵', title: 'No Screen 30 Min', desc: 'Put down all screens 30 minutes before bed. No exceptions tonight.', minutes: 0 },
      { icon: '🌬️', title: 'Body Scan Breathe', desc: 'Lie down. Breathe slowly. Relax each body part from feet to head.', minutes: 10 },
      { icon: '🌡️', title: 'Cool Your Room', desc: 'Lower the temperature or open a window. Sleep needs a cool environment.', minutes: 5 },
      { icon: '✍️', title: 'Brain Dump', desc: 'Write everything on your mind before bed. Empty your head onto paper.', minutes: 5 },
    ],
    plan: [
      { week: 'Week 1', label: 'Rhythm', days: [
        'Day 1: Set the same bedtime and wake time. Commit for 7 days.',
        'Day 2: No screens 30 min before bed. Try for one night.',
        'Day 3: Write your evening wind-down routine. Create it.',
        'Day 4: Track what happens when you try to sleep tonight.',
        'Day 5: Reduce caffeine after 2 PM today.',
        'Day 6: Make your bedroom a "sleep-only" space — no work, no phone.',
        'Day 7: Write: "What my mind does when I can\'t sleep."',
      ]},
      { week: 'Week 2', label: 'Wind Down', days: [
        'Day 8: Try a bedtime body scan meditation for 10 minutes.',
        'Day 9: Take a warm shower 1 hour before bed — your body cools after, triggering sleep.',
        'Day 10: Write your worries before bed to empty your head.',
        'Day 11: Remove clock visibility from your bed — clock-watching disrupts sleep.',
        'Day 12: Exercise today — physical tiredness is a legitimate sleep aid.',
        'Day 13: Reduce alcohol (it disrupts deep sleep phases).',
        'Day 14: Write: "What would sleeping well change about my daily life?"',
      ]},
      { week: 'Week 3', label: 'Calm', days: [
        'Day 15: Try 4-7-8 breathing as you lie down to sleep.',
        'Day 16: If you wake at night, stay in bed, don\'t check your phone.',
        'Day 17: Write about what sleep represents to you — is there fear around it?',
        'Day 18: Explore sleep sounds, white noise, or sleep music.',
        'Day 19: Eat dinner at least 2 hours before sleeping.',
        'Day 20: Try journaling at the same time each evening as a wind-down signal.',
        'Day 21: Celebrate — your sleep habits are improving.',
      ]},
      { week: 'Week 4', label: 'Restore', days: [
        'Day 22: Create your ideal sleep environment checklist. Make it happen.',
        'Day 23: Write about what you\'d do with the energy that comes from good sleep.',
        'Day 24: Try a morning light practice — natural sunlight resets your circadian rhythm.',
        'Day 25: Write a wind-down affirmation for tonight.',
        'Day 26: Review your sleep log: what has made the biggest difference?',
        'Day 27: Write: "I deserve rest. My body knows how to sleep."',
        'Day 28–30: Sleep is a skill. You are relearning it. Be patient with yourself.',
      ]},
    ],
  },
  family_relationships: {
    actions: [
      { icon: '✍️', title: 'Write Unsent Letter', desc: 'Write everything you want to say to a family member. Don\'t send it yet.', minutes: 10 },
      { icon: '🚶', title: 'Distance Today', desc: 'Create physical or emotional space today. It is allowed.', minutes: 0 },
      { icon: '☎️', title: 'One Kind Call', desc: 'Call one family member with the sole purpose of connection — no agenda.', minutes: 15 },
      { icon: '🧘', title: 'Boundary Breathe', desc: 'Before a family interaction: breathe, remember what you control, enter calmly.', minutes: 5 },
    ],
    plan: [
      { week: 'Week 1', label: 'Clarity', days: [
        'Day 1: Write which family relationship feels most painful and why.',
        'Day 2: Write what you wish your family understood about you.',
        'Day 3: Identify one pattern that keeps repeating in your family dynamics.',
        'Day 4: Write what you need from your family that you haven\'t asked for.',
        'Day 5: Practice one boundary — a gentle "no" or a limit on contact.',
        'Day 6: Spend time with one family member who nourishes you.',
        'Day 7: Write: "What a healthy version of this family relationship looks like."',
      ]},
      { week: 'Week 2', label: 'Responsibility', days: [
        'Day 8: Write your own role in the family dynamic — honestly.',
        'Day 9: Practice "I feel ___" language in one family conversation.',
        'Day 10: Write about what you received from your family, not just what was missing.',
        'Day 11: Set one gentle limit on a behaviour that hurts you.',
        'Day 12: Write a compassionate story of your parent\'s or sibling\'s life.',
        'Day 13: Step back from "rescuing" one family member today.',
        'Day 14: Write: "What I am taking responsibility for in this family."',
      ]},
      { week: 'Week 3', label: 'Boundaries', days: [
        'Day 15: Communicate one need to a family member directly.',
        'Day 16: Write about the family you are choosing to create or maintain.',
        'Day 17: Practice letting go of what you cannot change in your family.',
        'Day 18: Celebrate one family relationship that is good or improving.',
        'Day 19: Write about the child in you who needed more — give them compassion.',
        'Day 20: Seek support: therapy, community, or trusted friends.',
        'Day 21: Write: "I am allowed to take up space in my own family."',
      ]},
      { week: 'Week 4', label: 'Peace', days: [
        'Day 22: Write your vision of family peace — what it looks like, what it costs.',
        'Day 23: Practice emotional detachment with one family pattern (observe, don\'t absorb).',
        'Day 24: Write a letter of forgiveness — for you, not for them.',
        'Day 25: Create a "family boundary plan" for difficult occasions.',
        'Day 26: Write what you love about being part of your specific family.',
        'Day 27: Write: "I am a different generation. I am breaking patterns."',
        'Day 28–30: Family healing is slow. Even the trying is changing the legacy.',
      ]},
    ],
  },
  ocd_intrusive_thoughts: {
    actions: [
      { icon: '🌊', title: 'Let It Pass', desc: 'Notice the thought. Label it: "There is a thought." Don\'t engage. Let it pass.', minutes: 3 },
      { icon: '🛑', title: 'No Compulsion', desc: 'Notice one compulsion today. Choose not to do it. Wait 10 minutes.', minutes: 10 },
      { icon: '✍️', title: 'Defuse the Thought', desc: 'Write: "I am having the thought that ___." Then set it down.', minutes: 5 },
      { icon: '🌬️', title: 'Breathe, Not Fix', desc: 'When a thought comes: breathe. You don\'t have to fix or neutralise it.', minutes: 5 },
    ],
    plan: [
      { week: 'Week 1', label: 'Awareness', days: [
        'Day 1: Write the thoughts or compulsions that bother you most, without judgment.',
        'Day 2: Learn the OCD cycle: thought → anxiety → compulsion → temporary relief → repeat.',
        'Day 3: Practice observing one thought without acting on it.',
        'Day 4: Learn "defusion": "I notice I am having the thought that ___."',
        'Day 5: Write what you\'re afraid will happen if you don\'t do the compulsion.',
        'Day 6: Rest. Managing OCD is exhausting. You deserve restoration.',
        'Day 7: Write: "What my life would look like if OCD had less power."',
      ]},
      { week: 'Week 2', label: 'Respond Differently', days: [
        'Day 8: Delay one compulsion by 5 minutes. Notice the anxiety passes anyway.',
        'Day 9: Practice mindful observation of thoughts: they come, they go.',
        'Day 10: Write about what the intrusive thoughts have cost you.',
        'Day 11: Choose one small exposure: enter a situation that triggers thought without compulsing.',
        'Day 12: Connect with ERP (Exposure and Response Prevention) resources.',
        'Day 13: Write: "Thoughts are not facts. They are not commands."',
        'Day 14: Tell one safe person about your experience.',
      ]},
      { week: 'Week 3', label: 'Tolerance', days: [
        'Day 15: Increase exposure difficulty slightly. Stay with discomfort longer.',
        'Day 16: Write about the values that OCD is keeping you from living.',
        'Day 17: Practice self-compassion: OCD is not a character flaw.',
        'Day 18: Write about who you are outside of the OCD thoughts.',
        'Day 19: Begin working with an OCD-specialised therapist if possible.',
        'Day 20: Write about one moment this week you chose differently.',
        'Day 21: Celebrate — you are facing your fears instead of running.',
      ]},
      { week: 'Week 4', label: 'Freedom', days: [
        'Day 22: Continue gradual exposure. The fear diminishes with repeated non-response.',
        'Day 23: Write your vision of life when OCD doesn\'t run your day.',
        'Day 24: Practice accepting uncertainty: not all things need to be certain.',
        'Day 25: Connect with the OCD community — you are not alone in this.',
        'Day 26: Write about the strength it takes to resist compulsions.',
        'Day 27: Write a compassionate letter to the part of you with OCD.',
        'Day 28–30: Recovery from OCD is possible. Each act of resistance is proof.',
      ]},
    ],
  },
  trust_issues: {
    actions: [
      { icon: '✍️', title: 'Write the Story', desc: 'Write who first taught you that trust was dangerous. Tell the whole story.', minutes: 10 },
      { icon: '🌊', title: 'Small Trust Step', desc: 'Share one small true thing with someone today. One step.', minutes: 5 },
      { icon: '🔍', title: 'Safety vs. History', desc: 'Ask: is this person actually unsafe, or am I pattern-matching from the past?', minutes: 5 },
      { icon: '🧘', title: 'Body Check Trust', desc: 'Before dismissing someone: how does your body feel with them? Calm or tense?', minutes: 3 },
    ],
    plan: [
      { week: 'Week 1', label: 'Origins', days: [
        'Day 1: Write about who or what taught you not to trust. Name them.',
        'Day 2: Write about how trust issues show up in your daily life.',
        'Day 3: Identify one person in your life who has been consistently safe.',
        'Day 4: Write what you wish you could trust someone with right now.',
        'Day 5: Practice sharing one small truth with a safe person.',
        'Day 6: Write about the cost of not trusting — what have you missed?',
        'Day 7: Write: "If I trusted someone fully, I would fear ___."',
      ]},
      { week: 'Week 2', label: 'Discern', days: [
        'Day 8: Learn the difference between safe and unsafe people — specific behaviours.',
        'Day 9: Write about someone who has earned trust slowly and consistently.',
        'Day 10: Practice asking: "Is this person actually unsafe, or does trust feel unsafe?"',
        'Day 11: Share something slightly more vulnerable with one safe person.',
        'Day 12: Write about how trust issues may be protecting you from intimacy.',
        'Day 13: Write the story of one time you trusted and it worked out.',
        'Day 14: Write: "Trust I am willing to extend, and the limits I will honour."',
      ]},
      { week: 'Week 3', label: 'Open', days: [
        'Day 15: Practice tolerating the discomfort of not knowing someone\'s intentions.',
        'Day 16: Write about what a trustworthy person looks like to you.',
        'Day 17: Extend trust to someone incrementally — a small risk.',
        'Day 18: Write about the wounded part of you that guards the door. Give it gratitude.',
        'Day 19: Consider therapy to explore the roots of your trust wounds.',
        'Day 20: Write about one relationship where you\'re choosing to try.',
        'Day 21: Celebrate — you are choosing to try despite fear.',
      ]},
      { week: 'Week 4', label: 'Connect', days: [
        'Day 22: Write your vision of a trusting, connected version of your life.',
        'Day 23: Tell someone close to you that you\'re working on trusting.',
        'Day 24: Practice vulnerability: share something true that you\'d usually hide.',
        'Day 25: Write about the relationship between self-trust and trusting others.',
        'Day 26: Write about who you become when trust is present.',
        'Day 27: Write a letter to the part of you that wants to be known and loved.',
        'Day 28–30: Trust is rebuilt in small moments. You are choosing them.',
      ]},
    ],
  },
  default: {
    actions: [
      { icon: '🧘', title: 'One Minute Breathe', desc: 'Close your eyes. Breathe slowly and deeply for 60 seconds.', minutes: 1 },
      { icon: '✍️', title: 'Gratitude Note', desc: 'Write 3 things — however small — that are okay right now.', minutes: 5 },
      { icon: '🚿', title: 'Reset Your Body', desc: 'Splash cold water on your face. Change what you can, right now.', minutes: 2 },
      { icon: '📵', title: 'Phone Down, 10 Min', desc: 'Put your phone face-down. Be with yourself fully.', minutes: 10 },
    ],
    plan: [
      { week: 'Week 1', label: 'Begin', days: [
        'Day 1: Write honestly about what you\'re going through.',
        'Day 2: Identify one small habit that supports your wellbeing.',
        'Day 3: Reach out to one person who helps you feel less alone.',
        'Day 4: Take a 10-minute walk with no phone.',
        'Day 5: Write 3 things that are okay in your life right now.',
        'Day 6: Rest. You are allowed to rest.',
        'Day 7: Write: "One thing I will commit to next week."',
      ]},
      { week: 'Week 2', label: 'Build', days: [
        'Day 8: Start your day with water and 5 minutes of quiet.',
        'Day 9: Write about what you want your life to feel like.',
        'Day 10: Do one thing that used to bring you joy.',
        'Day 11: Say no to one thing that drains you.',
        'Day 12: Sleep at a consistent time for 3 nights.',
        'Day 13: Write about who you are when you are at your best.',
        'Day 14: Connect with someone who knows and loves you.',
      ]},
      { week: 'Week 3', label: 'Grow', days: [
        'Day 15: Exercise for 20 minutes.',
        'Day 16: Write about one belief that limits you.',
        'Day 17: Do one brave thing today.',
        'Day 18: Spend 10 minutes in nature.',
        'Day 19: Write about how you\'ve grown in the last year.',
        'Day 20: Help someone else. Purpose heals.',
        'Day 21: Celebrate — three weeks of showing up.',
      ]},
      { week: 'Week 4', label: 'Continue', days: [
        'Day 22: Write your vision for the next 3 months.',
        'Day 23: Create one sustainable daily ritual.',
        'Day 24: Write about who you are becoming.',
        'Day 25: Take one concrete step toward something you want.',
        'Day 26: Write what you would tell your past self.',
        'Day 27: Write a letter to your future self.',
        'Day 28–30: You showed up every day. That is everything.',
      ]},
    ],
  },
};

export default function ActionStage({ problemType, onComplete }) {
  const [done, setDone] = useState(null);
  const [showPlan, setShowPlan] = useState(false);
  const [openWeek, setOpenWeek] = useState(0);
  const data = ACTION_DATA[problemType] || ACTION_DATA.default;

  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-6">
        <div style={{ fontSize: 52, marginBottom: 12 }}>⚡</div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>The Action</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Pick one thing. Do it now. Small steps heal.</p>
      </div>

      {/* Today's Actions */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {data.actions.map((a, i) => (
          <div key={i} onClick={() => setDone(i)}
            className="rounded-2xl p-4 cursor-pointer transition-all"
            style={{
              background: done === i ? 'rgba(245,158,11,0.12)' : 'var(--bg-card)',
              border: `1px solid ${done === i ? '#f59e0b' : 'var(--border)'}`,
            }}>
            <span style={{ fontSize: 28 }}>{a.icon}</span>
            <p className="font-semibold text-sm mt-2 mb-1" style={{ color: 'var(--text)' }}>{a.title}</p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>{a.desc}</p>
            {a.minutes > 0 && (
              <p className="mt-2 text-xs font-semibold" style={{ color: '#f59e0b' }}>{a.minutes} min</p>
            )}
          </div>
        ))}
      </div>

      {/* 30-Day Plan Toggle */}
      <button
        onClick={() => setShowPlan(!showPlan)}
        className="w-full py-3 rounded-xl font-semibold mb-4 transition-all"
        style={{
          background: showPlan ? 'rgba(124,58,237,0.12)' : 'var(--bg-card)',
          border: '1px solid rgba(124,58,237,0.3)',
          color: '#a855f7',
        }}>
        {showPlan ? '▾ Hide' : '▸ View'} Your 30-Day Healing Plan
      </button>

      {showPlan && (
        <div className="rounded-2xl overflow-hidden mb-5" style={{ border: '1px solid var(--border)' }}>
          {data.plan.map((w, wi) => (
            <div key={wi}>
              <button
                onClick={() => setOpenWeek(openWeek === wi ? -1 : wi)}
                className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors"
                style={{
                  background: openWeek === wi ? 'rgba(124,58,237,0.08)' : 'var(--bg-card)',
                  borderBottom: '1px solid var(--border)',
                }}>
                <div>
                  <span className="font-bold text-sm" style={{ color: 'var(--text)' }}>{w.week}</span>
                  <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(168,85,247,0.15)', color: '#a855f7' }}>
                    {w.label}
                  </span>
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{openWeek === wi ? '▲' : '▼'}</span>
              </button>
              {openWeek === wi && (
                <div className="px-5 py-3 space-y-2" style={{ background: 'var(--bg-subtle)' }}>
                  {w.days.map((day, di) => (
                    <div key={di} className="flex items-start gap-3 py-1">
                      <span style={{ color: '#a855f7', fontSize: 11, fontWeight: 700, marginTop: 2, minWidth: 16 }}>
                        {di + 1 + wi * 7 <= 30 ? `${di + 1 + wi * 7}` : '·'}
                      </span>
                      <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{day}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => onComplete({ stage: 'action', chosen: done !== null ? data.actions[done] : null })}
        disabled={done === null}
        className="w-full py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-40"
        style={{ background: 'linear-gradient(135deg, #d97706, #dc2626)' }}>
        I did it ✓
      </button>
    </div>
  );
}
