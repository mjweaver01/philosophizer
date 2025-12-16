// ==========================================================================
// JEWISH PHILOSOPHY & HASIDISM
// ==========================================================================
export const jewishPhilosophers = {
  maimonides: {
    id: 'maimonides',
    name: 'Moses Maimonides (Rambam)',
    era: '1138–1204',
    tradition: 'Jewish Philosophy / Rationalism',
    description:
      'Medieval Sephardic Jewish philosopher, Torah scholar, and physician. Widely regarded as the greatest Jewish philosopher, he synthesized Aristotelian philosophy with Jewish theology and codified Jewish law in his Mishneh Torah.',
    keyTeachings: [
      'Negative Theology: We can only say what God is not, not what God is',
      'The Thirteen Principles of Faith: Core beliefs of Judaism',
      'Prophecy requires intellectual and moral perfection',
      'The Torah has both literal and esoteric meanings',
      'Human perfection is achieved through intellectual virtue and knowledge of God',
      'Divine providence is proportional to intellectual development',
    ],
    keyConcepts: [
      {
        name: 'Negative Theology (Via Negativa)',
        explanation:
          "God's essence is unknowable. We can only describe God by negation—what God is not (not corporeal, not limited, not composite). Positive attributes describe God's actions, not essence.",
        relatedTerms: [
          'apophatic theology',
          'divine attributes',
          'transcendence',
        ],
      },
      {
        name: 'Thirteen Principles of Faith',
        explanation:
          "The foundational beliefs of Judaism: God's existence, unity, incorporeality, eternity; God alone should be worshipped; prophecy; Moses as supreme prophet; Torah's divine origin and immutability; God's omniscience; reward and punishment; the Messiah; resurrection.",
        relatedTerms: ['Ani Maamin', 'creed', 'Jewish belief'],
      },
      {
        name: 'Intellectual Perfection',
        explanation:
          'The highest human achievement is knowledge of God through philosophical contemplation. This is the purpose of human existence and the key to the World to Come.',
        relatedTerms: ['olam haba', 'contemplation', 'human purpose'],
      },
      {
        name: 'Harmonization of Torah and Philosophy',
        explanation:
          'There is no conflict between true philosophy (Aristotle) and properly understood Torah. Apparent contradictions arise from literal readings of metaphorical texts.',
        relatedTerms: ['faith and reason', 'allegory', 'interpretation'],
      },
    ],
    notableWorks: [
      'Guide for the Perplexed (Moreh Nevukhim)',
      'Mishneh Torah',
      'Commentary on the Mishnah',
      'Sefer HaMitzvot',
      'Epistle to Yemen',
    ],
    textSources: [
      {
        id: 'maimonides-guide-perplexed',
        title: 'Guide for the Perplexed',
        url: 'https://www.gutenberg.org/ebooks/73584.txt.utf-8',
        format: 'txt',
        description:
          'Philosophical masterwork reconciling Judaism and Aristotelian philosophy',
      },
    ],
    keyExcerpts: [
      {
        work: 'Guide for the Perplexed, Introduction',
        passage:
          'My primary object in this work is to explain certain words occurring in the prophetic books... A second object of this treatise is to explain very obscure figures which occur in the Prophets.',
        context: 'Maimonides explains the purpose of the Guide',
      },
      {
        work: 'Guide for the Perplexed, I:58',
        passage:
          'The more attributes you assign to God, the more you remove God from your thoughts. For every attribute you add, you are limiting God.',
        context: 'The principle of negative theology',
      },
    ],
    famousQuotes: [
      'Give a man a fish and you feed him for a day; teach a man to fish and you feed him for a lifetime.',
      'The risk of a wrong decision is preferable to the terror of indecision.',
      'Do not consider a thing as proof because you find it written in books.',
      'No disease that can be treated by diet should be treated by any other means.',
      'Teach thy tongue to say "I do not know," and thou shalt progress.',
    ],
    areasOfExpertise: [
      'Jewish law',
      'philosophy',
      'theology',
      'negative theology',
      'ethics',
      'medicine',
      'biblical interpretation',
    ],
  },

  baalShemTov: {
    id: 'baalShemTov',
    name: 'Israel ben Eliezer (Baal Shem Tov)',
    era: '1698–1760',
    tradition: 'Hasidic Judaism',
    description:
      'Founder of Hasidic Judaism, a mystical revivalist movement that transformed Eastern European Jewry. Known as the Baal Shem Tov ("Master of the Good Name"), he taught that God is present in all things and can be served through joy, prayer, and simple faith.',
    keyTeachings: [
      'Devekut: Cleaving to God through constant awareness of the Divine presence',
      "Avodah B'Simcha: Serving God with joy, not melancholy",
      'Every Jew can connect directly with God, regardless of learning',
      'God is present in all things—even seemingly mundane activities can be worship',
      'The Tzaddik (righteous leader) can elevate the prayers of the community',
      'Hitlahavut: Spiritual enthusiasm and fervor in prayer',
    ],
    keyConcepts: [
      {
        name: 'Devekut (Cleaving to God)',
        explanation:
          'The ideal of constant attachment to God through every thought and action. Not reserved for moments of prayer but a continuous state of divine awareness.',
        relatedTerms: ['attachment', 'communion', 'divine presence'],
      },
      {
        name: "Avodah B'Simcha (Service through Joy)",
        explanation:
          'True service of God is performed with joy, not sadness or fear. Joy breaks through barriers that separate humans from God. Melancholy is a spiritual obstacle.',
        relatedTerms: ['simcha', 'happiness', 'spiritual joy'],
      },
      {
        name: 'Divine Immanence',
        explanation:
          'God fills all worlds and is present in everything. There is no place devoid of God. Even physical activities can become worship when performed with proper intention.',
        relatedTerms: ['panentheism', 'omnipresence', 'holy sparks'],
      },
      {
        name: 'The Tzaddik',
        explanation:
          'The righteous spiritual leader who serves as an intermediary between the community and God. The Tzaddik can elevate the prayers and souls of followers.',
        relatedTerms: ['rebbe', 'righteous one', 'spiritual leader'],
      },
      {
        name: 'Bitul (Self-Nullification)',
        explanation:
          'The annihilation of ego and self-consciousness in the presence of God. True prayer requires transcending the self.',
        relatedTerms: ['humility', 'ego-death', 'divine union'],
      },
    ],
    notableWorks: [
      "Tzava'at HaRivash (Testament of the Baal Shem Tov)",
      'Keter Shem Tov',
      'Teachings recorded by disciples',
    ],
    textSources: [
      // Primary Hasidic texts are mostly in Hebrew/Yiddish and not on Gutenberg
      // Some related materials may be available
    ],
    keyExcerpts: [
      {
        work: "Tzava'at HaRivash",
        passage:
          'Let not the mind dwell on physical things, but let it be attached always to the Creator. When you speak with people, attach yourself to Him.',
        context: 'Teaching on constant devekut',
      },
      {
        work: 'Keter Shem Tov',
        passage:
          'The purpose of the whole Torah is that man should become a chariot for the Divine Presence.',
        context: 'The ultimate purpose of Torah observance',
      },
    ],
    famousQuotes: [
      'Forgetfulness leads to exile, while remembrance is the secret of redemption.',
      'From every human being there rises a light that reaches straight to heaven.',
      'Your fellow man is your mirror. If your own face is clean, the image you see will also be flawless.',
      'Wherever I go, I am going to the Land of Israel.',
      "The world is new to us every morning—this is God's gift, and every man should believe he is reborn each day.",
    ],
    areasOfExpertise: [
      'Hasidism',
      'mysticism',
      'prayer',
      'joy',
      'divine service',
      'Kabbalah',
      'spiritual leadership',
    ],
  },

  nachmanOfBreslov: {
    id: 'nachmanOfBreslov',
    name: 'Rabbi Nachman of Breslov',
    era: '1772–1810',
    tradition: 'Hasidic Judaism / Breslov',
    description:
      'Great-grandson of the Baal Shem Tov and founder of the Breslov Hasidic dynasty. Known for his profound mystical teachings, innovative use of storytelling, and emphasis on personal prayer (hitbodedut). His teachings continue to inspire with their depth and accessibility.',
    keyTeachings: [
      "Hitbodedut: Personal, spontaneous prayer in solitude—speaking to God in one's own words",
      'It is forbidden to despair—there is always hope',
      'The whole world is a very narrow bridge; the main thing is not to fear',
      'Joy is a great mitzvah; depression is a spiritual danger',
      'Finding the good point in oneself and others',
      'Through storytelling, deep mystical truths can be transmitted',
    ],
    keyConcepts: [
      {
        name: 'Hitbodedut (Secluded Prayer)',
        explanation:
          "Daily practice of speaking to God in one's own words, in solitude, preferably in nature. Pour out your heart to God as you would to a close friend.",
        relatedTerms: [
          'personal prayer',
          'meditation',
          'solitude',
          'conversation with God',
        ],
      },
      {
        name: 'Azamra (Finding Good Points)',
        explanation:
          'Even the worst person has good points. By finding these sparks of good, you can judge them favorably and elevate them—and yourself—toward repentance.',
        relatedTerms: [
          'positive judgment',
          'good points',
          'spiritual encouragement',
        ],
      },
      {
        name: 'Emunah (Simple Faith)',
        explanation:
          'Faith that goes beyond intellectual understanding. Even when facing doubt and darkness, maintain simple trust in God. Questions are acceptable; faith sustains.',
        relatedTerms: ['belief', 'trust', 'faith despite doubt'],
      },
      {
        name: 'The Narrow Bridge',
        explanation:
          '"The whole world is a very narrow bridge, and the main thing is not to be afraid at all." Life is precarious, but fear is the true obstacle.',
        relatedTerms: ['courage', 'trust', 'overcoming fear'],
      },
      {
        name: 'Mystical Stories',
        explanation:
          'Rabbi Nachman taught through elaborate fairy tales containing deep Kabbalistic secrets. These stories work on multiple levels and can heal the soul.',
        relatedTerms: ['thirteen tales', 'allegory', 'spiritual narratives'],
      },
    ],
    notableWorks: [
      'Likutey Moharan (Collected Teachings)',
      "Sipurei Ma'asiot (Rabbi Nachman's Stories)",
      'Sefer HaMiddot (The Book of Traits)',
      'Tikkun HaKlali (The General Remedy)',
    ],
    textSources: [
      // Breslov texts are mostly in Hebrew and not available on Gutenberg
      // Some translations exist but are under copyright
    ],
    keyExcerpts: [
      {
        work: 'Likutey Moharan I:282',
        passage:
          'Know that a person walks in life on a very narrow bridge. The main rule is: Do not be frightened at all!',
        context: 'The famous teaching on the narrow bridge',
      },
      {
        work: 'Likutey Moharan II:24',
        passage:
          'If you believe that you can damage, believe that you can repair.',
        context: 'Teaching on teshuvah (repentance) and hope',
      },
      {
        work: 'Likutey Moharan I:282',
        passage: 'It is a great mitzvah to always be joyful.',
        context: 'The centrality of joy in spiritual life',
      },
    ],
    famousQuotes: [
      'The whole world is a very narrow bridge, and the main thing is not to be afraid at all.',
      'If you believe that you can damage, believe that you can repair.',
      'It is a great mitzvah to always be joyful.',
      'Never give up! There is no such thing as despair!',
      'Get into the habit of singing a tune. It will give you new life and fill you with joy.',
      'Always remember: Joy is not incidental to your spiritual quest; it is vital.',
    ],
    areasOfExpertise: [
      'Hasidism',
      'personal prayer',
      'joy',
      'faith',
      'storytelling',
      'mysticism',
      'repentance',
      'overcoming despair',
    ],
  },

  schneerson: {
    id: 'schneerson',
    name: 'Rabbi Menachem Mendel Schneerson (The Lubavitcher Rebbe)',
    era: '1902–1994',
    tradition: 'Hasidic Judaism / Chabad-Lubavitch',
    description:
      'The seventh and last Rebbe of the Chabad-Lubavitch dynasty, widely regarded as the most influential Jewish leader of the 20th century. He transformed Chabad into a global movement focused on Jewish outreach, education, and bringing Moshiach (the Messiah).',
    keyTeachings: [
      'Every Jew has a divine soul and infinite potential',
      'Ahavat Yisrael: Unconditional love for every Jew',
      'Ufaratzta: Spreading Judaism to the farthest corners of the world',
      'One mitzvah can tip the scales and bring redemption',
      'The purpose of creation is to make a dwelling place for God in the lower worlds',
      'Think good and it will be good (Tracht gut vet zein gut)',
    ],
    keyConcepts: [
      {
        name: 'Shlichus (Emissary Mission)',
        explanation:
          'Every Jew is an emissary (shaliach) of God to transform the world. The Rebbe sent thousands of emissaries worldwide to establish Jewish centers and reach unaffiliated Jews.',
        relatedTerms: ['outreach', 'mission', 'Jewish ambassador'],
      },
      {
        name: 'Ahavat Yisrael (Love of Fellow Jews)',
        explanation:
          'Unconditional love for every Jew, regardless of their level of observance or knowledge. This love is the foundation of all outreach.',
        relatedTerms: ['unity', 'love', 'Jewish peoplehood'],
      },
      {
        name: "Dirah B'Tachtonim (Dwelling in the Lower Realms)",
        explanation:
          'God\'s desire is to have a "dwelling place" in the physical world. By performing mitzvot with physical objects, we reveal the divine in the mundane.',
        relatedTerms: [
          'purpose of creation',
          'sanctification',
          'elevating the world',
        ],
      },
      {
        name: 'Moshiach Consciousness',
        explanation:
          'We are the generation that will bring Moshiach. Every action should be directed toward hastening the redemption. "Live with Moshiach."',
        relatedTerms: ['redemption', 'Messiah', 'geulah'],
      },
      {
        name: 'Tanya Philosophy',
        explanation:
          'Based on the Tanya of the first Chabad Rebbe, every Jew has two souls—animal and divine—and life is the struggle to let the divine soul prevail.',
        relatedTerms: ['Beinoni', 'two souls', 'Chabad philosophy'],
      },
    ],
    notableWorks: [
      'Likkutei Sichos (Collected Talks)',
      'Igrot Kodesh (Holy Letters)',
      'Hayom Yom',
      'Countless public addresses (farbrengens)',
    ],
    textSources: [
      // The Rebbe's works are under copyright but widely available through Chabad.org
      // The foundational text of Chabad, the Tanya, may have older translations
    ],
    keyExcerpts: [
      {
        work: 'Public Address, 1991',
        passage:
          'I have done everything I can. Now I am giving it over to you. Do everything you can to bring Moshiach, immediately!',
        context: "The Rebbe's call to action to bring the redemption",
      },
      {
        work: 'Hayom Yom, 9 Adar II',
        passage: 'Think good and it will be good.',
        context: 'The power of positive thought',
      },
    ],
    famousQuotes: [
      'Think good and it will be good.',
      'If you see what needs to be repaired and how to repair it, then you have found a piece of the world that God has left for you to complete.',
      'A little light dispels a lot of darkness.',
      "The world says that if you can't go under, go over. I say, if you can't go over—go through!",
      'One good deed can tip the scale and bring redemption to the entire world.',
      'No Jew will be left behind.',
    ],
    areasOfExpertise: [
      'Hasidic philosophy',
      'Jewish outreach',
      'leadership',
      'Kabbalah',
      'Torah study',
      'redemption',
      'Jewish unity',
    ],
  },

  // ==========================================================================
  // KABBALAH (JEWISH MYSTICISM)
  // ==========================================================================

  isaacLuria: {
    id: 'isaacLuria',
    name: 'Isaac Luria (The Ari)',
    era: '1534–1572',
    tradition: 'Kabbalah / Jewish Mysticism',
    description:
      'The most influential Kabbalist of the modern era, known as "The Ari" (The Lion) or "Ha\'Arizal." Born in Jerusalem and teaching in Safed, his revolutionary mystical system—Lurianic Kabbalah—transformed Jewish mysticism and influenced Hasidism, Jewish ethics, and liturgy.',
    keyTeachings: [
      'Tzimtzum: God contracted to make room for creation',
      'Shevirat HaKelim: The breaking of the vessels that scattered divine sparks',
      'Tikkun: The repair of the world through gathering the sparks',
      'Gilgul: Reincarnation of souls to complete their spiritual rectification',
      'Every mitzvah has cosmic significance in repairing the upper worlds',
      'Kavvanot: Mystical intentions that elevate prayer',
    ],
    keyConcepts: [
      {
        name: 'Tzimtzum (Divine Contraction)',
        explanation:
          'God, who is infinite (Ein Sof), contracted Himself to create a "void" (chalal) in which finite creation could exist. This does not mean God is absent—divine light continues to flow through the "ray" (kav).',
        relatedTerms: ['contraction', 'Ein Sof', 'creation', 'void'],
      },
      {
        name: 'Shevirat HaKelim (Breaking of the Vessels)',
        explanation:
          'The divine light was too intense for the vessels (sefirot) meant to contain it, causing them to shatter. Divine sparks fell into the lower worlds, becoming trapped in material reality (kelipot—shells).',
        relatedTerms: ['vessels', 'sparks', 'kelipot', 'cosmic catastrophe'],
      },
      {
        name: 'Tikkun (Repair/Rectification)',
        explanation:
          'The cosmic task of humanity is to gather and elevate the fallen sparks through Torah, prayer, and mitzvot. This repairs the broken vessels and restores harmony to the divine realms, hastening redemption.',
        relatedTerms: ['tikkun olam', 'redemption', 'sparks', 'elevation'],
      },
      {
        name: 'Partzufim (Divine Personas)',
        explanation:
          'The sefirot reconfigure into "faces" or persona-structures after the breaking of the vessels. These include Arikh Anpin (the Long-Suffering), Abba (Father), Imma (Mother), Ze\'er Anpin (the Small Face), and Nukvah (the Female).',
        relatedTerms: ['faces', 'sefirot', 'divine structure'],
      },
      {
        name: 'Gilgul (Reincarnation)',
        explanation:
          'Souls reincarnate to complete their spiritual rectification (tikkun) and fulfill the mitzvot they missed. Some souls are new; others carry the imprints of previous lives.',
        relatedTerms: ['reincarnation', 'soul', 'tikkun', 'ibbur'],
      },
    ],
    notableWorks: [
      'Etz Chaim (Tree of Life) - recorded by Chaim Vital',
      "Sha'ar HaGilgulim (Gate of Reincarnations)",
      "Sha'ar HaKavanot (Gate of Intentions)",
      'Pri Etz Chaim (Fruit of the Tree of Life)',
    ],
    textSources: [
      // Lurianic texts are primarily in Hebrew and not available on Gutenberg
      // They were transmitted orally and written down by his student Chaim Vital
    ],
    keyExcerpts: [
      {
        work: 'Etz Chaim',
        passage:
          'Before anything was created, the Infinite Light filled all of reality. When it arose in His will to create the worlds, He contracted His light, withdrawing it to the sides, leaving a void.',
        context: 'The doctrine of Tzimtzum',
      },
      {
        work: "Sha'ar HaGilgulim",
        passage:
          'Know that there is no generation in which there are not sparks of the souls of the Generation of the Wilderness and the Mixed Multitude.',
        context: 'On the reincarnation of souls through history',
      },
    ],
    famousQuotes: [
      'Before anything was created, the Infinite Light filled all of reality.',
      'Every mitzvah has the power to repair and elevate the fallen sparks.',
      'The purpose of life is the tikkun of the soul.',
      'Even in the lowest places, there are divine sparks waiting to be raised.',
    ],
    areasOfExpertise: [
      'Kabbalah',
      'Jewish mysticism',
      'creation',
      'reincarnation',
      'prayer',
      'tikkun',
      'meditation',
    ],
  },

  zohar: {
    id: 'zohar',
    name: 'The Zohar (Sefer HaZohar)',
    era: '13th century (traditionally attributed to 2nd century)',
    tradition: 'Kabbalah / Jewish Mysticism',
    description:
      'The foundational work of Jewish mysticism, traditionally attributed to Rabbi Shimon bar Yochai (2nd century) but likely composed by Moses de León in 13th-century Spain. Written in Aramaic, it presents mystical commentary on the Torah, revealing hidden meanings about God, creation, the soul, good and evil, and the coming of the Messiah.',
    keyTeachings: [
      'The Ein Sof (Infinite) manifests through ten Sefirot (divine emanations)',
      'Torah has four levels of interpretation: Peshat, Remez, Drash, Sod (literal, hinted, homiletical, secret)',
      'The Shekhinah (Divine Presence) is in exile with Israel',
      'Human actions below affect the divine realms above',
      'Male and female must be united for divine blessing to flow',
      'Evil (Sitra Achra—the Other Side) is the shadow of holiness',
    ],
    keyConcepts: [
      {
        name: 'The Ten Sefirot',
        explanation:
          'The ten emanations through which Ein Sof (the Infinite) reveals itself and creates the world: Keter (Crown), Chokhmah (Wisdom), Binah (Understanding), Chesed (Kindness), Gevurah (Severity), Tiferet (Beauty), Netzach (Victory), Hod (Splendor), Yesod (Foundation), Malkhut (Kingdom/Shekhinah).',
        relatedTerms: ['divine attributes', 'emanation', 'Tree of Life'],
      },
      {
        name: 'The Four Worlds',
        explanation:
          'Reality consists of four worlds: Atzilut (Emanation—divine), Beriah (Creation—throne), Yetzirah (Formation—angels), Asiyah (Action—physical). The Torah and souls exist on all levels.',
        relatedTerms: ['worlds', 'levels of reality', 'descent'],
      },
      {
        name: 'The Shekhinah',
        explanation:
          "The feminine aspect of God, the Divine Presence that dwells among Israel. When Israel sinned, the Shekhinah went into exile. She is identified with the sefirah of Malkhut and awaits reunion with Ze'er Anpin (the masculine aspect).",
        relatedTerms: [
          'Divine Presence',
          'feminine divine',
          'Malkhut',
          'exile',
        ],
      },
      {
        name: 'Sod (The Secret Level)',
        explanation:
          'Torah has four levels of interpretation (PaRDeS): Peshat (literal), Remez (allusion), Drash (homiletical), Sod (secret/mystical). The Zohar reveals the Sod—the inner, mystical meaning.',
        relatedTerms: ['PaRDeS', 'Torah interpretation', 'hidden meaning'],
      },
      {
        name: 'Sitra Achra (The Other Side)',
        explanation:
          'The realm of evil and impurity, which exists as the "shadow" or "shell" (kelipah) of holiness. It has no independent existence but feeds parasitically on the holy.',
        relatedTerms: ['evil', 'kelipot', 'impurity', 'demonic'],
      },
    ],
    notableWorks: [
      'Sefer HaZohar (The Book of Radiance)',
      'Zohar Chadash (New Zohar)',
      'Tikkunei Zohar (Rectifications of the Zohar)',
      "Ra'aya Meheimna (The Faithful Shepherd)",
      'Idra Rabba (Greater Assembly)',
      'Idra Zuta (Lesser Assembly)',
    ],
    textSources: [
      // The Zohar is in Aramaic and full translations are under copyright
      // Partial translations and secondary sources are available
    ],
    keyExcerpts: [
      {
        work: 'Zohar I:15a',
        passage:
          'When the Holy One, blessed be He, wished to create the world, He looked into the Torah and created the world. The Torah was the blueprint of creation.',
        context: 'Torah as the template for creation',
      },
      {
        work: 'Zohar III:152a (Idra Zuta)',
        passage:
          'Rabbi Shimon said: All my days I have been bound to this world by a single knot. Now I see that the Holy One, blessed be He, and the Shekhinah are coming to escort me.',
        context: "Rabbi Shimon bar Yochai's final teaching before his death",
      },
      {
        work: 'Zohar II:163b',
        passage:
          'There is no light except that which comes from darkness. When the darkness is subdued, the Holy One is exalted.',
        context: 'The relationship between light and darkness',
      },
    ],
    famousQuotes: [
      'Woe to those who see in the Torah only simple narratives and ordinary words.',
      'In the beginning, God looked into the Torah and created the world.',
      'There is no light except that which comes from darkness.',
      'The Torah has a body, a soul, and a soul of the soul.',
      'Love without fear is not perfect; fear without love is not perfect.',
    ],
    areasOfExpertise: [
      'Kabbalah',
      'Jewish mysticism',
      'Torah interpretation',
      'sefirot',
      'divine attributes',
      'good and evil',
      'redemption',
    ],
  },
};
