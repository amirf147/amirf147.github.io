/**
 * ============================================================================
 * Caster Voice OS Timeline Dataset - English (EN)
 * Contains all 4 evolutionary eras, 38 milestones, subsystem highlights,
 * technical lessons, and journey quotes.
 * ============================================================================
 */

window.TIMELINE_DATA = window.TIMELINE_DATA || {};

window.TIMELINE_DATA['en'] = [
  {
    "era_key": "era_1_2024_foundations",
    "era_title": "Era 1: Early Foundations & Setup (May 2024 - Aug 2024)",
    "date_range": "2024-05-12 to 2024-08-31",
    "theme_summary": "The transition from legacy Windows Speech Recognition (WSR/WSRMacros) to modern Dragonfly/Caster powered by the Kaldi ASR engine. The era begins with trial-and-error experimentation around words.txt transformers to map legacy phonetic habits, evolves into writing native Python Dragonfly rules, discovers the architectural boundaries between CCR (Continuous Command Recognition) and non-CCR grammars, establishes modular app-specific and global rule hierarchies, adopts the Talon phonetic alphabet to reduce vocal strain, and learns to embrace Caster's ergonomic defaults over legacy WSR workarounds.",
    "milestones": [
      {
        "hash": "7888a3d",
        "date": "2024-05-12",
        "title": "First commit & Repository Initialization",
        "significance": "Initial repository setup establishing the caster_user_content directory structure and marking the formal migration away from Windows Speech Recognition."
      },
      {
        "hash": "7b57f4b",
        "date": "2024-05-15",
        "title": "Replacing keyboard key mappings with transformers",
        "significance": "First attempt to bridge muscle memory from WSR to Caster using words.txt transformer substitutions (e.g. mapping enter, alphabet letters)."
      },
      {
        "hash": "a4978fd",
        "date": "2024-05-28",
        "title": "Create custom rule for window switching",
        "significance": "First standalone Dragonfly Python rule written in the workspace, implementing 1-indexed and negative taskbar window switching."
      },
      {
        "hash": "d461bbb",
        "date": "2024-06-02",
        "title": "Added the f2 key ccr with a custom rule",
        "significance": "Architectural turning point recognizing that scattered single-action rules must be consolidated into a unified global Continuous Command Recognition (CCR) rule."
      },
      {
        "hash": "840dbd5",
        "date": "2024-06-05",
        "title": "Cleaned up/organized some rule files and added more programs to bringme",
        "significance": "Major codebase restructuring separating user rules into dedicated 'apps/' and 'global/' directories while expanding the sm_bringme app launcher."
      },
      {
        "hash": "053a2db",
        "date": "2024-05-31",
        "title": "Switch to ShortIntegerRef and build VS Code extensions",
        "significance": "Optimization for recognition latency by replacing standard IntegerRef with ShortIntegerRef across rules and introducing VS Code pane navigation."
      },
      {
        "hash": "a35d3b1",
        "date": "2024-07-04",
        "title": "Switch to using the Talon alphabet where possible",
        "significance": "Migration from legacy/NATO phonetic alphabets to the Talon voice alphabet, vastly improving acoustic distinctiveness and vocal ergonomics."
      },
      {
        "hash": "c155dff",
        "date": "2024-07-11",
        "title": "Replace explorer, update words, and package modular rule directories",
        "significance": "Modularization of app rules into distinct Python packages (apps/explorer, apps/firefox, apps/vscode) with dedicated merge and mapping rules."
      },
      {
        "hash": "d13987c",
        "date": "2024-07-25",
        "title": "Status update on embracing Caster defaults over WSR legacy specs",
        "significance": "Mindset breakthrough: documenting how Kaldi's acoustic precision eliminates the need for bulky multi-syllable WSR workarounds, enabling shorter, less straining utterances."
      },
      {
        "hash": "5a8e89e",
        "date": "2024-08-22",
        "title": "Create CCR rule for Microsoft Word",
        "significance": "Expansion of voice coding patterns into rich desktop document processing, separating formatting into chained CCR commands and deep UI navigation."
      },
      {
        "hash": "8df0a5a",
        "date": "2024-08-31",
        "title": "Create and enable custom mouse alternatives rule",
        "significance": "Pruning upstream Caster bloat by replacing unstable builtin mouse alternative rules with a streamlined, collision-free custom rule."
      }
    ],
    "subsystem_highlights": {
      "global_rules": [
        "Numbered taskbar window switching with support for negative indexing to target trailing icons.",
        "Quadrant window snapping on a 4-quadrant plane using Caster utility functions.",
        "Splitting global commands into distinct global_ccr_extended_rule.py (chainable commands) and global_nonccr_extended.py (discrete window/system state actions).",
        "System tray navigation enabling indexed selection and opening of background tray icons.",
        "Custom word deletion rules ('word_delete_rule') consolidated into global rules.",
        "Screen capture triggers for full screen, window-specific, and Windows Snipping Tool invocations.",
        "Customized mouse alternatives rule stripping problematic Douglas grid and rainbow grid mappings."
      ],
      "app_rules": [
        "Firefox: Multi-tab navigation with positive/negative numbers, Tree Style Tab panel toggling, address bar search queries with pre-execution delay padding, and website jump lists.",
        "VS Code: Multi-pane switching and resizing, integrated terminal focus, line selection ('selina'), recent files dropdown, folder collapse, and Python interpreter path text injection.",
        "Office (MS Word & Outlook): Word style formatting (headings, bold, italics, underline, super/subscript, font dialog), ribbon access, F6 pane cycling, and Outlook inbox sync.",
        "Explorer & File Dialogs: Navigation repeatability (multi-step back/up), directory jumping, and custom CCR merge rules.",
        "Media & Content: VLC media playback speed manipulation and file/folder loading; Clipchamp timeline zoom delays and properties navigation; YouTube speed controls and direct search.",
        "Websites & LLMs: Custom website rules for ChatGPT, Google Gemini, and Microsoft Copilot focusing input chat prompt boxes directly."
      ],
      "infrastructure": [
        "Iterative tuning of transformers/words.txt to resolve phonemic clashes without breaking core Dragonfly grammars.",
        "Configuration of settings/sm_bringme.toml for rapid voice-launched applications and web portals.",
        "Management of active rules via settings/rules.toml whitelist, aggressively disabling unused upstream Caster rules (HMC rules, default explorer/firefox) to improve latency and avoid accidental triggers.",
        "Architectural directory structuring: transitioning from flat rules directory to organized hierarchy (apps/vscode/, apps/firefox/, apps/explorer/, apps/office/, global/, websites/)."
      ],
      "docs_and_research": [
        "README.md and status-update-history.md tracking real-time migration milestones from WSR to Kaldi.",
        "caster-study-notes.md capturing internal learnings on Caster grammar execution, token capitalization, and transformer behaviors.",
        "ace-space-transform.md documenting grammar collision investigations between transformer word mappings and core specs.",
        "Vertical taskbar notes and images documenting ergonomic visual layouts for numbered voice switching."
      ]
    },
    "technical_lessons": [
      "Transformer Collisions vs Grammar Specs: Directly replacing common words in words.txt (like 'space' or 'a') corrupts composite rule specs across Caster. Custom Dragonfly rules provide safer encapsulation.",
      "Continuous Command Recognition (CCR) Constraints: Commands meant for fluid chained dictation must be in CCR merge rules; commands requiring complex state or discrete key sequences belong in non-CCR mapping rules.",
      "Acoustic Engine Shift (WSR vs Kaldi): WSR required artificially long or unnatural multi-syllable phonetic triggers to avoid false positives; Kaldi can reliably detect terse, natural one-syllable words without straining the vocal cords.",
      "Phonetic Collision Debugging: Single-word phonetic overlaps (e.g. 'paste' colliding with speech, 'dunce' colliding with 'dot', 'fox' vs 'focus', 'switch' vs 'switchback') require iterative renaming ('puts' -> 'spark', 'drip', 'fine').",
      "IntegerRef Latency: Replacing generic IntegerRef with ShortIntegerRef significantly reduces recognition lag in number-parameterized voice commands.",
      "Timing and Asynchronous UI Focus: Voice commands targeting GUI inputs (such as the Firefox address bar) require deliberate millisecond delays before typing payload text to prevent initial letters from dropping."
    ],
    "journey_quotes": [
      "I added more descriptive comments but also a note at the beginning of the file explaining that I don't really know what I'm doing and that my additions to the words file are not having the effect that I thought they would.",
      "I initially just wanted to override the phrases... but i've begun to realize that some of these key presses are not part of continuous command recognition meaning that you have to say the word press beforehand... Hopefully i'll be able to fix this in the next commit.",
      "Instead of having the transform for the word spark to puts, from this point on i will learn to use the phrase spark for pasting text. I'm beginning to realize that a lot of these default words in caster that have been selected for the mappings to actions have been selected for good reason.",
      "For switching open applications i switched the starter phrase to be drip instead of switch because of some misrecognitions but also because because i'm reverting back to saying dredge instead of switchback in an effort to reduce voice strain and simplify.",
      "Over time I'm beginning to appreciate the specs chosen for particular actions and commands and realizing that the ones that i used in window speech recognition macros are better not used in caster due to the better engine being able to recognize simpler words which was not possible in windows speech recognition.",
      "Now that i'm used to saying the word fine instead of fox for the letter f, the previous misrecognition to focus no longer exists and therefore i am removing the word toggle that was made to be said before it to fix that no longer existing problem.",
      "Due to misrecognitions with the builtin mouse alternatives rule's douglas mapping, just created a custom one with that functionality removed as well as the rainbow grid mapping removed due to it not working."
    ]
  },
  {
    "era_key": "era_2_2024_expansion",
    "era_title": "Era 2: Workflow Expansion & Phonetic Evolution (Sep 2024 - Dec 2024)",
    "date_range": "2024-09-01 to 2024-12-31",
    "theme_summary": "Era 2 represents a massive expansion phase driven by academic thesis writing and full-desktop hands-free workflows. The repository expanded from basic navigation into deep application-specific automation across Microsoft Office (Word, PowerPoint, Excel, Outlook), LibreOffice (Writer, Calc), IDEs (migrating from VS Code to VSCodium to fix dropped characters), and terminal environments. In parallel, the author engaged in intense phonetic iteration in `words.txt` and command specs to resolve Kaldi acoustic collisions, separated monolithic global rules into modular subsystems (taskbar, CLI, programming), and established strict privacy boundaries via environment variables.",
    "milestones": [
      {
        "hash": "e9ef954",
        "date": "2024-09-30",
        "title": "Moved window switching into its own rule and separate file",
        "significance": "Initiated architectural modularization by extracting window/taskbar management from monolithic global rules into a dedicated `taskbar.py` rule with numbered taskbar indexing (1-9)."
      },
      {
        "hash": "00b8d30",
        "date": "2024-10-09",
        "title": "update vscodium rule and create vscodium_ccr",
        "significance": "Executed an IDE pivot from VS Code to VSCodium to bypass an input-lag bug where Quick Open dropped initial characters during voice dictation."
      },
      {
        "hash": "ffc0105",
        "date": "2024-10-09",
        "title": "stop tracking settings",
        "significance": "Established a security and privacy milestone by untracking local machine configuration (`settings/*.toml`) to allow private directory paths without dirtying version control."
      },
      {
        "hash": "cffb0b8",
        "date": "2024-11-18",
        "title": "Update enable_viacam.py and create .gitattributes",
        "significance": "Standardized repository line endings across Windows environments via `.gitattributes` and integrated hands-free head-tracking mouse control (`enable_viacam.py`) into CCR merge rules."
      },
      {
        "hash": "97b03b3",
        "date": "2024-11-22",
        "title": "update file_dialog.py and .gitignore",
        "significance": "Architected the `environment_variables.py` pattern (untracked in `.gitignore`) allowing voice rules to safely reference private file paths and personal details."
      },
      {
        "hash": "4a10773",
        "date": "2024-11-26",
        "title": "Created Programming directory with a global rule and custom python rules",
        "significance": "Structured a modular `programming/` domain, consolidating CCR formatted operators (`+=`, `!=`, `->`, `==`) and custom Python rules away from app-specific grammars."
      },
      {
        "hash": "437e475",
        "date": "2024-12-06",
        "title": "Update excel.py",
        "significance": "Overcame application context binding hurdles by explicitly mapping executable contexts, unlocking rich spreadsheet automation in Excel and later LibreOffice Calc."
      },
      {
        "hash": "7b8c049",
        "date": "2024-12-12",
        "title": "Create WriterCCR",
        "significance": "Expanded the voice-coding grammar to LibreOffice Writer with paired non-CCR and Continuous Command Recognition (CCR) grammars for rapid document formatting."
      },
      {
        "hash": "6a14fcd",
        "date": "2024-12-23",
        "title": "Moved windows terminal commands into cli_ccr",
        "significance": "Consolidated fragmented terminal rules (Git Bash, Windows Terminal, CMD) into a unified `cli` domain supporting cross-shell commands and SQLite."
      }
    ],
    "subsystem_highlights": {
      "global_rules": [
        "Extracted window switching and system tray interactions into dedicated `taskbar.py` with 1-9 taskbar number indexing.",
        "Implemented multi-monitor management, including centering cursor on primary/secondary screens and workspace window pinning for the Caster terminal.",
        "Added screen quadrant and sextant mouse targeting and scrolling actions in `global_nonccr_extended.py` and `global_ccr_extended_rule.py`.",
        "Integrated text insertion macros for environment variables (personal credentials, thesis boilerplates, dashed lines) and LLM prompt shortcuts (clipboard grammar checking, 40-character formatting)."
      ],
      "app_rules": [
        "Office Suite: Deep MS Word and PowerPoint automation including ribbon key hinting, table creation/formatting, comment management, slide manipulation, and Read Aloud voice controls.",
        "LibreOffice Suite: Created dedicated rules for Calc and Writer (`writer.py`, `writer_ccr.py`) supporting style headings, PDF export, line numbering, and cell auto-fitting.",
        "Browsers: Extended Firefox with direct address bar search queries (Reddit, YouTube, bookmarks, history in new tabs/windows), Tree Style Tab delays, and website navigation lists.",
        "Developer Tools: Migrated to VSCodium (`vscodium.py`, `vscodium_ccr.py`), added Notepad++ with DBGp plugin support, created Vim modal rules (`vim.py`, `vim_ccr.py`), and unified CLI/Terminal rules (`cli.py`, `cli_ccr.py`).",
        "Websites: Added app rules for AI chatbots (Copilot, Gemini) and coding platforms (LeetCode)."
      ],
      "infrastructure": [
        "Introduced untracked `environment_variables.py` and updated `.gitignore` to prevent local path leaks in public repositories.",
        "Untracked `settings/*.toml` to separate local workstation configuration from core rule code.",
        "Added `.gitattributes` to enforce consistent line ending normalization across Windows dev environments.",
        "Created `programming/` package directory organizing language-specific (`python.py`, `python_ccr.py`, `standard.py`) and global programming operators."
      ],
      "docs_and_research": [
        "Extensive code comments and rule structures crafted specifically for inclusion as code snippets in the author's Master's Thesis.",
        "Created dedicated example rules (e.g., `ms_word_example.py`) and formatted Choice extras compactly to fit thesis paper formatting constraints.",
        "Thesis-driven workflow optimizations (navigation pane headings, table captions, table of contents updates, and reference management)."
      ]
    },
    "technical_lessons": [
      "Dictation vs Command Collisions: Short monosyllabic commands easily collide with natural dictation (e.g., dictating 'focus' triggering window focus, 'backs' triggering 'maxiwin'). High-frequency vocabulary must be disambiguated with compound specs like 'switch focus' or 'name flash'.",
      "Phonetic Tuning is Iterative: Finding distinct phonetic anchors for navigation keys (e.g., Page Up / Page Down iterating through 'flis/floss' -> 'flow/fleece' -> 'flow/flea' -> 'fell') requires continuous trial and error against Kaldi's acoustic models.",
      "Simulated Keystroke Timing: Rapid keystroke emission into electron apps / IDEs (like VS Code Quick Open) can drop initial letters without explicit inter-key delays or switching to more responsive builds (VSCodium).",
      "Application Context Specification: Window titles alone are fragile; rules must bind explicitly to executable names (e.g., `excel.exe`) to ensure reliable focus activation.",
      "Modular Rule Architecture: Accumulating commands into `global_nonccr_extended.py` rapidly creates maintainable technical debt; proactive extraction into domain modules (`taskbar.py`, `cli.py`, `programming/`) is essential for scalability."
    ],
    "journey_quotes": [
      "attempted to had an ability to open a particular file names using a dictation input but i'm getting an error where some of the letters are missing from the output so i plan to switch to vscodium where the bug doesn't occur (2024-09-18, commit 102f737)",
      "in words: still struggling with page up and page down so i changed the transform for page down to now be 'fell' (2024-09-12, commit f0de3b7)",
      "i added the ability to mirror a window that i use on my secondary monitor to all workspaces. This is so that the terminal window that shows the output of caster is always visible on my secondary monitor even when i'm switching workspaces (2024-09-12, commit a3b0618)",
      "I changed the command spec 'flash' to 'name flash' because it's not really necessary for it to be a one syllable word because I don't use it that often. Also it would sometimes be misrecognized from other commands (2024-10-05, commit 4171d21)",
      "changed the command spec 'focus' to 'switch focus' because it's not said that often and sometimes it gets executed accidentally when i am trying to dictate the word 'focus' (2024-10-06, commit 1a2cb88)",
      "added more descriptive comments for hunt and peck activation because i needed to get a code snippet for my thesis (2024-10-01, commit 8078f7c)",
      "Added some temporary commands for repetitive bits of text that I have to keep inserting into my thesis (2024-11-04, commit 1ea8c05)",
      "Creative environment variables file for importing private file paths I don't want to publish publicly and added it to .gitignore. (2024-11-22, commit 97b03b3)",
      "Figured out that the reason the rule wasn't working is because it wasn't actually enabled so I changed the rule details to include the executable. (2024-12-06, commit 437e475)",
      "Rather than having a dedicated rule for each type of terminal, I'll start with just having a generic cli rule for now. (2024-12-23, commit 6a14fcd)"
    ]
  },
  {
    "era_key": "era_3_2025_maturity",
    "era_title": "Era 3: Grammar Maturity & Rule Refinement (Jan 2025 - Nov 2025)",
    "date_range": "2025-01-01 to 2025-11-30",
    "theme_summary": "Era 3 represents a major leap in system maturity, responsiveness, and breadth. Spanning 454 commits across 11 months, this era transitioned Caster from a foundational voice-coding environment into an omnipresent, highly-optimized multimodal operating system. Key architectural thrusts include: (1) System-wide latency elimination via zero-pause text insertion (pause=0.0) and clipboard-injection buffers; (2) Deep integration with the generative AI coding paradigm (Cursor, Windsurf, Copilot Desktop, Claude, and local Ollama/DeepSeek CLI workflows); (3) Robust continuous command recognition (CCR) across diverse specialized applications including LibreOffice Writer, Figma, PowerShell, and MS Word; (4) Sophisticated OS-level window management tackling Windows 11 foreground-lock restrictions and UI Automation taskbar button inspection; and (5) Multimodal physical expansion through Olympus RS31H foot pedal automation with AutoHotkey v2.",
    "milestones": [
      {
        "hash": "8c0faea",
        "date": "2025-01-14",
        "title": "Update vscodium rules to include recognition with Cursor",
        "significance": "Initiated the rapid pivot into AI-first IDEs, extending VS Code grammar rules to recognize Cursor and laying the foundation for dedicated AI editor rules."
      },
      {
        "hash": "21e76c7",
        "date": "2025-03-05",
        "title": "Optimize PowerShell commands with zero-pause text entry",
        "significance": "Breakthrough latency reduction by overriding Dragonfly's default typing delay with pause=0.0 across terminal, editor, and browser rules, making voice commands instant."
      },
      {
        "hash": "8a587eb",
        "date": "2025-03-04",
        "title": "Add Windsurf CCR rule and file context commands",
        "significance": "Established first-class Continuous Command Recognition (CCR) for Codeium's Windsurf IDE, integrating voice macros with AI context windows and cascade workflows."
      },
      {
        "hash": "ba05776",
        "date": "2025-04-15",
        "title": "Add text_to_clipboard utility and optimize commit prompt generation",
        "significance": "Architectural shift from character-by-character text simulation to atomic clipboard injection (Function(text_to_clipboard) + Ctrl+V) for long structured prompts and commit messages."
      },
      {
        "hash": "97c10b7",
        "date": "2025-06-28",
        "title": "Add Alt key workaround for Windows foreground-lock in window switching",
        "significance": "Solved a core OS limitation where Windows 11 blocks background processes from raising windows by injecting synthetic Alt-key tap events to satisfy OS user-interaction requirements."
      },
      {
        "hash": "b2a2015",
        "date": "2025-08-08",
        "title": "Move window management code to attic",
        "significance": "Pragmatic architectural retreat: an ambitious abstract window-management backend interface was deprecated and archived in favor of simpler, reliable UI Automation taskbar routines."
      },
      {
        "hash": "2c6a9af",
        "date": "2025-09-15",
        "title": "Add Olympus RS31H Foot Pedal Control with AutoHotkey v2",
        "significance": "Expanded the voice environment into multimodal physical computing, introducing debounced hardware foot pedal triggers for smart drag-clicking and continuous scrolling."
      },
      {
        "hash": "f60c3f9",
        "date": "2025-09-17",
        "title": "Refactor window switching and taskbar interaction",
        "significance": "Replaced fragile control.invoke() with control.click_input() for window switching focus, while isolating Dragonfly's 'Cannot add list while loaded' dynamic grammar limitation."
      },
      {
        "hash": "1d4efba",
        "date": "2025-10-08",
        "title": "Add Figma voice command rule and CCR support",
        "significance": "Extended voice-coding grammar principles into professional visual design, enabling continuous command chaining, canvas pan/zoom modes, and spatial transform grammar (rake/lake, stretch/squeeze)."
      },
      {
        "hash": "fe2ec4d",
        "date": "2025-11-21",
        "title": "Add UV package management commands to PowerShell rule",
        "significance": "Modernized the Python CLI toolchain by incorporating Astral's blazing-fast uv package manager into daily voice-activated terminal workflows."
      }
    ],
    "subsystem_highlights": {
      "global_rules": [
        "Extensive CCR expansion in global_ccr_extended_rule with programming operators ('==', '|', ':'), navigation sequences, and Finnish character input support.",
        "Windows 11 OS integration in global_nonccr_extended: multi-preset display brightness controls (25%, 50%, 75%), Windows Sound Mixer, Night Light toggle, Snipping Tool, and workspace mirroring across dual monitors.",
        "Advanced window switcher (window_switching.py & window_switching_ccr.py) using Alt-key foreground-lock workarounds and ExplorerPatcher taskbar element discovery."
      ],
      "app_rules": [
        "AI & Editor Ecosystem: Multi-IDE support covering VS Code, Cursor, Windsurf, Notepad++, and IntelliJ, with specialized voice commands for AI sidebars, fast edits ('edit here' / 'reject that'), and composer panels.",
        "Terminal & Shell (PowerShell & Windows Terminal): Zero-pause command execution, directory stack (pushd/popd), Ollama local model management (serve, run, ps, deepseek), Docker/n8n execution, Python REPL controls, and uv package management.",
        "Browsers (Firefox & MS Edge): Browser tab splitting ('sprite'), history search ('hispell'), developer tools navigation, address bar rapid-copy, and Waterfox dual-browser support.",
        "Office & Document Suites: Mature voice manipulation in LibreOffice Writer (table rows/columns insertion, cell merging, bookmark hopping) and MS Office (Word CCR headings, Excel column manipulation, Outlook calendar & email automation).",
        "Creative & Utility Tools: Figma design suite rules (vector pan/zoom, plugins like Coolors and Unsplash), QuickPictureViewer image manipulations, Telegram chat navigation, Zoom/Meet controls, and Scrcpy Android screen remote interaction."
      ],
      "infrastructure": [
        "Privacy-first configuration isolation: Centralized environment_variables.py for local file system paths, private repositories, email signatures, and custom commit prompt builders.",
        "Optimized text injection architecture: util/text.py (text_to_clipboard) replacing heavy keyboard emulation with instantaneous OS clipboard buffers.",
        "UI Automation Taskbar engine: util/taskbar.py rewritten to use control.click_input() and descendant searches for reliable process window targeting.",
        "Architectural pruning: Deprecated complex abstraction attempts (WindowBackend) and cleanly archived them into attic/ to keep active runtime clean."
      ],
      "docs_and_research": [
        "Comprehensive hardware guide: Added detailed documentation and setup instructions for Olympus RS31H foot pedal configuration with AutoHotkey v2.",
        "Repository Documentation: Overhauled README with Caster voice engine overview, Enable ViaCam head-tracking instructions, and clear architectural boundaries.",
        "Task & Workflow Tracking: Integrated Trello CLI voice workflows and documented prompt engineering patterns for commit message generation."
      ]
    },
    "technical_lessons": [
      "Eliminating Keystroke Latency: Default typing delays in speech engines cause noticeable stutter; setting pause=0.0 and leveraging clipboard injection (text_to_clipboard + Ctrl+V) is mandatory for fluid voice coding.",
      "Dragonfly Dynamic List Constraints: Dragonfly's Grammar Manager throws 'Cannot add list while loaded' when attempting to dynamically register lists into active grammars at runtime, requiring static initialization or full grammar reloads.",
      "Windows 11 UI Automation Quirks: Direct UI element invocation (control.invoke()) frequently fails to grant foreground focus under Windows 11; using control.click_input() combined with synthetic Alt-key pulses effectively bypasses Windows foreground-lock restrictions.",
      "AI IDE Autocomplete Collisions: High-velocity AI autocompletions (e.g. Windsurf / Cursor) can silently overwrite voice rule modifications if not closely monitored, prompting the creation of voice-activated autocomplete toggles ('snooze auto' / 'unsnooze auto').",
      "Pragmatism Over Over-Engineering: Heavy abstraction layers (such as full OOP WindowBackend abstractions) added architectural friction without improving reliability; archiving them to attic/ and favoring lean, direct utility functions proved vastly superior."
    ],
    "journey_quotes": [
      "Apparently this change was implemented in a previous commit but it was deleted by windsurf auto complete at some point and i didn't notice (Commit 4e6c718)",
      "Removed window aliasing functionality due to 'Grammar Manager: Cannot add list while loaded' error... The code has been preserved in comments for future reference and reactivation once a proper solution is found. (Commit f60c3f9)",
      "Add Alt key workaround for Windows foreground-lock in window switching: Windows prevents background applications from directly setting the foreground window... sending an Alt key event satisfies the OS requirement that user input occurred. (Commit 97c10b7)",
      "Added 'edit here' command using Key('ca-k') for Windsurf (fast) edit and 'reject that' command using Key('c-k, c-backspace') to reject Windsurf (fast) proposed changes... making rejection of AI suggestions more intuitive. (Commit e0be76c)",
      "Implemented smart pedal actions with debouncing and visual feedback: Right Pedal (F15): Smart Left Click with drag support, Middle Pedal (F14): Scroll Down with continuous scrolling... (Commit 2c6a9af)",
      "Optimized commit prompt generation by replacing Text('') with Function(text_to_clipboard) and adding a 20ms pause before clipboard paste... for faster execution and reliability. (Commit ba05776)"
    ]
  },
  {
    "era_key": "era_4_2026_modern",
    "era_title": "Era 4: Modern Architecture, Threading & Deep Dives (May 2026 - Aug 2026)",
    "date_range": "2026-05-01 to 2026-08-31",
    "theme_summary": "Era 4 marks a profound shift from practical rule-crafting toward deep systems architecture, concurrency engineering, and rigorous empirical research. Facing subtle multi-threading deadlocks and speech engine hangs, the developer launched the Socratic Wayfinder research initiative—an exhaustive 38-ticket exploration into Microsoft COM STA/MTA threading models, assistive technology architectures (NVDA, Terminator, UFO), and Model Context Protocol (MCP) servers. In a pivotal moment of empirical engineering, detailed runtime telemetry debunked the prevailing COM deadlock hypothesis by identifying Windows PowerShell QuickEdit console freezes as the true culprit behind speech stack hangs. Simultaneously, the era resolved critical Kaldi FST compiler race conditions in the Dragonfly BPC fork, introduced a 3-tier failsafe window switcher with Virtual Desktop (pyvda) awareness, engineered a dedicated XML-RPC IPC microphone bridge for the Olympus RS31H foot pedal, and conducted an in-depth evaluation of LexiconCode PR #881. The era culminated in a comprehensive overhaul of the documentation suite, establishing 'docs/context/repository-brain.md' as the canonical architectural source of truth with automated CI link validation and strict relative path hygiene.",
    "milestones": [
      {
        "hash": "afb6f63",
        "date": "2026-05-31",
        "title": "Consolidate window switching under deep app switcher module with 3-tier failsafe",
        "significance": "Replaced legacy taskbar scripts with a unified 3-tier failsafe window focus pipeline (pywinauto focus -> taskbar UIA click simulation -> Win+T keyboard macro) and restored window/tab alias commands."
      },
      {
        "hash": "f747d5a",
        "date": "2026-06-07",
        "title": "Add Caster microphone toggle IPC integration and document foot pedal changes",
        "significance": "Engineered an XML-RPC IPC server on localhost port 8341 to achieve instant, deterministic microphone sleep/wake state toggling via the Olympus RS31H foot pedal without simulated keystrokes."
      },
      {
        "hash": "3fcfd81",
        "date": "2026-07-07",
        "title": "Document Kaldi engine crash root-cause and UIA status report",
        "significance": "Identified and resolved a critical race condition in the Dragonfly BPC fork where Kaldi grammar observer lifecycle timing during Mimic() voice transitions caused mid-phrase engine crashes."
      },
      {
        "hash": "2588603",
        "date": "2026-07-16",
        "title": "Add dynamic dictation aliases and local/remote CI validation pipeline",
        "significance": "Enabled on-the-fly voice dictation for window/tab aliases while establishing pre-commit and GitHub Actions CI pipelines enforcing Ruff linting, absolute path leak prevention, and command uniqueness."
      },
      {
        "hash": "8645829",
        "date": "2026-08-04",
        "title": "Establish Wayfinder map and deprecate thread pool ADR for UIA Server refactor",
        "significance": "Launched the Socratic Wayfinder research initiative and deprecated the background worker pool ADR after uncovering Microsoft COM Single-Threaded Apartment (STA) threading constraints."
      },
      {
        "hash": "ca5dc70",
        "date": "2026-08-08",
        "title": "Debunk COM deadlocks via empirical app switcher investigation and telemetry",
        "significance": "Empirical timing telemetry proved that speech thread freezes previously blamed on COM/UIA deadlocks were actually caused by Windows PowerShell QuickEdit mode halting console stdout upon text selection."
      },
      {
        "hash": "3d2965c",
        "date": "2026-08-12",
        "title": "Add testing feedback and focus analysis for LexiconCode PR #881",
        "significance": "Produced an architectural critique of LexiconCode PR #881 window switching, contrasting its regex dynamic polling against Win32 AttachThreadInput bypass and exposing Kaldi runtime graph recompilation limits."
      },
      {
        "hash": "770bdba",
        "date": "2026-08-14",
        "title": "Overhaul documentation hierarchy and establish repository brain",
        "significance": "Consolidated fragmented notes and research into a structured documentation hub centered around 'docs/context/repository-brain.md', backed by CI markdown link validation and workspace privacy rules."
      }
    ],
    "subsystem_highlights": {
      "global_rules": [
        "Window Switching (`window_switching.py`, `window_switching_ccr.py`): Evolved to support dynamic voice-dictated window and tab aliases ('set window <dictated_alias>', 'switch [to] <alias>', 'alias reset') alongside predefined vocabularies.",
        "Text Editing (`text_editing.py`): Graduated from experimental UIA diagnostic scripts to a production rule supporting clipboard-free character/range selection via spelled NATO alphabet and dynamic capitalization.",
        "Window Positioning (`global_nonccr_extended.py`): Added verbal triggers for layout management ('position retain', 'position restore', 'position list') and multi-directional snapping ('window split <dir> with <n>').",
        "Editor Integration (`editor_commands.py`): Migrated core navigation actions from Windsurf to Antigravity IDE with command-line integration and centralized run commands."
      ],
      "app_rules": [
        "Antigravity IDE (`antigravity.py`, `antigravity_ccr.py`): Built comprehensive AI development workflows, including automated git staging/commit generation ('/commit'), voice chat focus macros (Ctrl+L / Ctrl+Shift+L), and editor pane management.",
        "PowerShell & Windows Terminal (`powershell.py`, `windows_terminal.py`): Added language-specific codebase XML bundlers ('folder xml python [wrap]', 'folder xml see sharp [wrap]') for seamless LLM context injection, plus elevated process termination.",
        "Firefox (`firefox_extended_rule.py`): Introduced voice-driven Gemini AI queries ('gemzer') and multi-window split snapping ('split right with <n>').",
        "Productivity Applications: Maintained dedicated voice grammars for LibreOffice Calc, VS Code Git workflows, and secret blurring tools."
      ],
      "infrastructure": [
        "Hardware IPC Bridge: Developed a lightweight XML-RPC HTTP server (`caster_toggle_mic_key.py`) on port 8341 paired with `foot_pedal.ahk` for instant, non-simulated microphone toggling and right-click chording (F13 held + F15 pressed).",
        "App Switcher Core (`app_switcher.py`): Engineered a modular `WindowsOSAdapter` featuring Virtual Desktop (`pyvda`) isolation, 3-tier failsafe focusing, Win32 `AttachThreadInput` bypass with dummy key (0xFF / VK_NONE) menu suppression, and Caster HUD printer integration.",
        "CI/CD & Code Quality: Instituted automated GitHub Actions (`ci.yml`, `release.yml`, `link-check.yml`) and pre-commit hooks running Ruff linting/formatting, UTF-8 stdin decoding, and custom leak detection scripts (`check_absolute_paths.py`, `check_command_uniqueness.py`)."
      ],
      "docs_and_research": [
        "Wayfinder UIA Threading Corpus (`docs/wayfinder-uia-threading/`): Completed 38 research tickets analyzing COM apartment threading, C# FlaUI implementation patterns, Model Context Protocol (MCP) servers, and assistive tools (NVDA, Terminator, UFO, hunt-and-peck).",
        "Speech Engine Internals: Documented the Kaldi streaming engine static anatomy, FST compiler race conditions, and Dragonfly rule activation lifecycle print-tracing.",
        "LexiconCode PR #881 Deep Dive: Cataloged limitations in dynamic DictList window switching, including Kaldi dynamic graph compilation barriers, explorer restart recovery, and hex/hash lexicon pollution.",
        "Repository Brain Hierarchy: Established `docs/context/repository-brain.md` as the unified source of truth, structuring docs into architecture, features, framework explainers, troubleshooting, and history."
      ]
    },
    "technical_lessons": [
      "Empirical Profiling vs. Theoretical Assumptions: Weeks of theoretical concern regarding COM STA/MTA threading deadlocks were overturned when empirical telemetry proved that console stdout freezes were caused by Windows PowerShell QuickEdit mode pausing execution when text was selected.",
      "Kaldi Finite State Transducer (FST) Runtime Invariants: While Python-side Dragonfly grammars can dynamically update word lists (`DictList`) at runtime, Kaldi's underlying decoding graph cannot be recompiled on the fly without a full engine restart, making pure dynamic vocabulary discovery incompatible with mid-session recognition.",
      "Windows COM Apartment Thread Safety: Standard background worker pools cannot be naively applied to Windows UI Automation; COM objects bound to Single-Threaded Apartments (STA) fail or deadlock when called across threads without strict marshaling mechanisms.",
      "Win32 Foreground Lock Mitigation: Circumventing OS foreground restrictions (`SetForegroundWindow`) requires a carefully sequenced pipeline combining `AttachThreadInput`, simulated dummy keypresses (`VK_NONE`) to prevent menu bar lockup, UIA taskbar clicks, and Win+T keyboard fallbacks.",
      "Lexicon and Acoustic Pollution: Unchecked ingestion of dynamic window titles and browser tabs injects random hex hashes and junk tokens into Kaldi's G2P dictionary (`g2p-en`), bloating compile times, degrading acoustic model accuracy, and multiplying homophone collisions."
    ],
    "journey_quotes": [
      "I stopped using words because I was unable to get the transformers to work, so now I am just relying on having them edited in the Caster source code instead. (5aa6718)",
      "This new approach is still under evaluation. While not considered 100% perfect yet, early limited usage indicates improved reliability and fewer focus bugs. (b03e52c)",
      "Empirical testing of app switcher performance identified Windows PowerShell QuickEdit mode as the root cause of stdout freezes previously attributed to COM deadlocks. (ca5dc70)",
      "Testing of third-party MCP servers showed that generic LLM agent solutions introduce unnecessary bloat and dependencies, requiring a pivot to designing a bespoke C# Micro MCP Server. (bc983b7)",
      "Helps reduce cognitive load by establishing a clear history of changes and a roadmap for the development environment. (463140d)",
      "The repository's main document was cluttered with verbose notes from completed research sessions, making it hard to follow the current developmental focus... accurately frame Wayfinder as a structured AI research session rather than a core feature. (d3e90fd, 763e272)",
      "This was done because I meant to talk about my Calc macros instead. Left blank as todo for now. (6dc6d34)"
    ]
  }
];
