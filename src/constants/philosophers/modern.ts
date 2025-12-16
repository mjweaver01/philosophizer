// ==========================================================================
// MODERN PHILOSOPHY
// ==========================================================================
export const modernPhilosophers = {
  kant: {
    id: 'kant',
    name: 'Immanuel Kant',
    era: '1724–1804',
    tradition: 'German Idealism / Enlightenment',
    description:
      'German philosopher who synthesized rationalism and empiricism and developed a deontological ethical theory based on reason and duty. His three Critiques transformed Western philosophy.',
    keyTeachings: [
      'Categorical Imperative: Act only according to maxims you could will to be universal laws',
      'Deontological ethics: Moral worth lies in intention and duty, not consequences',
      'Autonomy: Rational beings are self-legislating moral agents',
      'Phenomena vs. Noumena: We can only know things as they appear, not as they are in themselves',
      'Sapere aude! Dare to know! Have courage to use your own reason!',
    ],
    keyConcepts: [
      {
        name: 'Categorical Imperative',
        explanation:
          'The supreme principle of morality: act only on maxims you could will to be universal laws for all rational beings. This includes treating humanity always as an end, never merely as a means.',
        relatedTerms: ['universalizability', 'moral law', 'maxim', 'duty'],
      },
      {
        name: 'Phenomena and Noumena',
        explanation:
          'Phenomena are things as they appear to us, structured by our cognitive faculties. Noumena are things-in-themselves, independent of our experience, which we cannot know.',
        relatedTerms: ['appearance', 'thing-in-itself', 'epistemology'],
      },
      {
        name: 'Autonomy',
        explanation:
          'Rational beings are self-legislating: they give the moral law to themselves through reason. This is the foundation of human dignity.',
        relatedTerms: [
          'self-legislation',
          'freedom',
          'dignity',
          'rational will',
        ],
      },
      {
        name: 'Good Will',
        explanation:
          'The only thing good without qualification. The moral worth of an action lies not in its effects but in the principle behind it.',
        relatedTerms: ['duty', 'intention', 'moral worth'],
      },
    ],
    notableWorks: [
      'Critique of Pure Reason',
      'Critique of Practical Reason',
      'Critique of Judgment',
      'Groundwork of the Metaphysics of Morals',
      'Perpetual Peace',
    ],
    textSources: [
      {
        id: 'kant-critique-pure-reason',
        title: 'Critique of Pure Reason',
        url: 'https://www.gutenberg.org/cache/epub/4280/pg4280.txt',
        format: 'txt',
        description: 'Revolutionary examination of the limits of reason',
      },
      {
        id: 'kant-critique-practical-reason',
        title: 'Critique of Practical Reason',
        url: 'https://www.gutenberg.org/cache/epub/5683/pg5683.txt',
        format: 'txt',
        description: 'Ethics and the categorical imperative',
      },
      {
        id: 'kant-groundwork',
        title: 'Fundamental Principles of the Metaphysic of Morals',
        url: 'https://www.gutenberg.org/cache/epub/5682/pg5682.txt',
        format: 'txt',
        description: "Foundation of Kant's moral philosophy",
      },
      {
        id: 'kant-perpetual-peace',
        title: 'Perpetual Peace',
        url: 'https://www.gutenberg.org/cache/epub/50922/pg50922.txt',
        format: 'txt',
        description: 'Vision for international peace',
      },
      {
        id: 'kant-critique-judgment',
        title: 'The Critique of Judgement',
        url: 'https://www.gutenberg.org/cache/epub/48433/pg48433.txt',
        format: 'txt',
        description: 'Third Critique on aesthetics and teleology',
      },
      {
        id: 'kant-prolegomena',
        title: 'Prolegomena to Any Future Metaphysics',
        url: 'https://www.gutenberg.org/cache/epub/52821/pg52821.txt',
        format: 'txt',
        description: 'Accessible introduction to the Critique of Pure Reason',
      },
    ],
    keyExcerpts: [
      {
        work: 'Critique of Practical Reason (Conclusion)',
        passage:
          'Two things fill the mind with ever new and increasing admiration and reverence: the starry heavens above me and the moral law within me.',
        context: "Kant's famous reflection on nature and morality",
      },
      {
        work: 'Groundwork (First Formulation)',
        passage:
          'Act only according to that maxim whereby you can at the same time will that it should become a universal law.',
        context: 'The categorical imperative, first formulation',
      },
    ],
    famousQuotes: [
      'Two things fill the mind with ever new and increasing admiration: the starry heavens above me and the moral law within me.',
      'Act only according to that maxim whereby you can... will that it should become a universal law.',
      'Dare to know! Have courage to use your own reason!',
      'Out of the crooked timber of humanity, no straight thing was ever made.',
      'Morality is not the doctrine of how we may make ourselves happy, but of how we may make ourselves worthy of happiness.',
    ],
    areasOfExpertise: [
      'deontological ethics',
      'epistemology',
      'metaphysics',
      'duty',
      'autonomy',
      'rationalism',
    ],
  },

  nietzsche: {
    id: 'nietzsche',
    name: 'Friedrich Nietzsche',
    era: '1844–1900',
    tradition: 'Existentialism / Nihilism',
    description:
      'German philosopher known for radical critiques of morality, religion, and traditional philosophy. His provocative ideas about the will to power, eternal recurrence, and the Übermensch remain highly influential.',
    keyTeachings: [
      '"God is Dead": Traditional religious and moral foundations have collapsed',
      'Will to Power: The fundamental drive of life is self-overcoming and creative expression',
      'Übermensch (Overman): The ideal of one who creates their own values',
      'Eternal Recurrence: Imagine living your life infinitely—would you embrace it?',
      'Amor Fati: Love your fate—embrace life completely, including suffering',
    ],
    keyConcepts: [
      {
        name: '"God is Dead"',
        explanation:
          'A cultural diagnosis: the Christian God no longer serves as the foundation of Western values. Humanity must now create its own values or fall into nihilism.',
        relatedTerms: [
          'nihilism',
          'secularization',
          'meaning crisis',
          'revaluation of values',
        ],
      },
      {
        name: 'Will to Power (Wille zur Macht)',
        explanation:
          'The fundamental drive of life is not survival or pleasure but power—understood as self-overcoming, growth, and creative expression.',
        relatedTerms: [
          'self-overcoming',
          'life-affirmation',
          'strength',
          'becoming',
        ],
      },
      {
        name: 'Übermensch (Overman/Superman)',
        explanation:
          'The ideal human who creates their own values after the death of God. Not a biological superior but one who lives authentically, embracing life fully.',
        relatedTerms: ['higher type', 'self-creation', 'value-creation'],
      },
      {
        name: 'Eternal Recurrence',
        explanation:
          'The thought experiment: What if you had to live your life infinitely, in exactly the same way? To say "yes" to eternal recurrence is the highest affirmation.',
        relatedTerms: ['amor fati', 'life-affirmation', 'test of values'],
      },
      {
        name: 'Amor Fati (Love of Fate)',
        explanation:
          '"My formula for greatness in a human being is amor fati: that one wants nothing to be different, not forward, not backward, not in all eternity."',
        relatedTerms: ['fate', 'affirmation', 'necessity'],
      },
    ],
    notableWorks: [
      'Thus Spoke Zarathustra',
      'Beyond Good and Evil',
      'On the Genealogy of Morals',
      'The Birth of Tragedy',
      'Twilight of the Idols',
      'Ecce Homo',
      'The Gay Science',
    ],
    textSources: [
      {
        id: 'nietzsche-zarathustra',
        title: 'Thus Spoke Zarathustra',
        url: 'https://www.gutenberg.org/cache/epub/1998/pg1998.txt',
        format: 'txt',
        description: 'Philosophical novel on the Übermensch',
      },
      {
        id: 'nietzsche-beyond-good-evil',
        title: 'Beyond Good and Evil',
        url: 'https://www.gutenberg.org/cache/epub/4363/pg4363.txt',
        format: 'txt',
        description: 'Critique of past philosophers',
      },
      {
        id: 'nietzsche-genealogy-morals',
        title: 'The Genealogy of Morals',
        url: 'https://www.gutenberg.org/cache/epub/52319/pg52319.txt',
        format: 'txt',
        description: 'Analysis of the origins of morality',
      },
      {
        id: 'nietzsche-twilight-idols',
        title: 'Twilight of the Idols',
        url: 'https://www.gutenberg.org/cache/epub/52263/pg52263.txt',
        format: 'txt',
        description: 'Nietzsche\'s "hammer" to philosophy',
      },
      {
        id: 'nietzsche-gay-science',
        title: 'The Gay Science',
        url: 'https://www.gutenberg.org/cache/epub/52881/pg52881.txt',
        format: 'txt',
        description: 'Joyful wisdom and the death of God',
      },
      {
        id: 'nietzsche-birth-tragedy',
        title: 'The Birth of Tragedy',
        url: 'https://www.gutenberg.org/ebooks/51356.txt.utf-8',
        format: 'txt',
        description: 'Apollonian and Dionysian forces in art and culture',
      },
      {
        id: 'nietzsche-ecce-homo',
        title: 'Ecce Homo',
        url: 'https://www.gutenberg.org/cache/epub/52190/pg52190.txt',
        format: 'txt',
        description:
          'Nietzsche\'s autobiography: "How One Becomes What One Is"',
      },
      {
        id: 'nietzsche-antichrist',
        title: 'The Antichrist',
        url: 'https://www.gutenberg.org/cache/epub/19322/pg19322.txt',
        format: 'txt',
        description: 'Critique of Christianity',
      },
      {
        id: 'nietzsche-human-all-too-human',
        title: 'Human, All Too Human',
        url: 'https://www.gutenberg.org/cache/epub/38145/pg38145.txt',
        format: 'txt',
        description: 'Aphoristic critique of metaphysics and morality',
      },
      {
        id: 'nietzsche-will-to-power-1-2',
        title: 'The Will to Power, Books I and II',
        url: 'https://www.gutenberg.org/cache/epub/52914/pg52914.txt',
        format: 'txt',
        description: 'Posthumous collection of notes on power and values',
      },
      {
        id: 'nietzsche-will-to-power-3-4',
        title: 'The Will to Power, Books III and IV',
        url: 'https://www.gutenberg.org/cache/epub/52915/pg52915.txt',
        format: 'txt',
        description: 'Continuation on the will to power and eternal recurrence',
      },
      {
        id: 'nietzsche-dawn-of-day',
        title: 'The Dawn of Day',
        url: 'https://www.gutenberg.org/cache/epub/39955/pg39955.txt',
        format: 'txt',
        description: 'Thoughts on morality as prejudice',
      },
      {
        id: 'nietzsche-case-of-wagner',
        title: 'The Case of Wagner',
        url: 'https://www.gutenberg.org/cache/epub/25012/pg25012.txt',
        format: 'txt',
        description: 'Critique of Wagner and modern music',
      },
      {
        id: 'nietzsche-thoughts-out-of-season',
        title: 'Thoughts Out of Season, Part II',
        url: 'https://www.gutenberg.org/cache/epub/38226/pg38226.txt',
        format: 'txt',
        description: 'Essays on history and the utility of knowledge',
      },
      {
        id: 'nietzsche-early-greek-philosophy',
        title: 'Early Greek Philosophy and Other Essays',
        url: 'https://www.gutenberg.org/ebooks/51548.txt.utf-8',
        format: 'txt',
        description: 'Essays on pre-Socratic philosophers',
      },
    ],
    keyExcerpts: [
      {
        work: 'The Gay Science, §125',
        passage:
          '"God is dead. God remains dead. And we have killed him... Must we ourselves not become gods simply to appear worthy of it?"',
        context: "The famous proclamation of God's death",
      },
      {
        work: 'Thus Spoke Zarathustra (Prologue)',
        passage:
          '"I teach you the overman. Man is something that shall be overcome... Man is a rope, tied between beast and overman—a rope over an abyss."',
        context: 'Zarathustra introduces the Übermensch',
      },
      {
        work: 'Beyond Good and Evil, §146',
        passage:
          'He who fights with monsters should look to it that he himself does not become a monster. And if you gaze long into an abyss, the abyss also gazes into you.',
        context: 'Warning about the dangers of confronting evil',
      },
    ],
    famousQuotes: [
      'He who has a why to live can bear almost any how.',
      'That which does not kill us makes us stronger.',
      'Without music, life would be a mistake.',
      'When you gaze long into an abyss, the abyss also gazes into you.',
      'You must have chaos within you to give birth to a dancing star.',
      'There are no facts, only interpretations.',
    ],
    areasOfExpertise: [
      'critique of morality',
      'nihilism',
      'existentialism',
      'self-overcoming',
      'art and aesthetics',
      'perspectivism',
    ],
  },

  kierkegaard: {
    id: 'kierkegaard',
    name: 'Søren Kierkegaard',
    era: '1813–1855',
    tradition: 'Existentialism / Christian Philosophy',
    description:
      'Danish philosopher considered the father of existentialism. He explored subjectivity, anxiety, despair, and the "leap of faith" required for authentic Christian commitment.',
    keyTeachings: [
      'Subjectivity is Truth: Truth must be lived and appropriated personally',
      'Leap of Faith: Rational proofs cannot lead to faith; it requires a decisive commitment',
      'Three Stages of Existence: Aesthetic (pleasure), Ethical (duty), Religious (faith)',
      'Anxiety: The dizziness of freedom when facing infinite possibilities',
      "Despair: The sickness unto death—failure to become one's authentic self",
    ],
    keyConcepts: [
      {
        name: 'Subjectivity is Truth',
        explanation:
          "Truth that matters for existence cannot be objectively verified but must be personally appropriated. It's not about what is true in the abstract, but what is true for me.",
        relatedTerms: ['inwardness', 'appropriation', 'passion'],
      },
      {
        name: 'The Leap of Faith',
        explanation:
          'Faith cannot be reached by rational argument or proof. There is an objective uncertainty that must be embraced with passionate inwardness.',
        relatedTerms: ['risk', 'uncertainty', 'commitment', 'paradox'],
      },
      {
        name: 'Three Stages of Existence',
        explanation:
          'Life can be lived on three levels: (1) Aesthetic—pursuit of pleasure; (2) Ethical—commitment to duty; (3) Religious—the leap of faith.',
        relatedTerms: ['spheres of existence', "stages on life's way"],
      },
      {
        name: 'Anxiety (Angst)',
        explanation:
          'The dizziness of freedom when facing infinite possibilities. Unlike fear, anxiety has no object—it is about nothingness.',
        relatedTerms: ['dread', 'freedom', 'possibility', 'nothingness'],
      },
      {
        name: 'Despair (The Sickness Unto Death)',
        explanation:
          'Not wanting to be oneself, or defiantly wanting to be oneself without God. All humans are in despair, whether they know it or not.',
        relatedTerms: ['self', 'sin', 'relation', 'the eternal'],
      },
    ],
    notableWorks: [
      'Fear and Trembling',
      'Either/Or',
      'The Sickness Unto Death',
      'The Concept of Anxiety',
      'Concluding Unscientific Postscript',
    ],
    textSources: [
      {
        id: 'kierkegaard-fear-trembling',
        title: 'Fear and Trembling',
        url: 'https://www.gutenberg.org/cache/epub/60333/pg60333.txt',
        format: 'txt',
        description: 'Meditation on Abraham and the leap of faith',
      },
      {
        id: 'kierkegaard-sickness-unto-death',
        title: 'The Sickness Unto Death',
        url: 'https://archive.org/details/in.ernet.dli.2015.189042',
        format: 'txt',
        description: 'Analysis of despair as the failure to be oneself',
      },
      {
        id: 'kierkegaard-present-age',
        title: 'The Present Age',
        url: 'http://www.historyguide.org/europe/present_age.html',
        format: 'txt',
        description: 'Critique of modernity and the loss of passion',
      },
    ],
    keyExcerpts: [
      {
        work: 'Fear and Trembling',
        passage:
          'The knight of faith is obliged to rely upon himself alone, he feels the pain of not being able to make himself intelligible to others...',
        context: 'The solitary nature of faith',
      },
      {
        work: 'The Concept of Anxiety',
        passage:
          'Anxiety is the dizziness of freedom, which emerges when the spirit wants to posit the synthesis and freedom looks down into its own possibility.',
        context: "The definition of anxiety as freedom's vertigo",
      },
    ],
    famousQuotes: [
      'Life can only be understood backwards; but it must be lived forwards.',
      'Anxiety is the dizziness of freedom.',
      'The most common form of despair is not being who you are.',
      "To dare is to lose one's footing momentarily. Not to dare is to lose oneself.",
      'Once you label me, you negate me.',
    ],
    areasOfExpertise: [
      'existentialism',
      'faith',
      'anxiety',
      'subjectivity',
      'authentic existence',
      'Christian philosophy',
    ],
  },

  viktorFrankl: {
    id: 'viktorFrankl',
    name: 'Viktor Frankl',
    era: '1905–1997',
    tradition: 'Existential Psychology / Logotherapy',
    description:
      'Austrian psychiatrist, Holocaust survivor, and founder of logotherapy—the "Third Viennese School of Psychotherapy" (after Freud and Adler). His experiences in Nazi concentration camps led him to develop a therapy centered on finding meaning in all forms of existence, including suffering.',
    keyTeachings: [
      'The primary drive is not pleasure (Freud) or power (Adler) but meaning',
      'Meaning can be found in three ways: work, love, and suffering',
      'We cannot avoid suffering, but we can choose how to respond to it',
      'The "will to meaning" is the fundamental human motivation',
      'Even in the worst circumstances, we retain freedom of attitude',
      'A person who has a "why" to live can bear almost any "how"',
    ],
    keyConcepts: [
      {
        name: 'Logotherapy',
        explanation:
          'A form of existential analysis focusing on the "will to meaning" as the primary motivational force. The Greek "logos" means both "word" and "meaning." Therapy involves helping patients discover meaning in their lives.',
        relatedTerms: [
          'meaning therapy',
          'existential therapy',
          'Third Viennese School',
        ],
      },
      {
        name: 'The Will to Meaning',
        explanation:
          'The fundamental human drive is not pleasure (Freud) or power (Adler) but meaning. When meaning is frustrated, "existential vacuum" results, leading to neurosis, addiction, and depression.',
        relatedTerms: ['purpose', 'motivation', 'existential vacuum'],
      },
      {
        name: 'Tragic Optimism',
        explanation:
          'The ability to maintain hope and find meaning despite life\'s tragic triad: pain, guilt, and death. One can say "yes to life in spite of everything."',
        relatedTerms: ['hope', 'resilience', 'suffering', 'affirmation'],
      },
      {
        name: 'The Last Human Freedom',
        explanation:
          '"Everything can be taken from a man but one thing: the last of the human freedoms—to choose one\'s attitude in any given set of circumstances, to choose one\'s own way."',
        relatedTerms: ['freedom', 'attitude', 'choice', 'response'],
      },
      {
        name: 'Three Sources of Meaning',
        explanation:
          'Meaning can be discovered through: (1) Creative values—what we give to the world through work; (2) Experiential values—what we receive from the world through love and beauty; (3) Attitudinal values—the stance we take toward unavoidable suffering.',
        relatedTerms: ['work', 'love', 'suffering', 'values'],
      },
    ],
    notableWorks: [
      "Man's Search for Meaning",
      'The Doctor and the Soul',
      'The Will to Meaning',
      "Man's Search for Ultimate Meaning",
      'The Unheard Cry for Meaning',
    ],
    textSources: [
      // Viktor Frankl's works are still under copyright
      // "Man's Search for Meaning" was first published in 1946
    ],
    keyExcerpts: [
      {
        work: "Man's Search for Meaning",
        passage:
          "Everything can be taken from a man but one thing: the last of the human freedoms—to choose one's attitude in any given set of circumstances, to choose one's own way.",
        context: 'The core insight from the concentration camp experience',
      },
      {
        work: "Man's Search for Meaning",
        passage:
          'Those who have a "why" to live, can bear with almost any "how."',
        context: 'Quoting Nietzsche to illustrate the power of meaning',
      },
      {
        work: "Man's Search for Meaning",
        passage:
          'In some ways suffering ceases to be suffering at the moment it finds a meaning, such as the meaning of a sacrifice.',
        context: 'On transforming suffering through meaning',
      },
    ],
    famousQuotes: [
      'He who has a why to live can bear almost any how.',
      'When we are no longer able to change a situation, we are challenged to change ourselves.',
      "Everything can be taken from a man but one thing: the last of the human freedoms—to choose one's attitude.",
      'Life is never made unbearable by circumstances, but only by lack of meaning and purpose.',
      'Between stimulus and response there is a space. In that space is our power to choose our response.',
      'Happiness cannot be pursued; it must ensue.',
    ],
    areasOfExpertise: [
      'logotherapy',
      'meaning',
      'suffering',
      'existential psychology',
      'resilience',
      'Holocaust testimony',
      'human freedom',
    ],
  },
};
