fmt:
    npm exec -- eslint --fix src
    git diff --check main

lint:
    npm run lint
