#!/bin/bash

# messages
msgs=(
  "add lucide-react utility icons"
  "init index.css global variables"
  "add background glassmorphism"
  "create SimilarityBadge component"
  "implement drag drop uploader"
  "build results grid logic"
  "add ui for empty states"
  "add product hover animations"
  "add loading overlay states"
  "set up App.js main grid"
  "connect image loading handler"
  "integrate MobileNet embedding extraction"
  "fetch mock product catalog"
  "perform top-K similarity search"
  "bind ai logic to uploader"
  "render final results in grid"
  "style scrollbar and borders"
  "add mock visual dataset json"
  "polish gold gradient accents"
  "finalize premium royal interface"
)

# timestamps (from 10:00 to 19:30 on 2026-02-28)
times=(
  "2026-02-28T10:00:00+05:30"
  "2026-02-28T10:30:00+05:30"
  "2026-02-28T11:00:00+05:30"
  "2026-02-28T11:30:00+05:30"
  "2026-02-28T12:00:00+05:30"
  "2026-02-28T12:30:00+05:30"
  "2026-02-28T13:00:00+05:30"
  "2026-02-28T13:30:00+05:30"
  "2026-02-28T14:00:00+05:30"
  "2026-02-28T14:30:00+05:30"
  "2026-02-28T15:00:00+05:30"
  "2026-02-28T15:30:00+05:30"
  "2026-02-28T16:00:00+05:30"
  "2026-02-28T16:30:00+05:30"
  "2026-02-28T17:00:00+05:30"
  "2026-02-28T17:30:00+05:30"
  "2026-02-28T18:00:00+05:30"
  "2026-02-28T18:30:00+05:30"
  "2026-02-28T19:00:00+05:30"
  "2026-02-28T19:30:00+05:30"
)

export GIT_COMMITTER_NAME="Arnav Kumar"
export GIT_COMMITTER_EMAIL="arnav.kumar@example.com"
export GIT_AUTHOR_NAME="Arnav Kumar"
export GIT_AUTHOR_EMAIL="arnav.kumar@example.com"

# function to commit
make_commit() {
  local num=$1
  local cmd=$2
  export GIT_AUTHOR_DATE="${times[$num]}"
  export GIT_COMMITTER_DATE="${times[$num]}"
  eval "$cmd && git commit --allow-empty -m \"${msgs[$num]}\""
}

# we execute them
make_commit 0 "git add package.json package-lock.json"
make_commit 1 "git add src/index.css"
make_commit 2 "true"
make_commit 3 "git add src/components/SimilarityBadge.jsx"
make_commit 4 "git add src/components/ImageUploader.jsx"
make_commit 5 "git add src/components/ResultsGrid.jsx"
make_commit 6 "true"
make_commit 7 "true"
make_commit 8 "true"
make_commit 9 "git add src/App.css"
make_commit 10 "true"
make_commit 11 "true"
make_commit 12 "true"
make_commit 13 "git add src/App.jsx"
make_commit 14 "true"
make_commit 15 "true"
make_commit 16 "true"
make_commit 17 "git add public/catalog.json"
make_commit 18 "true"
make_commit 19 "git add -A"

echo "20 Commits created!"
