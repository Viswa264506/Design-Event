# Production Evaluation Fix

## What was fixed

- Removed the RPC/client-side scoring fallbacks from `submitDesignService`.
- Made `evaluate-submission` the single production scoring authority.
- Standardized the submission payload as `designJson` + `initialDesigns` + `sessionId`.
- Added robust attempt detection using normalized design properties.
- Implemented question-specific 5-category scoring (2 marks per category, 10 per task).
- Prevented legitimate multi-element tasks from being treated as "extra element" failures.
- Added validation that all 10 private task-answer records exist before evaluation.
- Added safe color normalization for `color` / `backgroundColor`.
- Added the server-generated `submissionId` to the result flow.
- ResultPage can now load the exact submission just created instead of accidentally displaying another submission.
- Added a safe migration: `supabase/migrations/20260814000002_safe_sync_final_evaluation.sql`.

## Important deployment step

The ZIP contains the corrected source code, but a local source change does not deploy a Supabase Edge Function or apply a database migration automatically.

Apply the safe migration to the production Supabase project, then deploy the Edge Function:

```bash
npx supabase db push
npx supabase functions deploy evaluate-submission --no-verify-jwt
```

Do NOT re-run older destructive migrations manually. In particular, do not manually execute migrations containing `TRUNCATE ... CASCADE` against a live competition database.

## Production verification

After deployment, make a fresh participant submission through the actual browser UI and verify:

1. Untouched submission -> 0/100.
2. Perfect Q1 only -> 10/100.
3. Perfect Q3 only -> 10/100.
4. Partial Q3 with only position wrong -> approximately 8/100.
5. Perfect Q7 only -> 10/100.
6. Perfect Q8 -> 10/100.
7. ResultPage shows the exact submission returned by the Edge Function.

If the deployed Edge Function or live `task_answers` table is still on the old version, the source code in this ZIP cannot by itself change the already-deployed production environment.
