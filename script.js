const form = document.getElementById("form");
const list = document.getElementById("list");
const error = document.getElementById("error");
const empty = document.getElementById("empty");

const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const balanceEl = document.getElementById("balance");

let transactions = JSON.parse(localStorage.getItem("financeData")) || [];
let filter = "all";

function updateUI() {
  list.innerHTML = "";
  let income = 0, expense = 0;

  const visible = transactions.filter(t =>
    filter === "all" || t.type === filter
  );

  empty.style.display = visible.length ? "none" : "block";

  visible.forEach((t, i) => {
    const li = document.createElement("li");
    li.className = t.type;
    li.innerHTML = `
      <span>${t.desc} • ${t.category} • ₹${t.amount}</span>
      <button data-index="${i}">✕</button>
    `;
    list.appendChild(li);

    t.type === "income" ? income += t.amount : expense += t.amount;
  });

  incomeEl.textContent = income;
  expenseEl.textContent = expense;
  balanceEl.textContent = income - expense;

  localStorage.setItem("financeData", JSON.stringify(transactions));
}

form.addEventListener("submit", e => {
  e.preventDefault();
  error.textContent = "";

  const desc = form.desc.value.trim();
  const amount = +form.amount.value;
  const type = form.type.value;
  const category = form.category.value;

  if (!desc || amount <= 0 || !type || !category) {
    error.textContent = "Please fill all fields correctly";
    return;
  }

  transactions.push({ desc, amount, type, category });
  form.reset();
  updateUI();
});

list.addEventListener("click", e => {
  if (e.target.tagName === "BUTTON") {
    transactions.splice(e.target.dataset.index, 1);c
    updateUI();
  }
});

document.querySelectorAll(".controls button").forEach(btn => {
  btn.onclick = () => {
    filter = btn.dataset.filter;
    document.querySelector(".active").classList.remove("active");
    btn.classList.add("active");
    updateUI();
  };
});

updateUI();
