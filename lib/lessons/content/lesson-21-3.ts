import type { LessonData } from "../types";

const content: LessonData = {
  num: 21,
  orderIndex: 3,
  phaseLabel: "PROBABILITY + STATISTICS",
  title: "10% vs. 20%: is that a real lift, or just luck?",
  minutes: 24,
  concept:
    "An A/B test splits people randomly into two groups — a control that sees the current version and a variant that sees the new one — then compares a metric like conversion rate between them. The catch is that even if the two versions were truly, identically effective, two random groups will almost never produce the exact same rate; some group will always come out a little ahead purely by chance, the same way flipping a fair coin 20 times doesn't always land exactly 10 heads. This means an observed gap between control and variant can't be judged by its size alone — a 3-point lift on 40 users and a 3-point lift on 40,000 users are not remotely the same kind of evidence, even though the raw numbers look identical. The sample size sets how much random noise you should expect: small samples swing wildly on their own, so a gap has to be large to stand out from that noise, while large samples settle down, so even a modest, consistent gap becomes meaningful. Reading an A/B test well means asking not just \"which bar is taller?\" but \"is this gap bigger than random chance alone would typically produce at this sample size?\" The formal tool for answering that question is a two-proportion z-test. It starts from a null hypothesis — the deliberately skeptical assumption that control and variant secretly share one true underlying conversion rate, and the gap you're staring at is nothing but sampling noise. Under that assumption, you can pool both groups' conversions into one combined rate, then use that pooled rate and the two sample sizes to calculate a standard error: the amount of wobble two random samples of exactly this size would typically produce even if the null hypothesis were completely true. Dividing the observed gap by that standard error produces a z-score — a single number that says how many \"standard errors\" apart the two groups are. A z-score near 0 means the gap is well within the noise you'd expect from random sampling alone. A z-score of roughly 1.96 or beyond, in either direction, is the traditional cutoff for \"statistically significant at the p < 0.05 level\" — meaning that if the null hypothesis were actually true, a gap this large would show up by pure chance less than 5% of the time, so seeing it is good evidence the null hypothesis is wrong and the variant is genuinely different. Getting from a z-score to an exact p-value technically requires a normal distribution's cumulative density function, which is more machinery than we need here — the z-score alone already tells you whether a gap looks like signal or looks like noise.",
  conceptSimpler:
    "It's like flipping two coins 10 times each and getting 6 heads versus 4 heads — nobody would call one coin \"better\"; but 6,000 heads versus 4,000 heads out of 10,000 flips each is an entirely different, much more convincing story. The z-score is just a way of measuring that: how many \"typical coin-flip wobbles\" apart the two results are. Less than about 2 wobbles apart, and it's easy to explain away as luck. Well past 2, and luck alone stops being a believable excuse.",
  vizStages: [
    {
      label: "1. A button color test, 100 users per group",
      body:
        "Control (blue button): 100 users, 12 conversions. Variant (green button): 100 users, 15 conversions. The variant looks 3 points better — but is that a real effect, or the kind of wobble you'd expect from any two random groups of 100?",
      code:
        "control = { \"users\": 100, \"conversions\": 12 }\nvariant = { \"users\": 100, \"conversions\": 15 }\n# 12% vs 15%",
    },
    {
      label: "2. Identical coins can still land differently",
      body:
        "Imagine control and variant were secretly running the exact same button. Splitting 100 people into two random groups would still rarely produce identical conversion counts — some noise is baked into random sampling no matter what. That \"secretly identical\" assumption is exactly what statisticians call the null hypothesis.",
      code:
        "# same true rate, two random samples of 100:\n# sample 1: 11 conversions\n# sample 2: 14 conversions\n# the gap alone doesn't prove a real difference",
    },
    {
      label: "3. The same 3-point gap, but with 10,000 users each",
      body:
        "Control: 10,000 users, 1,200 conversions (12%). Variant: 10,000 users, 1,500 conversions (15%). The percentage gap is identical to stage 1, but now it's anchored by 100x the data — random noise this large, this consistently, is far less likely.",
      code:
        "control = { \"users\": 10000, \"conversions\": 1200 }\nvariant = { \"users\": 10000, \"conversions\": 1500 }\n# 12% vs 15%, same gap as before",
    },
    {
      label: "4. The null hypothesis: assume there's no real difference",
      body:
        "To test whether the 3-point gap between control (12%) and variant (15%) is real, start with the deliberately skeptical explanation: both groups secretly share one true conversion rate, and any 100-person sample lands a little above or below it purely by chance. Pool both groups' raw conversions and raw users into one combined rate to estimate that shared rate — under the null hypothesis, they really are just two samples of the same thing.",
      code:
        "control_n = 100\ncontrol_conv = 12\nvariant_n = 100\nvariant_conv = 15\n\ntotal_conv = control_conv + variant_conv\ntotal_n = control_n + variant_n\npooled_rate = total_conv / total_n\n\nprint(f\"pooled rate: {pooled_rate}\")\n\n# pooled rate: 0.135 - the one shared rate the null hypothesis assumes",
    },
    {
      label: "5. Standard error: how much wobble the null hypothesis predicts",
      body:
        "The standard error for comparing two proportions is the square root of p * (1 - p) * (1/n1 + 1/n2), using the pooled rate p and both sample sizes. The part under the square root is just arithmetic; the square root itself needs a sqrt function we don't have built in, so we build one with Newton's method — start with a guess, repeatedly replace it with the average of the guess and x / guess, and after a couple dozen rounds it converges on the true square root of anything.",
      code:
        "one_minus_p = 1 - pooled_rate\ninv_control = 1 / control_n\ninv_variant = 1 / variant_n\ninv_sum = inv_control + inv_variant\nse_squared = pooled_rate * one_minus_p * inv_sum\n\ndef sqrt(x):\n    guess = x\n    if guess == 0:\n        guess = 1\n    i = 0\n    while i < 20:\n        sum_term = guess + x / guess\n        guess = sum_term / 2\n        i = i + 1\n    return guess\n\nse = sqrt(se_squared)\nprint(f\"se squared: {se_squared}\")\nprint(f\"standard error: {se}\")\n\n# se squared: 0.0023355\n# standard error: about 0.0483",
    },
    {
      label: "6. The z-score verdict: same gap, opposite conclusions — now backed by math",
      body:
        "Divide the observed gap (0.15 - 0.12 = 0.03) by the standard error to get the z-score. At 100 users per group, the standard error (about 0.048) is nearly as big as the gap itself, so the z-score barely clears 0.6 — nowhere near the ±1.96 needed for significance at p < 0.05, meaning this gap is exactly the kind of noise two identical variants could produce. Run the identical formula on the 10,000-user version of this same 3-point gap: the pooled rate doesn't change, but the standard error shrinks tenfold to about 0.0048 (bigger samples mean less wobble), so the same 0.03 gap now produces a z-score above 6 — far beyond ±1.96. Same percentage gap, same formula, opposite verdict, because the sample size changed how much noise was expected.",
      code:
        "diff = 0.15 - 0.12\nz_100_per_group = diff / se\nprint(f\"z-score at 100 users/group: {z_100_per_group}\")\n\n# with 10,000 users per group instead, standard error shrinks to about 0.00483\nse_10000 = 0.004832701108076104\nz_10000_per_group = diff / se_10000\nprint(f\"z-score at 10,000 users/group: {z_10000_per_group}\")\n\n# z-score at 100 users/group: about 0.62 -> within +-1.96, looks like noise\n# z-score at 10,000 users/group: about 6.21 -> far past +-1.96, real signal",
    },
    {
      label: "7. Big samples aren't a free pass: the razor-thin-gap case",
      body:
        "Control: 50,000 users, 5,000 conversions (10.0%). Variant: 50,000 users, 5,050 conversions (10.1%). The sample is enormous — a hundred times bigger than the button-color test — but the gap is tiny. Run the exact same three steps (pool the rate, compute the standard error, divide the gap by it) and the pooled rate comes out to 10.05%, the standard error shrinks all the way down to about 0.0019, and the z-score lands around 0.53 — still comfortably inside ±1.96. Even with 100,000 people in the test, this particular gap is indistinguishable from noise. Sample size alone was never the whole story; the gap has to be large relative to the standard error that the sample size produces. This is also exactly why serious teams decide on a required sample size in advance and run the test to completion instead of peeking early and stopping the moment a gap looks good — a promising-looking early z-score can evaporate by the time the planned sample size is actually reached.",
      code:
        "control_n = 50000\ncontrol_conv = 5000\nvariant_n = 50000\nvariant_conv = 5050\n\n# same pool -> standard error -> divide-the-gap steps as before:\n# pooled rate: 0.1005\n# standard error: about 0.0019\n# z-score: about 0.53 -> well within +-1.96, still just noise",
    },
  ],
  realWorldIntro:
    "This exact judgment call happens every time a team ships a new checkout flow, a new prompt template, or a new ranking model: they split traffic randomly between old and new, watch a metric move, and run this same pool-standard-error-z-score math to decide — often under pressure to ship fast — whether that movement is a genuine win or a statistical mirage that will vanish on the next batch of users.",
  realWorldCode:
    'control_conversions = 60\ncontrol_users = 500\nvariant_conversions = 75\nvariant_users = 500\n\ntotal_conv = control_conversions + variant_conversions\ntotal_n = control_users + variant_users\npooled_rate = total_conv / total_n\n\none_minus_p = 1 - pooled_rate\ninv_control = 1 / control_users\ninv_variant = 1 / variant_users\ninv_sum = inv_control + inv_variant\nse_squared = pooled_rate * one_minus_p * inv_sum\n\ndef sqrt(x):\n    guess = x\n    if guess == 0:\n        guess = 1\n    i = 0\n    while i < 20:\n        sum_term = guess + x / guess\n        guess = sum_term / 2\n        i = i + 1\n    return guess\n\nse = sqrt(se_squared)\ncontrol_rate = control_conversions / control_users\nvariant_rate = variant_conversions / variant_users\ndiff = variant_rate - control_rate\nz = diff / se\n\nprint(f"control: {control_rate}")\nprint(f"variant: {variant_rate}")\nprint(f"z-score: {z}")\n\n# z-score: about 1.39 - promising, but short of the 1.96 bar; keep collecting data',
  sandbox: {
    kind: "code",
    challenge:
      "This two-proportion z-test calculator's hand-rolled sqrt function is missing Newton's-method averaging step, so it wildly overshoots the true square root, wrecks the standard error, and makes a genuinely large effect look like statistical noise. Fix the sqrt function so each new guess is the average of the old guess and x / guess, then rerun it to watch the z-score jump from inside ±1.96 to comfortably beyond it.",
    starterCode:
      'def sqrt(x):\n    guess = x\n    if guess == 0:\n        guess = 1\n    i = 0\n    while i < 20:\n        sum_term = guess + x / guess\n        guess = sum_term + 0\n        i = i + 1\n    return guess\n\ncontrol_n = 900\ncontrol_conv = 90\nvariant_n = 100\nvariant_conv = 20\n\ntotal_conv = control_conv + variant_conv\ntotal_n = control_n + variant_n\npooled_rate = total_conv / total_n\none_minus_p = 1 - pooled_rate\n\ninv_control = 1 / control_n\ninv_variant = 1 / variant_n\ninv_sum = inv_control + inv_variant\n\nse_squared = pooled_rate * one_minus_p * inv_sum\nse = sqrt(se_squared)\n\ncontrol_rate = control_conv / control_n\nvariant_rate = variant_conv / variant_n\ndiff = variant_rate - control_rate\nz = diff / se\n\nprint(f"control rate: {control_rate}")\nprint(f"variant rate: {variant_rate}")\nprint(f"pooled rate: {pooled_rate}")\nprint(f"standard error: {se}")\nprint(f"z-score: {z}")\n\nif z > 1.96:\n    print("z clears 1.96 -> looks statistically significant (p < 0.05)")\nelse:\n    print("z is within +-1.96 -> could easily be sampling noise")',
  },
  quizQuestion:
    "A checkout redesign test shows control converting at 12% (60 of 500 users) and variant converting at 15% (75 of 500 users). Running the two-proportion z-test gives a pooled rate of 13.5%, a standard error of about 0.0216, and a z-score of about 1.39. What's the responsible read on this result?",
  quizCode:
    'control = { "users": 500, "conversions": 60 }\nvariant = { "users": 500, "conversions": 75 }\n# pooled rate: 0.135\n# standard error: ~0.0216\n# z-score: ~1.39',
  quizOptions: [
    {
      key: "a",
      label:
        "z ≈ 1.39 is below the ~1.96 threshold for p < 0.05, so this gap is promising but doesn't yet clear the bar for statistical significance — it needs more data before variant can be trusted as a real win",
      correct: true,
    },
    {
      key: "b",
      label:
        "Since variant's rate is higher and the z-score is positive, this is automatically a statistically significant win that should ship immediately",
      correct: false,
    },
    {
      key: "c",
      label:
        "A z-score of 1.39 isn't meaningful because it isn't a whole number — only integer z-scores can be compared to a significance threshold",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — the traditional cutoff for p < 0.05 (two-tailed) is a z-score of about 1.96 or beyond, and 1.39 falls short of it. The gap looks encouraging, but at this sample size it's still plausible as ordinary sampling noise, so the honest move is to keep collecting data rather than declare a winner.",
  quizFeedbackIncorrect:
    "Not quite — a positive z-score just means variant came out ahead, not that the gap is statistically significant; z has to clear roughly ±1.96 (for p < 0.05) before chance alone becomes an unconvincing explanation, and 1.39 doesn't clear that bar. Z-scores are also just as meaningful as decimals as they are as whole numbers.",
  takeaway:
    "The same size gap can be meaningless noise at a small sample size or a highly reliable signal at a large one — and now you have the actual tool to tell them apart: assume the null hypothesis (no real difference), pool both groups into one rate, use that pooled rate and the sample sizes to compute a standard error, then divide the observed gap by that standard error to get a z-score. A z-score near 0 looks like noise; one beyond roughly ±1.96 is the traditional bar for \"statistically significant at p < 0.05.\" Never judge an A/B test by which bar looks taller, and never trust sample size alone either — judge it by the z-score the data actually produces.",
};

export default content;
