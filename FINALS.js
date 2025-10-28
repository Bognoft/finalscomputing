let month = 9;
let year = 2025;
let events = [];
let selectedDate = null;

function formatDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function showCalendar() {
    const cal = document.getElementById('calendarGrid');
    cal.innerHTML = '';

    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    document.getElementById('currentMonth').textContent = `${months[month]} ${year}`;

    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    days.forEach(d => {
        const head = document.createElement('div');
        head.className = 'day-header';
        head.textContent = d;
        cal.appendChild(head);
    });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    for (let i = 0; i < firstDay; i++) cal.appendChild(document.createElement('div'));

    for (let d = 1; d <= daysInMonth; d++) {
        const box = document.createElement('div');
        box.className = 'day-cell';
        const dateStr = `${year}-${String(month + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        const dayEvents = events.filter(e => e.date === dateStr);

        if (dayEvents.length) box.classList.add('has-event');
        if (d === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            box.classList.add('today');
        }

        box.innerHTML = `<div class="day-number">${d}</div>` +
            (dayEvents.length ? `<div>${'<span class="event-dot"></span>'.repeat(Math.min(dayEvents.length, 3))}</div>` : '');

        box.onclick = () => showDayEvents(dateStr);
        cal.appendChild(box);
    }
}

function addEvent() {
    const title = document.getElementById('eventtitle').value.trim();
    const details = document.getElementById('eventdetails').value.trim();
    const date = selectedDate || document.getElementById('eventdate').value;

    if (!title || !date) return;

    events.push({ id: Date.now(), title, date, details });
    document.getElementById('eventtitle').value = '';
    document.getElementById('eventdetails').value = '';
    if (!selectedDate) document.getElementById('eventdate').value = '';

    showCalendar();
    displayEvents();
    if (selectedDate) showDayEvents(selectedDate);
}

function displayEvents() {
    const list = document.getElementById('eventslist');
    list.innerHTML = events.length
        ? ''
        : '<p style="color: #999; text-align: center; padding: 20px;">No events scheduled</p>';

    events.sort((a, b) => new Date(a.date) - new Date(b.date))
        .forEach(event => {
            const item = document.createElement('div');
            item.className = 'event-item';
            item.innerHTML = `
                <h5>${event.title}</h5>
                <p><strong>Date:</strong> ${event.date}</p>
                ${event.details ? `<p>${event.details}</p>` : ''}
                <button onclick="deleteEvent(${event.id})">Delete</button>
            `;
            list.appendChild(item);
        });
}

function deleteEvent(id) {
    events = events.filter(e => e.id !== id);
    showCalendar();
    displayEvents();
    if (selectedDate) showDayEvents(selectedDate);
}

function showDayEvents(date) {
    selectedDate = date;
    const title = document.getElementById('sectiontitle');
    const backBtn = document.getElementById('backbtn');
    const eventForm = document.getElementById('eventform');
    const dayEventsList = document.getElementById('dayeventslist');
    
    title.textContent = `Events for ${formatDate(date)}`;
    backBtn.style.display = 'block';
    eventForm.style.display = 'block';
    document.getElementById('eventdate').style.display = 'none';
    document.getElementById('eventlistsection').style.display = 'none';
    dayEventsList.style.display = 'block';
    
    const dayEvents = events.filter(e => e.date === date);
    dayEventsList.innerHTML = dayEvents.length
        ? dayEvents.map(e => `
            <div class="day-event-item">
                <h5>${e.title}</h5>
                ${e.details ? `<p>${e.details}</p>` : ''}
                <button onclick="deleteEvent(${e.id})">Delete Event</button>
            </div>`).join('')
        : '<div class="no-events">No events on this day</div>';
}

function backToDefault() {
    selectedDate = null;
    document.getElementById('sectiontitle').textContent = 'Upcoming Events';
    document.getElementById('backbtn').style.display = 'none';
    document.getElementById('eventdate').style.display = 'block';
    document.getElementById('eventlistsection').style.display = 'block';
    document.getElementById('dayeventslist').style.display = 'none';
    document.getElementById('eventform').style.display = 'none';
}

function previousMonth() {
    month = (month - 1 + 12) % 12;
    if (month === 11) year--;
    showCalendar();
}

function nextMonth() {
    month = (month + 1) % 12;
    if (month === 0) year++;
    showCalendar();
}

window.onload = function() {
    showCalendar();
    displayEvents();
};
