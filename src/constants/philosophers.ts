/**
 * Unified Philosopher Constants
 *
 * This file contains all philosopher/theologian data including:
 * - Biographical information
 * - Key teachings and concepts
 * - Primary source texts with Gutenberg URLs
 * - Key excerpts and quotes
 *
 * Used by both the philosopher tools and the RAG indexing system.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface TextSource {
  id: string;
  title: string;
  url: string;
  format: 'txt' | 'html';
  description?: string;
}

export interface KeyConcept {
  name: string;
  explanation: string;
  relatedTerms?: string[];
}

export interface KeyExcerpt {
  work: string;
  passage: string;
  context?: string;
}

export interface Philosopher {
  id: string;
  name: string;
  era: string;
  tradition: string;
  description: string;
  keyTeachings: string[];
  keyConcepts: KeyConcept[];
  notableWorks: string[];
  textSources: TextSource[];
  keyExcerpts: KeyExcerpt[];
  famousQuotes: string[];
  areasOfExpertise: string[];
}

// ============================================================================
// PHILOSOPHER DATA
// ============================================================================

export const PHILOSOPHERS: Record<string, Philosopher> = {
  // ==========================================================================
  // ANCIENT GREEK PHILOSOPHY
  // ==========================================================================

  aristotle: {
    id: 'aristotle',
    name: 'Aristotle',
    era: '384–322 BC',
    tradition: 'Ancient Greek Philosophy',
    description:
      'Greek philosopher and polymath who made foundational contributions to logic, metaphysics, ethics, biology, and political theory. Student of Plato and tutor to Alexander the Great.',
    keyTeachings: [
      'The Golden Mean: Virtue lies between extremes of excess and deficiency',
      'Eudaimonia (flourishing) as the highest human good, achieved through virtuous activity',
      'Four Causes: Material, Formal, Efficient, and Final causes explain why things exist',
      'The Unmoved Mover: An eternal, perfect being that is the ultimate cause of motion',
      'Humans are political animals (zoon politikon) meant to live in communities',
      'Practical wisdom (phronesis) is essential for ethical decision-making',
      'Habituation: Virtue is developed through repeated practice, not just knowledge',
    ],
    keyConcepts: [
      {
        name: 'Eudaimonia',
        explanation:
          "Often translated as 'happiness' or 'flourishing,' eudaimonia is the highest human good. It is not a fleeting feeling but a state of living well and doing well throughout one's life. Achieved through virtuous activity in accordance with reason.",
        relatedTerms: ['flourishing', 'well-being', 'the good life'],
      },
      {
        name: 'The Golden Mean (Mesotes)',
        explanation:
          'Virtue is a mean between two extremes—excess and deficiency. Courage, for example, is the mean between recklessness (excess) and cowardice (deficiency). The mean is relative to the individual and situation.',
        relatedTerms: ['moderation', 'balance', 'virtue as mean'],
      },
      {
        name: 'Phronesis (Practical Wisdom)',
        explanation:
          'The intellectual virtue of knowing how to act well in particular circumstances. Unlike theoretical wisdom (sophia), phronesis is concerned with practical matters—deliberating well about what conduces to the good life.',
        relatedTerms: ['prudence', 'practical reason', 'deliberation'],
      },
      {
        name: 'Four Causes',
        explanation:
          'Everything has four causes: Material (what it is made of), Formal (its form or essence), Efficient (what brought it about), and Final (its purpose or telos). Understanding something fully requires knowing all four.',
        relatedTerms: ['causation', 'explanation', 'telos'],
      },
      {
        name: 'Entelechy',
        explanation:
          'The condition of a thing whose essence is fully realized; actuality as opposed to potentiality. A thing reaches its entelechy when it fulfills its natural purpose.',
        relatedTerms: ['actuality', 'potentiality', 'fulfillment'],
      },
    ],
    notableWorks: [
      'Nicomachean Ethics',
      'Politics',
      'Metaphysics',
      'Poetics',
      'Physics',
      'Categories',
      'Prior Analytics',
      'De Anima (On the Soul)',
      'Rhetoric',
    ],
    textSources: [
      {
        id: 'aristotle-nicomachean-ethics',
        title: 'Nicomachean Ethics',
        url: 'https://www.gutenberg.org/cache/epub/8438/pg8438.txt',
        format: 'txt',
        description: 'Foundational work on virtue ethics and human flourishing',
      },
      {
        id: 'aristotle-politics',
        title: 'Politics',
        url: 'https://www.gutenberg.org/cache/epub/6762/pg6762.txt',
        format: 'txt',
        description: 'Treatise on political philosophy and the ideal state',
      },
      {
        id: 'aristotle-poetics',
        title: 'Poetics',
        url: 'https://www.gutenberg.org/cache/epub/1974/pg1974.txt',
        format: 'txt',
        description: 'Work on dramatic theory and literary criticism',
      },
      {
        id: 'aristotle-rhetoric',
        title: 'Rhetoric',
        url: 'https://www.gutenberg.org/cache/epub/2154/pg2154.txt',
        format: 'txt',
        description: 'The art of persuasion',
      },
      {
        id: 'aristotle-organon',
        title: 'The Organon (Logic)',
        url: 'https://www.gutenberg.org/cache/epub/46120/pg46120.txt',
        format: 'txt',
        description: "Aristotle's works on logic",
      },
      {
        id: 'aristotle-history-animals',
        title: 'History of Animals',
        url: 'https://www.gutenberg.org/cache/epub/59058/pg59058.txt',
        format: 'txt',
        description: 'Foundational work on zoology and natural history',
      },
      {
        id: 'aristotle-athenian-constitution',
        title: 'The Athenian Constitution',
        url: 'https://www.gutenberg.org/cache/epub/26095/pg26095.txt',
        format: 'txt',
        description: 'Analysis of Athenian political institutions',
      },
      {
        id: 'aristotle-categories',
        title: 'The Categories',
        url: 'https://www.gutenberg.org/cache/epub/6763/pg6763.txt',
        format: 'txt',
        description: 'Foundational work on ontology and classification',
      },
    ],
    keyExcerpts: [
      {
        work: 'Nicomachean Ethics, Book I',
        passage:
          'Every art and every inquiry, and similarly every action and pursuit, is thought to aim at some good; and for this reason the good has rightly been declared to be that at which all things aim.',
        context:
          'Opening lines establishing teleology as foundational to ethics',
      },
      {
        work: 'Nicomachean Ethics, Book II',
        passage:
          'Virtue, then, is a state of character concerned with choice, lying in a mean, i.e., the mean relative to us, this being determined by a rational principle, and by that principle by which the man of practical wisdom would determine it.',
        context: 'The definition of virtue as the mean',
      },
      {
        work: 'Politics, Book I',
        passage:
          'Man is by nature a political animal. And he who by nature and not by mere accident is without a state, is either a bad man or above humanity.',
        context: "Aristotle's famous claim about human social nature",
      },
      {
        work: 'Metaphysics, Book I',
        passage:
          'All men by nature desire to know. An indication of this is the delight we take in our senses.',
        context:
          'Opening of the Metaphysics on the natural human desire for knowledge',
      },
    ],
    famousQuotes: [
      'We are what we repeatedly do. Excellence, then, is not an act, but a habit.',
      'The whole is greater than the sum of its parts.',
      'Knowing yourself is the beginning of all wisdom.',
      'It is the mark of an educated mind to be able to entertain a thought without accepting it.',
      'Happiness depends upon ourselves.',
      'The roots of education are bitter, but the fruit is sweet.',
    ],
    areasOfExpertise: [
      'virtue ethics',
      'logic',
      'metaphysics',
      'politics',
      'biology',
      'rhetoric',
      'human flourishing',
      'aesthetics',
    ],
  },

  plato: {
    id: 'plato',
    name: 'Plato',
    era: '428–348 BC',
    tradition: 'Ancient Greek Philosophy',
    description:
      'Athenian philosopher, student of Socrates, and founder of the Academy. His dialogues explore justice, beauty, equality, and the nature of reality through the Theory of Forms.',
    keyTeachings: [
      'Theory of Forms: Abstract, eternal Forms are the true reality; physical world is mere shadow',
      'The Allegory of the Cave: Enlightenment is escaping illusion to perceive true reality',
      'The tripartite soul: Reason, Spirit, and Appetite must be harmonized',
      'Philosopher-kings should rule, as only they understand the Form of the Good',
      'Knowledge is recollection (anamnesis) of what the soul knew before birth',
      'Justice is harmony—each part fulfilling its proper function',
      'Love (Eros) is a ladder ascending from physical beauty to the Form of Beauty itself',
    ],
    keyConcepts: [
      {
        name: 'Theory of Forms (Ideas)',
        explanation:
          'The physical world is an imperfect copy of a higher realm of eternal, unchanging Forms. The Form of a thing is its perfect essence—the Form of Beauty is perfect beauty itself.',
        relatedTerms: ['Ideas', 'essences', 'universals', 'participation'],
      },
      {
        name: 'The Allegory of the Cave',
        explanation:
          "Prisoners chained in a cave see only shadows on the wall, mistaking them for reality. One prisoner escapes, sees the sun (the Form of the Good), and returns to free others. Represents the philosopher's journey from ignorance to enlightenment.",
        relatedTerms: ['enlightenment', 'education', 'illusion vs reality'],
      },
      {
        name: 'Tripartite Soul',
        explanation:
          'The soul has three parts: Reason (rational, seeks truth), Spirit (emotional, seeks honor), and Appetite (desires, seeks pleasure). Justice in the soul is each part performing its proper function under the rule of reason.',
        relatedTerms: ['psyche', 'harmony', 'internal justice'],
      },
      {
        name: 'Anamnesis (Recollection)',
        explanation:
          'Learning is actually recollection of knowledge the soul possessed before birth. The soul is immortal and has encountered the Forms; education is drawing out this latent knowledge.',
        relatedTerms: ['innate knowledge', 'immortality of soul', 'learning'],
      },
      {
        name: 'The Form of the Good',
        explanation:
          "The highest Form, source of truth and being for all other Forms. Like the sun illuminates the visible world, the Good illuminates the intelligible realm. To know the Good is the philosopher's ultimate goal.",
        relatedTerms: [
          'the sun analogy',
          'ultimate reality',
          'source of being',
        ],
      },
    ],
    notableWorks: [
      'The Republic',
      'Symposium',
      'Phaedo',
      'Phaedrus',
      'Timaeus',
      'Apology',
      'Meno',
      'Theaetetus',
      'Parmenides',
      'Laws',
    ],
    textSources: [
      {
        id: 'plato-republic',
        title: 'The Republic',
        url: 'https://www.gutenberg.org/cache/epub/1497/pg1497.txt',
        format: 'txt',
        description:
          'Masterwork on justice, the ideal state, and the philosopher-king',
      },
      {
        id: 'plato-symposium',
        title: 'Symposium',
        url: 'https://www.gutenberg.org/cache/epub/1600/pg1600.txt',
        format: 'txt',
        description: 'Dialogue on the nature of love (Eros)',
      },
      {
        id: 'plato-phaedo',
        title: 'Phaedo',
        url: 'https://www.gutenberg.org/cache/epub/1658/pg1658.txt',
        format: 'txt',
        description: "On the immortality of the soul; Socrates' final hours",
      },
      {
        id: 'plato-apology',
        title: 'Apology',
        url: 'https://www.gutenberg.org/cache/epub/1656/pg1656.txt',
        format: 'txt',
        description: "Socrates' defense speech at his trial",
      },
      {
        id: 'plato-meno',
        title: 'Meno',
        url: 'https://www.gutenberg.org/cache/epub/1643/pg1643.txt',
        format: 'txt',
        description: 'Dialogue on virtue and the theory of recollection',
      },
      {
        id: 'plato-crito',
        title: 'Crito',
        url: 'https://www.gutenberg.org/cache/epub/1657/pg1657.txt',
        format: 'txt',
        description: 'Dialogue on justice and civil obedience',
      },
      {
        id: 'plato-euthyphro',
        title: 'Euthyphro',
        url: 'https://www.gutenberg.org/cache/epub/1642/pg1642.txt',
        format: 'txt',
        description: 'Dialogue on the nature of piety',
      },
      {
        id: 'plato-phaedrus',
        title: 'Phaedrus',
        url: 'https://www.gutenberg.org/cache/epub/1636/pg1636.txt',
        format: 'txt',
        description: 'Dialogue on rhetoric and the soul',
      },
      {
        id: 'plato-timaeus',
        title: 'Timaeus',
        url: 'https://www.gutenberg.org/cache/epub/1572/pg1572.txt',
        format: 'txt',
        description: 'Cosmology and the creation of the universe',
      },
      {
        id: 'plato-parmenides',
        title: 'Parmenides',
        url: 'https://www.gutenberg.org/cache/epub/1687/pg1687.txt',
        format: 'txt',
        description: 'Critique and defense of the Theory of Forms',
      },
      {
        id: 'plato-laws',
        title: 'Laws',
        url: 'https://www.gutenberg.org/cache/epub/1750/pg1750.txt',
        format: 'txt',
        description: "Plato's final work on political philosophy",
      },
      {
        id: 'plato-gorgias',
        title: 'Gorgias',
        url: 'https://www.gutenberg.org/cache/epub/1672/pg1672.txt',
        format: 'txt',
        description: 'Dialogue on rhetoric and justice',
      },
      {
        id: 'plato-theaetetus',
        title: 'Theaetetus',
        url: 'https://www.gutenberg.org/cache/epub/1726/pg1726.txt',
        format: 'txt',
        description: 'Dialogue on the nature of knowledge',
      },
      {
        id: 'plato-cratylus',
        title: 'Cratylus',
        url: 'https://www.gutenberg.org/cache/epub/1616/pg1616.txt',
        format: 'txt',
        description: 'Dialogue on the correctness of names and language',
      },
      {
        id: 'plato-ion',
        title: 'Ion',
        url: 'https://www.gutenberg.org/cache/epub/1635/pg1635.txt',
        format: 'txt',
        description: 'Dialogue on poetry and divine inspiration',
      },
      {
        id: 'plato-sophist',
        title: 'Sophist',
        url: 'https://www.gutenberg.org/cache/epub/1735/pg1735.txt',
        format: 'txt',
        description:
          'Dialogue on being, non-being, and the nature of the sophist',
      },
      {
        id: 'plato-statesman',
        title: 'Statesman',
        url: 'https://www.gutenberg.org/cache/epub/1738/pg1738.txt',
        format: 'txt',
        description: 'Dialogue on political philosophy and the ideal ruler',
      },
      {
        id: 'plato-protagoras',
        title: 'Protagoras',
        url: 'https://www.gutenberg.org/cache/epub/1591/pg1591.txt',
        format: 'txt',
        description: 'Dialogue on virtue and whether it can be taught',
      },
      {
        id: 'plato-critias',
        title: 'Critias',
        url: 'https://www.gutenberg.org/cache/epub/1571/pg1571.txt',
        format: 'txt',
        description: 'Dialogue on the legend of Atlantis',
      },
      {
        id: 'plato-philebus',
        title: 'Philebus',
        url: 'https://www.gutenberg.org/cache/epub/1744/pg1744.txt',
        format: 'txt',
        description: 'Dialogue on pleasure and the good life',
      },
      {
        id: 'plato-charmides',
        title: 'Charmides',
        url: 'https://www.gutenberg.org/cache/epub/1580/pg1580.txt',
        format: 'txt',
        description: 'Dialogue on temperance and self-knowledge',
      },
      {
        id: 'plato-lysis',
        title: 'Lysis',
        url: 'https://www.gutenberg.org/cache/epub/1579/pg1579.txt',
        format: 'txt',
        description: 'Dialogue on the nature of friendship',
      },
      {
        id: 'plato-laches',
        title: 'Laches',
        url: 'https://www.gutenberg.org/cache/epub/1584/pg1584.txt',
        format: 'txt',
        description: 'Dialogue on courage and military virtue',
      },
    ],
    keyExcerpts: [
      {
        work: 'Republic, Book VII (Allegory of the Cave)',
        passage:
          'Behold! human beings living in an underground den, which has a mouth open towards the light... here they have been from their childhood, and have their legs and necks chained so that they cannot move, and can only see before them.',
        context: "The beginning of Plato's most famous allegory",
      },
      {
        work: 'Apology',
        passage: 'The unexamined life is not worth living for a human being.',
        context: "Socrates' famous declaration at his trial",
      },
      {
        work: 'Meno',
        passage:
          'The soul, then, as being immortal, and having been born again many times... has knowledge of them all... all enquiry and all learning is but recollection.',
        context: 'The doctrine of anamnesis (recollection)',
      },
    ],
    famousQuotes: [
      'The measure of a man is what he does with power.',
      'Be kind, for everyone you meet is fighting a hard battle.',
      'Wise men speak because they have something to say; fools because they have to say something.',
      'The first and greatest victory is to conquer yourself.',
      'Opinion is the medium between knowledge and ignorance.',
    ],
    areasOfExpertise: [
      'metaphysics',
      'epistemology',
      'political philosophy',
      'ethics',
      'aesthetics',
      'love and beauty',
      'education',
      'immortality of the soul',
    ],
  },

  socrates: {
    id: 'socrates',
    name: 'Socrates',
    era: '470–399 BC',
    tradition: 'Ancient Greek Philosophy',
    description:
      'Athenian philosopher credited as a founder of Western philosophy. Known for the Socratic method of questioning and his commitment to truth over personal safety.',
    keyTeachings: [
      'The Socratic Method: Knowledge emerges through questioning assumptions',
      '"I know that I know nothing" (Socratic ignorance) is the beginning of wisdom',
      'The unexamined life is not worth living',
      'Virtue is knowledge: No one does evil willingly; wrongdoing stems from ignorance',
      'Care of the soul is more important than wealth, honor, or reputation',
    ],
    keyConcepts: [
      {
        name: 'The Socratic Method (Elenchus)',
        explanation:
          "A form of cooperative argumentative dialogue. Through asking and answering questions, Socrates would expose contradictions in the interlocutor's beliefs, leading them to acknowledge their ignorance and seek true knowledge.",
        relatedTerms: ['dialectic', 'maieutics', 'cross-examination'],
      },
      {
        name: 'Socratic Ignorance',
        explanation:
          '"I know that I know nothing" — awareness of one\'s own ignorance is the first step toward wisdom.',
        relatedTerms: ['humility', 'wisdom', 'self-knowledge'],
      },
      {
        name: 'Virtue is Knowledge',
        explanation:
          'No one does evil willingly; wrongdoing stems from ignorance of what is truly good. If one truly knows what is good, one will do it.',
        relatedTerms: ['moral intellectualism', 'akrasia', 'the good'],
      },
      {
        name: 'The Examined Life',
        explanation:
          '"The unexamined life is not worth living." Continuous self-reflection and questioning of one\'s beliefs, values, and actions is essential to living a meaningful human life.',
        relatedTerms: ['self-reflection', 'philosophy as way of life'],
      },
    ],
    notableWorks: [
      "Left no writings; known through Plato's dialogues",
      'Apology (Plato)',
      'Crito (Plato)',
      'Phaedo (Plato)',
      'Memorabilia (Xenophon)',
    ],
    textSources: [
      {
        id: 'xenophon-memorabilia',
        title: 'Memorabilia',
        url: 'https://www.gutenberg.org/cache/epub/1177/pg1177.txt',
        format: 'txt',
        description: "Xenophon's recollections of Socrates",
      },
      // Socrates texts are primarily through Plato - reference plato's sources
    ],
    keyExcerpts: [
      {
        work: 'Apology',
        passage: 'The unexamined life is not worth living for a human being.',
        context:
          'Socrates explains why he cannot stop philosophizing even to save his life',
      },
      {
        work: 'Apology',
        passage:
          'I am wiser than this man, for neither of us appears to know anything great and good; but he fancies he knows something, although he knows nothing; whereas I, as I do not know anything, so I do not fancy I do.',
        context: "Socrates interprets the Oracle's pronouncement",
      },
    ],
    famousQuotes: [
      'The only true wisdom is in knowing you know nothing.',
      'An unexamined life is not worth living.',
      'To find yourself, think for yourself.',
      'I cannot teach anybody anything. I can only make them think.',
      'Education is the kindling of a flame, not the filling of a vessel.',
    ],
    areasOfExpertise: [
      'ethics',
      'epistemology',
      'dialectic method',
      'self-examination',
      'virtue',
      'piety',
      'justice',
    ],
  },

  // ==========================================================================
  // STOIC PHILOSOPHY
  // ==========================================================================

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
        url: 'https://www.gutenberg.org/cache/epub/45109/pg45109.txt',
        format: 'txt',
        description: 'Stoic teachings on living a good life',
      },
      {
        id: 'epictetus-enchiridion',
        title: 'Enchiridion (The Manual)',
        url: 'https://www.gutenberg.org/cache/epub/45139/pg45139.txt',
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
        url: 'https://www.gutenberg.org/cache/epub/64488/pg64488.txt',
        format: 'txt',
        description: 'Moral letters on Stoic wisdom',
      },
      {
        id: 'seneca-shortness-life',
        title: 'On the Shortness of Life',
        url: 'https://www.gutenberg.org/cache/epub/67672/pg67672.txt',
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

  // ==========================================================================
  // CHRISTIAN THEOLOGY
  // ==========================================================================

  paulTheApostle: {
    id: 'paulTheApostle',
    name: 'Paul the Apostle (Saint Paul)',
    era: 'c. 5–64 AD',
    tradition: 'Christian Theology',
    description:
      'Apostle who spread Christianity throughout the Roman Empire. His epistles form a significant portion of the New Testament and shaped Christian theology on grace, faith, and salvation.',
    keyTeachings: [
      'Justification by faith: Salvation comes through faith in Christ, not works of the law',
      "Grace: God's unmerited favor freely given to sinners",
      'The Body of Christ: The Church as one body with many members',
      'The fruit of the Spirit: Love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, self-control',
      'Love as the greatest virtue: "The greatest of these is love"',
    ],
    keyConcepts: [
      {
        name: 'Justification by Faith',
        explanation:
          'Humans are declared righteous before God not through obedience to the Law, but through faith in Jesus Christ. This righteousness is imputed (credited) to believers as a gift.',
        relatedTerms: [
          'righteousness',
          'imputation',
          'faith alone',
          'sola fide',
        ],
      },
      {
        name: 'Grace (Charis)',
        explanation:
          "God's unmerited favor freely given to sinners. Salvation is entirely a gift from God, not something humans can earn or deserve.",
        relatedTerms: ['gift', 'unmerited favor', 'salvation'],
      },
      {
        name: 'The Body of Christ',
        explanation:
          'The Church is one body with many members, each with different spiritual gifts. All believers are united in Christ and interdependent.',
        relatedTerms: ['church', 'unity', 'spiritual gifts', 'charismata'],
      },
      {
        name: 'Union with Christ',
        explanation:
          'Believers are spiritually united with Christ in his death and resurrection. "I have been crucified with Christ. It is no longer I who live, but Christ who lives in me."',
        relatedTerms: ['in Christ', 'dying and rising', 'new creation'],
      },
    ],
    notableWorks: [
      'Romans',
      '1 & 2 Corinthians',
      'Galatians',
      'Ephesians',
      'Philippians',
      'Colossians',
      '1 & 2 Thessalonians',
    ],
    textSources: [
      {
        id: 'bible-kjv-complete',
        title: 'King James Bible (Complete)',
        url: 'https://www.gutenberg.org/cache/epub/10/pg10.txt',
        format: 'txt',
        description: 'Complete King James Version including all epistles',
      },
      {
        id: 'bible-romans',
        title: 'Romans',
        url: 'https://www.gutenberg.org/cache/epub/8053/pg8053.txt',
        format: 'txt',
        description: "Paul's systematic exposition of the gospel",
      },
    ],
    keyExcerpts: [
      {
        work: 'Romans 3:23-24',
        passage:
          'For all have sinned and fall short of the glory of God, and are justified by his grace as a gift, through the redemption that is in Christ Jesus.',
        context: 'Core statement of justification by grace',
      },
      {
        work: '1 Corinthians 13:4-7',
        passage:
          'Love is patient and kind; love does not envy or boast; it is not arrogant or rude... Love bears all things, believes all things, hopes all things, endures all things.',
        context: 'The famous "love chapter"',
      },
      {
        work: 'Galatians 2:20',
        passage:
          'I have been crucified with Christ. It is no longer I who live, but Christ who lives in me.',
        context: 'Union with Christ in death and resurrection',
      },
    ],
    famousQuotes: [
      'For it is by grace you have been saved, through faith—and this is not from yourselves, it is the gift of God.',
      'And now these three remain: faith, hope and love. But the greatest of these is love.',
      'I have been crucified with Christ and I no longer live, but Christ lives in me.',
      'If God is for us, who can be against us?',
      'I can do all things through Christ who strengthens me.',
    ],
    areasOfExpertise: [
      'salvation',
      'grace',
      'faith',
      'Christian ethics',
      'church doctrine',
      'resurrection',
      'spiritual gifts',
    ],
  },

  augustine: {
    id: 'augustine',
    name: 'Augustine of Hippo (Saint Augustine)',
    era: '354–430 AD',
    tradition: 'Christian Philosophy / Patristics',
    description:
      'North African bishop and theologian whose writings shaped Western Christianity. His Confessions is a foundational spiritual autobiography, and City of God addresses the relationship between faith and society.',
    keyTeachings: [
      'Original Sin: All humans inherit a fallen nature from Adam',
      "Divine Grace: Salvation is entirely dependent on God's initiative",
      'Free Will and Evil: Evil is not a substance but a privation of good',
      'The Two Cities: City of God vs. City of Man',
      'Time and Eternity: God exists outside of time; time began with creation',
    ],
    keyConcepts: [
      {
        name: 'Original Sin',
        explanation:
          'All humans inherit a corrupted nature from Adam\'s fall. This "original sin" means humans are born with a tendency toward evil and are unable to save themselves.',
        relatedTerms: ['fall of man', 'inherited guilt', 'concupiscence'],
      },
      {
        name: 'Divine Grace',
        explanation:
          "Salvation is entirely God's gift, not something humans can earn or initiate. Grace is 'prevenient' (goes before human will), 'operative' (works in us), and 'cooperative' (works with us).",
        relatedTerms: ['prevenient grace', 'irresistible grace', 'gift'],
      },
      {
        name: 'Evil as Privation',
        explanation:
          'Evil is not a substance or positive reality but a privation (absence) of good—like darkness is absence of light. God created everything good; evil entered through the misuse of free will.',
        relatedTerms: ['theodicy', 'privatio boni', 'problem of evil'],
      },
      {
        name: 'The Two Cities',
        explanation:
          'Human history is the story of two cities: the City of God (civitas Dei) built on love of God, and the City of Man (civitas terrena) built on love of self.',
        relatedTerms: ['church and state', 'eschatology', 'pilgrimage'],
      },
    ],
    notableWorks: [
      'Confessions',
      'City of God',
      'On Christian Doctrine',
      'On the Trinity',
      'Enchiridion',
    ],
    textSources: [
      {
        id: 'augustine-confessions',
        title: 'Confessions',
        url: 'https://www.gutenberg.org/cache/epub/3296/pg3296.txt',
        format: 'txt',
        description:
          'Spiritual autobiography—perhaps the first in Western literature',
      },
      {
        id: 'augustine-city-of-god',
        title: 'City of God',
        url: 'https://www.gutenberg.org/cache/epub/45304/pg45304.txt',
        format: 'txt',
        description: 'Masterwork on Christianity and society',
      },
      {
        id: 'augustine-enchiridion',
        title: 'Enchiridion (Handbook on Faith, Hope and Love)',
        url: 'https://www.gutenberg.org/cache/epub/27380/pg27380.txt',
        format: 'txt',
        description: 'Concise summary of Christian doctrine',
      },
      {
        id: 'augustine-christian-doctrine',
        title: 'On Christian Doctrine',
        url: 'https://www.gutenberg.org/cache/epub/66442/pg66442.txt',
        format: 'txt',
        description:
          'Guide to interpreting Scripture and teaching Christian truth',
      },
    ],
    keyExcerpts: [
      {
        work: 'Confessions, Book I',
        passage:
          'You have made us for yourself, O Lord, and our hearts are restless until they rest in you.',
        context: 'The famous opening prayer expressing human longing for God',
      },
      {
        work: 'Confessions, Book VIII',
        passage:
          'Late have I loved you, beauty so old and so new: late have I loved you.',
        context: "Augustine's reflection on his long path to conversion",
      },
      {
        work: 'City of God, Book XIV',
        passage:
          'Two cities have been formed by two loves: the earthly by the love of self, even to the contempt of God; the heavenly by the love of God, even to the contempt of self.',
        context: 'The foundational distinction of the two cities',
      },
    ],
    famousQuotes: [
      'Our hearts are restless until they rest in You.',
      'Love, and do what you will.',
      'Faith is to believe what you do not see; the reward of this faith is to see what you believe.',
      "The truth is like a lion. You don't have to defend it. Let it loose. It will defend itself.",
      'Patience is the companion of wisdom.',
    ],
    areasOfExpertise: [
      'original sin',
      'grace',
      'free will',
      'theodicy',
      'Christian philosophy',
      'church and state',
    ],
  },

  thomasAquinas: {
    id: 'thomasAquinas',
    name: 'Thomas Aquinas',
    era: '1225–1274',
    tradition: 'Catholic Scholasticism',
    description:
      'Italian Dominican friar and theologian who synthesized Aristotelian philosophy with Christian doctrine. His Summa Theologica remains foundational in Catholic theology and natural law theory.',
    keyTeachings: [
      'Five Ways: Five proofs for the existence of God',
      'Natural Law: Moral principles discoverable through reason',
      'Faith and Reason: Both are paths to truth; reason supports faith',
      'Grace does not destroy nature, but perfects it',
      'Just War theory: Conditions under which war may be morally permissible',
    ],
    keyConcepts: [
      {
        name: 'The Five Ways (Quinque Viae)',
        explanation:
          "Five arguments for God's existence: (1) Unmoved Mover; (2) First Cause; (3) Necessary Being; (4) Gradation of perfection; (5) Intelligent Design.",
        relatedTerms: [
          'cosmological argument',
          'teleological argument',
          'natural theology',
        ],
      },
      {
        name: 'Natural Law',
        explanation:
          "Moral law is knowable through human reason as participation in God's eternal law. 'Good is to be done and pursued, and evil is to be avoided' is the first precept.",
        relatedTerms: [
          'eternal law',
          'human law',
          'divine law',
          'practical reason',
        ],
      },
      {
        name: 'Grace Perfects Nature',
        explanation:
          'Grace does not destroy or replace nature but elevates and perfects it. Reason is not opposed to faith but leads toward it.',
        relatedTerms: ['nature and grace', 'faith and reason', 'elevation'],
      },
      {
        name: 'Principle of Double Effect',
        explanation:
          'An action with both good and bad effects may be permissible if: (1) the action itself is not evil; (2) the good effect is intended; (3) the bad effect is not the means to the good; (4) there is proportionate reason.',
        relatedTerms: ['intention', 'proportionality', 'moral analysis'],
      },
    ],
    notableWorks: [
      'Summa Theologica',
      'Summa Contra Gentiles',
      'Commentaries on Aristotle',
      'De Ente et Essentia',
    ],
    textSources: [
      {
        id: 'aquinas-summa-part1',
        title: 'Summa Theologica - Part I (Prima Pars)',
        url: 'https://www.gutenberg.org/cache/epub/17611/pg17611.txt',
        format: 'txt',
        description: 'On God and creation',
      },
      {
        id: 'aquinas-summa-part1-2',
        title: 'Summa Theologica - Part I-II (Prima Secundae)',
        url: 'https://www.gutenberg.org/cache/epub/17897/pg17897.txt',
        format: 'txt',
        description: 'On human acts and virtues',
      },
      {
        id: 'aquinas-summa-part2-2',
        title: 'Summa Theologica - Part II-II (Secunda Secundae)',
        url: 'https://www.gutenberg.org/cache/epub/18755/pg18755.txt',
        format: 'txt',
        description: 'On specific virtues and vices',
      },
      {
        id: 'aquinas-summa-part3',
        title: 'Summa Theologica - Part III (Tertia Pars)',
        url: 'https://www.gutenberg.org/cache/epub/19950/pg19950.txt',
        format: 'txt',
        description: 'On Christ and the sacraments',
      },
      {
        id: 'aquinas-summa-contra-gentiles',
        title: 'Summa Contra Gentiles',
        url: 'https://www.gutenberg.org/cache/epub/42814/pg42814.txt',
        format: 'txt',
        description: 'Apologetic work defending Christianity through reason',
      },
    ],
    keyExcerpts: [
      {
        work: 'Summa Theologica I, Q.2, A.3',
        passage:
          'It is certain, and evident to our senses, that in the world some things are in motion... Therefore it is necessary to arrive at a first mover, put in motion by no other; and this everyone understands to be God.',
        context: 'The argument from motion (First Way)',
      },
      {
        work: 'Summa Theologica I-II, Q.94, A.2',
        passage:
          'The first precept of law is that good is to be done and pursued, and evil is to be avoided. All other precepts of the natural law are based upon this.',
        context: 'The foundational principle of natural law',
      },
    ],
    famousQuotes: [
      'To one who has faith, no explanation is necessary. To one without faith, no explanation is possible.',
      'The things that we love tell us what we are.',
      'Grace does not destroy nature, but perfects it.',
      'Beware the man of a single book.',
      'To love is to will the good of the other.',
    ],
    areasOfExpertise: [
      'natural law',
      'proofs of God',
      'faith and reason',
      'ethics',
      'metaphysics',
      'just war theory',
    ],
  },

  martinLuther: {
    id: 'martinLuther',
    name: 'Martin Luther',
    era: '1483–1546',
    tradition: 'Protestant Reformation',
    description:
      'German theologian and Protestant reformer whose Ninety-Five Theses sparked the Protestant Reformation. Emphasized Scripture alone, faith alone, and grace alone as foundations of Christianity.',
    keyTeachings: [
      'Sola Scriptura: Scripture alone is the ultimate authority',
      'Sola Fide: Justification by faith alone, not works',
      'Sola Gratia: Salvation by grace alone',
      'Priesthood of all believers: Every Christian has direct access to God',
      'Two Kingdoms: Distinction between spiritual and temporal authority',
    ],
    keyConcepts: [
      {
        name: 'Sola Scriptura (Scripture Alone)',
        explanation:
          'The Bible is the sole infallible source of authority for Christian faith and practice. Church tradition and papal decrees are subordinate to Scripture.',
        relatedTerms: [
          'biblical authority',
          'Word of God',
          'Reformation principles',
        ],
      },
      {
        name: 'Sola Fide (Faith Alone)',
        explanation:
          "Justification—being declared righteous before God—is received through faith alone, not through works, sacraments, or human merit. This was Luther's 'tower experience' discovery.",
        relatedTerms: ['justification', 'imputed righteousness', 'trust'],
      },
      {
        name: 'Theology of the Cross',
        explanation:
          'God reveals himself not through power and glory (theology of glory) but through suffering, weakness, and the cross. True theology is found in embracing the scandal of the cross.',
        relatedTerms: ['hidden God', 'suffering', 'humility', 'paradox'],
      },
      {
        name: 'Priesthood of All Believers',
        explanation:
          'Every baptized Christian is a priest with direct access to God through Christ. There is no special priestly class mediating between God and believers.',
        relatedTerms: ['universal priesthood', 'vocation', 'lay ministry'],
      },
    ],
    notableWorks: [
      'Ninety-Five Theses',
      'The Bondage of the Will',
      'On the Freedom of a Christian',
      "Luther's Small Catechism",
      'Commentary on Galatians',
    ],
    textSources: [
      {
        id: 'luther-95-theses',
        title: 'Ninety-Five Theses',
        url: 'https://www.gutenberg.org/cache/epub/274/pg274.txt',
        format: 'txt',
        description: 'The document that sparked the Reformation',
      },
      {
        id: 'luther-works-vol1',
        title: 'Works of Martin Luther, Volume I',
        url: 'https://www.gutenberg.org/cache/epub/31604/pg31604.txt',
        format: 'txt',
        description: 'Collection including major treatises',
      },
      {
        id: 'luther-works-vol2',
        title: 'Works of Martin Luther, Volume II',
        url: 'https://www.gutenberg.org/cache/epub/34904/pg34904.txt',
        format: 'txt',
        description: 'Additional treatises and writings',
      },
      {
        id: 'luther-good-works',
        title: 'A Treatise on Good Works',
        url: 'https://www.gutenberg.org/cache/epub/418/pg418.txt',
        format: 'txt',
        description: 'On the nature of good works in Christian faith',
      },
      {
        id: 'luther-translating',
        title: 'An Open Letter on Translating',
        url: 'https://www.gutenberg.org/cache/epub/272/pg272.txt',
        format: 'txt',
        description: 'On translating the Bible into the vernacular',
      },
      {
        id: 'luther-smalcald',
        title: 'The Smalcald Articles',
        url: 'https://www.gutenberg.org/cache/epub/273/pg273.txt',
        format: 'txt',
        description: 'Declaration of Lutheran beliefs',
      },
      {
        id: 'luther-table-talk',
        title: 'Table Talk',
        url: 'https://www.gutenberg.org/cache/epub/9841/pg9841.txt',
        format: 'txt',
        description: "Luther's informal conversations on theology and life",
      },
      {
        id: 'luther-bondage-will',
        title: 'The Bondage of the Will',
        url: 'https://www.gutenberg.org/cache/epub/37380/pg37380.txt',
        format: 'txt',
        description:
          "Luther's response to Erasmus on free will and predestination",
      },
      {
        id: 'luther-large-catechism',
        title: 'The Large Catechism',
        url: 'https://www.gutenberg.org/cache/epub/2601/pg2601.txt',
        format: 'txt',
        description:
          "Luther's comprehensive catechism for teaching Christian doctrine",
      },
    ],
    keyExcerpts: [
      {
        work: 'Ninety-Five Theses (Thesis 1)',
        passage:
          'When our Lord and Master Jesus Christ said, "Repent" (Mt 4:17), he willed the entire life of believers to be one of repentance.',
        context: 'The opening thesis redefining repentance',
      },
      {
        work: 'On the Freedom of a Christian',
        passage:
          'A Christian is a perfectly free lord of all, subject to none. A Christian is a perfectly dutiful servant of all, subject to all.',
        context: "Luther's paradox of Christian freedom and service",
      },
    ],
    famousQuotes: [
      'Here I stand, I can do no other. God help me.',
      "Faith is a living, daring confidence in God's grace.",
      'Even if I knew that tomorrow the world would go to pieces, I would still plant my apple tree.',
      'Peace if possible, truth at all costs.',
      'A mighty fortress is our God, a bulwark never failing.',
    ],
    areasOfExpertise: [
      'reformation theology',
      'biblical interpretation',
      'faith and works',
      'church authority',
      'grace',
      'Christian freedom',
    ],
  },

  johnCalvin: {
    id: 'johnCalvin',
    name: 'John Calvin',
    era: '1509–1564',
    tradition: 'Protestant Reformation / Reformed Theology',
    description:
      "French theologian and pastor who was a principal figure in the development of Reformed Christianity. His Institutes of the Christian Religion is one of the most influential works of Protestant theology, emphasizing God's sovereignty and predestination.",
    keyTeachings: [
      "God's Absolute Sovereignty: God is in complete control of all things",
      'Predestination: God has eternally chosen some for salvation (election)',
      'Total Depravity: Humans are completely corrupted by sin and cannot save themselves',
      'Irresistible Grace: Those whom God has chosen cannot ultimately resist His call',
      'Perseverance of the Saints: True believers will persevere to the end',
    ],
    keyConcepts: [
      {
        name: 'TULIP (Five Points of Calvinism)',
        explanation:
          'Total Depravity, Unconditional Election, Limited Atonement, Irresistible Grace, Perseverance of the Saints. These doctrines summarize Reformed soteriology.',
        relatedTerms: ['Reformed theology', 'doctrines of grace', 'Dort'],
      },
      {
        name: 'Double Predestination',
        explanation:
          "God has not only chosen some for salvation (election) but has also passed over others (reprobation). This is not arbitrary but according to God's just and mysterious will.",
        relatedTerms: ['election', 'reprobation', 'divine decree'],
      },
      {
        name: 'Covenant Theology',
        explanation:
          'God relates to humanity through covenants. The Covenant of Works with Adam and the Covenant of Grace through Christ structure redemptive history.',
        relatedTerms: [
          'covenant of works',
          'covenant of grace',
          'federal theology',
        ],
      },
      {
        name: 'The Third Use of the Law',
        explanation:
          'Beyond revealing sin and restraining evil, the law serves as a guide for Christian living. Believers, freed from condemnation, follow the law out of gratitude.',
        relatedTerms: ['moral law', 'sanctification', 'obedience'],
      },
    ],
    notableWorks: [
      'Institutes of the Christian Religion',
      'Commentaries on the Bible',
      'Commentary on Romans',
      'Treatise on Relics',
      'The Necessity of Reforming the Church',
    ],
    textSources: [
      {
        id: 'calvin-institutes-vol1',
        title: 'Institutes of the Christian Religion, Vol. 1',
        url: 'https://www.gutenberg.org/cache/epub/45315/pg45315.txt',
        format: 'txt',
        description:
          'Foundational systematic theology of Reformed Christianity',
      },
      {
        id: 'calvin-institutes-vol2',
        title: 'Institutes of the Christian Religion, Vol. 2',
        url: 'https://www.gutenberg.org/cache/epub/45001/pg45001.txt',
        format: 'txt',
        description:
          'Continuation of the Institutes covering church and sacraments',
      },
    ],
    keyExcerpts: [
      {
        work: 'Institutes of the Christian Religion, I.1.1',
        passage:
          'Nearly all the wisdom we possess, that is to say, true and sound wisdom, consists of two parts: the knowledge of God and of ourselves.',
        context: 'The famous opening of the Institutes',
      },
      {
        work: 'Institutes, III.21.5',
        passage:
          'By predestination we mean the eternal decree of God, by which he determined with himself whatever he wished to happen with regard to every man.',
        context: 'Definition of predestination',
      },
    ],
    famousQuotes: [
      'There is not one blade of grass, there is no color in this world that is not intended to make us rejoice.',
      'We are nowhere forbidden to laugh, or to be satisfied with food... or to be delighted with music, or to drink wine.',
      "Man's mind is like a store of idolatry and superstition; so much so that if a man believes his own mind it is certain that he will forsake God.",
      'However many blessings we expect from God, His infinite liberality will always exceed all our wishes and our thoughts.',
      'There is no knowing that does not begin with knowing God.',
    ],
    areasOfExpertise: [
      'Reformed theology',
      'predestination',
      'sovereignty of God',
      'church governance',
      'biblical interpretation',
      'systematic theology',
    ],
  },

  huldrychZwingli: {
    id: 'huldrychZwingli',
    name: 'Huldrych Zwingli',
    era: '1484–1531',
    tradition: 'Protestant Reformation / Swiss Reformed',
    description:
      "Swiss reformer and leader of the Reformation in Zurich. He emphasized the authority of Scripture and rejected Catholic practices not explicitly found in the Bible. His views on the Eucharist differed from Luther's, leading to significant theological debate.",
    keyTeachings: [
      'Sola Scriptura: Only what is found in Scripture should be practiced in the church',
      "The Lord's Supper is a memorial, not a physical presence of Christ",
      'Images and icons should be removed from churches',
      'Infant baptism is valid as a sign of the covenant',
      'Church and state should work together for godly society',
    ],
    keyConcepts: [
      {
        name: 'Memorial View of the Eucharist',
        explanation:
          'The Lord\'s Supper is a remembrance of Christ\'s sacrifice, not a physical or spiritual eating of Christ\'s body. "This is my body" means "This signifies my body."',
        relatedTerms: ['symbolic view', 'memorialism', 'sacrament'],
      },
      {
        name: 'Regulative Principle',
        explanation:
          'Only what Scripture explicitly commands or implies for worship is permitted. This led to the removal of organs, images, and elaborate ceremonies from Reformed worship.',
        relatedTerms: ['worship', 'simplicity', 'biblical authority'],
      },
      {
        name: 'Covenant Continuity',
        explanation:
          "The Old and New Testaments are unified by God's one covenant of grace. Infant baptism corresponds to circumcision as the sign of the covenant.",
        relatedTerms: ['paedobaptism', 'covenant sign', 'continuity'],
      },
    ],
    notableWorks: [
      'Commentary on True and False Religion',
      'Sixty-Seven Articles',
      'A Short Christian Instruction',
    ],
    textSources: [
      {
        id: 'zwingli-selected-works',
        title: 'Selected Works of Huldreich Zwingli',
        url: 'https://www.gutenberg.org/cache/epub/46961/pg46961.txt',
        format: 'txt',
        description: "Collection of Zwingli's theological writings",
      },
    ],
    keyExcerpts: [
      {
        work: 'Sixty-Seven Articles, Article 1',
        passage:
          'All who say that the Gospel is invalid without the confirmation of the Church err and slander God.',
        context: 'Asserting the authority of Scripture over Church tradition',
      },
    ],
    famousQuotes: [
      "For God's sake, do not put yourself at odds with the Word of God.",
      'In the matter of baptism, if I may be pardoned for saying it, I can only conclude that all the doctors have been in error from the time of the apostles.',
      'The business of truth is not to be deserted even to the sacrifice of our lives.',
    ],
    areasOfExpertise: [
      'Reformed theology',
      'sacramental theology',
      'church reform',
      'biblical authority',
      'iconoclasm',
    ],
  },

  johnKnox: {
    id: 'johnKnox',
    name: 'John Knox',
    era: '1514–1572',
    tradition: 'Protestant Reformation / Scottish Presbyterianism',
    description:
      'Scottish minister and theologian who led the Protestant Reformation in Scotland. His fiery preaching and writing established the Presbyterian Church of Scotland and influenced Reformed Christianity worldwide.',
    keyTeachings: [
      'The Bible is the sole authority for faith and practice',
      'Worship must be purified of Catholic innovations',
      'The church should be governed by elders (presbyters), not bishops',
      "Christians may resist tyrannical rulers who oppose God's law",
      'Education is essential for a godly society',
    ],
    keyConcepts: [
      {
        name: 'Presbyterian Polity',
        explanation:
          'Church governance by elected elders (presbyters) in graded courts: session, presbytery, synod, and general assembly. No single person holds supreme authority.',
        relatedTerms: ['elders', 'church courts', 'representative government'],
      },
      {
        name: 'Right of Resistance',
        explanation:
          'When rulers command what God forbids or forbid what God commands, lesser magistrates and even the people may resist. Knox argued this especially against Catholic monarchs.',
        relatedTerms: ['tyrannicide', 'political theology', 'covenant'],
      },
      {
        name: 'Book of Common Order',
        explanation:
          "Knox's liturgy for the Scottish church, emphasizing simplicity, biblical preaching, and congregational participation over elaborate ceremony.",
        relatedTerms: ['liturgy', 'worship', 'Scottish Reformation'],
      },
    ],
    notableWorks: [
      'The History of the Reformation of Religion in Scotland',
      'The First Blast of the Trumpet Against the Monstrous Regiment of Women',
      'Book of Common Order',
    ],
    textSources: [
      {
        id: 'knox-reformation-scotland',
        title: 'The History of the Reformation of Religion in Scotland',
        url: 'https://www.gutenberg.org/cache/epub/48131/pg48131.txt',
        format: 'txt',
        description: "Knox's firsthand account of the Scottish Reformation",
      },
    ],
    keyExcerpts: [
      {
        work: 'History of the Reformation',
        passage: 'A man with God is always in the majority.',
        context: "Knox's confidence in divine providence",
      },
    ],
    famousQuotes: [
      'Give me Scotland, or I die!',
      'A man with God is always in the majority.',
      'Lord, give me Scotland or I die.',
      'The fearful will not inherit the kingdom of God.',
    ],
    areasOfExpertise: [
      'Scottish Reformation',
      'Presbyterianism',
      'political theology',
      'church governance',
      'resistance theory',
    ],
  },

  philipMelanchthon: {
    id: 'philipMelanchthon',
    name: 'Philip Melanchthon',
    era: '1497–1560',
    tradition: 'Protestant Reformation / Lutheran Theology',
    description:
      'German reformer, theologian, and educator who was Martin Luther\'s closest collaborator. Known as "Praeceptor Germaniae" (Teacher of Germany), he systematized Lutheran theology and authored the Augsburg Confession.',
    keyTeachings: [
      'Justification by faith alone as the central article of faith',
      'The distinction between Law and Gospel in Scripture',
      'Human reason has a proper but limited role in theology',
      'Classical education serves the church and society',
      'Ecumenical dialogue is valuable for Christian unity',
    ],
    keyConcepts: [
      {
        name: 'Loci Communes (Common Places)',
        explanation:
          'The first systematic presentation of Lutheran theology (1521). Organized around key topics (loci) such as sin, law, grace, and justification.',
        relatedTerms: [
          'systematic theology',
          'doctrinal summary',
          'Reformation',
        ],
      },
      {
        name: 'Law and Gospel',
        explanation:
          'Scripture contains two kinds of words: Law (what God demands) and Gospel (what God gives in Christ). Proper distinction between them is key to sound theology.',
        relatedTerms: ['distinction', 'preaching', 'hermeneutics'],
      },
      {
        name: 'Adiaphora',
        explanation:
          'Matters neither commanded nor forbidden by Scripture (ceremonies, vestments) are "things indifferent." Churches have freedom in these areas.',
        relatedTerms: ['indifferent things', 'church practices', 'freedom'],
      },
    ],
    notableWorks: [
      'Loci Communes',
      'Augsburg Confession',
      'Apology of the Augsburg Confession',
      'Commentary on Romans',
    ],
    textSources: [
      {
        id: 'melanchthon-loci-communes',
        title: 'Loci Communes (Common Places)',
        url: 'https://www.gutenberg.org/cache/epub/56389/pg56389.txt',
        format: 'txt',
        description: 'First systematic theology of the Reformation',
      },
    ],
    keyExcerpts: [
      {
        work: 'Loci Communes',
        passage:
          'To know Christ means to know his benefits, and not as they teach, to reflect upon his natures and the modes of his incarnation.',
        context: "Emphasis on Christ's saving work over abstract speculation",
      },
    ],
    famousQuotes: [
      'To know Christ is to know his benefits.',
      'In essentials, unity; in non-essentials, liberty; in all things, charity.',
      'We are saved by grace alone, but the grace that saves is never alone.',
    ],
    areasOfExpertise: [
      'Lutheran theology',
      'systematic theology',
      'education',
      'ecumenism',
      'biblical interpretation',
    ],
  },

  johnWesley: {
    id: 'johnWesley',
    name: 'John Wesley',
    era: '1703–1791',
    tradition: 'Methodism / Evangelical Christianity',
    description:
      'English cleric and theologian who founded the Methodist movement. His emphasis on personal holiness, evangelism, and social reform transformed English Christianity and spread worldwide.',
    keyTeachings: [
      "Prevenient Grace: God's grace works in all people before conversion",
      'Justification by Faith: Salvation through trusting in Christ alone',
      'The New Birth: A real transformation of the heart by the Holy Spirit',
      'Sanctification: Growing in holiness throughout the Christian life',
      'Entire Sanctification (Christian Perfection): The possibility of perfect love for God and neighbor in this life',
    ],
    keyConcepts: [
      {
        name: 'The Wesleyan Quadrilateral',
        explanation:
          'Four sources of theological reflection: Scripture (primary), Tradition, Reason, and Experience. These guide faithful interpretation and living.',
        relatedTerms: ['theological method', 'authority', 'interpretation'],
      },
      {
        name: 'Prevenient Grace',
        explanation:
          'God\'s grace that "goes before" conversion, enabling fallen humans to respond to the gospel. Without it, no one could seek God.',
        relatedTerms: ['preventing grace', 'enabling grace', 'free will'],
      },
      {
        name: 'Entire Sanctification',
        explanation:
          'The Methodist distinctive that believers can be made perfect in love in this life—not sinless perfection but a heart wholly devoted to God.',
        relatedTerms: ['Christian perfection', 'holiness', 'perfect love'],
      },
      {
        name: 'Class Meetings',
        explanation:
          'Small groups meeting weekly for accountability, confession, and mutual support in the Christian life. Central to Methodist spiritual formation.',
        relatedTerms: ['small groups', 'accountability', 'discipleship'],
      },
    ],
    notableWorks: [
      'Sermons on Several Occasions',
      'A Plain Account of Christian Perfection',
      'The Journal of John Wesley',
      'Explanatory Notes on the New Testament',
    ],
    textSources: [
      {
        id: 'wesley-sermons-vol1',
        title: 'Sermons on Several Occasions, Volume 1',
        url: 'https://www.gutenberg.org/cache/epub/45849/pg45849.txt',
        format: 'txt',
        description: "Wesley's foundational sermons on Methodist doctrine",
      },
      {
        id: 'wesley-journal',
        title: 'The Journal of John Wesley',
        url: 'https://www.gutenberg.org/cache/epub/2520/pg2520.txt',
        format: 'txt',
        description: "Wesley's famous diary of his ministry and spiritual life",
      },
      {
        id: 'wesley-christian-perfection',
        title: 'A Plain Account of Christian Perfection',
        url: 'https://www.gutenberg.org/cache/epub/26720/pg26720.txt',
        format: 'txt',
        description: "Wesley's mature statement on holiness and sanctification",
      },
    ],
    keyExcerpts: [
      {
        work: 'Journal, May 24, 1738',
        passage:
          'I felt my heart strangely warmed. I felt I did trust in Christ, Christ alone, for salvation; and an assurance was given me that He had taken away my sins.',
        context: "Wesley's famous Aldersgate experience of conversion",
      },
      {
        work: 'Sermon 5: Justification by Faith',
        passage:
          'Faith is the only condition of justification... the sole condition, without which none is justified; the only condition which is immediately and proximately necessary to justification.',
        context: "Wesley's affirmation of sola fide",
      },
    ],
    famousQuotes: [
      'Do all the good you can, by all the means you can, in all the ways you can.',
      'I felt my heart strangely warmed.',
      'The world is my parish.',
      'Give me one hundred men who fear nothing but sin and desire nothing but God, and I will shake the world.',
      'Catch on fire with enthusiasm and people will come for miles to watch you burn.',
    ],
    areasOfExpertise: [
      'holiness',
      'sanctification',
      'evangelism',
      'revival',
      'social reform',
      'practical theology',
    ],
  },

  johnBunyan: {
    id: 'johnBunyan',
    name: 'John Bunyan',
    era: '1628–1688',
    tradition: 'Puritan / Baptist Christianity',
    description:
      "English Puritan preacher and author whose allegorical novel The Pilgrim's Progress became one of the most widely read books in the English language. Imprisoned for preaching without a license, he wrote his masterpiece in jail.",
    keyTeachings: [
      'The Christian life is a pilgrimage through spiritual dangers',
      'Salvation is by grace alone through faith in Christ',
      'Spiritual warfare is real and constant',
      'Perseverance through trials is essential',
      'Scripture is the guide for the Christian journey',
    ],
    keyConcepts: [
      {
        name: 'Pilgrim Allegory',
        explanation:
          'The Christian life as a journey from the City of Destruction to the Celestial City. Obstacles like the Slough of Despond, Vanity Fair, and Doubting Castle represent spiritual struggles.',
        relatedTerms: ['journey', 'allegory', 'spiritual warfare'],
      },
      {
        name: 'Burden of Sin',
        explanation:
          'Christian carries a heavy burden on his back (representing sin and guilt) until he reaches the Cross, where it falls off and rolls into the empty tomb.',
        relatedTerms: ['conviction', 'guilt', 'forgiveness'],
      },
      {
        name: 'Vanity Fair',
        explanation:
          'A town that represents worldly temptations and persecutions. Christians must pass through but not conform to its values.',
        relatedTerms: ['worldliness', 'persecution', 'faithfulness'],
      },
    ],
    notableWorks: [
      "The Pilgrim's Progress",
      'Grace Abounding to the Chief of Sinners',
      'The Holy War',
      'The Life and Death of Mr. Badman',
    ],
    textSources: [
      {
        id: 'bunyan-pilgrims-progress',
        title: "The Pilgrim's Progress",
        url: 'https://www.gutenberg.org/cache/epub/131/pg131.txt',
        format: 'txt',
        description: 'Classic allegory of the Christian life',
      },
      {
        id: 'bunyan-grace-abounding',
        title: 'Grace Abounding to the Chief of Sinners',
        url: 'https://www.gutenberg.org/cache/epub/654/pg654.txt',
        format: 'txt',
        description: "Bunyan's spiritual autobiography",
      },
      {
        id: 'bunyan-holy-war',
        title: 'The Holy War',
        url: 'https://www.gutenberg.org/cache/epub/7140/pg7140.txt',
        format: 'txt',
        description: 'Allegory of spiritual warfare for the soul',
      },
    ],
    keyExcerpts: [
      {
        work: "The Pilgrim's Progress",
        passage:
          'As I walked through the wilderness of this world, I lighted on a certain place where was a den, and laid me down in that place to sleep; and as I slept, I dreamed a dream.',
        context: 'The famous opening of the allegory',
      },
      {
        work: 'Grace Abounding',
        passage:
          "One day, as I was passing in the field... this sentence fell upon my soul: Thy righteousness is in heaven. And I saw, with the eyes of my soul, Jesus Christ at God's right hand.",
        context: "Bunyan's moment of spiritual breakthrough",
      },
    ],
    famousQuotes: [
      'You have not lived today until you have done something for someone who can never repay you.',
      'In prayer it is better to have a heart without words than words without a heart.',
      'He that is down needs fear no fall; he that is low no pride.',
      'Run when I can, walk when I cannot run, and creep when I cannot walk.',
    ],
    areasOfExpertise: [
      'allegory',
      'Puritan spirituality',
      'spiritual warfare',
      'perseverance',
      'conversion',
    ],
  },

  jonathanEdwards: {
    id: 'jonathanEdwards',
    name: 'Jonathan Edwards',
    era: '1703–1758',
    tradition: 'Reformed / Great Awakening',
    description:
      "American Congregationalist preacher, philosopher, and theologian who played a critical role in the First Great Awakening. Widely regarded as America's greatest theologian, he combined rigorous Calvinist theology with deep spiritual passion.",
    keyTeachings: [
      "God's sovereignty in salvation is absolute",
      'True religion consists in holy affections',
      'The beauty of God is the foundation of all true virtue',
      "Revival is a sovereign work of God's Spirit",
      'Hell is a real and eternal punishment for sin',
    ],
    keyConcepts: [
      {
        name: 'Religious Affections',
        explanation:
          'True religion is not merely intellectual assent but involves the whole person, especially the affections (emotions/will). Holy affections include love for God, hatred of sin, and longing for Christ.',
        relatedTerms: ['affections', 'heart religion', 'true conversion'],
      },
      {
        name: 'Divine Beauty',
        explanation:
          'God is infinitely beautiful in His holiness. Perceiving this beauty is the essence of conversion and the foundation of true virtue.',
        relatedTerms: ['beauty', 'holiness', 'aesthetics', 'virtue'],
      },
      {
        name: 'Freedom of the Will',
        explanation:
          "The will is always determined by the strongest motive. True freedom is not freedom from causes but freedom to act according to one's desires—which in sinners are always toward evil apart from grace.",
        relatedTerms: ['compatibilism', 'determinism', 'moral inability'],
      },
    ],
    notableWorks: [
      'A Treatise Concerning Religious Affections',
      'Freedom of the Will',
      'Sinners in the Hands of an Angry God',
      'The Nature of True Virtue',
      'A History of the Work of Redemption',
    ],
    textSources: [
      {
        id: 'edwards-religious-affections',
        title: 'A Treatise Concerning Religious Affections',
        url: 'https://www.gutenberg.org/cache/epub/17659/pg17659.txt',
        format: 'txt',
        description: "Edwards' analysis of true vs. false religious experience",
      },
      {
        id: 'edwards-freedom-will',
        title: 'Freedom of the Will',
        url: 'https://www.gutenberg.org/cache/epub/17660/pg17660.txt',
        format: 'txt',
        description:
          'Philosophical defense of divine sovereignty and human responsibility',
      },
      {
        id: 'edwards-works-vol1',
        title: 'The Works of Jonathan Edwards, Vol. 1',
        url: 'https://www.gutenberg.org/cache/epub/57463/pg57463.txt',
        format: 'txt',
        description: 'Collection including sermons and treatises',
      },
      {
        id: 'edwards-works-vol2',
        title: 'The Works of Jonathan Edwards, Vol. 2',
        url: 'https://www.gutenberg.org/cache/epub/57466/pg57466.txt',
        format: 'txt',
        description: 'Additional sermons and theological writings',
      },
    ],
    keyExcerpts: [
      {
        work: 'Sinners in the Hands of an Angry God',
        passage:
          'There is nothing that keeps wicked men at any one moment out of hell, but the mere pleasure of God... The God that holds you over the pit of hell, much as one holds a spider, or some loathsome insect over the fire, abhors you.',
        context: 'The famous revival sermon on divine judgment',
      },
      {
        work: 'Religious Affections',
        passage:
          'True religion, in great part, consists in holy affections... The Author of human nature has not only given affections to men, but has made them very much the spring of actions.',
        context: "Edwards' thesis on the centrality of affections",
      },
    ],
    famousQuotes: [
      'The happiness of the creature consists in rejoicing in God, by which also God is magnified and exalted.',
      'Resolution One: I will live for God. Resolution Two: If no one else does, I still will.',
      'Grace is but glory begun, and glory is but grace perfected.',
      'Prayer is as natural an expression of faith as breathing is of life.',
    ],
    areasOfExpertise: [
      'Reformed theology',
      'revival',
      'religious experience',
      'philosophy',
      'divine sovereignty',
      'affections',
    ],
  },

  charlesSpurgeon: {
    id: 'charlesSpurgeon',
    name: 'Charles Haddon Spurgeon',
    era: '1834–1892',
    tradition: 'Baptist / Reformed Christianity',
    description:
      'English Baptist preacher known as the "Prince of Preachers." His sermons and writings reached millions, and he remains one of the most widely read Christian authors. He combined Reformed theology with evangelistic fervor.',
    keyTeachings: [
      'The centrality of Christ and the cross in all preaching',
      'Salvation by grace alone through faith alone',
      'The importance of prayer in the Christian life',
      'The Bible as the inspired and inerrant Word of God',
      'The necessity of personal conversion',
    ],
    keyConcepts: [
      {
        name: 'Christ-Centered Preaching',
        explanation:
          'Every sermon should lead to Christ. "I take my text and make a beeline for the cross." All Scripture points to Jesus.',
        relatedTerms: ['expository preaching', 'gospel', 'cross'],
      },
      {
        name: 'Calvinistic Evangelism',
        explanation:
          "Spurgeon held both to God's sovereignty in election and the genuine offer of the gospel to all. Divine sovereignty motivates, not hinders, evangelism.",
        relatedTerms: ['election', 'free offer', 'evangelism'],
      },
      {
        name: 'Downgrade Controversy',
        explanation:
          "Spurgeon's warning against theological liberalism creeping into Baptist churches. He ultimately left the Baptist Union over doctrinal compromise.",
        relatedTerms: ['liberalism', 'orthodoxy', 'separation'],
      },
    ],
    notableWorks: [
      'Lectures to My Students',
      'The Treasury of David',
      'Morning and Evening',
      'All of Grace',
      'Metropolitan Tabernacle Pulpit',
    ],
    textSources: [
      {
        id: 'spurgeon-lectures-students',
        title: 'Lectures to My Students',
        url: 'https://www.gutenberg.org/cache/epub/29199/pg29199.txt',
        format: 'txt',
        description: 'Practical wisdom for preachers and pastors',
      },
      {
        id: 'spurgeon-all-of-grace',
        title: 'All of Grace',
        url: 'https://www.gutenberg.org/cache/epub/5657/pg5657.txt',
        format: 'txt',
        description: 'Evangelistic explanation of salvation by grace',
      },
      {
        id: 'spurgeon-john-ploughman',
        title: "John Ploughman's Talk",
        url: 'https://www.gutenberg.org/cache/epub/15645/pg15645.txt',
        format: 'txt',
        description: 'Practical Christian wisdom in plain language',
      },
      {
        id: 'spurgeon-treasury-david-vol1',
        title: 'The Treasury of David, Vol. 1',
        url: 'https://www.gutenberg.org/cache/epub/14420/pg14420.txt',
        format: 'txt',
        description: 'Comprehensive commentary on the Psalms',
      },
    ],
    keyExcerpts: [
      {
        work: 'All of Grace',
        passage:
          'Grace is the opposite of merit... Merit is what we earn or deserve; grace is what God gives, not because we deserve it, but because He is gracious.',
        context: 'Definition of grace for seekers',
      },
      {
        work: 'Lectures to My Students',
        passage: 'I take my text and make a beeline for the cross.',
        context: "Spurgeon's homiletical principle",
      },
    ],
    famousQuotes: [
      'I have learned to kiss the wave that throws me against the Rock of Ages.',
      "A Bible that's falling apart usually belongs to someone who isn't.",
      'Visit many good books, but live in the Bible.',
      'If you want truth to go round the world you must hire an express train to pull it; but if you want a lie to go round the world, it will fly.',
      'By perseverance the snail reached the ark.',
    ],
    areasOfExpertise: [
      'preaching',
      'Reformed theology',
      'evangelism',
      'pastoral ministry',
      'prayer',
      'Psalms',
    ],
  },

  // ==========================================================================
  // EASTERN PHILOSOPHY
  // ==========================================================================

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

  // ==========================================================================
  // MODERN PHILOSOPHY
  // ==========================================================================

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
        url: 'https://www.gutenberg.org/cache/epub/7134/pg7134.txt',
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
        url: 'https://www.gutenberg.org/cache/epub/5639/pg5639.txt',
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
        url: 'https://www.gutenberg.org/cache/epub/45631/pg45631.txt',
        format: 'txt',
        description: 'Meditation on Abraham and the leap of faith',
      },
      {
        id: 'kierkegaard-sickness-unto-death',
        title: 'The Sickness Unto Death',
        url: 'https://www.gutenberg.org/cache/epub/27618/pg27618.txt',
        format: 'txt',
        description: 'Analysis of despair as the failure to be oneself',
      },
      {
        id: 'kierkegaard-present-age',
        title: 'The Present Age',
        url: 'https://www.gutenberg.org/cache/epub/57944/pg57944.txt',
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

  csLewis: {
    id: 'csLewis',
    name: 'C.S. Lewis',
    era: '1898–1963',
    tradition: 'Christian Apologetics',
    description:
      'British writer, theologian, and literary scholar who became one of the most influential Christian apologists of the 20th century. Known for accessible defenses of faith and imaginative fiction.',
    keyTeachings: [
      'Mere Christianity: Core Christian beliefs shared across denominations',
      'The Moral Argument: Universal moral law points to a Moral Lawgiver',
      'Trilemma: Jesus was either Lord, Liar, or Lunatic—not merely a good teacher',
      'The Problem of Pain: Suffering can be compatible with a loving God',
      'The Four Loves: Affection, Friendship, Eros, and Charity (agape)',
    ],
    keyConcepts: [
      {
        name: 'The Moral Argument',
        explanation:
          'All humans have a sense of right and wrong—a "Law of Nature." This law cannot be explained by biology or society alone; it points to a moral Lawgiver.',
        relatedTerms: ['natural law', 'conscience', 'moral lawgiver'],
      },
      {
        name: 'The Trilemma (Lord, Liar, or Lunatic)',
        explanation:
          "Jesus claimed to be God. If false and he knew it, he was a liar. If false and he didn't know it, he was a lunatic. If true, he is Lord.",
        relatedTerms: ['Christology', 'divinity of Christ', 'apologetics'],
      },
      {
        name: 'The Four Loves',
        explanation:
          "Lewis distinguishes four types of love: (1) Storge—affection; (2) Philia—friendship; (3) Eros—romantic love; (4) Agape—charity, God's unconditional love.",
        relatedTerms: ['affection', 'friendship', 'romance', 'charity'],
      },
      {
        name: 'Sehnsucht (Longing)',
        explanation:
          'An inconsolable longing for "something more." Lewis saw this as evidence that we were made for another world.',
        relatedTerms: ['joy', 'desire', 'heaven', 'the numinous'],
      },
    ],
    notableWorks: [
      'Mere Christianity',
      'The Screwtape Letters',
      'The Problem of Pain',
      'The Abolition of Man',
      'The Four Loves',
      'The Chronicles of Narnia',
    ],
    textSources: [
      // C.S. Lewis works are still under copyright and not available on Gutenberg
      // Include Internet Archive links where available
    ],
    keyExcerpts: [
      {
        work: 'Mere Christianity, Book I',
        passage:
          'These, then, are the two points I wanted to make. First, that human beings, all over the earth, have this curious idea that they ought to behave in a certain way... Secondly, that they do not in fact behave in that way.',
        context: "The moral argument for God's existence",
      },
      {
        work: 'The Weight of Glory',
        passage:
          'If I find in myself a desire which no experience in this world can satisfy, the most probable explanation is that I was made for another world.',
        context: 'The argument from desire (Sehnsucht)',
      },
    ],
    famousQuotes: [
      "You don't have a soul. You are a soul. You have a body.",
      'Hardships often prepare ordinary people for an extraordinary destiny.',
      'I believe in Christianity as I believe that the sun has risen: not only because I see it, but because by it I see everything else.',
      'Humility is not thinking less of yourself, but thinking of yourself less.',
      'There are far, far better things ahead than any we leave behind.',
    ],
    areasOfExpertise: [
      'Christian apologetics',
      'moral philosophy',
      'problem of pain',
      'faith and reason',
      'love',
      'imagination',
    ],
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get a philosopher by ID
 */
export function getPhilosopher(id: string): Philosopher | undefined {
  return PHILOSOPHERS[id];
}

/**
 * Get all philosopher IDs
 */
export function getAllPhilosopherIds(): string[] {
  return Object.keys(PHILOSOPHERS);
}

/**
 * Get all text sources across all philosophers
 */
export function getAllTextSources(): Array<
  TextSource & { philosopher: string }
> {
  const sources: Array<TextSource & { philosopher: string }> = [];

  for (const [philosopherId, philosopher] of Object.entries(PHILOSOPHERS)) {
    for (const source of philosopher.textSources) {
      sources.push({ ...source, philosopher: philosopherId });
    }
  }

  return sources;
}

/**
 * Get text sources for a specific philosopher
 */
export function getTextSourcesForPhilosopher(
  philosopherId: string
): TextSource[] {
  return PHILOSOPHERS[philosopherId]?.textSources || [];
}

/**
 * Get philosophers by tradition
 */
export function getPhilosophersByTradition(tradition: string): Philosopher[] {
  return Object.values(PHILOSOPHERS).filter(p =>
    p.tradition.toLowerCase().includes(tradition.toLowerCase())
  );
}

/**
 * Get philosophers by area of expertise
 */
export function getPhilosophersByExpertise(expertise: string): Philosopher[] {
  return Object.values(PHILOSOPHERS).filter(p =>
    p.areasOfExpertise.some(e =>
      e.toLowerCase().includes(expertise.toLowerCase())
    )
  );
}
