/**
 * Assignment #1 — Conversion Calculator
 * Supports:
 * 1. Celsius to Fahrenheit: (C * 9/5) + 32
 * 2. Fahrenheit to Celsius: (F - 32) * 5/9
 * 3. Meters to Feet: Meters * 3.28084
 * 4. Feet to Meters: Feet / 3.28084
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('conversion-form');
  const valueInput = document.getElementById('conversion-value');
  const typeSelect = document.getElementById('conversion-type');
  const resetBtn = document.getElementById('reset-conversion-btn');
  const errorBox = document.getElementById('conversion-error');

  const resultPrimary = document.getElementById('conversion-result-primary');
  const resultInputEcho = document.getElementById('conversion-input-echo');
  const resultFormulaEcho = document.getElementById('conversion-formula-echo');

  if (!form || !valueInput || !typeSelect) return;

  const CONVERSION_SPECS = {
    'c-to-f': {
      inputUnit: '°C',
      outputUnit: '°F',
      formulaLabel: 'Fahrenheit = (Celsius × 9/5) + 32',
      allowNegative: true,
      compute: (val) => (val * 9) / 5 + 32,
    },
    'f-to-c': {
      inputUnit: '°F',
      outputUnit: '°C',
      formulaLabel: 'Celsius = (Fahrenheit − 32) × 5/9',
      allowNegative: true,
      compute: (val) => ((val - 32) * 5) / 9,
    },
    'm-to-ft': {
      inputUnit: 'm',
      outputUnit: 'ft',
      formulaLabel: 'Feet = Meters × 3.28084',
      allowNegative: false,
      compute: (val) => val * 3.28084,
    },
    'ft-to-m': {
      inputUnit: 'ft',
      outputUnit: 'm',
      formulaLabel: 'Meters = Feet ÷ 3.28084',
      allowNegative: false,
      compute: (val) => val / 3.28084,
    },
  };

  /**
   * Formats converted numbers cleanly up to 4 decimal places.
   */
  function formatNumber(num) {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 4,
    }).format(num);
  }

  /**
   * Resets outputs back to initial idle display.
   */
  function resetDisplay() {
    window.setFeedbackError(errorBox, '');
    if (resultPrimary) resultPrimary.textContent = '—';
    if (resultInputEcho) resultInputEcho.textContent = 'Waiting for input';
    if (resultFormulaEcho) resultFormulaEcho.textContent = 'Select a conversion type';
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const rawValue = valueInput.value.trim();
    const conversionKey = typeSelect.value;
    const spec = CONVERSION_SPECS[conversionKey];

    if (!spec) {
      window.setFeedbackError(errorBox, 'Please select a valid conversion option.');
      return;
    }

    if (rawValue === '') {
      window.setFeedbackError(errorBox, 'Please enter a numeric value to convert.');
      valueInput.focus();
      return;
    }

    const numericValue = Number(rawValue);
    if (!Number.isFinite(numericValue)) {
      window.setFeedbackError(errorBox, 'Please enter a valid finite number.');
      valueInput.focus();
      return;
    }

    if (!spec.allowNegative && numericValue < 0) {
      window.setFeedbackError(
        errorBox,
        'Length values cannot be negative. Please enter 0 or a positive number.'
      );
      valueInput.focus();
      return;
    }

    window.setFeedbackError(errorBox, '');
    const converted = spec.compute(numericValue);

    if (resultPrimary) {
      resultPrimary.textContent = `${formatNumber(converted)} ${spec.outputUnit}`;
    }
    if (resultInputEcho) {
      resultInputEcho.textContent = `${formatNumber(numericValue)} ${spec.inputUnit}`;
    }
    if (resultFormulaEcho) {
      resultFormulaEcho.textContent = spec.formulaLabel;
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      resetDisplay();
      valueInput.focus();
    });
  }
});
