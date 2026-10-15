# Handoff Report: Verification Suite Refactoring & Hardening Strategy

**Agent**: Test Suite Rigor Strategist (`teamwork_preview_explorer_fix_2`)  
**Mission**: Formulate the exact refactor and hardening strategy for `verify_target_companies.py`: strengthen Gate 9 to strictly assert `kausal.in` and 3.5 YOE, add Gate 11 asserting mandatory presence of all 7 seed companies, fix line 125 cardinality check to 30–40, and harden compensation and skill regexes against edge-case vulnerabilities.  
**Recipient**: Project Orchestrator (`fc1a0e68-b83b-49e4-9e93-60c036f1a7e8`)  
**Working Directory**: `/Users/a7970513448/Documents/antigravity/quirky-babbage/.agents/teamwork_preview_explorer_fix_2`  
**Date**: 2026-09-24T00:43:00+05:30  
**Status**: COMPLETE (Hard Handoff — Fully Specified Refactor, Patch & Drop-In Replacement File)

---

## 1. Observation

### 1.1 Gate 9 Facade Vulnerability & False Personalization Assertion
- **File**: `/Users/a7970513448/Documents/antigravity/quirky-babbage/verify_target_companies.py`, lines 217–235:
  ```python
  # Gate 9: Substantial, Personalized Value Proposition for Candidate
  for idx, row in enumerate(rows, start=1):
      name = row[0]
      val_prop = str(row[9]).strip()
      assert len(val_prop) >= 25, (
          f"Gate 9 Failed: Row {idx} ({name}) value proposition too brief ({len(val_prop)} chars): '{val_prop}'"
      )
      # Check alignment keywords
      vp_lower = val_prop.lower()
      has_alignment = any(kw in vp_lower for kw in [
          "react", "native", "angular", "ci/cd", "pipeline", "fintech",
          "banking", "insurance", "performance", "component", "state",
          "docker", "kubernetes", "scale", "concurrency", "checkout", "3.5"
      ])
      assert has_alignment, (
          f"Gate 9 Failed: Row {idx} ({name}) value proposition lacks candidate alignment keywords: '{val_prop}'"
      )
  print("✓ Gate 9 Passed: 100% tailored, substantial value propositions for Kaushal Kumar (3.5 YOE).")
  ```
- **File**: `/Users/a7970513448/Documents/antigravity/quirky-babbage/verify_target_companies.py` (`TestTargetCompaniesDataset`), lines 312–317:
  ```python
  def test_gate9_value_proposition(self):
      rows = self.data["rows"]
      for r in rows:
          val_prop = r[9]
          self.assertGreaterEqual(len(val_prop), 25, f"{r[0]} value proposition too short: {val_prop}")
  ```
- **Empirical Gap Confirmed by Reviewer 2 (`.agents/teamwork_preview_reviewer_2/handoff.md`, lines 35–59, 172–188)**:
  - Gate 9 prints that it verified "100% tailored, substantial value propositions for Kaushal Kumar (3.5 YOE)", but the underlying assertion only tests `len(val_prop) >= 25` and whether `any()` of 17 common tech words (`"component"`, `"scale"`, `"state"`, `"pipeline"`) appears.
  - It performs zero assertions for the candidate's portfolio link `kausal.in`, zero assertions for candidate name `Kaushal`, and zero mandatory checks for `3.5` YOE.
  - A completely generic sentence like `"We build scalable web components"` passes Gate 9.

### 1.2 Missing Seed Company Assertion (Absence of Gate 11)
- **Contract Requirement**: `ORIGINAL_REQUEST.md` (§R1, lines 58–62):
  > "Identify and curate 30 to 40 high-caliber, underrated product companies (expanding upon examples such as Nike, Samsung, Airtel, Cult.fit, Agoda, BookMyShow, Ixigo):"
- **Finding Confirmed by Challenger 1 (`.agents/teamwork_preview_challenger_1/handoff.md`, lines 155–157, 231–236)**:
  - `verify_target_companies.py` currently has only Gates 1 through 10.
  - Zero assertions exist verifying the presence of the 7 prompt seed companies. If a data modification or regression dropped Nike, Samsung, or Ixigo, all 10 existing gates would still pass.

### 1.3 Cardinality Over-Constraint on Line 125
- **File**: `/Users/a7970513448/Documents/antigravity/quirky-babbage/verify_target_companies.py`, lines 122–127:
  ```python
  assert 30 <= total_companies <= 40, (
      f"Gate 3 Failed: Dataset must contain between 30 and 40 product companies, got {total_companies}"
  )
  assert total_companies == 35, (
      f"Gate 3 Warning/Requirement: Expected exactly 35 companies per dispatch assignment, got {total_companies}"
  )
  ```
- **File**: Line 273:
  ```python
  self.assertEqual(len(rows), 35)
  ```
- **Finding Confirmed by Reviewer 2 (`handoff.md`, line 210–215)**:
  - `ORIGINAL_REQUEST.md` line 50 and 86 explicitly define the requirement as 30 to 40 companies.
  - Hardcoding `assert total_companies == 35` creates an artificial failure on valid datasets containing 32, 36, or 38 companies.

### 1.4 Compensation Floor Regex Vulnerabilities
- **File**: `/Users/a7970513448/Documents/antigravity/quirky-babbage/verify_target_companies.py`, lines 71–88:
  ```python
  def parse_compensation_floor(comp_str):
      c = comp_str.lower()
      inr_match = re.search(r'[₹]?\s*(\d+)\s*(?:lpa|l\b)', c)
      if inr_match:
          return int(inr_match.group(1))
      usd_match = re.search(r'\$\s*(\d+)k', c)
      if usd_match:
          return int(usd_match.group(1)) * 37 // 45
      return None
  ```
- **Empirical Reproduction from Challenger 2 (`handoff.md`, lines 75–94)**:
  1. Hyphenated range without leading LPA tag: `"₹15 - ₹25 LPA"` matches `25` (ceiling) instead of `15` (floor), allowing an under-market band (< ₹18 LPA) to falsely pass Gate 8.
  2. Inverted order / descriptive string: `"Max ₹35 LPA, Min ₹12 LPA"` matches `35` (first regex match) instead of `12`.
  3. Float/decimal amounts: `"₹16.5 LPA - ₹24 LPA"` matches `5` (the digit after `.`) instead of `16.5`.

### 1.5 Loose Substrings in Skill Matching
- **File**: `/Users/a7970513448/Documents/antigravity/quirky-babbage/verify_target_companies.py`, lines 57–67:
  - `"aws"` in `cicd_tokens`: `any(token in s for token in cicd_tokens)` matches `"flaws"`, `"draws"`, `"jaws"`.
  - `"angular"` in `s`: matches `"triangular"` or `"rectangular"`.

---

## 2. Logic Chain

1. **Step 1: Test Rigor & Integrity Mandate**:
   - *Observation*: Reviewer 2 flagged Gate 9 as an Integrity Violation because it claims to verify candidate personalization (Kaushal Kumar, 3.5 YOE, `kausal.in`) while using a superficial check where generic text passes.
   - *Inference*: Gate 9 must be refactored from a loose keyword check into an uncompromising assertion suite enforcing candidate name (`kaushal`), experience (`3.5`), portfolio URL (`kausal.in`), substantial narrative length (`>= 50 chars`), and target tech domain alignment.
2. **Step 2: Seed Company Preservation Guarantee**:
   - *Observation*: Challenger 1 noted the absence of any assertion protecting the 7 prompt seed companies (`Nike`, `Samsung`, `Airtel`, `Cult.fit`, `Agoda`, `BookMyShow`, `Ixigo`).
   - *Inference*: Adding Gate 11 (`MANDATORY_SEED_COMPANIES`) ensures dataset stability against unintentional pruning or regression across all future edits.
3. **Step 3: Harmonizing Cardinality Checks with System Scope**:
   - *Observation*: `ORIGINAL_REQUEST.md` line 50 defines the cardinality boundary as `30 to 40 product companies`. Line 125 in `verify_target_companies.py` hardcoded `total_companies == 35`.
   - *Inference*: Line 125 must enforce `30 <= total_companies <= 40` as the sole assertion gate, removing the rigid `== 35` failure.
4. **Step 4: Hardening Mathematical Parsing of Compensation Bands**:
   - *Observation*: `parse_compensation_floor` had 3 edge-case vulnerabilities (capturing range ceilings, first-match inversion, and float truncation).
   - *Inference*: The parser must extract both ends of hyphenated ranges (`(\d+(?:\.\d+)?)\s*(?:-|to)\s*(\d+(?:\.\d+)?)`), properly capture float digits, identify standalone LPA amounts, and compute the true minimum CTC floor.
5. **Step 5: Word Boundary Isolation for Core Skills**:
   - *Observation*: Substrings like `"aws"` and `"angular"` cause false positive collisions with common English words.
   - *Inference*: Applying `\b` boundaries (`\bangular(\.js)?\b`, `\bci[\s/]?cd\b`, `\baws\b`) ensures 100% precision with zero token bleeding.

---

## 3. Caveats

1. **Dataset Dependency**:
   - Strengthening Gate 9 to require `kausal.in`, `Kaushal`, and `3.5` means that running `verify_target_companies.py` against the *current* `target_companies.json` will fail on Row 1 (Nike) because Nike's current Column J does not contain `kausal.in`.
   - This failure is intentional and desirable: it confirms the test is no longer a facade. Once Explorer Fix 1 / Remediation Worker updates Column J in `target_companies.json`, Gate 9 will pass cleanly.
2. **Read-Only Explorer Discipline**:
   - As an Explorer agent, we do NOT directly modify `/Users/a7970513448/Documents/antigravity/quirky-babbage/verify_target_companies.py`.
   - Instead, we have provided the complete drop-in replacement file `proposed_verify_target_companies.py` and unified diff `verify_target_companies.patch` in our working directory for downstream execution.

---

## 4. Conclusion & Concrete Implementation Recommendations

### 4.1 Summary of Deliverables Produced in Working Directory
1. **Drop-In Replacement File**:
   `/Users/a7970513448/Documents/antigravity/quirky-babbage/.agents/teamwork_preview_explorer_fix_2/proposed_verify_target_companies.py`
2. **Unified Diff Patch**:
   `/Users/a7970513448/Documents/antigravity/quirky-babbage/.agents/teamwork_preview_explorer_fix_2/verify_target_companies.patch`

---

### 4.2 Detailed Code Modifications (Before vs. After)

#### Component 1: Seed Company Constants (Add after line 36)
```python
# BEFORE (Lines 36-37):
VALID_HEADCOUNT_TIERS = ["100-500", "500-1000", "1000-5000", "5000+"]

# AFTER:
VALID_HEADCOUNT_TIERS = ["100-500", "500-1000", "1000-5000", "5000+"]

MANDATORY_SEED_COMPANIES = [
    "Nike",
    "Samsung",
    "Airtel",
    "Cult.fit",
    "Agoda",
    "BookMyShow",
    "Ixigo"
]
```

#### Component 2: Hardened `match_core_skills` (Lines 38–70)
```python
# BEFORE:
def match_core_skills(stack_str):
    s = stack_str.lower()
    matched = []
    has_rn = "react native" in s or "react-native" in s
    if has_rn:
        matched.append("React Native")
    if has_rn:
        cleaned = re.sub(r'react[\s-]native', '', s)
        if re.search(r'\breact(\.js)?\b', cleaned) or "next.js" in cleaned or "nextjs" in cleaned:
            matched.append("React")
    else:
        if re.search(r'\breact(\.js)?\b', s) or "next.js" in s or "nextjs" in s:
            matched.append("React")
    cicd_tokens = [
        "ci/cd", "cicd", "ci / cd", "docker", "kubernetes", "k8s",
        "jenkins", "gitlab ci", "github actions", "pipeline", "devops",
        "openshift", "harness", "aws"
    ]
    if any(token in s for token in cicd_tokens):
        matched.append("CI/CD")
    if "angular" in s:
        matched.append("Angular")
    return matched

# AFTER:
def match_core_skills(stack_str):
    """
    Identifies target skills from stack string with strict word boundary protection:
    - React Native
    - React (standalone React / React.js / Next.js)
    - CI/CD & Deployment Automation
    - Angular
    Prevents false substring matches (e.g. 'flaws' for AWS or 'triangular' for Angular).
    """
    s = stack_str.lower()
    matched = []

    # 1. React Native (word boundary protected)
    has_rn = bool(re.search(r'\breact[\s-]native\b', s))
    if has_rn:
        matched.append("React Native")

    # 2. React (standalone React / React.js / Next.js, isolating React Native)
    if has_rn:
        cleaned = re.sub(r'\breact[\s-]native\b', '', s)
        has_react = bool(
            re.search(r'\breact(\.js)?\b', cleaned) or
            re.search(r'\bnext(\.js)?\b', cleaned) or
            "nextjs" in cleaned
        )
    else:
        has_react = bool(
            re.search(r'\breact(\.js)?\b', s) or
            re.search(r'\bnext(\.js)?\b', s) or
            "nextjs" in s
        )
    if has_react:
        matched.append("React")

    # 3. CI/CD & Deployment Automation (strict word boundary regexes, no loose substring collisions)
    has_cicd = bool(
        re.search(r'\bci[\s/]?cd\b', s) or
        re.search(r'\b(docker|kubernetes|k8s|jenkins|gitlab[\s-]?ci|github[\s-]?actions|pipelines?|devops|openshift|harness)\b', s) or
        re.search(r'\baws\b', s)
    )
    if has_cicd:
        matched.append("CI/CD")

    # 4. Angular (strict word boundary, no collision with 'triangular')
    if re.search(r'\bangular(\.js)?\b', s):
        matched.append("Angular")

    return matched
```

#### Component 3: Hardened `parse_compensation_floor` (Lines 71–88)
```python
# BEFORE:
def parse_compensation_floor(comp_str):
    c = comp_str.lower()
    inr_match = re.search(r'[₹]?\s*(\d+)\s*(?:lpa|l\b)', c)
    if inr_match:
        return int(inr_match.group(1))
    usd_match = re.search(r'\$\s*(\d+)k', c)
    if usd_match:
        return int(usd_match.group(1)) * 37 // 45
    return None

# AFTER:
def parse_compensation_floor(comp_str):
    """
    Parses minimum compensation and returns floor in LPA or equivalent.
    Hardened against:
    - Hyphenated ranges without leading LPA (e.g. '₹15 - ₹25 LPA') -> captures lower bound (15)
    - Dual tagged LPA ranges (e.g. '₹28 LPA - ₹42 LPA CTC') -> captures lower bound (28)
    - Decimals/floats without digit truncation (e.g. '₹16.5 LPA - ₹24 LPA') -> captures 16.5 -> 16
    - Inverted/worded order (e.g. 'Max ₹35 LPA, Min ₹12 LPA') -> captures 12
    - USD ranges (e.g. '$45k - $75k USD') -> converts $45k to ~₹37 LPA
    """
    c = comp_str.lower()
    inr_candidates = []

    # 1. Hyphenated / 'to' range with LPA/L/Lakh at the end: e.g. '₹15 - ₹25 LPA', '18 to 28L'
    range_matches = re.findall(
        r'(?:₹\s*|inr\s*)?(\d+(?:\.\d+)?)\s*(?:lpa|l\b|lakhs?)?\s*(?:-|–|—|to)\s*(?:₹\s*|inr\s*)?(\d+(?:\.\d+)?)\s*(?:lpa|l\b|lakhs?)',
        c
    )
    for low, high in range_matches:
        inr_candidates.append(float(low))
        inr_candidates.append(float(high))

    # 2. Standalone or individually tagged LPA/L/Lakh amounts: e.g. '₹28 LPA', '₹20L', 'min ₹12 lpa'
    tagged_matches = re.findall(
        r'(?:₹\s*|inr\s*)?(\d+(?:\.\d+)?)\s*(?:lpa|l\b|lakhs?)',
        c
    )
    for val in tagged_matches:
        inr_candidates.append(float(val))

    # Filter out unreasonable numbers (valid LPA range: 5 to 150)
    valid_inr = [val for val in inr_candidates if 5.0 <= val <= 150.0]

    if valid_inr:
        # If an explicit salary range was identified at the start, use the lower bound of the first range
        if range_matches:
            first_low = float(range_matches[0][0])
            if 5.0 <= first_low <= 150.0:
                return int(first_low)
        return int(min(valid_inr))

    # 3. Check for USD $ pattern: e.g. $45k, $45,000, 45k usd
    usd_k_matches = re.findall(r'\$\s*(\d+(?:\.\d+)?)\s*k|\b(\d+(?:\.\d+)?)\s*k\s*usd', c)
    usd_candidates = []
    for m in usd_k_matches:
        val = m[0] or m[1]
        if val:
            usd_candidates.append(float(val))

    if usd_candidates:
        min_usd_k = min(usd_candidates)
        # $45k USD is ~₹37 LPA CTC equivalent
        return int(min_usd_k * 37 / 45)

    return None
```

#### Component 4: Relax Gate 3 Cardinality (Lines 120–128)
```python
# BEFORE:
    total_companies = len(rows)
    assert 30 <= total_companies <= 40, (
        f"Gate 3 Failed: Dataset must contain between 30 and 40 product companies, got {total_companies}"
    )
    assert total_companies == 35, (
        f"Gate 3 Warning/Requirement: Expected exactly 35 companies per dispatch assignment, got {total_companies}"
    )
    print(f"✓ Gate 3 Passed: Exactly {total_companies} product companies present (within 30-40 requirement).")

# AFTER:
    total_companies = len(rows)
    assert 30 <= total_companies <= 40, (
        f"Gate 3 Failed: Dataset must contain between 30 and 40 product companies per ORIGINAL_REQUEST.md (§R1), got {total_companies}"
    )
    print(f"✓ Gate 3 Passed: Exactly {total_companies} product companies present (within canonical 30-40 boundary).")
```

#### Component 5: Harden Gate 5 Headcount Matching (Line 147)
```python
# BEFORE:
    matched_tiers = [t for t in VALID_HEADCOUNT_TIERS if t in tier_str]

# AFTER:
    matched_tiers = [t for t in VALID_HEADCOUNT_TIERS if tier_str.startswith(t)]
```

#### Component 6: Strengthen Gate 9 to Strict Candidate Personalization (Lines 217–235)
```python
# BEFORE:
    # Gate 9: Substantial, Personalized Value Proposition for Candidate
    for idx, row in enumerate(rows, start=1):
        name = row[0]
        val_prop = str(row[9]).strip()
        assert len(val_prop) >= 25, (
            f"Gate 9 Failed: Row {idx} ({name}) value proposition too brief ({len(val_prop)} chars): '{val_prop}'"
        )
        # Check alignment keywords
        vp_lower = val_prop.lower()
        has_alignment = any(kw in vp_lower for kw in [
            "react", "native", "angular", "ci/cd", "pipeline", "fintech",
            "banking", "insurance", "performance", "component", "state",
            "docker", "kubernetes", "scale", "concurrency", "checkout", "3.5"
        ])
        assert has_alignment, (
            f"Gate 9 Failed: Row {idx} ({name}) value proposition lacks candidate alignment keywords: '{val_prop}'"
        )
    print("✓ Gate 9 Passed: 100% tailored, substantial value propositions for Kaushal Kumar (3.5 YOE).")

# AFTER:
    # Gate 9: Strict Tailored Value Proposition for Candidate (Kaushal Kumar, 3.5 YOE, kausal.in)
    for idx, row in enumerate(rows, start=1):
        name = row[0]
        val_prop = str(row[9]).strip()
        vp_lower = val_prop.lower()

        # 1. Length floor: Must be substantial (>= 50 characters)
        assert len(val_prop) >= 50, (
            f"Gate 9 Failed: Row {idx} ({name}) value proposition too brief ({len(val_prop)} chars, min 50): '{val_prop}'"
        )

        # 2. Portfolio Link: Mandatory presence of 'kausal.in'
        assert "kausal.in" in vp_lower, (
            f"Gate 9 Failed: Row {idx} ({name}) value proposition missing candidate portfolio link 'kausal.in': '{val_prop}'"
        )

        # 3. Candidate Experience & Identity: Mandatory reference to '3.5' YOE and candidate name 'Kaushal'
        has_exp = "3.5" in vp_lower or bool(re.search(r'\b3\.5\s*(?:yoe|years|\+?\s*years)?\b', vp_lower))
        assert has_exp, (
            f"Gate 9 Failed: Row {idx} ({name}) value proposition missing candidate experience '3.5' YOE: '{val_prop}'"
        )
        assert "kaushal" in vp_lower, (
            f"Gate 9 Failed: Row {idx} ({name}) value proposition missing candidate name 'Kaushal': '{val_prop}'"
        )

        # 4. Tech Stack Alignment: Must mention candidate core competencies
        has_tech_alignment = any(tech in vp_lower for tech in [
            "react", "native", "angular", "ci/cd", "cicd", "pipeline"
        ])
        assert has_tech_alignment, (
            f"Gate 9 Failed: Row {idx} ({name}) value proposition lacks target tech stack alignment: '{val_prop}'"
        )
    print("✓ Gate 9 Passed: 100% verified tailored value propositions citing Kaushal Kumar, 3.5 YOE, kausal.in, and stack alignment.")
```

#### Component 7: Add Gate 11 for Mandatory Seed Companies (Add after Gate 10)
```python
    # Gate 11: Mandatory Inclusion of Prompt Seed Companies
    present_company_names = [str(row[0]).strip() for row in rows]
    names_lower = [n.lower() for n in present_company_names]

    missing_seeds = []
    for seed in MANDATORY_SEED_COMPANIES:
        seed_lower = seed.lower()
        matched = any(
            seed_lower in name or
            (seed_lower == "cult.fit" and ("curefit" in name or "cultfit" in name))
            for name in names_lower
        )
        if not matched:
            missing_seeds.append(seed)

    assert not missing_seeds, (
        f"Gate 11 Failed: Missing mandatory seed companies from ORIGINAL_REQUEST.md (§R1): {missing_seeds}. "
        f"Present companies ({len(present_company_names)}): {present_company_names}"
    )
    print(f"✓ Gate 11 Passed: All 7 prompt seed companies present and verified ({', '.join(MANDATORY_SEED_COMPANIES)}).")
```

#### Component 8: Synchronize Unittest Suite (`TestTargetCompaniesDataset`)
Update `test_gate3_quantity_boundary`, `test_gate5_headcount_tiers`, `test_gate9_value_proposition`, and add `test_gate11_mandatory_seed_companies`:
```python
    def test_gate3_quantity_boundary(self):
        rows = self.data["rows"]
        self.assertTrue(30 <= len(rows) <= 40, f"Expected 30-40 companies, got {len(rows)}")

    def test_gate5_headcount_tiers(self):
        rows = self.data["rows"]
        for r in rows:
            tier_str = str(r[4]).strip()
            self.assertTrue(any(tier_str.startswith(t) for t in VALID_HEADCOUNT_TIERS), f"{r[0]} invalid tier: {tier_str}")

    def test_gate9_value_proposition(self):
        rows = self.data["rows"]
        for r in rows:
            val_prop = str(r[9]).strip()
            vp_lower = val_prop.lower()
            self.assertGreaterEqual(len(val_prop), 50, f"{r[0]} value proposition too short: {val_prop}")
            self.assertIn("kausal.in", vp_lower, f"{r[0]} missing 'kausal.in' portfolio link")
            has_exp = "3.5" in vp_lower or bool(re.search(r'\b3\.5\s*(?:yoe|years|\+?\s*years)?\b', vp_lower))
            self.assertTrue(has_exp, f"{r[0]} missing '3.5' YOE")
            self.assertIn("kaushal", vp_lower, f"{r[0]} missing candidate name 'Kaushal'")
            self.assertTrue(
                any(tech in vp_lower for tech in ["react", "native", "angular", "ci/cd", "cicd", "pipeline"]),
                f"{r[0]} missing core tech keywords: {val_prop}"
            )

    def test_gate11_mandatory_seed_companies(self):
        rows = self.data["rows"]
        names_lower = [str(r[0]).lower() for r in rows]
        for seed in MANDATORY_SEED_COMPANIES:
            seed_lower = seed.lower()
            matched = any(
                seed_lower in name or
                (seed_lower == "cult.fit" and ("curefit" in name or "cultfit" in name))
                for name in names_lower
            )
            self.assertTrue(matched, f"Mandatory seed company '{seed}' missing from dataset")
```

---

## 5. Verification Method

### 5.1 Verification Commands for Downstream Worker
1. **Apply the patch or copy the replacement file**:
   ```bash
   cp /Users/a7970513448/Documents/antigravity/quirky-babbage/.agents/teamwork_preview_explorer_fix_2/proposed_verify_target_companies.py \
      /Users/a7970513448/Documents/antigravity/quirky-babbage/verify_target_companies.py
   # OR:
   git apply /Users/a7970513448/Documents/antigravity/quirky-babbage/.agents/teamwork_preview_explorer_fix_2/verify_target_companies.patch
   ```

2. **Verify against Edge-Case Unit Checks**:
   ```python
   python3 -c "
   from verify_target_companies import parse_compensation_floor, match_core_skills
   assert parse_compensation_floor('₹15 - ₹25 LPA') == 15
   assert parse_compensation_floor('Max ₹35 LPA, Min ₹12 LPA') == 12
   assert parse_compensation_floor('₹16.5 LPA - ₹24 LPA') == 16
   assert match_core_skills('analyzes code flaws with triangular geometry') == []
   assert match_core_skills('React Native, iOS') == ['React Native']
   assert match_core_skills('React.js, React Native, CI/CD, Angular') == ['React Native', 'React', 'CI/CD', 'Angular']
   print('All edge-case stress assertions passed!')
   "
   ```

3. **Run Full Verification Suite (after Column J is updated)**:
   ```bash
   python3 verify_target_companies.py
   # Expected output:
   # ALL 11 GATES PASSED! Dataset is 100% compliant with R1-R4.
   # Exit code: 0
   ```

4. **Run Unittest Runner**:
   ```bash
   python3 verify_target_companies.py --unittest
   # Expected output:
   # Ran 11 tests in 0.005s
   # OK
   ```

### 5.2 Invalidation Conditions
- Any occurrence of `kausal.in`, `Kaushal`, or `3.5` missing in Column J not being caught by Gate 9.
- Any dropping of the 7 seed companies (`Nike`, `Samsung`, `Airtel`, `Cult.fit`, `Agoda`, `BookMyShow`, `Ixigo`) passing Gate 11.
- A valid dataset of 32 or 38 companies failing Gate 3.
- Substring collision on `aws` (e.g. `flaws`) or `angular` (e.g. `triangular`) generating false skill credit.
