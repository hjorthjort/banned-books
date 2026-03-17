#!/usr/bin/env python3

from __future__ import annotations

import csv
import io
import json
import re
import subprocess
import sys
import unicodedata
import urllib.parse
import urllib.request
from dataclasses import dataclass
from html.parser import HTMLParser
from pathlib import Path
from typing import Callable

ROOT = Path(__file__).resolve().parents[1]
OUTPUT_PATH = ROOT / "scripts" / "data" / "imported-works.json"
USER_AGENT = "ForbiddenBooksWiki/1.0 (+https://forbidden-books.example)"
TARGET_TOTAL_COUNT = 10000

EXISTING_GLOBAL_JURISDICTIONS = {
    "Albania": "albania",
    "Australia": "australia",
    "Austria": "austria",
    "Bangladesh": "bangladesh",
    "Bosnia and Herzegovina": "bosnia-herzegovina",
    "Brazil": "brazil",
    "Canada": "canada",
    "Chile": "chile",
    "China": "china",
    "Czechoslovakia": "czechoslovakia",
    "Egypt": "egypt",
    "El Salvador": "el-salvador",
    "France": "france",
    "Weimar Republic (1918-1933)": "germany",
    "Nazi Germany (1933-1945)": "germany",
    "East Germany (1949-1990)": "east-germany",
    "List of books confiscated for violating Criminal Code 86, 86a, 130 or 130a": "germany",
    "List of books confiscated for violating Criminal Code 131": "germany",
    "Greece": "greece",
    "Guatemala": "guatemala",
    "India": "india",
    "Indonesia": "indonesia",
    "Iran": "iran",
    "Ireland": "ireland",
    "Italy": "italy",
    "Japan": "japan",
    "Kenya": "kenya",
    "Lebanon": "lebanon",
    "Malaysia": "malaysia",
    "Norway": "norway",
    "Pakistan": "pakistan",
    "Papal States": "papal-states",
    "Poland": "poland",
    "Qatar": "qatar",
    "Roman Empire": "roman-empire",
    "Russia": "russia",
    "Soviet Union": "soviet-union",
    "Saudi Arabia": "saudi-arabia",
    "Singapore": "singapore",
    "South Africa": "south-africa",
    "Spain": "spain",
    "Sri Lanka": "sri-lanka",
    "Tanzania": "tanzania",
    "Thailand": "thailand",
    "United Kingdom": "united-kingdom",
    "United States": "united-states",
}

PAGE_PRIORITY = {
    "wikipedia-book-censorship-hong-kong": 500,
    "wikipedia-books-banned-india": 400,
    "wikipedia-book-censorship-china": 350,
    "wikipedia-book-censorship-iran": 300,
    "wikipedia-government-list": 200,
    "wikipedia-books-banned-new-zealand": 150,
    "marshall-project-prison-bans": 75,
}

TITLE_OVERRIDE_TRANSLATIONS = {
    "重構二二八：戰後美中體制、中國統治模式與臺灣": "Reconstructing 228: The Postwar US-China System, China's Governance Model, and Taiwan",
    "香港政治：發展歷程與核心課題": "Hong Kong Politics: Development History and Core Issues",
}

PRISON_STATE_INFO = {
    "az": ("arizona", "Arizona"),
    "ca": ("california", "California"),
    "ct": ("connecticut", "Connecticut"),
    "fl": ("florida", "Florida"),
    "ga": ("georgia", "Georgia"),
    "ia": ("iowa", "Iowa"),
    "il": ("illinois", "Illinois"),
    "ks": ("kansas", "Kansas"),
    "mi": ("michigan", "Michigan"),
    "mt": ("montana", "Montana"),
    "nc": ("north-carolina", "North Carolina"),
    "nj": ("new-jersey", "New Jersey"),
    "or": ("oregon", "Oregon"),
    "ri": ("rhode-island", "Rhode Island"),
    "sc": ("south-carolina", "South Carolina"),
    "tx": ("texas", "Texas"),
    "va": ("virginia", "Virginia"),
    "wi": ("wisconsin", "Wisconsin"),
}

PRISON_STATE_FILES = {
    "az": ["https://s3.amazonaws.com/tmp-gfx-public-data/banned-books20220819/banned_book_data_az-list.csv"],
    "ca": ["https://s3.amazonaws.com/tmp-gfx-public-data/banned-books20220819/banned_book_data_ca-list.csv"],
    "ct": ["https://s3.amazonaws.com/tmp-gfx-public-data/banned-books20220819/banned_book_data_ct-list.csv"],
    "fl": [
        "https://s3.amazonaws.com/tmp-gfx-public-data/banned-books20220819/banned_book_data_fl-list-1.csv",
        "https://s3.amazonaws.com/tmp-gfx-public-data/banned-books20220819/banned_book_data_fl-list-2.csv",
    ],
    "ga": ["https://s3.amazonaws.com/tmp-gfx-public-data/banned-books20220819/banned_book_data_ga-list.csv"],
    "ia": ["https://s3.amazonaws.com/tmp-gfx-public-data/banned-books20220819/banned_book_data_ia-list.csv"],
    "il": ["https://s3.amazonaws.com/tmp-gfx-public-data/banned-books20220819/banned_book_data_il-list-2.csv"],
    "ks": ["https://s3.amazonaws.com/tmp-gfx-public-data/banned-books20220819/banned_book_data_ks-list.csv"],
    "mi": ["https://s3.amazonaws.com/tmp-gfx-public-data/banned-books20220819/banned_book_data_mi-list.csv"],
    "mt": ["https://s3.amazonaws.com/tmp-gfx-public-data/banned-books20220819/banned_book_data_mt-list.csv"],
    "nc": ["https://s3.amazonaws.com/tmp-gfx-public-data/banned-books20220819/banned_book_data_nc-list.csv"],
    "nj": ["https://s3.amazonaws.com/tmp-gfx-public-data/banned-books20220819/banned_book_data_nj-list.csv"],
    "or": ["https://s3.amazonaws.com/tmp-gfx-public-data/banned-books20220819/banned_book_data_or-list.csv"],
    "ri": ["https://s3.amazonaws.com/tmp-gfx-public-data/banned-books20220819/banned_book_data_ri-list.csv"],
    "sc": ["https://s3.amazonaws.com/tmp-gfx-public-data/banned-books20220819/banned_book_data_sc-list.csv"],
    "tx": ["https://s3.amazonaws.com/tmp-gfx-public-data/banned-books20220819/banned_book_data_tx-list.csv"],
    "va": ["https://s3.amazonaws.com/tmp-gfx-public-data/banned-books20220819/banned_book_data_va-list.csv"],
    "wi": [
        "https://s3.amazonaws.com/tmp-gfx-public-data/banned-books20220819/banned_book_data_wi-list-1.csv",
        "https://s3.amazonaws.com/tmp-gfx-public-data/banned-books20220819/banned_book_data_wi-list-2.csv",
    ],
}


def slugify(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode("ascii")
    normalized = re.sub(r"[^\w\s-]", "", normalized.lower()).strip()
    return re.sub(r"\s+", "-", normalized)


def contains_cjk(text: str) -> bool:
    return bool(re.search(r"[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]", text))


def contains_non_latin(text: str) -> bool:
    for char in text:
        if char.isalpha() and ord(char) > 127:
            return True
    return False


def clean_text(value: str) -> str:
    value = value.replace("\xa0", " ").replace("–", "-").replace("—", "-")
    value = re.sub(r"\[[^\]]+\]", "", value)
    return re.sub(r"\s+", " ", value).strip(" ;,")


def short_note(value: str, limit: int = 320) -> str:
    value = clean_text(value)
    if len(value) <= limit:
        return value
    truncated = value[: limit - 1].rsplit(" ", 1)[0].rstrip(".,;: ")
    return f"{truncated}."


def sentence_split(value: str) -> list[str]:
    value = clean_text(value)
    if not value:
        return []
    parts = re.split(r"(?<=[.!?])\s+", value)
    return [part.strip() for part in parts if part.strip()]


def title_case(value: str) -> str:
    words = []
    for word in value.split():
        if word.isupper() and len(word) <= 4:
            words.append(word)
        else:
            words.append(word[:1].upper() + word[1:])
    return " ".join(words)


def extract_year(value: str | None) -> int | None:
    if not value:
        return None
    match = re.search(r"(\d{4})", value)
    if not match:
        return None
    return int(match.group(1))


def normalize_year_text(value: str | None) -> str | None:
    value = clean_text(value or "")
    if not value or value in {"*Unknown*", "Unknown"}:
        return None
    return value


def format_list(values: list[str]) -> str:
    values = [value for value in values if value]
    if not values:
        return ""
    if len(values) == 1:
        return values[0]
    if len(values) == 2:
        return f"{values[0]} and {values[1]}"
    return f"{', '.join(values[:-1])}, and {values[-1]}"


def normalize_author(raw: str) -> str:
    raw = clean_text(raw)
    if not raw:
        return "Unknown author"

    if " / " in raw:
        _, latin = raw.split(" / ", 1)
        raw = latin

    raw = raw.rstrip(".")
    if re.match(r"^[^,]+,\s*[^,]+$", raw):
        surname, given = [part.strip() for part in raw.split(",", 1)]
        raw = f"{given} {surname}"

    return raw


def normalize_work_type(raw: str) -> str:
    raw = clean_text(raw)
    if not raw:
        return "Book"

    lowered = raw.lower()
    replacements = {
        "children's novel/adventure": "Children's novel",
        "childrens novel/adventure": "Children's novel",
        "non-fiction novel": "Non-fiction study",
        "novels": "Novel",
        "short stories": "Short story collection",
    }
    if lowered in replacements:
        return replacements[lowered]
    if lowered == "political":
        return "Political memoir"
    if lowered == "religious":
        return "Religious tract"
    if lowered == "criticism":
        return "Critical study"
    return raw[:1].upper() + raw[1:]


def content_sentence_from_note(note: str) -> str | None:
    sentences = sentence_split(note)
    if not sentences:
        return None

    preferred_prefixes = (
        "this ",
        "the book ",
        "it ",
        "a ",
        "an ",
        "novel ",
        "memoir ",
        "autobiography ",
        "collection ",
    )

    for sentence in sentences:
        lowered = sentence.lower()
        if lowered.startswith(preferred_prefixes) or any(
            phrase in lowered for phrase in ("is about", "describes", "contains", "collects", "focuses on")
        ):
            return sentence

    return sentences[0]


def detect_profile(
    note: str, title: str, work_type: str, jurisdiction_id: str
) -> tuple[list[str], list[str], list[str], str]:
    haystack = f"{title} {work_type} {note}".lower()
    reason_tags: list[str] = []
    content_tags: list[str] = []
    counter_themes = ["censorship"]

    if any(term in haystack for term in ("obscene", "obscenity", "indecent", "porn", "erotic", "sexual")):
        reason_tags.extend(["obscenity", "public-morality"])
        content_tags.extend(["sexuality", "morality", "print scandal"])
        counter_themes = ["obscenity", "censorship"]
        hook = "Its interest lies partly in the way literary or informational writing gets collapsed into a public-morality problem."
    elif any(term in haystack for term in ("islam", "quran", "koran", "prophet", "blasphem", "religious", "church", "heresy")):
        reason_tags.extend(["religious-offense", "religious-control"])
        content_tags.extend(["religion", "doctrine", "public controversy"])
        counter_themes = ["religious-freedom", "censorship"]
        hook = "What makes it interesting is that interpretation, devotion, satire, or doctrinal conflict becomes a matter of state administration."
    elif any(
        term in haystack
        for term in (
            "criminal activity",
            "security issue",
            "safety/security",
            "institutional security",
            "contraband",
            "escape",
            "weapon",
            "wiring information",
            "computer security",
            "mailroom",
            "prison",
            "corrections",
        )
    ):
        reason_tags.extend(["instructional-harm", "public-order"])
        content_tags.extend(["institutional control", "risk knowledge", "circulation politics"])
        counter_themes = ["censorship"]
        hook = "What makes it interesting is the prison-censorship logic: officials treat the book as a practical threat model and collapse the distinction between reading about something and doing it."
    elif any(term in haystack for term in ("violence", "violent", "murder", "killing", "assassin", "terror")):
        reason_tags.extend(["violence", "incitement-to-violence"])
        content_tags.extend(["violence", "risk", "sensational culture"])
        counter_themes = ["censorship"]
        hook = "Its interest lies in how censors blur depiction, endorsement, and imitation, treating a book's violent material as if it were already an act."
    elif any(term in haystack for term in ("communist", "ccp", "party", "dissident", "national security", "state", "government", "revolution", "sovereignty", "democracy", "dictator", "military")):
        reason_tags.extend(["political-dissent", "political-control"])
        content_tags.extend(["politics", "state power", "public argument"])
        counter_themes = ["authoritarianism", "censorship"]
        hook = "What makes it interesting is the way a book becomes legible to officials as a political instrument rather than a neutral cultural object."
    elif any(term in haystack for term in ("race", "slavery", "colonial", "apartheid", "empire")):
        reason_tags.extend(["racial-politics", "political-sensitivity"])
        content_tags.extend(["race", "history", "political memory"])
        counter_themes = ["race-politics", "colonialism"]
        hook = "Its significance comes from how questions of race, empire, or hierarchy remain live enough to provoke official suppression."
    elif "hong-kong" == jurisdiction_id:
        reason_tags.extend(["political-dissent", "national-security"])
        content_tags.extend(["hong kong", "public argument", "political memory"])
        counter_themes = ["authoritarianism", "censorship"]
        hook = "Even with sparse bibliographic metadata, the work is interesting because its very availability became part of a struggle over Hong Kong's public sphere."
    else:
        reason_tags.extend(["political-sensitivity"])
        content_tags.extend(["controversy", "publication history", "state scrutiny"])
        counter_themes = ["censorship"]
        hook = "The surviving record is interesting because it shows how even ordinary-looking books can acquire a charged political afterlife."

    return sorted(set(reason_tags)), sorted(set(content_tags)), counter_themes, hook


def detect_language(original_title: str | None, jurisdiction_id: str) -> str | None:
    if original_title and contains_cjk(original_title):
        return "Chinese"
    if jurisdiction_id == "hong-kong":
        return "Chinese"
    if jurisdiction_id == "iran" and original_title:
        return "Persian"
    return None


TRANSLATION_CACHE: dict[str, str] = {}


def translate_to_english(text: str) -> str:
    text = clean_text(text)
    if not text:
        return text
    if text in TITLE_OVERRIDE_TRANSLATIONS:
        return TITLE_OVERRIDE_TRANSLATIONS[text]
    if text in TRANSLATION_CACHE:
        return TRANSLATION_CACHE[text]

    url = (
        "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q="
        + urllib.parse.quote(text)
    )
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(request, timeout=5) as response:
            payload = json.loads(response.read().decode("utf8"))
        translated = clean_text("".join(part[0] for part in payload[0] if part and part[0]))
    except Exception:
        translated = text
    TRANSLATION_CACHE[text] = translated or text
    return TRANSLATION_CACHE[text]


def strip_trailing_year(title: str) -> str:
    return clean_text(re.sub(r"\s*\((?:c\.\s*)?\d{4}\)\s*$", "", title))


def parse_title_variants(raw_title: str, source_id: str) -> tuple[str, str | None, str | None, str | None]:
    cleaned = strip_trailing_year(raw_title)

    if " = " in cleaned:
        left, right = [clean_text(part) for part in cleaned.split(" = ", 1)]
        if contains_non_latin(left) and right and not contains_non_latin(right):
            return right, left, None, None
        if left and not contains_non_latin(left) and contains_non_latin(right):
            return left, right, None, None

    if " ; " in cleaned and contains_non_latin(cleaned.split(" ; ", 1)[0]):
        original_title, romanized = [clean_text(part) for part in cleaned.split(" ; ", 1)]
        return title_case(romanized), original_title, romanized, (
            "This page currently uses the source-listed romanized form because a stable English bibliographic rendering "
            "has not yet been attached to the record. The original title is preserved here for later cleanup."
        )

    if " / " in cleaned and contains_non_latin(cleaned.split(" / ", 1)[0]):
        original_title, romanized = [clean_text(part) for part in cleaned.split(" / ", 1)]
        english_title = title_case(romanized)
        note = (
            "This page currently uses the source-listed romanized form because a stable English bibliographic rendering "
            "has not yet been attached to the record. The original title is preserved here for later cleanup."
        )

        should_translate = len(original_title) <= 18 and ":" not in original_title and "：" not in original_title
        if should_translate:
            translated = clean_text(translate_to_english(original_title))
            if translated and not contains_non_latin(translated):
                english_title = title_case(translated)
                note = (
                    "This page uses a provisional English rendering generated from the source-listed title. "
                    "The original title and romanized form are preserved here because fuller English bibliographic coverage is still pending."
                )
        return english_title, original_title, romanized, note

    match = re.match(r"^(.*?)\s+\(([^()]+)\)$", cleaned)
    if match:
        left, inner = clean_text(match.group(1)), clean_text(match.group(2))
        if contains_non_latin(left) and inner and not contains_non_latin(inner):
            return inner, left, None, None
        if left and not contains_non_latin(left) and contains_non_latin(inner):
            return left, inner, None, None
        if source_id == "wikipedia-book-censorship-iran" and inner and not contains_non_latin(inner):
            note = (
                "The title shown here follows the source page's parenthetical English rendering; "
                "the romanized source form is preserved for search and future cleanup."
            )
            return inner, None, left, note

    if contains_cjk(cleaned):
        translated = clean_text(translate_to_english(cleaned))
        if translated and not contains_non_latin(translated):
            note = (
                "This page uses a provisional English rendering generated from the source-listed title. "
                "The original title is preserved here because fuller English bibliographic coverage is still pending."
            )
            return title_case(translated), cleaned, None, note

    return cleaned, None, None, None


def title_key(title: str, authors: list[str]) -> tuple[str, str]:
    normalized_title = re.sub(r"\s+", " ", clean_text(title).lower())
    author_key = normalize_author(authors[0] if authors else "").lower()
    return normalized_title, author_key


def fetch_text(url: str) -> str:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=60) as response:
        return response.read().decode("utf8", "ignore")


def fetch_csv_rows(url: str) -> list[dict[str, str]]:
    payload = fetch_text(url)
    return list(csv.DictReader(io.StringIO(payload)))


def looks_like_placeholder_title(title: str) -> bool:
    cleaned = clean_text(title)
    if not cleaned:
        return True
    if re.fullmatch(r"\[[^\]]*language characters[^\]]*\][\s\.\-:;]*", cleaned, flags=re.IGNORECASE):
        return True
    if not re.search(r"[A-Za-z0-9\u0080-\uffff]", cleaned):
        return True
    return False


def prison_reason_tags(reason: str) -> list[str]:
    haystack = reason.lower()
    tags: list[str] = []

    if any(term in haystack for term in ("sexual", "nudity", "obscene", "porn", "erotic")):
        tags.extend(["obscenity", "public-morality"])
    if any(term in haystack for term in ("criminal activity", "security", "safety", "escape", "weapon", "hacking", "contraband")):
        tags.extend(["instructional-harm", "public-order"])
    if any(term in haystack for term in ("violence", "violent", "kill", "mutilat", "terror")):
        tags.extend(["violence", "incitement-to-violence"])
    if any(term in haystack for term in ("relig", "quran", "islam", "prophet")):
        tags.extend(["religious-offense", "religious-control"])

    return sorted(set(tags))


def build_prison_note(state_name: str, reason: str) -> str:
    base = (
        f"The {state_name} prison-ban record treats the book as excluded reading inside state custody, "
        "which shows how prison and mailroom censorship function as a government reading regime."
    )
    reason = short_note(reason, 220)
    if reason:
        return f"{base} The exported reason says: {reason}"
    return f"{base} The exported row does not preserve a fuller justification."


def build_description_paragraphs(
    title: str,
    authors: list[str],
    work_type: str,
    jurisdiction_name: str,
    title_note: str | None,
    content_sentence: str | None,
    interest_hook: str,
    note: str,
) -> list[str]:
    author_label = format_list(authors)
    lower_type = work_type.lower()

    first = f"{title} is a {lower_type} by {author_label}."
    if content_sentence:
        first = f"{first} {content_sentence}"
    elif title_note:
        first = f"{first} {title_note}"
    else:
        first = f"{first} The current record survives chiefly through censorship documentation rather than a full English-language critical apparatus."

    second = (
        f"{interest_hook} As a {lower_type}, it can be read not only for subject matter but for the way form, tone, "
        "and circulation make a text feel dangerous, intimate, or politically usable to anxious officials."
    )

    third = (
        f"It also matters as part of a wider censorship history in {jurisdiction_name}. "
        f"The present page is a dossier starter built from source-tracked ban records; the surviving note currently says: {short_note(note, 220)} "
        "More publication history, translations, and close reading can be added later."
    )

    return [first, second, third]


def build_description(title: str, work_type: str, authors: list[str], content_sentence: str | None) -> str:
    author_label = format_list(authors)
    base = f"{title} is a {work_type.lower()} by {author_label}."
    if content_sentence:
        return f"{base} {content_sentence}"
    return base


def make_section_status() -> dict[str, str]:
    return {
        "bibliographic": "seeded",
        "description": "seeded",
        "banningOverview": "seeded",
        "counterReadings": "reviewed",
    }


class WikiTableParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.current_heading: str | None = None
        self.heading_level: str | None = None
        self.heading_text: list[str] = []
        self.in_heading = False
        self.skip_depth = 0
        self.table_depth = 0
        self.tables: list[dict[str, object]] = []
        self.current_table: dict[str, object] | None = None
        self.current_row: list[dict[str, object]] | None = None
        self.current_cell: dict[str, object] | None = None

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attrs_map = {key: value or "" for key, value in attrs}

        if tag in {"style", "script", "sup"}:
            self.skip_depth += 1
            return

        if self.skip_depth:
            return

        if tag in {"h2", "h3", "h4"}:
            self.in_heading = True
            self.heading_level = tag
            self.heading_text = []
            return

        if tag == "table" and "wikitable" in attrs_map.get("class", ""):
            self.table_depth += 1
            if self.table_depth == 1:
                self.current_table = {"heading": self.current_heading, "rows": []}
            return

        if self.table_depth != 1:
            return

        if tag == "tr":
            self.current_row = []
        elif tag in {"td", "th"} and self.current_row is not None:
            self.current_cell = {
                "text": [],
                "rowspan": int(attrs_map.get("rowspan", "1") or "1"),
                "colspan": int(attrs_map.get("colspan", "1") or "1"),
            }
        elif tag == "br" and self.current_cell is not None:
            self.current_cell["text"].append("\n")

    def handle_endtag(self, tag: str) -> None:
        if self.skip_depth:
            if tag in {"style", "script", "sup"}:
                self.skip_depth -= 1
            return

        if tag in {"h2", "h3", "h4"} and self.in_heading and tag == self.heading_level:
            heading = clean_text("".join(self.heading_text)).replace("[edit]", "")
            self.current_heading = clean_text(heading)
            self.in_heading = False
            self.heading_level = None
            return

        if tag == "table" and self.table_depth:
            if self.table_depth == 1 and self.current_table is not None:
                self.tables.append(self.current_table)
                self.current_table = None
            self.table_depth -= 1
            return

        if self.table_depth != 1:
            return

        if tag in {"td", "th"} and self.current_cell is not None and self.current_row is not None:
            self.current_cell["text"] = clean_text("".join(self.current_cell["text"]))
            self.current_row.append(self.current_cell)
            self.current_cell = None
        elif tag == "tr" and self.current_row is not None and self.current_table is not None:
            if any(cell.get("text") for cell in self.current_row):
                self.current_table["rows"].append(self.current_row)
            self.current_row = None

    def handle_data(self, data: str) -> None:
        if self.skip_depth:
            return
        if self.in_heading:
            self.heading_text.append(data)
        elif self.current_cell is not None:
            self.current_cell["text"].append(data)


def resolve_rowspans(rows: list[list[dict[str, object]]]) -> list[list[str]]:
    active: list[list[object] | None] = []
    resolved_rows: list[list[str]] = []

    for row in rows:
        resolved: list[str] = []
        cells = list(row)
        column = 0

        while cells or any(slot and int(slot[0]) > 0 for slot in active[column:]):
            while column < len(active) and active[column] and int(active[column][0]) > 0:
                cell = active[column][1]
                resolved.append(str(cell["text"]))
                active[column][0] = int(active[column][0]) - 1
                column += 1
                if cells:
                    break

            if column < len(active) and active[column] and int(active[column][0]) > 0:
                continue

            if not cells:
                continue

            cell = cells.pop(0)
            colspan = int(cell["colspan"])
            rowspan = int(cell["rowspan"])
            for _ in range(colspan):
                resolved.append(str(cell["text"]))
                if rowspan > 1:
                    while len(active) <= column:
                        active.append(None)
                    active[column] = [rowspan - 1, cell]
                column += 1

        resolved_rows.append(resolved)

    return resolved_rows


def fetch_tables(page_title: str) -> list[dict[str, object]]:
    url = (
        "https://en.wikipedia.org/w/api.php?action=parse&prop=text&format=json&page="
        + urllib.parse.quote(page_title)
    )
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=30) as response:
        payload = json.loads(response.read().decode("utf8"))
    parser = WikiTableParser()
    parser.feed(payload["parse"]["text"]["*"])
    return parser.tables


def load_existing_baseline() -> tuple[set[tuple[str, str]], set[str]]:
    command = [
        "node",
        "-e",
        (
            "import('./scripts/data/works.mjs').then(({works}) => {"
            "process.stdout.write(JSON.stringify(works.map((work) => ({ title: work.title, authors: work.authors }))));"
            "});"
        ),
    ]
    result = subprocess.run(
        command,
        cwd=ROOT,
        capture_output=True,
        check=True,
        text=True,
    )
    payload = json.loads(result.stdout)
    keys = {title_key(item["title"], item.get("authors", [])) for item in payload}
    titles = {slugify(item["title"]) for item in payload}
    return keys, titles


@dataclass
class Candidate:
    source_id: str
    jurisdiction_id: str
    title: str
    original_title: str | None
    romanized_title: str | None
    title_note: str | None
    authors: list[str]
    work_type: str
    published_year_text: str | None
    original_language: str | None
    description: str
    description_paragraphs: list[str]
    content_tags: list[str]
    counter_themes: list[str]
    source_ids: list[str]
    description_source_ids: list[str]
    ban_events: list[dict[str, object]]
    priority: int

    @property
    def key(self) -> tuple[str, str]:
        return title_key(self.title, self.authors)


def build_candidate(
    *,
    source_id: str,
    jurisdiction_id: str,
    jurisdiction_name: str,
    raw_title: str,
    raw_author: str,
    raw_type: str,
    raw_published: str | None,
    raw_date: str | None,
    note: str,
    governing_body: str,
    action_type: str,
    extra_reason_tags: list[str] | None = None,
    date_fallback: str | None = None,
    start_year_fallback: int | None = None,
) -> Candidate | None:
    title, original_title, romanized_title, title_note = parse_title_variants(raw_title, source_id)
    if original_title in TITLE_OVERRIDE_TRANSLATIONS:
        title = TITLE_OVERRIDE_TRANSLATIONS[original_title]
        title_note = (
            "This page uses a provisional English rendering generated from the source-listed title. "
            "The original title and romanized form are preserved here because fuller English bibliographic coverage is still pending."
        )
    title = clean_text(title)
    if not title:
        return None

    authors = [normalize_author(raw_author)]
    work_type = normalize_work_type(raw_type)
    content_sentence = content_sentence_from_note(note)
    reason_tags, content_tags, counter_themes, interest_hook = detect_profile(note, title, work_type, jurisdiction_id)
    if extra_reason_tags:
        reason_tags = sorted(set(reason_tags + extra_reason_tags))

    published_year_text = normalize_year_text(raw_published)
    original_language = detect_language(original_title, jurisdiction_id)
    description_paragraphs = build_description_paragraphs(
        title=title,
        authors=authors,
        work_type=work_type,
        jurisdiction_name=jurisdiction_name,
        title_note=title_note,
        content_sentence=content_sentence,
        interest_hook=interest_hook,
        note=note,
    )
    description = build_description(title, work_type, authors, content_sentence)

    start_year = extract_year(raw_date) or extract_year(note) or start_year_fallback
    date_text = clean_text(raw_date or date_fallback or "")
    if not date_text:
        date_text = str(start_year) if start_year else "Date not yet pinned down"

    reason_summary = short_note(note, 220)
    if not reason_summary:
        reason_summary = f"Authorities treated the work as objectionable under the current {jurisdiction_name} censorship record."

    ban_event = {
        "jurisdictionId": jurisdiction_id,
        "governingBody": governing_body,
        "dateText": date_text,
        "actionType": action_type,
        "reasonTags": reason_tags,
        "reasonSummary": reason_summary,
        "note": short_note(note or "This imported record still needs fuller local archival detail.", 260),
        "sourceIds": [source_id],
        "startYear": start_year,
        "endYear": None,
    }

    priority = PAGE_PRIORITY[source_id]
    if title_note:
        priority += 5
    if contains_non_latin(raw_title):
        priority += 5

    return Candidate(
        source_id=source_id,
        jurisdiction_id=jurisdiction_id,
        title=title,
        original_title=original_title,
        romanized_title=romanized_title,
        title_note=title_note,
        authors=authors,
        work_type=work_type,
        published_year_text=published_year_text,
        original_language=original_language,
        description=description,
        description_paragraphs=description_paragraphs,
        content_tags=content_tags,
        counter_themes=counter_themes,
        source_ids=[source_id],
        description_source_ids=[source_id],
        ban_events=[ban_event],
        priority=priority,
    )


def iter_hong_kong_candidates() -> list[Candidate]:
    candidates: list[Candidate] = []
    for table in fetch_tables("Book_censorship_in_Hong_Kong"):
        if table.get("heading") != "List of banned books":
            continue
        rows = resolve_rowspans(table["rows"])
        headers = [header.lower() for header in rows[0]]
        for row in rows[1:]:
            values = row + [""] * (len(headers) - len(row))
            data = dict(zip(headers, values))
            flags = [
                ("public libraries", data.get("banned by public libraries")),
                ("school libraries", data.get("banned by school libraries")),
                ("government e-book and database services", data.get("banned in ebook or e-databases")),
                ("Correctional Services Department collections", data.get("banned by csd")),
            ]
            active_flags = [label for label, value in flags if value == "Y"]
            if not active_flags:
                continue

            note = (
                "The source page records removal or withholding in "
                + format_list(active_flags)
                + " amid the post-2020 tightening of Hong Kong's public reading infrastructure."
            )
            candidate = build_candidate(
                source_id="wikipedia-book-censorship-hong-kong",
                jurisdiction_id="hong-kong",
                jurisdiction_name="Hong Kong",
                raw_title=data.get("title", ""),
                raw_author=data.get("author", ""),
                raw_type="Book",
                raw_published=None,
                raw_date=data.get("disclosure date"),
                note=note,
                governing_body="Hong Kong public libraries and other government-managed collections",
                action_type="removed from government-managed collections",
                extra_reason_tags=["national-security", "political-dissent"],
                start_year_fallback=2020,
            )
            if candidate:
                candidates.append(candidate)
    return candidates


def iter_india_candidates() -> list[Candidate]:
    candidates: list[Candidate] = []
    for table in fetch_tables("List_of_books_banned_in_India"):
        heading = table.get("heading")
        if heading not in {"Nationwide", "Statewide"}:
            continue

        rows = resolve_rowspans(table["rows"])
        headers = [header.lower() for header in rows[0]]
        for row in rows[1:]:
            values = row + [""] * (len(headers) - len(row))
            data = dict(zip(headers, values))
            state_name = data.get("state(s)", "")
            governing_body = (
                f"Government of {state_name}" if state_name else "Government of India or British Indian authorities"
            )
            candidate = build_candidate(
                source_id="wikipedia-books-banned-india",
                jurisdiction_id="india",
                jurisdiction_name="India",
                raw_title=data.get("work", ""),
                raw_author=data.get("author", ""),
                raw_type="Book",
                raw_published=None,
                raw_date=data.get("date"),
                note=data.get("notes", ""),
                governing_body=governing_body,
                action_type="banned publication, sale, or possession",
                start_year_fallback=extract_year(data.get("date")),
            )
            if candidate:
                candidates.append(candidate)
    return candidates


def iter_china_candidates() -> list[Candidate]:
    candidates: list[Candidate] = []
    for table in fetch_tables("Book_censorship_in_China"):
        if table.get("heading") != "List of censored books":
            continue
        rows = resolve_rowspans(table["rows"])
        headers = [header.lower() for header in rows[0]]
        for row in rows[1:]:
            values = row + [""] * (len(headers) - len(row))
            data = dict(zip(headers, values))
            raw_title = data.get("title", "")
            if clean_text(raw_title).lower() == "various works":
                continue

            candidate = build_candidate(
                source_id="wikipedia-book-censorship-china",
                jurisdiction_id="china",
                jurisdiction_name="China",
                raw_title=raw_title,
                raw_author=data.get("author", ""),
                raw_type=data.get("type", "Book"),
                raw_published=None,
                raw_date=None,
                note=data.get("notes", ""),
                governing_body="Chinese state censors and party authorities",
                action_type="banned or suppressed publication",
                start_year_fallback=extract_year(data.get("notes")),
                date_fallback="20th-21st century",
            )
            if candidate:
                candidates.append(candidate)
    return candidates


def iter_iran_candidates() -> list[Candidate]:
    candidates: list[Candidate] = []
    for table in fetch_tables("Book_censorship_in_Iran"):
        if table.get("heading") != "Books banned in Iran":
            continue
        rows = resolve_rowspans(table["rows"])
        headers = [header.lower() for header in rows[0]]
        for row in rows[1:]:
            values = row + [""] * (len(headers) - len(row))
            data = dict(zip(headers, values))
            candidate = build_candidate(
                source_id="wikipedia-book-censorship-iran",
                jurisdiction_id="iran",
                jurisdiction_name="Iran",
                raw_title=data.get("title", ""),
                raw_author=data.get("author", ""),
                raw_type=data.get("type of literature", "Book"),
                raw_published=None,
                raw_date=None,
                note=data.get("references and notes", "") or "The source page lists the work as banned in Iran.",
                governing_body="Iranian censors and the Ministry of Culture and Islamic Guidance",
                action_type="banned or denied publication",
                start_year_fallback=1979,
                date_fallback="Post-1979 Islamic Republic period",
            )
            if candidate:
                candidates.append(candidate)
    return candidates


def iter_global_candidates() -> list[Candidate]:
    candidates: list[Candidate] = []
    for table in fetch_tables("List_of_books_banned_by_governments"):
        heading = clean_text(str(table.get("heading") or ""))
        jurisdiction_id = EXISTING_GLOBAL_JURISDICTIONS.get(heading)
        if not jurisdiction_id:
            continue

        rows = resolve_rowspans(table["rows"])
        if len(rows) <= 1:
            continue

        headers = [header.lower() for header in rows[0]]
        for row in rows[1:]:
            values = row + [""] * (len(headers) - len(row))
            data = dict(zip(headers, values))
            raw_title = data.get("title", "")
            if clean_text(raw_title).lower() in {"works", "all", "various works"}:
                continue

            raw_type = data.get("type", "Book")
            if any(token in raw_type.lower() for token in ("newspaper", "journal", "magazine", "website")):
                continue

            candidate = build_candidate(
                source_id="wikipedia-government-list",
                jurisdiction_id=jurisdiction_id,
                jurisdiction_name=heading,
                raw_title=raw_title,
                raw_author=data.get("author(s)", ""),
                raw_type=raw_type,
                raw_published=data.get("year published"),
                raw_date=data.get("year banned"),
                note=data.get("notes", ""),
                governing_body=f"{heading} authorities",
                action_type="banned publication or circulation",
                start_year_fallback=extract_year(data.get("year banned")) or extract_year(data.get("notes")),
                date_fallback="Date not yet pinned down",
            )
            if candidate:
                candidates.append(candidate)
    return candidates


def iter_new_zealand_candidates() -> list[Candidate]:
    candidates: list[Candidate] = []
    for table in fetch_tables("List_of_books_banned_in_New_Zealand"):
        rows = resolve_rowspans(table["rows"])
        if len(rows) <= 1:
            continue

        headers = [header.lower() for header in rows[0]]
        for row in rows[1:]:
            values = row + [""] * (len(headers) - len(row))
            data = dict(zip(headers, values))
            raw_title = data.get("title", "")
            raw_type = data.get("type", "")

            if not raw_type:
                continue
            if raw_title.lower().startswith("works of "):
                continue
            if any(token in raw_type.lower() for token in ("newspaper", "journal", "magazine", "periodical")):
                continue

            governing_body = data.get("banned by") or "New Zealand censorship authorities"
            candidate = build_candidate(
                source_id="wikipedia-books-banned-new-zealand",
                jurisdiction_id="new-zealand",
                jurisdiction_name="New Zealand",
                raw_title=raw_title,
                raw_author=data.get("author", ""),
                raw_type=raw_type,
                raw_published=data.get("published"),
                raw_date=data.get("banned"),
                note=data.get("notes", ""),
                governing_body=governing_body,
                action_type="classified, prohibited, or restricted",
                start_year_fallback=extract_year(data.get("banned")),
                date_fallback="20th century",
            )
            if candidate:
                candidates.append(candidate)
    return candidates


def iter_marshall_project_candidates() -> list[Candidate]:
    candidates: list[Candidate] = []

    for state_code, urls in PRISON_STATE_FILES.items():
        jurisdiction_id, state_name = PRISON_STATE_INFO[state_code]
        for url in urls:
            for row in fetch_csv_rows(url):
                raw_title = clean_text(row.get("publication", ""))
                raw_author = clean_text(row.get("author", ""))

                if looks_like_placeholder_title(raw_title):
                    continue
                if not raw_author:
                    continue

                lowered_title = raw_title.lower()
                if any(token in lowered_title for token in ("magazine", "newsletter", "periodical", "newspaper")):
                    continue

                reason = clean_text(row.get("reason", ""))
                date_text = clean_text(row.get("date", "")) or (row.get("year", "").strip() if row.get("year") else "")

                candidate = build_candidate(
                    source_id="marshall-project-prison-bans",
                    jurisdiction_id=jurisdiction_id,
                    jurisdiction_name=state_name,
                    raw_title=raw_title,
                    raw_author=raw_author,
                    raw_type="Book",
                    raw_published=None,
                    raw_date=date_text,
                    note=build_prison_note(state_name, reason),
                    governing_body=f"{state_name} corrections agencies and prison mailrooms",
                    action_type="excluded from prison circulation",
                    extra_reason_tags=prison_reason_tags(reason),
                    start_year_fallback=extract_year(date_text) or extract_year(row.get("year")),
                )
                if candidate:
                    if contains_non_latin(raw_title) or contains_non_latin(raw_author):
                        candidate.priority += 15
                    candidates.append(candidate)

    return candidates


def dedupe_candidates(
    candidates: list[Candidate], existing_keys: set[tuple[str, str]], existing_titles: set[str], target_count: int
) -> list[Candidate]:
    chosen: dict[tuple[str, str], Candidate] = {}

    for candidate in sorted(candidates, key=lambda item: (-item.priority, item.title.lower(), item.authors[0].lower())):
        if candidate.key in existing_keys or slugify(candidate.title) in existing_titles:
            continue
        current = chosen.get(candidate.key)
        if current is None:
            chosen[candidate.key] = candidate
            continue

        current.content_tags = sorted(set(current.content_tags + candidate.content_tags))
        current.counter_themes = sorted(set(current.counter_themes + candidate.counter_themes))
        current.source_ids = sorted(set(current.source_ids + candidate.source_ids))
        current.description_source_ids = sorted(set(current.description_source_ids + candidate.description_source_ids))
        current.ban_events.extend(candidate.ban_events)

        for field_name in ("original_title", "romanized_title", "title_note", "published_year_text", "original_language"):
            if getattr(current, field_name) is None and getattr(candidate, field_name) is not None:
                setattr(current, field_name, getattr(candidate, field_name))

    ordered = sorted(chosen.values(), key=lambda item: (-item.priority, item.title.lower(), item.authors[0].lower()))
    title_groups: dict[str, list[Candidate]] = {}
    for candidate in ordered:
        title_groups.setdefault(slugify(candidate.title), []).append(candidate)

    filtered: list[Candidate] = []
    for group in title_groups.values():
        known = [candidate for candidate in group if candidate.authors[0].lower() != "unknown author"]
        if known:
            filtered.extend(known)
        else:
            filtered.append(group[0])

    filtered.sort(key=lambda item: (-item.priority, item.title.lower(), item.authors[0].lower()))
    return filtered[:target_count]


def ensure_unique_ids(records: list[dict[str, object]]) -> None:
    seen_ids: dict[str, int] = {}
    seen_slugs: dict[str, int] = {}
    for record in records:
        base_id = slugify(f"{record['title']} {' '.join(record['authors'])}")
        id_count = seen_ids.get(base_id, 0)
        record["id"] = base_id if id_count == 0 else f"{base_id}-{id_count + 1}"
        seen_ids[base_id] = id_count + 1

        base_slug = str(record.get("slug") or slugify(str(record["title"])))
        slug_count = seen_slugs.get(base_slug, 0)
        record["slug"] = base_slug if slug_count == 0 else f"{base_slug}-{slug_count + 1}"
        seen_slugs[base_slug] = slug_count + 1


def build_records(candidates: list[Candidate]) -> list[dict[str, object]]:
    records: list[dict[str, object]] = []
    for candidate in candidates:
        event_key = lambda event: (
            event["startYear"] or 9999,
            str(event["jurisdictionId"]),
            str(event["governingBody"]),
            str(event["dateText"]),
            str(event["reasonSummary"]),
        )
        ban_events = []
        seen_events: set[tuple[object, ...]] = set()
        for event in sorted(candidate.ban_events, key=event_key):
            key = (
                event["jurisdictionId"],
                event["governingBody"],
                event["dateText"],
                event["actionType"],
                event["reasonSummary"],
            )
            if key in seen_events:
                continue
            seen_events.add(key)
            ban_events.append(event)

        record = {
            "title": candidate.title,
            "slug": slugify(f"{candidate.title} {candidate.authors[0]}"),
            "originalTitle": candidate.original_title,
            "romanizedTitle": candidate.romanized_title,
            "titleNote": candidate.title_note,
            "authors": candidate.authors,
            "workType": candidate.work_type,
            "originalLanguage": candidate.original_language,
            "publishedYearText": candidate.published_year_text,
            "wikipediaTitle": None,
            "description": candidate.description,
            "descriptionParagraphs": candidate.description_paragraphs,
            "descriptionSourceIds": candidate.description_source_ids,
            "copiesSoldEstimate": 1000,
            "contentTags": candidate.content_tags,
            "counterThemes": candidate.counter_themes,
            "sourceIds": candidate.source_ids,
            "seedSourceIds": candidate.source_ids,
            "banEvents": ban_events,
            "sectionStatus": make_section_status(),
            "reviewStatus": "seeded",
            "published": True,
            "incompleteCoverage": True,
            "featured": False,
            "addedOn": "2026-03-17",
        }
        records.append(record)

    ensure_unique_ids(records)
    return records


def main() -> int:
    existing_keys, existing_titles = load_existing_baseline()
    target_imported_count = max(TARGET_TOTAL_COUNT - len(existing_keys), 0)

    candidates = []
    candidates.extend(iter_hong_kong_candidates())
    candidates.extend(iter_india_candidates())
    candidates.extend(iter_china_candidates())
    candidates.extend(iter_iran_candidates())
    candidates.extend(iter_global_candidates())
    candidates.extend(iter_new_zealand_candidates())
    candidates.extend(iter_marshall_project_candidates())

    selected = dedupe_candidates(candidates, existing_keys, existing_titles, target_imported_count)
    if len(selected) < target_imported_count:
        print(
            f"Expected at least {target_imported_count} imported works, only found {len(selected)} after dedupe.",
            file=sys.stderr,
        )
        return 1

    records = build_records(selected)
    OUTPUT_PATH.write_text(json.dumps(records, indent=2, ensure_ascii=False) + "\n", encoding="utf8")
    print(f"Wrote {len(records)} imported works to {OUTPUT_PATH}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
