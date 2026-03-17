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

## Notes

- The current dataset favors broad seed coverage plus explicit provenance over exhaustive per-work archival research.
- Some recommendation sources are intentionally present before deep harvesting so they can already power the "Counter and critical readings" sections.
- The next harvesting phase should concentrate on primary or quasi-primary ban records, especially for Roman, Papal, Bangladeshi, Soviet, and apartheid-era entries.
