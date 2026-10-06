# Nested Noughts and Crosses — Web Edition

A browser rewrite of the original pygame desktop game. No build step, no
framework — plain HTML/CSS/JS — which is what makes it something you can
actually containerize and run on Kubernetes.

## Why this exists

The original pygame version opens a real window and needs a screen,
keyboard, and mouse on the machine it runs on — that doesn't translate to a
headless container running in a cluster. This version runs in any browser
and is served as plain static files, which **is** a normal containerized
workload: build an image, run N replicas behind a Service, done.

## Project layout

```
index.html          entry point, loads the canvas + main.js
style.css            page styling
src/gameLogic.js      pure game rules - no DOM/canvas, fully unit tested
src/render.js         all canvas drawing - reads state, draws it, no decisions
src/main.js           screen state machine + input handling, wires the above together
tests/gameLogic.test.js   unit tests (Node's built-in test runner, zero extra deps to run)
Dockerfile             nginx image serving the static files
k8s/deployment.yaml     Deployment manifest (2 replicas, resource limits, health probes)
k8s/service.yaml        ClusterIP Service in front of it
.github/workflows/ci.yml   lint -> test -> docker build -> validate k8s manifests
```

## What changed from the original pygame code (and why)

- **Logic and rendering are fully separated.** `gameLogic.js` has zero
  dependency on the DOM or canvas — it's plain functions in, plain data out.
  That's what makes real unit testing possible, instead of the smoke-test
  workaround the pygame version needed.
- **One source of truth for score.** The original had two separate,
  drifting score counters (a module-level global in `check_game_winner()`
  and a separate local in `main()`). Here, score lives in one place:
  `state.game.score`.
- **State is never mutated in place.** `applyMove()` returns a new boards
  array rather than editing the existing one — easier to reason about, and
  what let the "does not mutate the input" test actually mean something.
- **The chained-comparison bug class is covered by a regression test.**
  `checkWinner: two matching cells plus a different third cell is NOT a win`
  exists specifically to catch the `row[0] == row[1] == row[1]` style typo
  that was invisible to the original test suite.
- **Constants aren't duplicated across files** the way `WIDTH`/`HEIGHT`/
  `GRID_SIZE` were copy-pasted across `mainMenu.py`, `game.py`, and
  `rules.py`.

## Running it locally

```bash
npm install          # only needed for eslint; the app itself has zero runtime deps
npm test              # run the unit tests
npm run lint           # lint src/ and tests/
```

To view the game itself, just open `index.html` in a browser, or serve the
folder with any static file server, e.g. `npx serve .`

## Building and running the container

```bash
docker build -t nested-tictactoe-web .
docker run -p 8080:80 nested-tictactoe-web
# then open http://localhost:8080
```

## Deploying to Kubernetes

1. Push the built image to a registry (Docker Hub, GHCR, ECR, etc.)
2. Update the `image:` field in `k8s/deployment.yaml` to point at it
3. `kubectl apply -f k8s/`
4. `kubectl port-forward svc/nested-tictactoe-web 8080:80` to check it locally,
   or add an Ingress / switch the Service to `LoadBalancer` to expose it externally

## CI/CD pipeline

On every push/PR to `main`:
1. **lint-and-test** — ESLint, then the unit test suite
2. **docker-build** — builds the image (only if lint-and-test passed)
3. **validate-k8s-manifests** — checks `k8s/*.yaml` against the Kubernetes
   schema with `kubeconform`, so a typo in a manifest fails CI instead of
   failing at `kubectl apply` time

The pipeline doesn't push the image anywhere yet — that's the natural next
step once you've got a registry to push to.
