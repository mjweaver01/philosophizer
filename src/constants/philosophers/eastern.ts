// ==========================================================================
// EASTERN PHILOSOPHY
// ==========================================================================
export const easternPhilosophers = {
  confucius: {
    id: 'confucius',
    name: 'Confucius (Kong Qiu)',
    era: '551–479 BC',
    tradition: 'Chinese Philosophy / Confucianism',
    description:
      'Chinese philosopher whose teachings on ethics, family, and social harmony became foundational to East Asian culture. Emphasized moral cultivation, proper relationships, and virtuous leadership.',
    keyTeachings: [
      'Ren (仁): Benevolence, humaneness, and compassion as the highest virtue',
      'Li (禮): Ritual propriety, proper conduct, and respect for tradition',
      'Xiao (孝): Filial piety—reverence and care for parents and ancestors',
      'Junzi (君子): The ideal of the "gentleman" or morally cultivated person',
      'Five Relationships: Ruler-subject, parent-child, husband-wife, elder-younger, friend-friend',
    ],
    keyConcepts: [
      {
        name: 'Ren (仁) — Benevolence/Humaneness',
        explanation:
          'The supreme virtue encompassing compassion, kindness, and love for others. Ren is what makes us fully human.',
        relatedTerms: ['humaneness', 'benevolence', 'goodness', 'love'],
      },
      {
        name: 'Li (禮) — Ritual Propriety',
        explanation:
          'The proper forms of conduct, manners, and rituals that govern social interaction. Li shapes behavior and cultivates virtue through practice.',
        relatedTerms: ['ritual', 'propriety', 'manners', 'ceremony'],
      },
      {
        name: 'Junzi (君子) — The Exemplary Person',
        explanation:
          'The ideal of moral cultivation—a person of virtue, wisdom, and refinement. Anyone can become a junzi through self-cultivation.',
        relatedTerms: ['gentleman', 'noble person', 'moral exemplar'],
      },
      {
        name: 'Xiao (孝) — Filial Piety',
        explanation:
          'Reverence and care for parents and ancestors. Filial piety is the root of all virtue.',
        relatedTerms: [
          'respect for parents',
          'ancestor worship',
          'family loyalty',
        ],
      },
    ],
    notableWorks: [
      'Analects (Lunyu)',
      'Doctrine of the Mean',
      'Great Learning',
    ],
    textSources: [
      {
        id: 'confucius-analects',
        title: 'The Analects',
        url: 'https://www.gutenberg.org/cache/epub/3330/pg3330.txt',
        format: 'txt',
        description: 'The collected sayings and dialogues of Confucius',
      },
    ],
    keyExcerpts: [
      {
        work: 'Analects 15:24',
        passage:
          'The Master replied, "It is the word shu—reciprocity: Do not do to others what you do not want them to do to you."',
        context: 'The principle of reciprocity as a guide for life',
      },
      {
        work: 'Analects 2:4',
        passage:
          'At fifteen, I set my heart on learning. At thirty, I stood firm. At forty, I had no doubts. At fifty, I knew the decrees of Heaven. At sixty, my ear was an obedient organ for the reception of truth. At seventy, I could follow what my heart desired without transgressing what was right.',
        context: 'Confucius describes his own moral development',
      },
    ],
    famousQuotes: [
      'It does not matter how slowly you go as long as you do not stop.',
      'What you do not want done to yourself, do not do to others.',
      "Real knowledge is to know the extent of one's ignorance.",
      'The man who moves a mountain begins by carrying away small stones.',
      'To see what is right and not do it is want of courage.',
    ],
    areasOfExpertise: [
      'ethics',
      'social harmony',
      'education',
      'virtuous leadership',
      'family relationships',
      'self-cultivation',
    ],
  },

  buddha: {
    id: 'buddha',
    name: 'Siddhartha Gautama (The Buddha)',
    era: 'c. 563–483 BC',
    tradition: 'Buddhism',
    description:
      'Indian spiritual teacher who founded Buddhism. After achieving enlightenment, he taught the path to liberation from suffering through ethical conduct, mental discipline, and wisdom.',
    keyTeachings: [
      'Four Noble Truths: Life involves suffering; suffering arises from craving; suffering can cease; the Eightfold Path leads to cessation',
      'Noble Eightfold Path: Right view, intention, speech, action, livelihood, effort, mindfulness, concentration',
      'Middle Way: Avoid extremes of self-indulgence and self-mortification',
      'Anatta (No-Self): There is no permanent, unchanging self',
      'Anicca (Impermanence): All conditioned phenomena are constantly changing',
    ],
    keyConcepts: [
      {
        name: 'Four Noble Truths',
        explanation:
          '(1) Dukkha—life involves suffering; (2) Samudaya—suffering arises from craving; (3) Nirodha—suffering can cease; (4) Magga—the Noble Eightfold Path leads to cessation.',
        relatedTerms: ['dukkha', 'tanha', 'nirodha', 'magga'],
      },
      {
        name: 'Noble Eightfold Path',
        explanation:
          'The way to the cessation of suffering: Right View, Right Intention (wisdom); Right Speech, Right Action, Right Livelihood (ethics); Right Effort, Right Mindfulness, Right Concentration (mental discipline).',
        relatedTerms: [
          'Middle Way',
          'threefold training',
          'path to enlightenment',
        ],
      },
      {
        name: 'Three Marks of Existence',
        explanation:
          '(1) Anicca—impermanence; (2) Dukkha—suffering; (3) Anatta—no-self. Understanding these leads to liberation.',
        relatedTerms: ['impermanence', 'suffering', 'non-self', 'tilakkhana'],
      },
      {
        name: 'Nirvana',
        explanation:
          'The extinguishing of craving, aversion, and delusion; liberation from the cycle of rebirth (samsara). Not annihilation but the cessation of suffering.',
        relatedTerms: [
          'liberation',
          'enlightenment',
          'extinction',
          'unbinding',
        ],
      },
      {
        name: 'Mindfulness (Sati)',
        explanation:
          'Clear, non-judgmental awareness of present experience—body, feelings, mind, and mental objects.',
        relatedTerms: ['awareness', 'vipassana', 'meditation', 'presence'],
      },
    ],
    notableWorks: [
      'Dhammapada',
      'Sutta Pitaka',
      'Heart Sutra',
      'Diamond Sutra',
    ],
    textSources: [
      {
        id: 'buddha-dhammapada',
        title: 'Dhammapada',
        url: 'https://www.gutenberg.org/cache/epub/2017/pg2017.txt',
        format: 'txt',
        description: "Collection of the Buddha's sayings in verse",
      },
    ],
    keyExcerpts: [
      {
        work: 'Dhammapada, Chapter 1',
        passage:
          'Mind is the forerunner of all actions. All deeds are led by mind, created by mind. If one speaks or acts with a corrupt mind, suffering follows... If one speaks or acts with a serene mind, happiness follows.',
        context: 'The opening verses on the primacy of mind',
      },
      {
        work: 'Dhammapada, Chapter 14',
        passage:
          'Hatred is never appeased by hatred in this world. By non-hatred alone is hatred appeased. This is a law eternal.',
        context: 'On overcoming hatred with love',
      },
    ],
    famousQuotes: [
      'Peace comes from within. Do not seek it without.',
      'The mind is everything. What you think you become.',
      'Three things cannot be long hidden: the sun, the moon, and the truth.',
      'You yourself must strive. The Buddhas only point the way.',
      'Holding on to anger is like grasping a hot coal... you are the one who gets burned.',
    ],
    areasOfExpertise: [
      'suffering and liberation',
      'mindfulness',
      'meditation',
      'ethics',
      'impermanence',
      'enlightenment',
      'compassion',
    ],
  },

  krishna: {
    id: 'krishna',
    name: 'Krishna (Bhagavad Gita)',
    era: 'c. 5th–2nd century BC (composition)',
    tradition: 'Hindu Philosophy / Vedanta',
    description:
      'The Bhagavad Gita ("Song of God") is a 700-verse Hindu scripture that is part of the Mahabharata. It presents the teachings of Lord Krishna to the warrior Arjuna on the battlefield, addressing duty, action, devotion, knowledge, and liberation.',
    keyTeachings: [
      'Karma Yoga: Perform action without attachment to results',
      'Bhakti Yoga: Devotion to God as a path to liberation',
      'Jnana Yoga: Knowledge and discrimination lead to liberation',
      'Dharma: Fulfill your duty according to your nature and role',
      'The Self (Atman) is eternal and indestructible',
      'Equanimity: Remain balanced in success and failure, pleasure and pain',
    ],
    keyConcepts: [
      {
        name: 'Nishkama Karma (Desireless Action)',
        explanation:
          'Perform your duties without attachment to the fruits of action. "You have the right to work, but never to the fruit of work." This leads to liberation while remaining engaged in the world.',
        relatedTerms: ['karma yoga', 'detachment', 'selfless action'],
      },
      {
        name: 'The Three Gunas',
        explanation:
          'All of nature is composed of three qualities: Sattva (purity, harmony), Rajas (passion, activity), and Tamas (inertia, darkness). Liberation involves transcending all three.',
        relatedTerms: ['sattva', 'rajas', 'tamas', 'prakriti'],
      },
      {
        name: 'Atman and Brahman',
        explanation:
          'The individual self (Atman) is eternal and identical with the ultimate reality (Brahman). The body dies, but the Self is never born and never dies.',
        relatedTerms: ['soul', 'Self', 'ultimate reality', 'immortality'],
      },
      {
        name: 'Bhakti (Devotion)',
        explanation:
          'Loving devotion to God is the most accessible path to liberation. "Fix your mind on Me, be devoted to Me, worship Me, bow down to Me—and you shall come to Me."',
        relatedTerms: ['devotion', 'surrender', 'divine love'],
      },
      {
        name: 'Yoga (Union)',
        explanation:
          'Yoga means union with the divine. The Gita presents multiple paths: Karma Yoga (action), Bhakti Yoga (devotion), Jnana Yoga (knowledge), and Raja Yoga (meditation).',
        relatedTerms: ['paths to liberation', 'moksha', 'spiritual practice'],
      },
    ],
    notableWorks: ['Bhagavad Gita (as part of the Mahabharata)'],
    textSources: [
      {
        id: 'gita-song-celestial',
        title: 'The Song Celestial (Bhagavad Gita)',
        url: 'https://www.gutenberg.org/cache/epub/2388/pg2388.txt',
        format: 'txt',
        description: "Edwin Arnold's poetic translation of the Bhagavad Gita",
      },
      {
        id: 'gita-mahabharata',
        title: 'The Mahabharata (containing the Gita)',
        url: 'https://www.gutenberg.org/cache/epub/15474/pg15474.txt',
        format: 'txt',
        description: 'The great Indian epic containing the Bhagavad Gita',
      },
    ],
    keyExcerpts: [
      {
        work: 'Bhagavad Gita, Chapter 2',
        passage:
          'The Self is never born, nor does it die at any time. It is unborn, eternal, permanent, and primeval. The Self is not slain when the body is slain.',
        context: 'Krishna teaches Arjuna about the immortality of the Self',
      },
      {
        work: 'Bhagavad Gita, Chapter 2',
        passage:
          'You have the right to work only, but never to its fruits. Let not the fruits of action be your motive, nor let your attachment be to inaction.',
        context: 'The central teaching on karma yoga',
      },
      {
        work: 'Bhagavad Gita, Chapter 11',
        passage: 'I am become Death, the destroyer of worlds.',
        context:
          'Krishna reveals his cosmic form (later quoted by Oppenheimer)',
      },
    ],
    famousQuotes: [
      'You have the right to work, but never to the fruit of work.',
      'The soul is neither born, and nor does it die.',
      'Reshape yourself through the power of your will.',
      'A person can rise through the efforts of their own mind.',
      'Change is the law of the universe.',
      'Set your heart upon your work but never its reward.',
    ],
    areasOfExpertise: [
      'duty',
      'action without attachment',
      'devotion',
      'self-knowledge',
      'yoga',
      'liberation',
      'dharma',
    ],
  },
};
