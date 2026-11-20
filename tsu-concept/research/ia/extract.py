"""Map tsu.edu.ph's homepage navigation into a tree.

Usage: python3 extract.py <saved-homepage.html> > ia.json
Fetch the page yourself first (one request), e.g.
  curl -A "Mozilla/5.0" -o home.html https://www.tsu.edu.ph/
Stdlib only.
"""
import json
import sys
from html.parser import HTMLParser


class Nav(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.navs = []          # list of {label, aria, hidden_mobile, items}
        self.depth = 0          # <nav> nesting
        self.cur = None         # current nav
        self.top = None         # current top-level item
        self.group = None       # current column group
        self.text_into = None   # where the next text goes
        self.anchor = None      # open <a> attrs

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        cls = a.get("class", "") or ""
        if tag == "nav":
            self.cur = {"id": a.get("id"), "aria_label": a.get("aria-label"),
                        "hidden_on_mobile": "is-hidden-mobile" in cls, "items": []}
            self.navs.append(self.cur)
            self.depth += 1
            return
        if not self.depth:
            return
        if tag == "div" and "has-dropdown" in cls:
            self.top = {"label": "", "href": None, "groups": []}
            self.cur["items"].append(self.top)
            self.group = None
        if tag == "h6" and self.top is not None:
            self.group = {"label": "", "links": []}
            self.top["groups"].append(self.group)
            self.text_into = ("group", self.group)
        if tag == "a":
            self.anchor = {"href": a.get("href"), "text": "", "class": cls,
                           "role": a.get("role"), "has_href": "href" in a}

    def handle_endtag(self, tag):
        if tag == "nav" and self.depth:
            self.depth -= 1
            self.top = self.group = None
            return
        if tag == "h6":
            self.text_into = None
        if tag == "a" and self.anchor is not None:
            an, self.anchor = self.anchor, None
            text = " ".join(an["text"].split())
            if not text and not an["has_href"]:
                return
            if "navbar-link" in an["class"] and self.top is not None and not self.top["label"]:
                self.top["label"], self.top["href"] = text, an["href"]
                return
            link = {"text": text, "href": an["href"]}
            if self.group is not None:
                self.group["links"].append(link)
            elif self.top is not None:
                self.top.setdefault("links", []).append(link)
            elif self.cur is not None:
                self.cur["items"].append({"label": text, "href": an["href"], "groups": []})

    def handle_data(self, data):
        if self.anchor is not None:
            self.anchor["text"] += data
        elif self.text_into and self.text_into[0] == "group":
            self.text_into[1]["label"] += data.strip()


def main():
    p = Nav()
    p.feed(open(sys.argv[1], encoding="utf-8", errors="ignore").read())
    out = []
    for n in p.navs:
        items = []
        for it in n["items"]:
            count = sum(len(g["links"]) for g in it["groups"]) + len(it.get("links", []))
            items.append({**it, "link_count": count})
        out.append({**n, "items": items,
                    "link_count": sum(max(i["link_count"], 1) for i in items)})
    json.dump(out, sys.stdout, indent=2, ensure_ascii=False)


if __name__ == "__main__":
    main()
