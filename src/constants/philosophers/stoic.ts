// ==========================================================================
// STOIC PHILOSOPHY
// ==========================================================================
export const stoicPhilosophers = {
  marcusAurelius: {
    id: 'marcusAurelius',
    name: 'Marcus Aurelius',
    era: '121–180 AD',
    tradition: 'Stoicism',
    description:
      'Roman Emperor and Stoic philosopher. His personal writings, known as Meditations, offer practical wisdom on virtue, duty, and inner tranquility amid the chaos of life.',
    keyTeachings: [
      'Focus only on what is within your control',
      'Accept fate (amor fati) and work with nature, not against it',
      'The present moment is all we truly have',
      'Virtue is the only true good; external things are indifferent',
      'We are all part of one rational, cosmic order',
      'Death is natural and not to be feared',
    ],
    keyConcepts: [
      {
        name: 'Dichotomy of Control',
        explanation:
          'Distinguish between what is "up to us" (our judgments, intentions, desires) and what is not (external events, others\' actions). Focus energy only on what you can control.',
        relatedTerms: ['prohairesis', 'choice', 'inner citadel'],
      },
      {
        name: 'Memento Mori',
        explanation:
          'Remember that you will die. This awareness should inspire you to live virtuously now, not waste time on trivial matters, and appreciate each moment.',
        relatedTerms: ['mortality', 'urgency', 'perspective'],
      },
      {
        name: 'Cosmopolitanism',
        explanation:
          'We are citizens of the cosmos, not just of our city or nation. All rational beings share in the same divine reason (logos) and are thus brothers and sisters.',
        relatedTerms: ['universal brotherhood', 'logos', 'duty to humanity'],
      },
      {
        name: 'The Inner Citadel',
        explanation:
          'Your mind is a fortress that cannot be invaded unless you allow it. External events cannot harm your character; only your judgments about them can.',
        relatedTerms: ['mental fortitude', 'judgment', 'prohairesis'],
      },
    ],
    notableWorks: ['Meditations'],
    textSources: [
      {
        id: 'aurelius-meditations',
        title: 'Meditations',
        url: 'https://www.gutenberg.org/cache/epub/2680/pg2680.txt',
        format: 'txt',
        description: 'Personal writings on Stoic philosophy',
      },
    ],
    keyExcerpts: [
      {
        work: 'Meditations, Book II',
        passage:
          'Begin the morning by saying to thyself, I shall meet with the busy-body, the ungrateful, arrogant, deceitful, envious, unsocial. All these things happen to them by reason of their ignorance of what is good and evil.',
        context: 'Preparing for difficult people with equanimity',
      },
      {
        work: 'Meditations, Book IV',
        passage:
          'Never value anything as profitable that compels you to break your promise, lose your self-respect, hate any man, suspect, curse, act the hypocrite, or desire anything that needs walls or curtains.',
        context: 'On maintaining integrity',
      },
    ],
    famousQuotes: [
      'You have power over your mind - not outside events. Realize this, and you will find strength.',
      'The happiness of your life depends upon the quality of your thoughts.',
      'Waste no more time arguing about what a good man should be. Be one.',
      'The best revenge is to be unlike him who performed the injury.',
      'When you arise in the morning, think of what a precious privilege it is to be alive.',
    ],
    areasOfExpertise: [
      'Stoicism',
      'self-discipline',
      'duty',
      'mortality',
      'inner peace',
      'leadership',
    ],
  },

  epictetus: {
    id: 'epictetus',
    name: 'Epictetus',
    era: '50–135 AD',
    tradition: 'Stoicism',
    description:
      "Born a slave, Epictetus became one of the most influential Stoic philosophers. His teachings, recorded by his student Arrian, emphasize freedom through mastery of one's judgments and desires.",
    keyTeachings: [
      'Some things are within our power, and some things are not',
      'It is not things that disturb us, but our judgments about things',
      'Make the best use of what is in your power, and take the rest as it happens',
      'Difficulty shows what men are',
      'No man is free who is not master of himself',
    ],
    keyConcepts: [
      {
        name: 'The Dichotomy of Control',
        explanation:
          'The opening of the Enchiridion: "Some things are within our power, while others are not." Our opinions, impulses, desires, and aversions are up to us; our body, property, reputation, and office are not.',
        relatedTerms: ['eph hemin', 'prohairesis', 'freedom'],
      },
      {
        name: 'Role Ethics',
        explanation:
          'We each have various roles (parent, citizen, friend) with associated duties. Living well means fulfilling these roles excellently while maintaining our role as a rational human being.',
        relatedTerms: ['duty', 'persona', 'social roles'],
      },
      {
        name: 'Impression Management',
        explanation:
          'Between stimulus and response, there is a space. We can choose how to interpret impressions (phantasiai) before assenting to them. Mastery of this process is the key to freedom.',
        relatedTerms: ['phantasia', 'assent', 'judgment'],
      },
    ],
    notableWorks: ['Discourses', 'Enchiridion (Handbook)'],
    textSources: [
      {
        id: 'epictetus-discourses',
        title: 'Discourses and Enchiridion',
        url: 'https://www.gutenberg.org/ebooks/10661.txt.utf-8',
        format: 'txt',
        description: 'Stoic teachings on living a good life',
      },
      {
        id: 'epictetus-enchiridion',
        title: 'Enchiridion (The Manual)',
        url: 'https://www.gutenberg.org/ebooks/45109.txt.utf-8',
        format: 'txt',
        description: 'Condensed handbook of Stoic principles',
      },
    ],
    keyExcerpts: [
      {
        work: 'Enchiridion, Chapter 1',
        passage:
          'Some things are in our control and others not. Things in our control are opinion, pursuit, desire, aversion, and, in a word, whatever are our own actions. Things not in our control are body, property, reputation, command, and, in one word, whatever are not our own actions.',
        context: 'The fundamental Stoic distinction',
      },
      {
        work: 'Enchiridion, Chapter 5',
        passage:
          'Men are disturbed, not by things, but by the principles and notions which they form concerning things.',
        context: 'The cognitive theory of emotions',
      },
    ],
    famousQuotes: [
      'It is not what happens to you, but how you react to it that matters.',
      'No man is free who is not master of himself.',
      'First say to yourself what you would be; and then do what you have to do.',
      'Circumstances do not make the man, they reveal him.',
      'We cannot choose our external circumstances, but we can always choose how we respond to them.',
    ],
    areasOfExpertise: [
      'Stoicism',
      'freedom',
      'self-mastery',
      'resilience',
      'practical ethics',
    ],
  },

  seneca: {
    id: 'seneca',
    name: 'Seneca',
    era: '4 BC–65 AD',
    tradition: 'Stoicism',
    description:
      'Roman Stoic philosopher, statesman, and dramatist. His letters and essays offer eloquent practical wisdom on how to live well amid the challenges of wealth, power, and mortality.',
    keyTeachings: [
      'Time is our most precious resource; do not waste it',
      'We suffer more in imagination than in reality',
      'Philosophy is the art of living well',
      'Wealth and power are indifferent; virtue alone matters',
      'Prepare for adversity through premeditation (premeditatio malorum)',
    ],
    keyConcepts: [
      {
        name: 'Premeditatio Malorum',
        explanation:
          'Premeditation of evils: mentally rehearse potential hardships so they do not catch you off guard. By imagining loss, exile, or death, you reduce their power over you.',
        relatedTerms: ['negative visualization', 'preparation', 'resilience'],
      },
      {
        name: 'The Shortness of Life',
        explanation:
          'Life is not short; we make it so by wasting time. Most people are too busy for living. The wise person uses time well and thus lives a long life even if they die young.',
        relatedTerms: ['time management', 'mortality', 'priorities'],
      },
      {
        name: 'Tranquility of Mind',
        explanation:
          'The goal is a stable, peaceful mind (tranquillitas animi) that remains undisturbed by fortune. This comes from virtue, not from external circumstances.',
        relatedTerms: ['ataraxia', 'peace', 'equanimity'],
      },
    ],
    notableWorks: [
      'Letters from a Stoic (Moral Letters)',
      'On the Shortness of Life',
      'On Anger',
      'On the Happy Life',
      'On Providence',
    ],
    textSources: [
      {
        id: 'seneca-letters',
        title: 'Letters from a Stoic',
        url: 'https://ia801500.us.archive.org/10/items/in.ernet.dli.2015.65471/2015.65471.Letters-From-A-Stoic_djvu.txt',
        format: 'txt',
        description: 'Moral letters on Stoic wisdom',
      },
      {
        id: 'seneca-shortness-life',
        title: 'On the Shortness of Life',
        url: 'https://www.gutenberg.org/ebooks/64576.txt.utf-8',
        format: 'txt',
        description: 'Essay on the proper use of time',
      },
    ],
    keyExcerpts: [
      {
        work: 'On the Shortness of Life',
        passage:
          'It is not that we have a short time to live, but that we waste a lot of it. Life is long enough, and a sufficiently generous amount has been given to us for the highest achievements if it were all well invested.',
        context: 'The famous opening on time',
      },
      {
        work: 'Letters, 13',
        passage: 'We suffer more often in imagination than in reality.',
        context: 'On the nature of anxiety',
      },
    ],
    famousQuotes: [
      'We suffer more often in imagination than in reality.',
      'Luck is what happens when preparation meets opportunity.',
      'It is not that we have a short time to live, but that we waste a lot of it.',
      'Difficulties strengthen the mind, as labor does the body.',
      'Begin at once to live, and count each separate day as a separate life.',
    ],
    areasOfExpertise: [
      'Stoicism',
      'time management',
      'anger management',
      'wealth',
      'mortality',
      'practical wisdom',
    ],
  },
};
