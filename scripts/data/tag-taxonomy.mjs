export const banReasonTagGroups = [
  {
    id: "sexuality-and-morality",
    label: "Sexuality and Morality",
    tags: [
      { id: "profanity", label: "Profanity", description: "Profane, vulgar, or insulting language cited as offensive." },
      { id: "indecency", label: "Indecency", description: "Broad claims of indecency that fall short of a formal obscenity charge." },
      { id: "obscenity", label: "Obscenity", description: "The work was treated as obscene under law or official policy." },
      { id: "sexual-explicitness", label: "Sexual Explicitness", description: "Graphic or unusually candid sexual content." },
      { id: "sexuality", label: "Sexuality", description: "Sexual subject matter was cited, even without graphic detail." },
      { id: "queer-content", label: "Queer Content", description: "Same-sex desire or gender nonconformity was targeted by censors." },
      { id: "gender-politics", label: "Gender Politics", description: "The work was banned because of feminist or gender-order disputes." },
      { id: "child-protection", label: "Child Protection", description: "Officials claimed the work endangered children or youth readers." },
      { id: "morality", label: "Morality", description: "General moral corruption or immorality was cited." },
      { id: "public-morality", label: "Public Morality", description: "Officials framed the ban as necessary to protect public morals." },
      { id: "moral-panic", label: "Moral Panic", description: "The ban was driven by panic over social corruption rather than a narrower legal issue." },
    ],
  },
  {
    id: "religion-and-belief",
    label: "Religion and Belief",
    tags: [
      { id: "blasphemy", label: "Blasphemy", description: "The work was said to insult a deity, prophet, or sacred matter." },
      { id: "religious-offense", label: "Religious Offense", description: "Authorities said the work offended a religion or believers." },
      { id: "religious-criticism", label: "Religious Criticism", description: "The work criticizes religious doctrine, authority, or sacred history." },
      { id: "religious-content", label: "Religious Content", description: "Religious subject matter itself triggered censorship." },
      { id: "religious-control", label: "Religious Control", description: "Authorities controlled access to a text for confessional or sectarian reasons." },
      { id: "religious-dissent", label: "Religious Dissent", description: "The work challenged dominant religious authority or orthodoxy." },
      { id: "religious-morality", label: "Religious Morality", description: "Censors invoked a specifically religious moral code." },
      { id: "anti-clericalism", label: "Anti-Clericalism", description: "The work attacked clergy, church institutions, or religious hierarchy." },
      { id: "doctrinal-control", label: "Doctrinal Control", description: "Authorities intervened to police doctrine or theology." },
      { id: "heresy", label: "Heresy", description: "The text was condemned as heretical or doctrinally deviant." },
      { id: "secularism", label: "Secularism", description: "The work was targeted for defending or embodying secular values against religious authority." },
    ],
  },
  {
    id: "politics-and-state",
    label: "Politics and State",
    tags: [
      { id: "political-dissent", label: "Political Dissent", description: "The work opposed or undermined the ruling order." },
      { id: "political-sensitivity", label: "Political Sensitivity", description: "Officials treated the subject as too politically delicate to circulate." },
      { id: "political-control", label: "Political Control", description: "The work was suppressed to preserve direct political control over discourse." },
      { id: "political-danger", label: "Political Danger", description: "Authorities described the work as politically dangerous or destabilizing." },
      { id: "ideological-control", label: "Ideological Control", description: "The ban aimed to enforce an official ideology." },
      { id: "anti-state", label: "Anti-State", description: "The work was framed as hostile to the state or its institutions." },
      { id: "anti-communism", label: "Anti-Communism", description: "The work was banned for criticizing communist doctrine or regimes." },
      { id: "anti-dictatorship", label: "Anti-Dictatorship", description: "The work attacked dictatorship or authoritarian rule." },
      { id: "anti-fascism", label: "Anti-Fascism", description: "The work was suppressed for opposing fascist rule or ideology." },
      { id: "anti-imperialism", label: "Anti-Imperialism", description: "The work attacked empire, foreign domination, or imperial ideology." },
      { id: "anti-militarism", label: "Anti-Militarism", description: "The work challenged militarism, conscription, or martial culture." },
      { id: "anti-war", label: "Anti-War", description: "The work opposed war or patriotic war culture." },
      { id: "nazism", label: "Nazism", description: "Authorities cited Nazi ideology, Nazi propaganda, or explicit Nazi affiliation." },
      { id: "decolonization", label: "Decolonization", description: "The work was tied to anti-colonial or decolonizing politics." },
      { id: "left-politics", label: "Left Politics", description: "Authorities targeted the work for socialist, radical, or left political content." },
      { id: "revolutionary-politics", label: "Revolutionary Politics", description: "The work was accused of promoting revolution or insurrectionary politics." },
      { id: "utopian-politics", label: "Utopian Politics", description: "The work's speculative political vision itself triggered state alarm." },
      { id: "sedition", label: "Sedition", description: "The work was treated as seditious or disloyal to lawful authority." },
      { id: "national-security", label: "National Security", description: "Authorities invoked security of the state or nation." },
      { id: "state-secrecy", label: "State Secrecy", description: "The work revealed or was accused of revealing protected state information." },
      { id: "public-order", label: "Public Order", description: "Officials said the work threatened unrest, riots, or disorder." },
      { id: "wartime-censorship", label: "Wartime Censorship", description: "The work was restricted under wartime emergency controls." },
      { id: "press-freedom", label: "Press Freedom", description: "The text's defense of press freedom or open print culture triggered suppression." },
      { id: "licensing", label: "Licensing", description: "The text was blocked for lacking required permission, license, or approved imprint." },
      { id: "unauthorized-history", label: "Unauthorized History", description: "Authorities objected to an unapproved version of history or memory." },
      { id: "offense-to-local-interests", label: "Offense to Local Interests", description: "Officials said the work insulted local institutions, customs, or national prestige." },
      { id: "defamation", label: "Defamation", description: "The work was accused of defamatory attacks on persons, institutions, or the state." },
    ],
  },
  {
    id: "violence-hate-and-harm",
    label: "Violence, Hate, and Harm",
    tags: [
      { id: "violence", label: "Violence", description: "Violent content itself was cited as objectionable." },
      { id: "graphic-violence", label: "Graphic Violence", description: "Extreme or graphic depictions of violence triggered the ban." },
      { id: "incitement-to-violence", label: "Incitement to Violence", description: "The work was said to encourage violence or violent imitation." },
      { id: "instructional-harm", label: "Instructional Harm", description: "The text gives harmful instructions, such as for sabotage, suicide, or dangerous acts." },
      { id: "self-harm", label: "Self-Harm", description: "The work was tied to suicide, self-deliverance, or other self-harm concerns." },
      { id: "copycat-fear", label: "Copycat Fear", description: "Officials feared readers would imitate what the work described." },
      { id: "extremism", label: "Extremism", description: "Authorities treated the work as extremist propaganda or material." },
      { id: "hate-speech", label: "Hate Speech", description: "The work was targeted for hatred toward a protected group." },
      { id: "racism", label: "Racism", description: "Racist content or racial insult was itself the basis for restriction." },
      { id: "antisemitism", label: "Antisemitism", description: "Antisemitic ideology or propaganda was central to the ban rationale." },
      { id: "discrimination", label: "Discrimination", description: "Authorities cited discriminatory treatment of a group or class." },
      { id: "ethnic-conflict", label: "Ethnic Conflict", description: "The work was said to inflame ethnic hostility or communal tension." },
      { id: "racial-politics", label: "Racial Politics", description: "Race conflict or racial critique was treated as politically dangerous." },
    ],
  },
  {
    id: "form-and-special-content",
    label: "Form and Special Content",
    tags: [
      { id: "satire", label: "Satire", description: "The work's satirical mode was itself treated as subversive or insulting." },
      { id: "anthropomorphic-animals", label: "Anthropomorphic Animals", description: "Authorities objected to animals acting or speaking like humans." },
    ],
  },
];

export const criticismTargetTagGroups = [
  {
    id: "religions-and-churches",
    label: "Religions and Religious Institutions",
    tags: [
      { id: "islam", label: "Islam", description: "The work criticizes Islam, Islamic tradition, or Islamic sacred history." },
      { id: "islamism", label: "Islamism", description: "The work criticizes Islamist politics or political movements claiming Islamic legitimacy." },
      { id: "christianity", label: "Christianity", description: "The work criticizes Christianity in general." },
      { id: "catholic-church", label: "Catholic Church", description: "The work criticizes Catholic clergy, institutions, or authority." },
      { id: "papacy", label: "Papacy", description: "The work specifically targets papal authority or the pope." },
      { id: "clerical-authority", label: "Clerical Authority", description: "The work targets priests, clerics, or institutional religious hierarchy in general." },
      { id: "judaism", label: "Judaism", description: "The work criticizes Judaism or Jewish religious authority." },
      { id: "hinduism", label: "Hinduism", description: "The work criticizes Hinduism or Hindu religious authority." },
      { id: "state-church", label: "State Church", description: "The work criticizes an alliance between church authority and state power." },
      { id: "religious-majoritarianism", label: "Religious Majoritarianism", description: "The work targets political projects built around majority-faith dominance." },
    ],
  },
  {
    id: "regimes-and-ideologies",
    label: "Regimes and Ideologies",
    tags: [
      { id: "communist-party", label: "Communist Party", description: "The work criticizes a communist party as a governing apparatus." },
      { id: "soviet-state", label: "Soviet State", description: "The work criticizes the Soviet state or Soviet system." },
      { id: "stalinism", label: "Stalinism", description: "The work targets Stalinism specifically." },
      { id: "totalitarian-state", label: "Totalitarian State", description: "The work criticizes totalitarian rule as a political form." },
      { id: "surveillance-state", label: "Surveillance State", description: "The work attacks a state built on pervasive surveillance." },
      { id: "fascism", label: "Fascism", description: "The work criticizes fascism as ideology or regime type." },
      { id: "nazism", label: "Nazism", description: "The work criticizes Nazism specifically." },
      { id: "monarchy", label: "Monarchy", description: "The work criticizes hereditary monarchy or court rule." },
      { id: "military-dictatorship", label: "Military Dictatorship", description: "The work targets military rule or junta politics." },
      { id: "apartheid", label: "Apartheid", description: "The work criticizes apartheid as a system of racial rule." },
      { id: "colonialism", label: "Colonialism", description: "The work criticizes colonial rule or settler domination." },
      { id: "imperialism", label: "Imperialism", description: "The work criticizes empire or unequal foreign domination." },
      { id: "american-imperialism", label: "American Imperialism", description: "The work specifically targets U.S. imperial or cultural dominance." },
      { id: "militarism", label: "Militarism", description: "The work criticizes militarist culture or permanent war mentality." },
    ],
  },
  {
    id: "social-orders-and-institutions",
    label: "Social Orders and Institutions",
    tags: [
      { id: "capitalism", label: "Capitalism", description: "The work criticizes capitalism as an economic or social order." },
      { id: "consumer-capitalism", label: "Consumer Capitalism", description: "The work criticizes market society organized around consumption and status." },
      { id: "industrial-capitalism", label: "Industrial Capitalism", description: "The work attacks industrial exploitation or factory capitalism." },
      { id: "oligarchy", label: "Oligarchy", description: "The work criticizes rule by a narrow, wealthy elite." },
      { id: "slavery", label: "Slavery", description: "The work criticizes slavery as an institution." },
      { id: "white-supremacy", label: "White Supremacy", description: "The work attacks white supremacy or racial domination." },
      { id: "patriarchy", label: "Patriarchy", description: "The work criticizes patriarchal authority or gender hierarchy." },
      { id: "prison-system", label: "Prison System", description: "The work criticizes prisons, incarceration, or penal power." },
      { id: "state-bureaucracy", label: "State Bureaucracy", description: "The work targets bureaucratic state machinery and its dehumanizing effects." },
      { id: "technocracy", label: "Technocracy", description: "The work criticizes expert-managed or engineered social control." },
    ],
  },
];

export const banReasonTagIds = new Set(
  banReasonTagGroups.flatMap((group) => group.tags.map((tag) => tag.id)),
);

export const criticismTargetTagIds = new Set(
  criticismTargetTagGroups.flatMap((group) => group.tags.map((tag) => tag.id)),
);

const banReasonAliasMap = {
  "offensive-language": "profanity",
  "queer-sexuality": "queer-content",
};

export function normalizeBanReasonTag(rawTag) {
  const normalized = rawTag.trim().toLowerCase().replace(/[\s_]+/g, "-");
  return banReasonAliasMap[normalized] ?? normalized;
}

export function normalizeBanReasonTags(tags) {
  return [...new Set(tags.map(normalizeBanReasonTag))];
}
