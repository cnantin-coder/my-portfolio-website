/**
 * Assignment #2 — Philippine Income Tax Calculator
 * Computes income tax using exact graduated brackets and displays
 * formatted Philippine Peso (₱) output.
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('tax-form');
  const incomeInput = document.getElementById('taxable-income');
  const clearBtn = document.getElementById('clear-tax-btn');
  const errorBox = document.getElementById('tax-error');

  const resultTaxEl = document.getElementById('tax-result-amount');
  const resultIncomeEl = document.getElementById('tax-result-income');
  const resultBracketEl = document.getElementById('tax-result-bracket');
  const bracketRows = document.querySelectorAll('#tax-bracket-table tbody tr');

  if (!form || !incomeInput) return;

  /**
   * Calculates income tax and identifies the matching bracket index & label.
   * @param {number} income
   * @returns {{ tax: number, bracketLabel: string, bracketIndex: number }}
   */
  function calculateIncomeTax(income) {
    if (income <= 250000) {
      return {
        tax: 0,
        bracketLabel: '₱250,000 and below (0%)',
        bracketIndex: 0,
      };
    }

    if (income <= 400000) {
      return {
        tax: (income - 250000) * 0.2,
        bracketLabel: 'Over ₱250,000 – ₱400,000 (20% of excess over ₱250,000)',
        bracketIndex: 1,
      };
    }

    if (income <= 800000) {
      return {
        tax: 30000 + (income - 400000) * 0.25,
        bracketLabel: 'Over ₱400,000 – ₱800,000 (₱30,000 + 25% of excess over ₱400,000)',
        bracketIndex: 2,
      };
    }

    if (income <= 2000000) {
      return {
        tax: 130000 + (income - 800000) * 0.3,
        bracketLabel: 'Over ₱800,000 – ₱2,000,000 (₱130,000 + 30% of excess over ₱800,000)',
        bracketIndex: 3,
      };
    }

    if (income <= 8000000) {
      return {
        tax: 490000 + (income - 2000000) * 0.32,
        bracketLabel: 'Over ₱2,000,000 – ₱8,000,000 (₱490,000 + 32% of excess over ₱2,000,000)',
        bracketIndex: 4,
      };
    }

    return {
      tax: 2410000 + (income - 8000000) * 0.35,
      bracketLabel: 'Over ₱8,000,000 (₱2,410,000 + 35% of excess over ₱8,000,000)',
      bracketIndex: 5,
    };
  }

  /**
   * Highlights the matching tax bracket row in the reference table.
   * @param {number} activeIndex
   */
  function highlightBracketRow(activeIndex) {
    bracketRows.forEach((row, index) => {
      if (index === activeIndex) {
        row.classList.add('is-highlighted');
      } else {
        row.classList.remove('is-highlighted');
      }
    });
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const rawIncome = incomeInput.value.trim();

    if (rawIncome === '') {
      window.setFeedbackError(errorBox, 'Please enter your net taxable income.');
      incomeInput.focus();
      return;
    }

    const income = Number(rawIncome);
    if (!Number.isFinite(income)) {
      window.setFeedbackError(errorBox, 'Please enter a valid numeric taxable income.');
      incomeInput.focus();
      return;
    }

    if (income < 0) {
      window.setFeedbackError(
        errorBox,
        'Taxable income cannot be negative. Please enter ₱0 or higher.'
      );
      incomeInput.focus();
      return;
    }

    window.setFeedbackError(errorBox, '');
    const { tax, bracketLabel, bracketIndex } = calculateIncomeTax(income);

    if (resultTaxEl) resultTaxEl.textContent = window.formatPeso(tax);
    if (resultIncomeEl) resultIncomeEl.textContent = window.formatPeso(income);
    if (resultBracketEl) resultBracketEl.textContent = bracketLabel;

    highlightBracketRow(bracketIndex);
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      form.reset();
      window.setFeedbackError(errorBox, '');
      if (resultTaxEl) resultTaxEl.textContent = '—';
      if (resultIncomeEl) resultIncomeEl.textContent = 'Waiting for input';
      if (resultBracketEl) resultBracketEl.textContent = '—';
      highlightBracketRow(-1);
      incomeInput.focus();
    });
  }
});
