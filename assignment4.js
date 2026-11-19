/**
 * Assignment #4 — Simple Payroll System
 * Supports adding employees, automatic Gross/Net Pay calculation,
 * automatic line numbering, and deleting employees by line number.
 */

document.addEventListener('DOMContentLoaded', () => {
  const payrollList = [];

  const addForm = document.getElementById('payroll-add-form');
  const nameInput = document.getElementById('employee-name');
  const daysInput = document.getElementById('days-worked');
  const rateInput = document.getElementById('daily-rate');
  const deductionInput = document.getElementById('deduction-amount');
  const addErrorBox = document.getElementById('payroll-add-error');

  const deleteForm = document.getElementById('payroll-delete-form');
  const deleteLineInput = document.getElementById('delete-line-number');
  const deleteErrorBox = document.getElementById('payroll-delete-error');

  const tableBody = document.getElementById('payroll-table-body');
  const summaryBar = document.getElementById('payroll-summary-bar');
  const summaryCountEl = document.getElementById('payroll-total-employees');
  const summaryNetEl = document.getElementById('payroll-total-net');

  if (!addForm || !deleteForm || !tableBody) return;

  /**
   * Renders the payroll table and summary totals immediately.
   */
  function renderPayrollTable() {
    tableBody.innerHTML = '';

    if (payrollList.length === 0) {
      const emptyRow = document.createElement('tr');
      const emptyCell = document.createElement('td');
      emptyCell.colSpan = 7;
      emptyCell.className = 'empty-cell';
      emptyCell.textContent =
        'No employees in the payroll list yet. Add an employee above to view payroll records.';
      emptyRow.appendChild(emptyCell);
      tableBody.appendChild(emptyRow);

      if (summaryBar) summaryBar.hidden = true;
      return;
    }

    let totalNetPay = 0;

    payrollList.forEach((employee, index) => {
      totalNetPay += employee.netPay;

      const row = document.createElement('tr');

      const noCell = document.createElement('td');
      noCell.className = 'tabular';
      noCell.textContent = String(index + 1);

      const nameCell = document.createElement('td');
      nameCell.textContent = employee.name;

      const daysCell = document.createElement('td');
      daysCell.className = 'col-num';
      daysCell.textContent = String(employee.daysWorked);

      const rateCell = document.createElement('td');
      rateCell.className = 'col-num';
      rateCell.textContent = window.formatPeso(employee.dailyRate);

      const grossCell = document.createElement('td');
      grossCell.className = 'col-num';
      grossCell.textContent = window.formatPeso(employee.grossPay);

      const deductionCell = document.createElement('td');
      deductionCell.className = 'col-num';
      deductionCell.textContent = window.formatPeso(employee.deductionAmount);

      const netCell = document.createElement('td');
      netCell.className = 'col-num';
      netCell.textContent = window.formatPeso(employee.netPay);

      row.append(
        noCell,
        nameCell,
        daysCell,
        rateCell,
        grossCell,
        deductionCell,
        netCell
      );
      tableBody.appendChild(row);
    });

    if (summaryBar && summaryCountEl && summaryNetEl) {
      summaryBar.hidden = false;
      summaryCountEl.textContent = String(payrollList.length);
      summaryNetEl.textContent = window.formatPeso(totalNetPay);
    }
  }

  /**
   * Handle adding a new employee to the payroll list.
   */
  addForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = nameInput.value.trim();
    const rawDays = daysInput.value.trim();
    const rawRate = rateInput.value.trim();
    const rawDeduction = deductionInput.value.trim();

    if (name === '') {
      window.setFeedbackError(addErrorBox, 'Please enter the employee name.');
      nameInput.focus();
      return;
    }

    if (rawDays === '' || rawRate === '' || rawDeduction === '') {
      window.setFeedbackError(
        addErrorBox,
        'Please fill in Days Worked, Daily Rate, and Deduction Amount.'
      );
      return;
    }

    const daysWorked = Number(rawDays);
    const dailyRate = Number(rawRate);
    const deductionAmount = Number(rawDeduction);

    if (
      !Number.isFinite(daysWorked) ||
      !Number.isFinite(dailyRate) ||
      !Number.isFinite(deductionAmount)
    ) {
      window.setFeedbackError(
        addErrorBox,
        'Days Worked, Daily Rate, and Deduction Amount must be valid numbers.'
      );
      return;
    }

    if (daysWorked < 0 || dailyRate < 0 || deductionAmount < 0) {
      window.setFeedbackError(
        addErrorBox,
        'Negative values are not allowed for Days Worked, Daily Rate, or Deduction Amount.'
      );
      return;
    }

    const grossPay = daysWorked * dailyRate;

    if (deductionAmount > grossPay) {
      window.setFeedbackError(
        addErrorBox,
        `Deduction amount (${window.formatPeso(deductionAmount)}) cannot exceed Gross Pay (${window.formatPeso(grossPay)}).`
      );
      deductionInput.focus();
      return;
    }

    const netPay = grossPay - deductionAmount;

    payrollList.push({
      name,
      daysWorked,
      dailyRate,
      grossPay,
      deductionAmount,
      netPay,
    });

    window.setFeedbackError(addErrorBox, '');
    window.setFeedbackError(deleteErrorBox, '');
    addForm.reset();
    renderPayrollTable();
    nameInput.focus();
  });

  /**
   * Handle deleting an employee strictly by line number (No.).
   */
  deleteForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (payrollList.length === 0) {
      window.setFeedbackError(
        deleteErrorBox,
        'The payroll list is currently empty. There is no employee to delete.'
      );
      return;
    }

    const rawLine = deleteLineInput.value.trim();
    if (rawLine === '') {
      window.setFeedbackError(
        deleteErrorBox,
        'Please enter the employee line number (No.) to delete.'
      );
      deleteLineInput.focus();
      return;
    }

    const lineNumber = Number(rawLine);
    if (
      !Number.isFinite(lineNumber) ||
      !Number.isInteger(lineNumber) ||
      lineNumber < 1 ||
      lineNumber > payrollList.length
    ) {
      window.setFeedbackError(
        deleteErrorBox,
        `Line number ${rawLine} does not exist. Enter a number from 1 to ${payrollList.length}.`
      );
      deleteLineInput.focus();
      return;
    }

    payrollList.splice(lineNumber - 1, 1);
    window.setFeedbackError(deleteErrorBox, '');
    deleteForm.reset();
    renderPayrollTable();
  });

  // Initial empty table render
  renderPayrollTable();
});
