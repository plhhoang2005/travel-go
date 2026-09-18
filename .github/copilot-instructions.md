# GitHub Copilot Custom Instructions for TripAI (TravelGO)

Whenever assisting with coding tasks in this repository, you MUST follow these instructions:

## 1. Prime Directive: Consult AGENTS.md First
- Read and adhere to the project constitution in [AGENTS.md](../AGENTS.md).
- Adhere to the consolidated rules in [.agent/rules.md](../.agent/rules.md) and knowledge base in [.agent/knowledge.md](../.agent/knowledge.md).
- Follow the Prompt Gatekeeper and development workflow in [.agent/workflow.md](../.agent/workflow.md).

## 2. Five Immutable Architecture Laws
1. **Interactive Dashboard First**: Never suggest transforming the UI into a simple chatbot text thread. Maintain sliders, scorecards, and Recharts components.
2. **Backend Single Source of Truth**: All decision math (MCDA scoring, Pareto transport optimization, Greedy itinerary scheduling) belongs in `com.travelgo.decision`. Frontend only displays DTOs.
3. **Zero Silent Fallback**: When external services (e.g. Open-Meteo) fail, return fallback data with `isFallback: true` and display the fallback badge on UI.
4. **Non-Blocking LLM Explainer**: The AI explanation layer must not break core decision API responses.
5. **Human Gatekeeper**: Never modify architecture standards or permanent rules without explicit developer confirmation.

## 3. Anti-Vague Prompt & Coding Conventions
- **Codebase First**: When technical parameters or DTOs are unmentioned, inspect existing code before asking the user.
- **Java (Spring Boot 3)**: Java 17/21 records for DTOs, `@RestControllerAdvice` for global error handling, clear named constants for math weights (no magic numbers).
- **Frontend (React 18 / TypeScript)**: Strict typing (no `any`), centralized API client in `src/api/tripApi.ts`, responsive TailwindCSS design, keep TypeScript types in sync with Java DTOs.
- **Verification**: Always run `mvn test` and `npm run build` before claiming a task is complete.
