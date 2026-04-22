# Sources Ledger

This file tracks the source set currently harvested or queued for the Forbidden Books Wiki seed dataset. Status meanings:

- `not started`: listed for future use, not yet harvested into notes beyond metadata.
- `partial`: harvested for at least one work, but not exhaustively mined across the corpus.
- `complete`: fully harvested for the current scoped use.

## Active Sources

| Source ID | Harvest status | Scope | Notes |
| --- | --- | --- | --- |
| `wikipedia-government-list` | partial | Seed list, linked country tables, and initial harvesting targets. | [Wikipedia: List of books banned by governments](https://en.wikipedia.org/wiki/List_of_books_banned_by_governments). Primary discovery source only. |
| `wikipedia-summary-api` | partial | Short summaries and Wikimedia-hosted thumbnails for page cards. | [Wikipedia REST summary API](https://en.wikipedia.org/api/rest_v1/). Used for thumbnails and orientation, not for standalone verification. |
| `karolides-1999` | partial | General censorship reference used across the seed dataset. | [100 Banned Books: Censorship Histories of World Literature](https://books.google.com/books?id=Ab8vAQAAIAAJ). Core secondary source across many records. |
| `haight-1978` | partial | Historical reference for classical, modern, and obscenity-related bans. | [Banned Books: 387 B.C. to 1978 A.D.](https://archive.org/details/bannedbooks387bc0000haig). Strong for older and obscenity-related cases. |
| `encyclopedia-censorship-2005` | partial | Country and censorship-background reference. | [Encyclopedia of Censorship](https://books.google.com/books?id=bunHURgi7FcC). Used for jurisdiction context and cross-checking. |
| `bald-religious-grounds` | partial | Religious censorship and blasphemy-related bans. | [Banned Books: Literature Suppressed on Religious Grounds](https://archive.org/details/literaturesuppre0000bald). Key source for scripture, blasphemy, and heresy cases. |
| `sova-sexual-grounds` | partial | Sexual-obscenity prosecutions and bans. | [Banned Books: Literature Suppressed on Sexual Grounds](https://archive.org/details/literaturesuppre0000sova_r9r5). Core obscenity reference. |
| `wlc-edict-against-arius` | partial | Primary text reference for Arius and the Roman ban on his writings. | [Edict Against Arius](https://faculty.wlc.edu/strohbehn/ChurchHistory/Urkunden/Ch%2018%20Edict%20Against%20Arius.htm). Used for `Thalia`. |
| `national-archives-australia-droll-stories` | partial | Australian censorship example for Balzac's Droll Stories. | [National Archives of Australia: Droll Stories](https://bannedpublications.naa.gov.au/record/droll-stories). |
| `australia-classification-american-psycho` | partial | Official classification record for Bret Easton Ellis. | [Australian Classification: American Psycho](https://www.classification.gov.au/titles/american-psycho-c-1991). |
| `dw-rushdie-fatwa` | partial | Context for the Rushdie affair and government bans. | [Deutsche Welle: The Rushdie fatwa, 25 years on](https://www.dw.com/en/the-rushdie-fatwa-25-years-on/a-17425932). |
| `ala-satanic-verses-timeline` | partial | Broad cross-jurisdiction ban list and restriction notes for The Satanic Verses. | [ALA Intellectual Freedom Blog: Timeline entry for 1989 - The Satanic Verses](https://www.oif.ala.org/timeline-entry-for-1989-the-satanic-verses/). Useful for the first-pass country census. |
| `ap-india-satanic-verses-2024` | partial | India's 1988 import ban and the 2024 Delhi High Court proceeding that undermined it. | [AP: India's ban on Salman Rushdie's 'The Satanic Verses' may end - thanks to missing paperwork](https://apnews.com/article/4b389bd17238c50c7a1373bc38896490). |
| `indian-express-satanic-verses-2024` | partial | Timeline of the novel's first-wave bans across South Asia, Southeast Asia, and Africa. | [The Indian Express: Storm of controversies across globe](https://indianexpress.com/article/research/storm-of-controversies-across-globe-as-satanic-verses-appears-for-sale-in-delhi-a-look-at-how-it-was-first-received-9752880/). |
| `time-censored-satanic-verses` | partial | Secondary summary of the novel's censorship trail, especially Japan and Venezuela. | [TIME: The Satanic Verses](https://entertainment.time.com/2011/01/06/removing-the-n-word-from-huck-finn-top-10-censored-books/slide/the-satanic-verses/). |
| `upi-iran-fatwa-satanic-verses-1989` | partial | Contemporaneous report on Iran's February 14, 1989 state-backed fatwa. | [UPI Archives: Ayatollah Khomeini issues a fatwa against author of The Satanic Verses](https://www.upi.com/Archives/1989/02/14/Ayatollah-Khomeini-issues-a-fatwa-against-author-of-The-Satanic-Verses/1542603435600/). |
| `upi-jordan-satanic-verses-1989` | partial | Contemporaneous report on Jordan's library and border ban. | [UPI Archives: Jordan bans 'The Satanic Verses'](https://www.upi.com/Archives/1989/02/26/Jordan-bans-The-Satanic-Verses/4889604472400/). |
| `brunei-undesirable-publications-satanic-verses` | partial | Official Brunei order prohibiting the importation, sale, or circulation of The Satanic Verses. | [Laws of Brunei: Undesirable Publications](https://www.agc.gov.bn/AGC%20Images/LAWS/ACT_PDF/cap025%2C%20O1.pdf). Primary-law source listing the book under `GN 328/89`. |
| `singapore-mha-satanic-verses-2017` | partial | Official retrospective confirmation that Singapore banned The Satanic Verses in 1989. | [Singapore Ministry of Home Affairs: Ministerial Statement on Restricting Hate Speech](https://www.mha.gov.sg/media-room/newsroom/ministerial-statement-on-restricting-hate-speech-to-maintain-racial-and-religious-harmony-in-singapore-speech-by-mr-k-shanmugam-minister-for-home-affairs-and-minister-for-law/). |
| `latimes-turkey-satanic-verses-1989` | partial | Associated Press archive item on Turkey's 1989 import, sale, and distribution ban. | [Los Angeles Times: Turkey Bans Rushdie Book](https://www.latimes.com/archives/la-xpm-1989-09-30-mn-221-story.html). |
| `al-ahram-seaweeds` | partial | Egyptian controversy over A Feast for the Seaweeds. | [Al-Ahram Weekly: Off the shelf - and then where?](https://weekly.ahram.org.eg/2001/519/cu7.htm). |
| `bbc-taslima-1999` | partial | Bangladesh memoir and novel bans connected to Taslima Nasrin. | [BBC News: Bangladesh bans new Taslima book](http://news.bbc.co.uk/2/hi/south_asia/419428.stm). |
| `bbc-taslima-2002` | partial | Later Bangladesh bans involving Taslima Nasrin. | [BBC News: Bangladesh bans third Taslima book](http://news.bbc.co.uk/2/hi/south_asia/2218972.stm). |
| `latimes-clandestine-chile` | partial | Chile ban and destruction of Clandestine in Chile. | [Los Angeles Times: 14,846 Books by Nobel Prize Winner Burned in Chile](https://www.latimes.com/archives/la-xpm-1987-01-25-mn-5720-story.html). |
| `reuters-russia-quran-2013` | partial | Russian court ban on a Quran translation. | [Reuters: Russian Muslim Clerics Warn of Unrest Over Ban of Translation of Koran](https://www.reuters.com/article/us-russia-koran-idUSBRE98J0YW20130920). |
| `russia-moscow-times-quran` | partial | Follow-up reporting on the overturned Quran-translation ban. | [The Moscow Times: Ban of Quran Translation Overturned, Easing Fears of Unrest](https://www.themoscowtimes.com/archive/ban-of-quran-translation-overturned-easing-fears-of-unrest). |
| `hitchens-assassins-of-the-mind` | partial | Counter-reading on censorship, Rushdie, and free expression. | [Christopher Hitchens: Assassins of the Mind](https://www.vanityfair.com/news/2009/02/rushdie200902). |
| `malik-from-fatwa-to-jihad` | not started | Counter-reading on the politics of the Rushdie affair and later free-speech conflicts. | [From Fatwa to Jihad](https://www.malikonline.co.uk/books/from-fatwa-to-jihad/). Listed for recommendations; not yet harvested deeply. |
| `arendt-origins-totalitarianism` | not started | Shared counter-reading for authoritarian and anti-totalitarian works. | [The Origins of Totalitarianism](https://www.penguinrandomhouse.com/books/307494/the-origins-of-totalitarianism-by-hannah-arendt/). |
| `snyder-on-tyranny` | not started | Shared counter-reading for authoritarian and fascist texts. | [On Tyranny](https://timothysnyder.org/on-tyranny). |
| `evans-third-reich` | not started | Shared counter-reading for Nazi propaganda, bans, and antisemitic texts. | [The Third Reich in Power, 1933-1939](https://www.penguinrandomhouse.com/books/294831/the-third-reich-in-power-1933-1939-by-richard-j-evans/). |
| `ushmm-holocaust` | partial | Shared counter-reading for fascist, antisemitic, or Holocaust-denial texts. | [USHMM: Introduction to the Holocaust](https://encyclopedia.ushmm.org/content/en/article/introduction-to-the-holocaust). |
| `adl-turner-diaries` | partial | Public contextual article on the Turner Diaries and extremist violence. | [ADL: The Turner Diaries](https://www.adl.org/resources/backgrounder/turner-diaries). |
| `lipstadt-denying-the-holocaust` | not started | Shared counter-reading for Holocaust-denial and revisionist texts. | [Denying the Holocaust](https://www.penguinrandomhouse.com/books/189620/denying-the-holocaust-by-deborah-e-lipstadt/). |
| `baldwin-everybodys-protest-novel` | partial | Classic critique connected to Uncle Tom's Cabin and protest fiction. | [Everybody's Protest Novel](https://harpers.org/archive/1949/06/everybodys-protest-novel/). |
| `fanon-wretched-of-the-earth` | not started | Shared counter-reading for colonial, racial, and liberation-era works. | [The Wretched of the Earth](https://groveatlantic.com/book/the-wretched-of-the-earth/). |
| `who-suicide-prevention` | partial | Counter-reading for suicide manuals and assisted-dying instruction texts. | [World Health Organization: Suicide prevention](https://www.who.int/health-topics/suicide). |
| `new-republic-camp-of-the-saints-2018` | partial | Critical history of The Camp of the Saints and its adoption by the modern far right. | [The New Republic: The Notorious Book That Ties the Right to the Far Right](https://newrepublic.com/article/146925/notorious-book-ties-right-far-right). |
| `splc-miller-camp-of-the-saints-2019` | partial | American far-right circulation and political influence of The Camp of the Saints. | [SPLC Hatewatch: Miller pushed racist 'Camp of the Saints' beloved by far right](https://www.splcenter.org/resources/hatewatch/miller-pushed-racist-camp-saints-beloved-far-right/). |
| `pharos-camp-of-the-saints-2020` | partial | Public critical essay on the novel's race panic, classical imagery, and xenophobic politics. | [Pharos: Jean Raspail's Camp of the Saints, the fall of Rome, and white nationalist xenophobia](https://pharos.vassarspaces.net/2020/09/16/jean-raspail-camp-of-saints-fall-of-rome-xenophobia/). |
| `le-monde-camp-of-the-saints-2026` | partial | Recent synthesis of the novel's publication history, French reception, and far-right revival. | [Le Monde: How 'The Camp of the Saints' became the far right's cult novel, from the Le Pens to MAGA](https://www.lemonde.fr/en/m-le-mag/article/2026/04/05/how-the-camp-of-the-saints-became-the-far-right-s-cult-novel-from-the-le-pens-to-maga_6752128_117.html). |
| `blaze-camp-of-the-saints-amazon-2026` | partial | Reported April 2026 temporary Amazon delisting and restoration of a paperback edition. | [The Blaze: Amazon yanks anti-immigration novel, accidentally sends it rocketing up the charts](https://www.theblaze.com/news/amazon-yanks-anti-immigration-novel-accidentally-sends-it-rocketing-up-the-charts). Used only for a reported non-state platform restriction claim. |

## Notes

- The current dataset favors broad seed coverage plus explicit provenance over exhaustive per-work archival research.
- Some recommendation sources are intentionally present before deep harvesting so they can already power the "Counter and critical readings" sections.
- The next harvesting phase should concentrate on primary or quasi-primary ban records, especially for Roman, Papal, Bangladeshi, Soviet, and apartheid-era entries.
