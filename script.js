// Массив банков
let banks = [];

// Веса критериев
const weights = {
  interest: 10,      // Процентная ставка
  reliability: 9,    // Надёжность банка
  term: 5,           // Срок и досрочное снятие
  flexibility: 3,    // Пополнение/снятие
  currency: 4        // Валюта вклада
};

// Кол-во экспертов
const expertsCount = 2;
let expertRatings = [];

// Добавление банка
function addBank() {
  const name = bankName.value.trim();

  if (!name) {
    alert("Введите название банка!");
    return;
  }

  // Проверяем на дубликаты по имени
  if (banks.some(b => b.name.toLowerCase() === name.toLowerCase())) {
    alert("Банк с таким названием уже добавлен!");
    return;
  }

  const bank = {
    name,
    interest: +interestRate.value,
    reliability: +reliability.value,
    term: +depositTerm.value,
    flexibility: +flexibility.value,
    currency: +currency.value
  };

  // Проверка, что критерии введены числами
  if (Object.values(bank).some((v, i) => i > 0 && (isNaN(v) || v < 1 || v > 10))) {
    alert("Заполните все критерии (от 1 до 10)!");
    return;
  }

  banks.push(bank);
  updateBanksList();
  updateExperts();

  // Очистка формы
  bankName.value = "";
  interestRate.value = "";
  reliability.value = "";
  depositTerm.value = "";
  flexibility.value = "";
  currency.value = "";
}

// Обновление списка банков
function updateBanksList() {
  banksList.innerHTML = "";
  banks.forEach((bank, i) => {
    const li = document.createElement("li");
    li.textContent = `${bank.name} (Ставка: ${bank.interest}, Надёжность: ${bank.reliability}, Срок: ${bank.term}, Гибкость: ${bank.flexibility}, Валюта: ${bank.currency})`;
    
    const btn = document.createElement("button");
    btn.textContent = "Удалить";
    btn.onclick = () => { banks.splice(i, 1); updateBanksList(); updateExperts(); };
    li.appendChild(btn);

    banksList.appendChild(li);
  });
}

// Создание полей для экспертов
function updateExperts() {
  experts.innerHTML = "";
  expertRatings = Array.from({ length: expertsCount }, () => []);

  banks.forEach((bank, i) => {
    for (let e = 0; e < expertsCount; e++) {
      const input = document.createElement("input");
      input.type = "number";
      input.min = 1;
      input.max = 10;
      input.placeholder = `Оценка ${e+1} эксперта для ${bank.name}`;
      input.oninput = () => {
        expertRatings[e][i] = +input.value;
        updateRanking();
      };
      experts.appendChild(input);
    }
    experts.appendChild(document.createElement("br"));
  });
}

// Расчёт интегральной оценки
function calcScore(bank, expertScores) {
  const baseScore = 
    bank.interest * weights.interest +
    bank.reliability * weights.reliability +
    bank.term * weights.term +
    bank.flexibility * weights.flexibility +
    bank.currency * weights.currency;

  const avgExpert = expertScores.length > 0 
    ? expertScores.reduce((a,b)=>a+b,0) / expertScores.length 
    : 0;

  return baseScore + avgExpert; // итог = веса критериев + средняя оценка экспертов
}

// Ранжирование
function updateRanking() {
  ranking.innerHTML = "";
  if (banks.length === 0) return;

  const scores = banks.map((bank, i) => {
    const expertScores = expertRatings.map(r => r[i] || 0);
    return { name: bank.name, score: calcScore(bank, expertScores) };
  });

  scores.sort((a, b) => b.score - a.score);

  scores.forEach(s => {
    const li = document.createElement("li");
    li.textContent = `${s.name}: ${s.score.toFixed(2)} баллов`;
    ranking.appendChild(li);
  });
}
