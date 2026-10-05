fmt:
    npm run lint -- --fix

lint:
    npm run lint
    npx tsc --noEmit -p .
