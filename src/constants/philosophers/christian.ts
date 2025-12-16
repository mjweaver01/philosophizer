export const christianPhilosophers = {
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
        url: 'https://www.gutenberg.org/cache/epub/8045/pg8045.txt',
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
        url: 'https://ccel.org/ccel/a/augustine/enchiridion/cache/enchiridion.txt',
        format: 'txt',
        description: 'Concise summary of Christian doctrine',
      },
      {
        id: 'augustine-christian-doctrine',
        title: 'On Christian Doctrine',
        url: 'https://ccel.org/ccel/a/augustine/doctrine/cache/doctrine.txt',
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
        url: 'https://www.gutenberg.org/ebooks/18755.txt.utf-8',
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
        url: 'https://ccel.org/ccel/a/aquinas/gentiles/cache/gentiles.txt',
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
        url: 'https://ccel.org/ccel/l/luther/bondage/cache/bondage.txt',
        format: 'txt',
        description:
          "Luther's response to Erasmus on free will and predestination",
      },
      {
        id: 'luther-large-catechism',
        title: 'The Large Catechism',
        url: 'https://www.gutenberg.org/cache/epub/1722/pg1722.txt',
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
        url: 'https://archive.org/download/selectedworksofh00zwin/selectedworksofh00zwin_djvu.txt',
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
        url: 'https://www.gutenberg.org/cache/epub/48250/pg48250.txt',
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
        url: 'https://archive.org/download/locicommunesofph0000mela/locicommunesofph0000mela_djvu.txt',
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
        url: 'https://archive.org/download/bim_eighteenth-century_sermons-on-several-occas_wesley-john_1746_1/bim_eighteenth-century_sermons-on-several-occas_wesley-john_1746_1_djvu.txt',
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
        url: 'https://www.gutenberg.org/cache/epub/395/pg395.txt',
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

  // ==========================================================================
  // CHRISTIAN MYSTICISM
  // ==========================================================================
  meisterEckhart: {
    id: 'meisterEckhart',
    name: 'Meister Eckhart',
    era: '1260–1328',
    tradition: 'Christian Mysticism / Rhineland Mysticism',
    description:
      "German Dominican theologian, philosopher, and mystic. His profound sermons and treatises on the soul's union with God influenced both Christian mysticism and later German philosophy. Some of his propositions were condemned by the Pope, but his spiritual depth has been increasingly appreciated.",
    keyTeachings: [
      'Gelassenheit (Releasement): Letting go of self-will and attachment',
      'The birth of the Word in the soul: Christ is born in the detached soul',
      'The divine spark (Seelenfünklein) exists in every soul',
      'God and the Godhead: Distinction between God as Trinity and the unknowable Ground',
      'True poverty is wanting nothing, knowing nothing, having nothing',
      'The eye with which I see God is the same eye with which God sees me',
    ],
    keyConcepts: [
      {
        name: 'Gelassenheit (Releasement/Detachment)',
        explanation:
          'The letting go of self-will, desire, and attachment to creatures. Only in complete detachment can the soul become a vessel for divine birth. This is not passive but actively releasing all that is not God.',
        relatedTerms: [
          'detachment',
          'letting go',
          'resignation',
          'Abgeschiedenheit',
        ],
      },
      {
        name: 'The Birth of the Word in the Soul',
        explanation:
          'Just as the Father eternally gives birth to the Son, so God gives birth to the Word in the detached soul. This mystical birth happens in the "now" of eternity for those who are prepared.',
        relatedTerms: ['divine birth', 'incarnation', 'eternal now'],
      },
      {
        name: 'The Ground of the Soul (Seelengrund)',
        explanation:
          'The deepest part of the soul where God dwells. Also called the "spark" or "castle" of the soul. Here, the soul and God are one. This ground is beyond all faculties and images.',
        relatedTerms: ['divine spark', 'Seelenfünklein', 'inner castle'],
      },
      {
        name: 'God and Godhead',
        explanation:
          'Eckhart distinguishes between "God" (the Trinity acting in creation) and the "Godhead" (Gottheit)—the unknowable, undifferentiated Ground beyond all names and attributes.',
        relatedTerms: ['Gottheit', 'divine ground', 'apophatic theology'],
      },
      {
        name: 'Living Without Why',
        explanation:
          '"The rose is without why; it blooms because it blooms." True spiritual life is without ulterior motive—not seeking reward, even from God, but loving God for God alone.',
        relatedTerms: ['pure love', 'disinterested love', 'sunder warumbe'],
      },
    ],
    notableWorks: [
      'German Sermons',
      'Treatises',
      'The Book of Divine Consolation',
      'The Talks of Instruction',
      'Commentary on John',
    ],
    textSources: [
      {
        id: 'eckhart-sermons',
        title: "Meister Eckhart's Sermons",
        url: 'https://ccel.org/ccel/eckhart/sermons.txt',
        format: 'txt',
        description: "Collection of Eckhart's mystical sermons",
      },
    ],
    keyExcerpts: [
      {
        work: 'Sermon on Poverty',
        passage:
          'A man should be so poor that he is not and has not a place wherein God could act. To reserve a place would be to maintain distinctions.',
        context: "Eckhart's radical teaching on spiritual poverty",
      },
      {
        work: 'Sermon',
        passage:
          "The eye with which I see God is the same eye with which God sees me: my eye and God's eye are one eye, one seeing, one knowing and one love.",
        context: 'The union of the soul with God',
      },
      {
        work: 'Talks of Instruction',
        passage:
          'People should not worry so much about what they ought to do; they ought to be more concerned about what they should be.',
        context: 'Being over doing',
      },
    ],
    famousQuotes: [
      'The eye with which I see God is the same eye with which God sees me.',
      'If the only prayer you ever say is "thank you," it will be enough.',
      'Be willing to be a beginner every single morning.',
      'The soul grows by subtraction, not addition.',
      'God is at home. It is we who have gone out for a walk.',
      'What we plant in the soil of contemplation, we shall reap in the harvest of action.',
    ],
    areasOfExpertise: [
      'mystical theology',
      'detachment',
      'union with God',
      'apophatic theology',
      'spiritual poverty',
      'contemplation',
    ],
  },

  jakobBoehme: {
    id: 'jakobBoehme',
    name: 'Jakob Böhme',
    era: '1575–1624',
    tradition: 'Christian Theosophy / Protestant Mysticism',
    description:
      'German Christian mystic and theologian whose visionary writings combined Lutheran piety with cosmic speculation. A shoemaker by trade, he experienced mystical illuminations that led him to write about the nature of God, creation, evil, and redemption. Influenced later figures from William Law to Hegel.',
    keyTeachings: [
      'God contains both light and dark, love and wrath—the Ungrund (groundless ground)',
      'Creation emerges through divine self-manifestation and opposition',
      "Evil arises from the necessary dark fire in God's nature",
      'Regeneration: The soul must be reborn through Christ',
      'Signature of all things: Nature reveals divine truth symbolically',
      'The seven source-spirits (Quellgeister) of divine life',
    ],
    keyConcepts: [
      {
        name: 'Ungrund (The Groundless Ground)',
        explanation:
          'The primordial divine abyss before all determination—neither light nor darkness, good nor evil. From this unfathomable depth, God eternally generates Himself and the cosmos.',
        relatedTerms: ['abyss', 'divine ground', 'nothing', 'eternal will'],
      },
      {
        name: 'The Two Principles (Light and Dark Fire)',
        explanation:
          'God contains two eternal principles: the dark fire of wrath/desire and the light fire of love. Both are necessary—the dark provides the ground and intensity that makes love possible.',
        relatedTerms: ['wrath', 'love', 'divine nature', 'opposition'],
      },
      {
        name: 'Signatura Rerum (Signature of All Things)',
        explanation:
          'Everything in nature bears an outward signature revealing its inner spiritual essence. By reading these signatures, one can discern hidden divine truths.',
        relatedTerms: ['correspondence', 'nature mysticism', 'symbolism'],
      },
      {
        name: 'The New Birth (Regeneration)',
        explanation:
          'Through Christ, the corrupted soul can be reborn. The old Adam must die so the new spiritual man can arise. This is an inner, mystical process of transformation.',
        relatedTerms: ['rebirth', 'redemption', 'inner Christ'],
      },
      {
        name: 'Sophia (Divine Wisdom)',
        explanation:
          "The feminine aspect of the divine—God's mirror and virgin companion. Sophia participates in creation and redemption, and the soul must be reunited with her.",
        relatedTerms: ['wisdom', 'feminine divine', 'virgin Sophia'],
      },
    ],
    notableWorks: [
      'Aurora (The Morning Redness)',
      'The Signature of All Things',
      'The Way to Christ',
      'Mysterium Magnum',
      'The Threefold Life of Man',
    ],
    textSources: [
      {
        id: 'boehme-signature',
        title: 'The Signature of All Things',
        url: 'https://www.gutenberg.org/cache/epub/57753/pg57753.txt',
        format: 'txt',
        description: 'On the inner essence of things revealed in nature',
      },
      {
        id: 'boehme-way-to-christ',
        title: 'The Way to Christ',
        url: 'https://www.gutenberg.org/cache/epub/58062/pg58062.txt',
        format: 'txt',
        description: 'Practical devotional writings on regeneration',
      },
      {
        id: 'boehme-aurora',
        title: 'Aurora',
        url: 'https://www.gutenberg.org/cache/epub/58164/pg58164.txt',
        format: 'txt',
        description: "Böhme's first and foundational work",
      },
    ],
    keyExcerpts: [
      {
        work: 'Aurora, Preface',
        passage:
          'When I wrestled with God, then I broke through the gates of hell and saw into the being of all beings, into the ground and the unground.',
        context: 'Böhme describes his mystical breakthrough',
      },
      {
        work: 'The Way to Christ',
        passage:
          'When thou art quiet and still from the thinking and willing of self, the eternal hearing, seeing, and speaking will be revealed in thee.',
        context: 'On inner stillness and revelation',
      },
    ],
    famousQuotes: [
      'When thou art quiet from the thinking of self, the eternal hearing, seeing, and speaking will be revealed in thee.',
      'Heaven and hell are within us, and we carry them around wherever we go.',
      "The soul is a fire, and it burns either in the fire of God's love or in the fire of wrath.",
      'In Yes and No all things consist.',
      'God is all things, and yet he is none of all.',
    ],
    areasOfExpertise: [
      'Christian theosophy',
      'mystical theology',
      'nature mysticism',
      'theodicy',
      'spiritual alchemy',
      'regeneration',
    ],
  },
};
