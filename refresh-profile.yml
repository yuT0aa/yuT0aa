name: Refresh profile README

on:
  schedule:
    - cron: "17 8 * * *" # Daily at 08:17 UTC
  workflow_dispatch:

permissions:
  contents: write

concurrency:
  group: refresh-profile-readme
  cancel-in-progress: false

jobs:
  refresh:
    runs-on: ubuntu-latest
    steps:
      - name: Check out profile repository
        uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.x"

      - name: Refresh repository section
        run: python scripts/update_readme.py

      - name: Commit changes if needed
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
          if git diff --quiet -- README.md; then
            echo "No README changes to commit."
          else
            git add README.md
            git commit -m "chore: refresh profile repository list"
            git push
          fi
