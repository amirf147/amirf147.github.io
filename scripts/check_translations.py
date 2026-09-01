#!/usr/bin/env python3
"""
check_translations.py
=====================
Automated Translation & Sync Verification Script for Portfolio.

Verifies that:
1. All HTML pages (index.html, systems-engineering.html, test-engineering.html, timeline.html)
   have corresponding translations in both English (js/i18n/en.js) and Finnish (js/i18n/fi.js).
2. No keys are missing or have empty/whitespace-only values.
3. Both dictionaries maintain symmetric key structures.

Usage:
    python scripts/check_translations.py
"""

import sys
import os
import re
import json
import subprocess
from pathlib import Path

# Ensure UTF-8 output encoding on Windows
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

ROOT_DIR = Path(__file__).resolve().parent.parent

HTML_FILES = [
    ROOT_DIR / "index.html",
    ROOT_DIR / "systems-engineering.html",
    ROOT_DIR / "test-engineering.html",
    ROOT_DIR / "timeline.html",
]

DICT_FILES = {
    "en": ROOT_DIR / "js" / "i18n" / "en.js",
    "fi": ROOT_DIR / "js" / "i18n" / "fi.js",
}


def load_dict_via_node(dict_path: Path, lang: str) -> dict:
    """
    Evaluates the JS dictionary file using Node.js to guarantee exact JS object parsing.
    Returns flattened key-value pairs (e.g. 'index.title': '...').
    """
    eval_script = f"""
    const fs = require('fs');
    global.window = {{ I18N_DICTS: {{}} }};
    const content = fs.readFileSync({json.dumps(str(dict_path))}, 'utf8');
    eval(content);
    
    function flatten(obj, prefix = '') {{
        let res = {{}};
        for (const [k, v] of Object.entries(obj)) {{
            const newKey = prefix ? prefix + '.' + k : k;
            if (v && typeof v === 'object' && !Array.isArray(v)) {{
                Object.assign(res, flatten(v, newKey));
            }} else {{
                res[newKey] = String(v);
            }}
        }}
        return res;
    }}
    
    const target = global.window.I18N_DICTS['{lang}'] || {{}};
    console.log(JSON.stringify(flatten(target)));
    """
    
    proc = subprocess.run(
        ["node", "-e", eval_script],
        capture_output=True,
        text=True,
        check=True,
        encoding="utf-8"
    )
    return json.loads(proc.stdout)


def extract_html_keys(file_path: Path) -> set:
    """
    Extracts all data-i18n, data-i18n-html, and data-i18n-attr keys from an HTML file.
    """
    if not file_path.exists():
        print(f"[!] Warning: HTML file not found: {file_path}")
        return set()
    
    content = file_path.read_text(encoding="utf-8")
    keys = set()
    
    # 1. data-i18n="key"
    for match in re.finditer(r'data-i18n=["\']([^"\']+)["\']', content):
        keys.add(match.group(1).strip())
        
    # 2. data-i18n-html="key"
    for match in re.finditer(r'data-i18n-html=["\']([^"\']+)["\']', content):
        keys.add(match.group(1).strip())
        
    # 3. data-i18n-attr="attr:key|attr2:key2"
    for match in re.finditer(r'data-i18n-attr=["\']([^"\']+)["\']', content):
        pairs = match.group(1).split('|')
        for pair in pairs:
            if ':' in pair:
                _, k = pair.split(':', 1)
                keys.add(k.strip())
                
    return keys


def main():
    print("=" * 65)
    print("[*] Portfolio Translation & Bilingual Sync Verification")
    print("=" * 65)
    
    # 1. Load Dictionaries
    dicts = {}
    for lang, path in DICT_FILES.items():
        if not path.exists():
            print(f"[X] Error: Dictionary file not found: {path}")
            sys.exit(1)
        try:
            dicts[lang] = load_dict_via_node(path, lang)
            print(f"[+] Loaded {lang.upper()} dictionary ({len(dicts[lang])} flattened keys)")
        except Exception as e:
            print(f"[X] Error parsing {path}: {e}")
            sys.exit(1)
            
    en_keys = set(dicts["en"].keys())
    fi_keys = set(dicts["fi"].keys())
    
    has_errors = False
    
    # 2. Check Dictionary Symmetry
    print("\n--- Checking EN / FI Dictionary Symmetry ---")
    missing_in_fi = en_keys - fi_keys
    missing_in_en = fi_keys - en_keys
    
    if missing_in_fi:
        print(f"[X] Missing in FI dictionary ({len(missing_in_fi)} keys):")
        for k in sorted(missing_in_fi):
            print(f"    - {k}")
        has_errors = True
    else:
        print("[+] All English keys are present in Finnish dictionary.")
        
    if missing_in_en:
        print(f"[X] Missing in EN dictionary ({len(missing_in_en)} keys):")
        for k in sorted(missing_in_en):
            print(f"    - {k}")
        has_errors = True
    else:
        print("[+] All Finnish keys are present in English dictionary.")
        
    # 3. Check for Empty or Incomplete Values
    print("\n--- Checking for Empty or Whitespace Values ---")
    empty_en = [k for k, v in dicts["en"].items() if not v.strip()]
    empty_fi = [k for k, v in dicts["fi"].items() if not v.strip()]
    
    if empty_en:
        print(f"[X] Empty values in EN ({len(empty_en)}): {empty_en}")
        has_errors = True
    if empty_fi:
        print(f"[X] Empty values in FI ({len(empty_fi)}): {empty_fi}")
        has_errors = True
        
    if not empty_en and not empty_fi:
        print("[+] No empty translation strings found.")
        
    # 4. Check HTML Coverage
    print("\n--- Checking HTML Files Data-Attribute Key Coverage ---")
    all_html_keys = set()
    for html_path in HTML_FILES:
        rel_name = html_path.name
        html_keys = extract_html_keys(html_path)
        all_html_keys.update(html_keys)
        
        missing_en_html = html_keys - en_keys
        missing_fi_html = html_keys - fi_keys
        
        if missing_en_html or missing_fi_html:
            print(f"[X] {rel_name} contains unmapped keys ({len(html_keys)} total in file):")
            if missing_en_html:
                for k in sorted(missing_en_html):
                    print(f"    - Missing in EN: {k}")
            if missing_fi_html:
                for k in sorted(missing_fi_html):
                    print(f"    - Missing in FI: {k}")
            has_errors = True
        else:
            print(f"[+] {rel_name} ({len(html_keys)} keys mapped successfully)")
            
    print("\n" + "=" * 65)
    if has_errors:
        print("[X] Verification FAILED: Please resolve the missing keys above.")
        print("=" * 65)
        sys.exit(1)
    else:
        print("[V] ALL TRANSLATION CHECKS PASSED PERFECTLY (100% Coverage)")
        print("=" * 65)
        sys.exit(0)


if __name__ == "__main__":
    main()
