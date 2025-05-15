const calendarContainer = document.getElementById('calendar-container');
const modal = document.getElementById('modal');
const modalDate = document.getElementById('modal-date');
const textInput = document.getElementById('text-input');
const imageInput = document.getElementById('image-input');
const preview = document.getElementById('preview');
const saveBtn = document.getElementById('save-btn');
const closeBtn = document.getElementById('close');

let selectedDateKey = null;

const keywords = {
  red: ['loss', 'lost', 'stop loss', 'sl'],
  green: ['won', 'win', 'profit', 'take profit', 'tp'],
  orange: ['be', 'breakeven']
};

function generateCalendar(yearStart, yearEnd) {
  for (let year = yearStart; year <= yearEnd; year++) {
    for (let month = 0; month < 12; month++) {
      const monthDiv = document.createElement('div');
      monthDiv.className = 'month';
      const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });
      monthDiv.innerHTML = `<h3>${monthName} ${year}</h3>`;

      const weekdaysDiv = document.createElement('div');
      weekdaysDiv.className = 'weekdays';
      ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day =>
        weekdaysDiv.innerHTML += `<div>${day}</div>`
      );

      const daysDiv = document.createElement('div');
      daysDiv.className = 'days';

      const firstDay = new Date(year, month, 1).getDay();
      const totalDays = new Date(year, month + 1, 0).getDate();

      for (let i = 0; i < firstDay; i++) {
        daysDiv.innerHTML += `<div></div>`;
      }

      for (let day = 1; day <= totalDays; day++) {
        const dateKey = `${year}-${month + 1}-${day}`;
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day';
        dayDiv.textContent = day;
        dayDiv.dataset.date = dateKey;
        loadCellColor(dayDiv, dateKey);
        dayDiv.addEventListener('click', () => openModal(dateKey));
        daysDiv.appendChild(dayDiv);
      }

      monthDiv.appendChild(weekdaysDiv);
      monthDiv.appendChild(daysDiv);
      calendarContainer.appendChild(monthDiv);
    }
  }
}

function openModal(dateKey) {
  selectedDateKey = dateKey;
  modalDate.textContent = `Notes for ${dateKey}`;
  textInput.value = '';
  preview.innerHTML = '';
  imageInput.value = '';

  const saved = JSON.parse(localStorage.getItem(dateKey));
  if (saved) {
    textInput.value = saved.text || '';
    if (saved.image) {
      const img = new Image();
      img.src = saved.image;
      preview.appendChild(img);
    }
  }

  modal.style.display = 'block';
}

closeBtn.onclick = () => modal.style.display = 'none';

saveBtn.onclick = () => {
  const text = textInput.value.trim();
  const file = imageInput.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      saveEntry(selectedDateKey, text, reader.result);
    };
    reader.readAsDataURL(file);
  } else {
    const existing = JSON.parse(localStorage.getItem(selectedDateKey)) || {};
    saveEntry(selectedDateKey, text, existing.image || null);
  }
};

function saveEntry(key, text, image) {
  const data = { text, image };
  localStorage.setItem(key, JSON.stringify(data));
  const cell = document.querySelector(`.day[data-date="${key}"]`);
  if (cell) updateCellColor(cell, text);
  modal.style.display = 'none';
}

function loadCellColor(cell, key) {
  const data = JSON.parse(localStorage.getItem(key));
  if (data) updateCellColor(cell, data.text);
}

function updateCellColor(cell, text) {
  const val = (text || '').toLowerCase();
  if (keywords.red.some(word => val.includes(word))) {
    cell.style.backgroundColor = '#f8d7da'; // red
  } else if (keywords.green.some(word => val.includes(word))) {
    cell.style.backgroundColor = '#d4f1d4'; // green
  } else if (keywords.orange.some(word => val.includes(word))) {
    cell.style.backgroundColor = '#fff3cd'; // orange
  } else {
    cell.style.backgroundColor = '#fff'; // default
  }
}

generateCalendar(2025, 2026);