/**
 * Assignment #3 — Natural Numbers Calculator
 * A. Factorial of N using a WHILE loop
 * B. Sum of first N natural numbers using a DO-WHILE loop
 * C. Average of first N natural numbers using a FOR loop
 */

document.addEventListener('DOMContentLoaded', () => {
  initFactorialCalculator();
  initSumCalculator();
  initAverageCalculator();
});

/**
 * Validates that an input string represents a positive integer within maxLimit.
 * @param {string} rawValue
 * @param {number} maxLimit
 * @returns {{ valid: boolean, value?: number, error?: string }}
 */
function parsePositiveInteger(rawValue, maxLimit) {
  const trimmed = rawValue.trim();
  if (trimmed === '') {
    return { valid: false, error: 'Please enter a positive integer N.' };
  }

  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed) || !Number.isInteger(parsed)) {
    return { valid: false, error: 'N must be a whole integer (no decimals or letters).' };
  }

  if (parsed < 1) {
    return { valid: false, error: 'N must be a positive integer (1 or greater).' };
  }

  if (parsed > maxLimit) {
    return {
      valid: false,
      error: `Please enter an integer up to ${maxLimit.toLocaleString('en-US')} for instant calculation.`,
    };
  }

  return { valid: true, value: parsed };
}

/**
 * A. Factorial Using While Loop: N! = N × (N-1) × ... × 1
 */
function initFactorialCalculator() {
  const form = document.getElementById('factorial-form');
  const input = document.getElementById('factorial-n');
  const errorBox = document.getElementById('factorial-error');
  const resultEl = document.getElementById('factorial-result');
  const detailEl = document.getElementById('factorial-detail');

  if (!form || !input) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const check = parsePositiveInteger(input.value, 500);

    if (!check.valid) {
      window.setFeedbackError(errorBox, check.error);
      input.focus();
      return;
    }

    window.setFeedbackError(errorBox, '');
    const n = check.value;

    // Required WHILE LOOP using BigInt for exact integer precision
    let factorial = 1n;
    let counter = BigInt(n);
    while (counter > 1n) {
      factorial *= counter;
      counter--;
    }

    const rawDigits = factorial.toString();
    const formatted =
      rawDigits.length <= 21
        ? BigInt(rawDigits).toLocaleString('en-US')
        : `${rawDigits.slice(0, 12)}… (${rawDigits.length} digits)`;

    if (resultEl) resultEl.textContent = formatted;
    if (detailEl) detailEl.textContent = `${n}! computed with a while loop`;
  });
}

/**
 * B. Sum Using Do-While Loop: Sum = 1 + 2 + 3 + ... + N
 */
function initSumCalculator() {
  const form = document.getElementById('sum-form');
  const input = document.getElementById('sum-n');
  const errorBox = document.getElementById('sum-error');
  const resultEl = document.getElementById('sum-result');
  const detailEl = document.getElementById('sum-detail');

  if (!form || !input) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const check = parsePositiveInteger(input.value, 1000000);

    if (!check.valid) {
      window.setFeedbackError(errorBox, check.error);
      input.focus();
      return;
    }

    window.setFeedbackError(errorBox, '');
    const n = check.value;

    // Required DO-WHILE LOOP
    let sum = 0;
    let i = 1;
    do {
      sum += i;
      i++;
    } while (i <= n);

    if (resultEl) resultEl.textContent = sum.toLocaleString('en-US');
    if (detailEl) detailEl.textContent = `Sum of 1 to ${n.toLocaleString('en-US')} via do-while loop`;
  });
}

/**
 * C. Average Using For Loop: Average = (1 + 2 + 3 + ... + N) / N
 */
function initAverageCalculator() {
  const form = document.getElementById('average-form');
  const input = document.getElementById('average-n');
  const errorBox = document.getElementById('average-error');
  const resultEl = document.getElementById('average-result');
  const detailEl = document.getElementById('average-detail');

  if (!form || !input) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const check = parsePositiveInteger(input.value, 1000000);

    if (!check.valid) {
      window.setFeedbackError(errorBox, check.error);
      input.focus();
      return;
    }

    window.setFeedbackError(errorBox, '');
    const n = check.value;

    // Required FOR LOOP
    let sum = 0;
    for (let i = 1; i <= n; i++) {
      sum += i;
    }
    const average = sum / n;

    const formattedAverage = new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 4,
    }).format(average);

    if (resultEl) resultEl.textContent = formattedAverage;
    if (detailEl) {
      detailEl.textContent = `Average of 1 to ${n.toLocaleString('en-US')} via for loop`;
    }
  });
}
