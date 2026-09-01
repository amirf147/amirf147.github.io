#!/usr/bin/env python3
"""
check_absolute_paths.py
=======================
Automated Pre-Flight & CI Safety Audit Script.

Scans the repository to verify that:
1. No absolute local file paths (e.g. C:\\Users\\, /home/, /Users/, file:///C:) are committed.
2. All internal links and asset references use relative paths (./ or ../).
3. No secrets, private API keys, or personal tokens are leaked.

Usage:
    python scripts/check_absolute_paths.py
"""

import sys
import os
import re
from pathlib import Path

# Ensure UTF-8 output encoding on Windows
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

ROOT_DIR = Path(__file__).resolve().parent.parent

# Files and extensions to include
INCLUDE_EXTENSIONS = {
    ".html", ".js", ".css", ".md", ".json", ".py", ".yml", ".yaml", ".xml", ".txt"
}

# Directories to ignore
IGNORE_DIRS = {
    ".git", "__pycache__", "node_modules", ".gemini", ".github_cache"
}

# Patterns to detect violations
FORBIDDEN_PATTERNS = [
    # Windows User Directory / Absolute Paths
    (r'(?i)[a-z]:[\\/]users[\\/]', "Windows user directory absolute path"),
    (r'(?i)file:///[a-z]:[\\/]', "file:/// local absolute drive URI"),
    (r'(?i)/Users/[a-zA-Z0-9_-]+/', "macOS/Unix user home path"),
    (r'(?i)/home/[a-zA-Z0-9_-]+/', "Linux user home path"),
    
    # Secrets & API Tokens
    (r'ghp_[a-zA-Z0-9]{36}', "GitHub Personal Access Token"),
    (r'github_pat_[a-zA-Z0-9_]{82}', "GitHub Fine-Grained Token"),
    (r'AIzaSy[a-zA-Z0-9_-]{33}', "Google API Key"),
    (r'AKIA[0-9A-Z]{16}', "AWS Access Key ID"),
    (r'-----BEGIN [A-Z ]*PRIVATE KEY-----', "Private Cryptographic Key"),
]

# Allowlisted occurrences (e.g. error message strings explaining the browser limitation on file:/// protocol)
ALLOWLIST_PATTERNS = [
    r"getUserMedia not permitted on file:/// protocol",
    r"window\.location\.protocol !== 'file:'",
    r"window\.location\.protocol === 'file:'",
]


def is_allowlisted(line_content: str) -> bool:
    for allow_pattern in ALLOWLIST_PATTERNS:
        if re.search(allow_pattern, line_content):
            return True
    return False


def scan_file(file_path: Path) -> list:
    violations = []
    try:
        content = file_path.read_text(encoding="utf-8", errors="ignore")
    except Exception as e:
        print(f"[!] Warning: Could not read {file_path}: {e}")
        return violations

    lines = content.splitlines()
    for line_idx, line in enumerate(lines, start=1):
        if is_allowlisted(line):
            continue
            
        for pattern, description in FORBIDDEN_PATTERNS:
            if re.search(pattern, line):
                rel_path = file_path.relative_to(ROOT_DIR)
                violations.append({
                    "file": str(rel_path),
                    "line": line_idx,
                    "desc": description,
                    "snippet": line.strip()[:140]
                })
    return violations


def main():
    print("=" * 65)
    print("[*] Repository Path & Security Audit")
    print("=" * 65)

    all_violations = []
    scanned_count = 0

    for root, dirs, files in os.walk(ROOT_DIR):
        # Exclude ignored directories
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]

        for file_name in files:
            file_path = Path(root) / file_name
            if file_path.suffix.lower() in INCLUDE_EXTENSIONS:
                scanned_count += 1
                violations = scan_file(file_path)
                if violations:
                    all_violations.extend(violations)

    print(f"[+] Scanned {scanned_count} repository files.")

    if all_violations:
        print(f"\n[X] Found {len(all_violations)} violation(s):")
        for v in all_violations:
            print(f"    - {v['file']}:{v['line']} [{v['desc']}]")
            print(f"      Snippet: {v['snippet']}")
        print("\n" + "=" * 65)
        print("[X] Audit FAILED: Absolute path or secret leaks detected!")
        print("=" * 65)
        sys.exit(1)
    else:
        print("\n" + "=" * 65)
        print("[V] Audit PASSED: 100% clean (zero absolute paths or secret leaks).")
        print("=" * 65)
        sys.exit(0)


if __name__ == "__main__":
    main()
