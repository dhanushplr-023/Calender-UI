/**
 * COSMIC CALENDAR - MODERN GLASSMORPHISM SCHEDULE & PLANNER
 * Complete interactive engine: calendar generation, multi-views,
 * SVG gauge animation, task list sync, audio synthesis, and iCal export.
 */

// ==========================================
// 1. STAR & COSMIC PARTICLES BACKGROUND
// ==========================================
class CosmicBackground {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.stars = [];
    this.numStars = 140;
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Generate random stars
    for (let i = 0; i < this.numStars; i++) {
      this.stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.015 + 0.005,
        twinkleDir: Math.random() > 0.5 ? 1 : -1,
        color: Math.random() > 0.2 ? '#22d3ee' : '#ffffff'
      });
    }

    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let star of this.stars) {
      star.alpha += star.twinkleSpeed * star.twinkleDir;
      if (star.alpha > 0.95) {
        star.alpha = 0.95;
        star.twinkleDir = -1;
      } else if (star.alpha < 0.15) {
        star.alpha = 0.15;
        star.twinkleDir = 1;
      }

      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = star.color;
      this.ctx.globalAlpha = star.alpha;
      this.ctx.shadowBlur = star.radius > 1 ? 6 : 0;
      this.ctx.shadowColor = star.color;
      this.ctx.fill();
    }

    this.ctx.globalAlpha = 1;
    this.ctx.shadowBlur = 0;
    requestAnimationFrame(() => this.animate());
  }
}

// ==========================================
// 2. AUDIO SYNTHESIS FEEDBACK (Web Audio API)
// ==========================================
class SoundFX {
  constructor() {
    this.enabled = true;
    this.audioCtx = null;
  }

  initContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playPop() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.audioCtx) return;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.08);
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  }

  playChime() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.audioCtx) return;
      const now = this.audioCtx.currentTime;
      [659.25, 880, 1046.5].forEach((freq, i) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.05);

        gain.gain.setValueAtTime(0.06, now + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.22);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.22);
      });
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  }
}

// ==========================================
// 3. INITIAL SEED DATA (Matching Screenshot)
// ==========================================
const DEFAULT_EVENTS = [
  {
    id: 'evt-1',
    title: 'Chemistry challenge',
    date: '2022-02-03',
    startTime: '09:00',
    endTime: '11:00',
    category: 'education',
    color: '#38bdf8',
    notes: 'Complete organic chemistry lab problem sets and redox balancing.',
    attendees: ['Sarah J.', 'Raj P.']
  },
  {
    id: 'evt-2',
    title: 'Music assessment',
    date: '2022-02-05',
    startTime: '10:00',
    endTime: '12:00',
    category: 'arts',
    color: '#c084fc',
    notes: 'Acoustic violin piece recital preparation and evaluation.',
    attendees: ['Maria G.']
  },
  {
    id: 'evt-3',
    title: 'Meet up with mat...',
    date: '2022-02-05',
    startTime: '15:00',
    endTime: '17:30',
    category: 'social',
    color: '#fb7185',
    notes: 'Coffee chat at Lumina Lounge to discuss project roadmap.',
    attendees: ['Leo K.', 'Sarah J.']
  },
  {
    id: 'evt-4',
    title: 'Meeting with fri...',
    date: '2022-02-06',
    startTime: '11:00',
    endTime: '13:00',
    category: 'social',
    color: '#fb7185',
    notes: 'Brunch with college friends at downtown cafe.',
    attendees: ['Sarah J.', 'Raj P.', 'Leo K.', 'Maria G.']
  },
  {
    id: 'evt-5',
    title: 'Mathematic lesson',
    date: '2022-02-06',
    startTime: '14:30',
    endTime: '16:30',
    category: 'education',
    color: '#38bdf8',
    notes: 'Advanced multivariable calculus & partial differential equations.',
    attendees: ['Raj P.']
  },
  {
    id: 'evt-6',
    title: 'Working',
    date: '2022-02-07',
    startTime: '09:00',
    endTime: '17:00',
    category: 'work',
    color: '#2dd4bf',
    notes: 'Full sprint development & system design refactor.',
    attendees: ['Sarah J.', 'Leo K.']
  },
  {
    id: 'evt-7',
    title: 'Dream concert 103',
    date: '2022-02-11',
    startTime: '18:30',
    endTime: '22:00',
    category: 'arts',
    color: '#fb7185',
    notes: 'Live stadium arena synthwave concert night!',
    attendees: ['Leo K.', 'Maria G.']
  },
  {
    id: 'evt-8',
    title: 'Birthday',
    date: '2022-02-16',
    startTime: '09:30',
    endTime: '14:00',
    category: 'celebration',
    color: '#22d3ee',
    notes: 'Celebration lunch & cake party with close friends!',
    attendees: ['Sarah J.', 'Raj P.', 'Leo K.', 'Maria G.']
  },
  {
    id: 'evt-9',
    title: 'Natural science c...',
    date: '2022-02-19',
    startTime: '10:00',
    endTime: '12:30',
    category: 'education',
    color: '#34d399',
    notes: 'Field biology and ecological ecosystem seminar.',
    attendees: ['Sarah J.']
  },
  {
    id: 'evt-10',
    title: 'Register',
    date: '2022-02-25',
    startTime: '08:30',
    endTime: '10:00',
    category: 'work',
    color: '#2dd4bf',
    notes: 'Register for academic credentials and certification courses.',
    attendees: ['Annisa']
  },
  {
    id: 'evt-11',
    title: 'Climbing Mt Sem...',
    date: '2022-02-27',
    startTime: '06:00',
    endTime: '18:00',
    category: 'outdoor',
    color: '#f97316',
    notes: 'Summit expedition with mountain climbing club. Pack thermal gear.',
    attendees: ['Raj P.', 'Leo K.']
  }
];

const DEFAULT_TASKS = [
  { id: 'tsk-1', text: 'Mathematic lesson', completed: true },
  { id: 'tsk-2', text: 'Chemistry challenge', completed: true },
  { id: 'tsk-3', text: 'Music assessment', completed: true },
  { id: 'tsk-4', text: 'Climbing Mt Semeru', completed: false },
  { id: 'tsk-5', text: 'Dream concert 103', completed: true },
  { id: 'tsk-6', text: 'Prepare presentation deck', completed: false },
  { id: 'tsk-7', text: 'Submit biology lab notes', completed: true },
  { id: 'tsk-8', text: 'Review team pull requests', completed: false }
];

const COLLABORATOR_ROSTER = [
  { name: 'Sarah J.', role: 'Product Manager', avatar: 'assets/avatar_team.jpg', clip: '0% 0%' },
  { name: 'Raj P.', role: 'Software Engineer', avatar: 'assets/avatar_team.jpg', clip: '100% 0%' },
  { name: 'Leo K.', role: 'UX Designer', avatar: 'assets/avatar_team.jpg', clip: '0% 100%' },
  { name: 'Maria G.', role: 'Marketing Lead', avatar: 'assets/avatar_team.jpg', clip: '100% 100%' }
];

// ==========================================
// 4. MAIN APP CONTROLLER
// ==========================================
class CosmicCalendarApp {
  constructor() {
    this.sound = new SoundFX();
    
    // Starting date defaults to February 2022 as showcased in the screenshot!
    this.currentDate = new Date(2022, 1, 16);
    this.selectedDate = new Date(2022, 1, 16);
    this.currentView = 'month'; // month, week, day, year
    this.searchQuery = '';
    
    // Pagination for task list
    this.taskPage = 0;
    this.tasksPerPage = 5;

    // Active Collaborators for new event form
    this.selectedCollaborators = [...COLLABORATOR_ROSTER];

    // Load persisted state or seed data
    this.loadState();

    // DOM Elements
    this.cacheElements();

    // Setup Event Listeners
    this.bindEvents();

    // Initial Renders
    this.render();
  }

  loadState() {
    const savedEvents = localStorage.getItem('astra_cosmic_events');
    this.events = savedEvents ? JSON.parse(savedEvents) : [...DEFAULT_EVENTS];

    const savedTasks = localStorage.getItem('astra_cosmic_tasks');
    this.tasks = savedTasks ? JSON.parse(savedTasks) : [...DEFAULT_TASKS];
  }

  saveEvents() {
    localStorage.setItem('astra_cosmic_events', JSON.stringify(this.events));
  }

  saveTasks() {
    localStorage.setItem('astra_cosmic_tasks', JSON.stringify(this.tasks));
  }

  cacheElements() {
    // Header
    this.viewButtons = document.querySelectorAll('.view-btn');
    this.searchInput = document.getElementById('event-search-input');
    this.clearSearchBtn = document.getElementById('clear-search-btn');
    this.btnToday = document.getElementById('btn-today');
    this.soundToggleBtn = document.getElementById('sound-toggle-btn');
    this.soundIconOn = document.getElementById('sound-icon-on');
    this.soundIconOff = document.getElementById('sound-icon-off');
    this.exportDropdownBtn = document.getElementById('export-dropdown-btn');
    this.exportDropdownMenu = document.getElementById('export-dropdown-menu');

    // Nav tabs
    this.navTabs = document.querySelectorAll('.nav-tab-btn');

    // Resource Consumption
    this.gaugeProgress = document.getElementById('gauge-progress-circle');
    this.gaugePercentDisplay = document.getElementById('gauge-percent-display');
    this.statTotal = document.getElementById('stat-total-tasks');
    this.statInProgress = document.getElementById('stat-in-progress');
    this.statCompleted = document.getElementById('stat-completed-tasks');

    // Mini Calendar
    this.miniMonthTitle = document.getElementById('mini-cal-month-title');
    this.miniDatesGrid = document.getElementById('mini-cal-dates-grid');
    this.miniPrevBtn = document.getElementById('mini-prev-month');
    this.miniNextBtn = document.getElementById('mini-next-month');
    this.miniToggleMonth = document.getElementById('mini-toggle-month');
    this.miniToggleYear = document.getElementById('mini-toggle-year');

    // Task List
    this.tasksUl = document.getElementById('tasks-ul');
    this.taskPrevBtn = document.getElementById('task-prev-page');
    this.taskNextBtn = document.getElementById('task-next-page');
    this.taskPageInfo = document.getElementById('task-page-info');
    this.btnQuickAddTask = document.getElementById('btn-quick-add-task');

    // Form
    this.scheduleForm = document.getElementById('schedule-form');
    this.formEventId = document.getElementById('form-event-id');
    this.formTitle = document.getElementById('form-title');
    this.formDate = document.getElementById('form-date');
    this.styledDateDisplay = document.getElementById('styled-date-display');
    this.formCategory = document.getElementById('form-category');
    this.categoryDotIndicator = document.getElementById('category-dot-indicator');
    this.formStartTime = document.getElementById('form-start-time');
    this.formEndTime = document.getElementById('form-end-time');
    this.formNotes = document.getElementById('form-notes');
    this.collaboratorStack = document.getElementById('collaborator-avatars-list');
    this.btnRemoveCollab = document.getElementById('btn-remove-last-collab');
    this.btnAddCollab = document.getElementById('btn-add-collab');
    this.btnSubmitEvent = document.getElementById('btn-submit-event');
    this.submitBtnText = document.getElementById('submit-btn-text');
    this.btnCancelEdit = document.getElementById('btn-cancel-edit');
    this.btnToggleNewEvent = document.getElementById('btn-toggle-new-event');

    // Main Calendar
    this.monthViewContainer = document.getElementById('calendar-month-view');
    this.weekViewContainer = document.getElementById('calendar-week-view');
    this.dayViewContainer = document.getElementById('calendar-day-view');
    this.yearViewContainer = document.getElementById('calendar-year-view');
    this.calendarCellsGrid = document.getElementById('calendar-cells-grid');

    // Modals
    this.detailModal = document.getElementById('event-detail-modal');
    this.modalCloseBtn = document.getElementById('modal-close-btn');
    this.modalEventTitle = document.getElementById('modal-event-title');
    this.modalEventBadge = document.getElementById('modal-event-badge');
    this.modalEventDate = document.getElementById('modal-event-date');
    this.modalEventTime = document.getElementById('modal-event-time');
    this.modalEventNotes = document.getElementById('modal-event-notes');
    this.modalAttendeeChips = document.getElementById('modal-attendee-chips');
    this.btnModalEdit = document.getElementById('btn-modal-edit');
    this.btnModalDelete = document.getElementById('btn-modal-delete');

    this.addTaskModal = document.getElementById('add-task-modal');
    this.newTaskForm = document.getElementById('new-task-form');
    this.newTaskTitleInput = document.getElementById('new-task-title-input');
    this.taskModalCloseBtn = document.getElementById('task-modal-close-btn');

    this.addCollabModal = document.getElementById('add-collab-modal');
    this.collabPickerList = document.getElementById('collab-picker-list');
    this.collabModalCloseBtn = document.getElementById('collab-modal-close-btn');

    this.toastContainer = document.getElementById('toast-container');
  }

  bindEvents() {
    // Navigation Tabs
    this.navTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        this.navTabs.forEach(t => {
          t.classList.remove('active');
          const dot = t.querySelector('.active-dot');
          if (dot) dot.remove();
        });
        tab.classList.add('active');
        if (!tab.querySelector('.active-dot')) {
          const dot = document.createElement('span');
          dot.className = 'active-dot';
          tab.appendChild(dot);
        }
        this.sound.playPop();
      });
    });

    // View Switching (Month, Week, Day, Year)
    this.viewButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.viewButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentView = btn.dataset.view;
        this.sound.playPop();
        this.renderCalendarView();
      });
    });

    // Today Button
    this.btnToday.addEventListener('click', () => {
      this.currentDate = new Date();
      this.selectedDate = new Date();
      this.syncDateToForm(this.selectedDate);
      this.sound.playPop();
      this.render();
      this.showToast('Jumped to Today');
    });

    // Sound Toggle
    this.soundToggleBtn.addEventListener('click', () => {
      this.sound.enabled = !this.sound.enabled;
      this.soundIconOn.style.display = this.sound.enabled ? 'block' : 'none';
      this.soundIconOff.style.display = this.sound.enabled ? 'none' : 'block';
      this.showToast(this.sound.enabled ? 'Audio feedback enabled' : 'Audio muted');
    });

    // Search Box
    this.searchInput.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.toLowerCase().trim();
      this.clearSearchBtn.style.display = this.searchQuery ? 'block' : 'none';
      this.renderCalendarView();
    });

    this.clearSearchBtn.addEventListener('click', () => {
      this.searchInput.value = '';
      this.searchQuery = '';
      this.clearSearchBtn.style.display = 'none';
      this.renderCalendarView();
    });

    // Export Dropdown
    this.exportDropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.exportDropdownMenu.classList.toggle('show');
    });

    document.addEventListener('click', () => {
      this.exportDropdownMenu.classList.remove('show');
    });

    document.getElementById('btn-export-ical').addEventListener('click', () => {
      this.exportICalendar();
    });

    document.getElementById('btn-export-json').addEventListener('click', () => {
      this.exportJSON();
    });

    document.getElementById('btn-reset-demo').addEventListener('click', () => {
      this.resetDemoData();
    });

    // Mini Calendar Chevrons
    this.miniPrevBtn.addEventListener('click', () => {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
      this.sound.playPop();
      this.render();
    });

    this.miniNextBtn.addEventListener('click', () => {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
      this.sound.playPop();
      this.render();
    });

    // Mini Toggle Month/Year
    this.miniToggleMonth.addEventListener('click', () => {
      this.miniToggleMonth.classList.add('active');
      this.miniToggleYear.classList.remove('active');
    });

    this.miniToggleYear.addEventListener('click', () => {
      this.miniToggleYear.classList.add('active');
      this.miniToggleMonth.classList.remove('active');
      const year = prompt('Enter year to navigate to:', this.currentDate.getFullYear());
      if (year && !isNaN(year)) {
        this.currentDate.setFullYear(parseInt(year, 10));
        this.render();
      }
    });

    // Task Pagination
    this.taskPrevBtn.addEventListener('click', () => {
      if (this.taskPage > 0) {
        this.taskPage--;
        this.renderTasks();
        this.sound.playPop();
      }
    });

    this.taskNextBtn.addEventListener('click', () => {
      const maxPages = Math.ceil(this.tasks.length / this.tasksPerPage);
      if (this.taskPage < maxPages - 1) {
        this.taskPage++;
        this.renderTasks();
        this.sound.playPop();
      }
    });

    // Quick Add Task Modal
    this.btnQuickAddTask.addEventListener('click', () => {
      this.newTaskTitleInput.value = '';
      this.addTaskModal.showModal();
    });

    this.taskModalCloseBtn.addEventListener('click', () => {
      this.addTaskModal.close();
    });

    this.newTaskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = this.newTaskTitleInput.value.trim();
      if (!title) return;
      this.tasks.unshift({
        id: 'tsk-' + Date.now(),
        text: title,
        completed: false
      });
      this.saveTasks();
      this.addTaskModal.close();
      this.taskPage = 0;
      this.renderTasks();
      this.updateResourceGauge();
      this.sound.playChime();
      this.showToast(`Task added: "${title}"`);
    });

    // Event Form Interactions
    this.formCategory.addEventListener('change', () => {
      const selectedOption = this.formCategory.selectedOptions[0];
      const color = selectedOption.dataset.color || '#22d3ee';
      this.categoryDotIndicator.style.backgroundColor = color;
      this.categoryDotIndicator.style.boxShadow = `0 0 8px ${color}`;
    });

    this.formDate.addEventListener('change', (e) => {
      const [y, m, d] = e.target.value.split('-').map(Number);
      this.selectedDate = new Date(y, m - 1, d);
      this.updateDateDisplay(this.selectedDate);
      this.renderMiniCalendar();
      this.renderCalendarView();
    });

    this.btnToggleNewEvent.addEventListener('click', () => {
      this.resetForm();
      this.formTitle.focus();
      this.showToast('Ready to schedule a new event');
    });

    // Collaborators Tools
    this.btnRemoveCollab.addEventListener('click', () => {
      if (this.selectedCollaborators.length > 0) {
        const removed = this.selectedCollaborators.pop();
        this.renderCollaboratorStack();
        this.showToast(`Removed ${removed.name}`);
        this.sound.playPop();
      }
    });

    this.btnAddCollab.addEventListener('click', () => {
      this.openCollabModal();
    });

    this.collabModalCloseBtn.addEventListener('click', () => {
      this.addCollabModal.close();
    });

    // Form Submit (Create or Update Event)
    this.scheduleForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmit();
    });

    this.btnCancelEdit.addEventListener('click', () => {
      this.resetForm();
    });

    // Modal Details Actions
    this.modalCloseBtn.addEventListener('click', () => {
      this.detailModal.close();
    });

    this.btnModalEdit.addEventListener('click', () => {
      const eventId = this.detailModal.dataset.eventId;
      this.detailModal.close();
      this.startEditEvent(eventId);
    });

    this.btnModalDelete.addEventListener('click', () => {
      const eventId = this.detailModal.dataset.eventId;
      if (confirm('Are you sure you want to delete this event?')) {
        this.deleteEvent(eventId);
        this.detailModal.close();
      }
    });

    // Global Keybindings
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 't' || e.key === 'T') {
        this.btnToday.click();
      } else if (e.key === 'ArrowLeft') {
        this.miniPrevBtn.click();
      } else if (e.key === 'ArrowRight') {
        this.miniNextBtn.click();
      } else if (e.key === '1') {
        this.switchView('month');
      } else if (e.key === '2') {
        this.switchView('week');
      } else if (e.key === '3') {
        this.switchView('day');
      } else if (e.key === '4') {
        this.switchView('year');
      }
    });
  }

  switchView(viewName) {
    const btn = Array.from(this.viewButtons).find(b => b.dataset.view === viewName);
    if (btn) btn.click();
  }

  // ==========================================
  // 5. RENDERING PIPELINE
  // ==========================================
  render() {
    this.renderMiniCalendar();
    this.renderCalendarView();
    this.renderTasks();
    this.updateResourceGauge();
    this.renderCollaboratorStack();
    this.syncDateToForm(this.selectedDate);
  }

  // Mini Month Picker Rendering
  renderMiniCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    this.miniMonthTitle.textContent = `${monthNames[month]} ${year}`;

    this.miniDatesGrid.innerHTML = '';

    // First day of current month (0=Sun, 1=Mon, ..., 6=Sat)
    // Convert to Monday-first indexing: Mon=0, Tue=1, ..., Sun=6
    const firstDay = new Date(year, month, 1).getDay();
    const startOffset = (firstDay + 6) % 7;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    // Previous month filler days
    for (let i = startOffset - 1; i >= 0; i--) {
      const cell = document.createElement('div');
      cell.className = 'mini-date-cell muted';
      cell.textContent = daysInPrevMonth - i;
      this.miniDatesGrid.appendChild(cell);
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const cell = document.createElement('div');
      cell.className = 'mini-date-cell';
      cell.textContent = day;

      const dateStr = this.formatDateKey(year, month, day);

      // Check if selected
      const isSelected = this.selectedDate.getFullYear() === year &&
                         this.selectedDate.getMonth() === month &&
                         this.selectedDate.getDate() === day;
      if (isSelected) {
        cell.classList.add('active-circle');
      }

      // Check if day has events
      const hasEvents = this.events.some(ev => ev.date === dateStr);
      if (hasEvents) {
        cell.classList.add('has-event');
      }

      cell.addEventListener('click', () => {
        this.selectedDate = new Date(year, month, day);
        this.syncDateToForm(this.selectedDate);
        this.sound.playPop();
        this.renderMiniCalendar();
        this.renderCalendarView();
      });

      this.miniDatesGrid.appendChild(cell);
    }

    // Trailing days to fill 35 or 42 grid cells
    const totalRendered = startOffset + daysInMonth;
    const remaining = totalRendered % 7 === 0 ? 0 : 7 - (totalRendered % 7);
    for (let i = 1; i <= remaining; i++) {
      const cell = document.createElement('div');
      cell.className = 'mini-date-cell muted';
      cell.textContent = i;
      this.miniDatesGrid.appendChild(cell);
    }
  }

  // Large Calendar View Router
  renderCalendarView() {
    this.monthViewContainer.style.display = 'none';
    this.weekViewContainer.style.display = 'none';
    this.dayViewContainer.style.display = 'none';
    this.yearViewContainer.style.display = 'none';

    if (this.currentView === 'month') {
      this.monthViewContainer.style.display = 'block';
      this.renderMonthView();
    } else if (this.currentView === 'week') {
      this.weekViewContainer.style.display = 'block';
      this.renderWeekView();
    } else if (this.currentView === 'day') {
      this.dayViewContainer.style.display = 'block';
      this.renderDayView();
    } else if (this.currentView === 'year') {
      this.yearViewContainer.style.display = 'block';
      this.renderYearView();
    }
  }

  // Month Grid View Rendering (Matching the exact look of screenshot)
  renderMonthView() {
    this.calendarCellsGrid.innerHTML = '';

    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const startOffset = (firstDay + 6) % 7; // Monday = 0
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    // Trailing previous month days
    for (let i = startOffset - 1; i >= 0; i--) {
      const prevDay = daysInPrevMonth - i;
      const prevDate = new Date(year, month - 1, prevDay);
      const cell = this.createCalendarCell(prevDate, true);
      this.calendarCellsGrid.appendChild(cell);
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const cell = this.createCalendarCell(date, false);
      this.calendarCellsGrid.appendChild(cell);
    }

    // Next month filler days to complete grid
    const totalCells = startOffset + daysInMonth;
    const nextOffset = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    for (let i = 1; i <= nextOffset; i++) {
      const nextDate = new Date(year, month + 1, i);
      const cell = this.createCalendarCell(nextDate, true);
      this.calendarCellsGrid.appendChild(cell);
    }
  }

  createCalendarCell(date, isOutsideMonth) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const dateStr = this.formatDateKey(year, month, day);

    const cell = document.createElement('div');
    cell.className = 'cal-cell';

    const isSelected = this.selectedDate.getFullYear() === year &&
                       this.selectedDate.getMonth() === month &&
                       this.selectedDate.getDate() === day;

    // Filter events for this cell
    let dayEvents = this.events.filter(e => e.date === dateStr);
    if (this.searchQuery) {
      dayEvents = dayEvents.filter(e => 
        e.title.toLowerCase().includes(this.searchQuery) ||
        (e.notes && e.notes.toLowerCase().includes(this.searchQuery))
      );
    }

    // Apply aesthetics based on screenshot:
    // Selected day (16 in screenshot) is bright cyan theme!
    if (isSelected) {
      cell.classList.add('theme-cyan');
    } else if (isOutsideMonth) {
      cell.classList.add('muted-month');
    } else {
      // Replicate the high visual contrast of the screenshot:
      // Certain dates have dark teal/navy backgrounds (day 3, 5, 6, 27)
      // Others have soft teal (day 7, 25)
      // The rest have clean frosted light cards
      if ([3, 5, 6, 27].includes(day) && month === 1 && year === 2022) {
        cell.classList.add('theme-dark');
      } else if ([7, 25].includes(day) && month === 1 && year === 2022) {
        cell.classList.add('theme-teal');
      } else {
        cell.classList.add('theme-light');
      }
    }

    // Day Number header
    const cellHeader = document.createElement('div');
    cellHeader.className = 'cell-header';

    const dayNum = document.createElement('span');
    dayNum.className = 'cell-day-num';
    dayNum.textContent = day;
    cellHeader.appendChild(dayNum);
    cell.appendChild(cellHeader);

    // Events list inside cell
    const eventsList = document.createElement('div');
    eventsList.className = 'cell-events-list';

    const maxDisplay = 2;
    dayEvents.slice(0, maxDisplay).forEach(event => {
      const pill = document.createElement('div');
      pill.className = 'cal-event-pill';
      pill.title = `${event.title} (${event.startTime} - ${event.endTime})`;

      const dot = document.createElement('span');
      dot.className = 'event-dot';
      dot.style.backgroundColor = event.color || '#22d3ee';
      dot.style.boxShadow = `0 0 6px ${event.color || '#22d3ee'}`;

      const text = document.createElement('span');
      text.className = 'event-title-text';
      text.textContent = event.title;

      pill.appendChild(dot);
      pill.appendChild(text);

      pill.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openEventDetails(event);
      });

      eventsList.appendChild(pill);
    });

    if (dayEvents.length > maxDisplay) {
      const moreBadge = document.createElement('span');
      moreBadge.className = 'event-more-badge';
      moreBadge.textContent = `+${dayEvents.length - maxDisplay} more`;
      eventsList.appendChild(moreBadge);
    }

    cell.appendChild(eventsList);

    // Clicking cell selects it and populates the New Event form
    cell.addEventListener('click', () => {
      this.selectedDate = new Date(year, month, day);
      this.syncDateToForm(this.selectedDate);
      this.sound.playPop();
      this.renderMiniCalendar();
      this.renderCalendarView();
    });

    return cell;
  }

  // Week View Implementation
  renderWeekView() {
    const weekHeader = document.getElementById('week-view-header');
    const weekBody = document.getElementById('week-view-body');
    weekHeader.innerHTML = '<div class="time-col-header">Time</div>';
    weekBody.innerHTML = '';

    // Calculate current week's Monday
    const current = new Date(this.selectedDate);
    const day = current.getDay();
    const diff = current.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(current.setDate(diff));

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      weekDays.push(d);

      const dayName = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i];
      const headerCell = document.createElement('div');
      headerCell.innerHTML = `<div>${dayName}</div><div style="font-size:0.8rem; color:var(--accent-cyan);">${d.getDate()}</div>`;
      weekHeader.appendChild(headerCell);
    }

    // Time slots from 8 AM to 20 PM
    for (let hour = 8; hour <= 20; hour += 2) {
      const row = document.createElement('div');
      row.className = 'week-time-row';

      const timeLabel = document.createElement('div');
      timeLabel.className = 'week-time-label';
      timeLabel.textContent = `${hour.toString().padStart(2, '0')}:00`;
      row.appendChild(timeLabel);

      weekDays.forEach(date => {
        const slot = document.createElement('div');
        slot.className = 'week-cell-slot';
        const dateStr = this.formatDateKey(date.getFullYear(), date.getMonth(), date.getDate());

        // Find events in this hour
        const hourEvents = this.events.filter(e => {
          if (e.date !== dateStr) return false;
          const startHour = parseInt(e.startTime.split(':')[0], 10);
          return startHour >= hour && startHour < hour + 2;
        });

        hourEvents.forEach(ev => {
          const pill = document.createElement('div');
          pill.className = 'cal-event-pill';
          pill.style.background = 'rgba(34, 211, 238, 0.25)';
          pill.style.color = '#fff';
          pill.textContent = ev.title;
          pill.addEventListener('click', () => this.openEventDetails(ev));
          slot.appendChild(pill);
        });

        row.appendChild(slot);
      });

      weekBody.appendChild(row);
    }
  }

  // Day View Implementation
  renderDayView() {
    const timeline = document.getElementById('day-view-timeline');
    timeline.innerHTML = '';

    const year = this.selectedDate.getFullYear();
    const month = this.selectedDate.getMonth();
    const day = this.selectedDate.getDate();
    const dateStr = this.formatDateKey(year, month, day);

    const dayEvents = this.events.filter(e => e.date === dateStr);

    for (let hour = 8; hour <= 21; hour++) {
      const block = document.createElement('div');
      block.className = 'timeline-hour-block';

      const mark = document.createElement('div');
      mark.className = 'timeline-hour-mark';
      mark.textContent = `${hour.toString().padStart(2, '0')}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
      block.appendChild(mark);

      const eventsCont = document.createElement('div');
      eventsCont.className = 'timeline-events-container';

      const eventsInHour = dayEvents.filter(e => {
        const h = parseInt(e.startTime.split(':')[0], 10);
        return h === hour;
      });

      if (eventsInHour.length > 0) {
        eventsInHour.forEach(ev => {
          const card = document.createElement('div');
          card.className = 'timeline-event-card';
          card.style.borderLeftColor = ev.color || '#22d3ee';
          card.innerHTML = `
            <div>
              <div style="font-weight:700; color:#fff;">${ev.title}</div>
              <div style="font-size:0.8rem; color:#8bb3c7;">${ev.startTime} - ${ev.endTime} • ${ev.category}</div>
            </div>
            <button class="action-pill-btn" style="padding:4px 10px; font-size:0.75rem;">View</button>
          `;
          card.addEventListener('click', () => this.openEventDetails(ev));
          eventsCont.appendChild(card);
        });
      } else {
        const emptyHint = document.createElement('div');
        emptyHint.style.fontSize = '0.78rem';
        emptyHint.style.color = '#456a7d';
        emptyHint.textContent = 'Free slot';
        eventsCont.appendChild(emptyHint);
      }

      block.appendChild(eventsCont);
      timeline.appendChild(block);
    }
  }

  // Year View Implementation
  renderYearView() {
    const grid = document.getElementById('year-view-grid');
    grid.innerHTML = '';
    const year = this.currentDate.getFullYear();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let m = 0; m < 12; m++) {
      const card = document.createElement('div');
      card.className = 'year-mini-month-card';

      const title = document.createElement('div');
      title.className = 'year-month-title';
      title.textContent = `${monthNames[m]} ${year}`;
      card.appendChild(title);

      const daysCount = new Date(year, m + 1, 0).getDate();
      const eventsInMonth = this.events.filter(e => {
        const [ey, em] = e.date.split('-').map(Number);
        return ey === year && em === m + 1;
      }).length;

      const info = document.createElement('div');
      info.style.fontSize = '0.8rem';
      info.style.color = '#8bb3c7';
      info.style.textAlign = 'center';
      info.textContent = `${daysCount} days • ${eventsInMonth} scheduled events`;
      card.appendChild(info);

      card.addEventListener('click', () => {
        this.currentDate.setMonth(m);
        this.switchView('month');
      });

      grid.appendChild(card);
    }
  }

  // ==========================================
  // 6. TASK LIST & GAUGE SYNCHRONIZATION
  // ==========================================
  renderTasks() {
    this.tasksUl.innerHTML = '';
    const startIdx = this.taskPage * this.tasksPerPage;
    const pageTasks = this.tasks.slice(startIdx, startIdx + this.tasksPerPage);

    pageTasks.forEach(task => {
      const li = document.createElement('li');
      li.className = `task-item ${task.completed ? 'completed' : ''}`;

      const checkbox = document.createElement('div');
      checkbox.className = 'task-checkbox-custom';
      checkbox.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      `;

      const span = document.createElement('span');
      span.className = 'task-text';
      span.textContent = task.text;

      li.appendChild(checkbox);
      li.appendChild(span);

      li.addEventListener('click', () => {
        task.completed = !task.completed;
        this.saveTasks();
        this.sound.playPop();
        this.renderTasks();
        this.updateResourceGauge();
      });

      this.tasksUl.appendChild(li);
    });

    // Pagination info
    const totalPages = Math.ceil(this.tasks.length / this.tasksPerPage) || 1;
    this.taskPageInfo.textContent = `${this.taskPage + 1} / ${totalPages}`;
  }

  updateResourceGauge() {
    const total = this.tasks.length;
    const completed = this.tasks.filter(t => t.completed).length;
    const inProgress = total - completed;

    // Calculate percentage (fallback to 45% if empty, or actual task ratio)
    let percent = total > 0 ? Math.round((completed / total) * 100) : 45;

    // In the image, values are 45%, 30 total, 15 in progress, 29 completed.
    // If the tasks list is modified, we dynamically update cleanly!
    this.gaugePercentDisplay.textContent = `${percent}%`;
    this.statTotal.textContent = total;
    this.statInProgress.textContent = inProgress;
    this.statCompleted.textContent = completed;

    // Circular SVG dash calculation: 2 * PI * 62 = 389.56
    const circumference = 389.56;
    const offset = circumference * (1 - percent / 100);
    this.gaugeProgress.style.strokeDashoffset = offset;
  }

  // ==========================================
  // 7. COLLABORATOR AVATARS MANAGEMENT
  // ==========================================
  renderCollaboratorStack() {
    this.collaboratorStack.innerHTML = '';
    this.selectedCollaborators.forEach(collab => {
      const img = document.createElement('img');
      img.src = collab.avatar;
      img.alt = collab.name;
      img.title = `${collab.name} (${collab.role})`;
      img.className = 'collab-avatar-thumb';
      this.collaboratorStack.appendChild(img);
    });
  }

  openCollabModal() {
    this.collabPickerList.innerHTML = '';
    COLLABORATOR_ROSTER.forEach(collab => {
      const isAlreadyAdded = this.selectedCollaborators.some(c => c.name === collab.name);
      const card = document.createElement('div');
      card.className = 'collab-option';
      card.innerHTML = `
        <img src="${collab.avatar}" alt="${collab.name}">
        <div>
          <div style="font-weight:700; color:#fff; font-size:0.86rem;">${collab.name}</div>
          <div style="font-size:0.75rem; color:#7ca5b9;">${collab.role}</div>
        </div>
        <div style="margin-left:auto; font-size:0.8rem; color:${isAlreadyAdded ? '#648a9e' : 'var(--accent-cyan)'}">
          ${isAlreadyAdded ? 'Added' : '+ Add'}
        </div>
      `;

      if (!isAlreadyAdded) {
        card.addEventListener('click', () => {
          this.selectedCollaborators.push(collab);
          this.renderCollaboratorStack();
          this.addCollabModal.close();
          this.sound.playChime();
          this.showToast(`Added ${collab.name} to collaborators`);
        });
      }

      this.collabPickerList.appendChild(card);
    });

    this.addCollabModal.showModal();
  }

  // ==========================================
  // 8. EVENT CRUD OPERATIONS
  // ==========================================
  syncDateToForm(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    this.formDate.value = `${y}-${m}-${d}`;
    this.updateDateDisplay(date);
  }

  updateDateDisplay(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    const dateNum = date.getDate();
    const year = date.getFullYear();

    this.styledDateDisplay.textContent = `${dayName}, ${dateNum} ${monthName} ${year}`;
  }

  handleFormSubmit() {
    const title = this.formTitle.value.trim();
    if (!title) {
      alert('Please enter an event title');
      return;
    }

    const editId = this.formEventId.value;
    const selectedOption = this.formCategory.selectedOptions[0];
    const category = this.formCategory.value;
    const color = selectedOption.dataset.color || '#22d3ee';

    const eventPayload = {
      id: editId || 'evt-' + Date.now(),
      title: title,
      date: this.formDate.value,
      category: category,
      color: color,
      startTime: this.formStartTime.value,
      endTime: this.formEndTime.value,
      notes: this.formNotes.value.trim(),
      attendees: this.selectedCollaborators.map(c => c.name)
    };

    if (editId) {
      const idx = this.events.findIndex(e => e.id === editId);
      if (idx !== -1) {
        this.events[idx] = eventPayload;
        this.showToast(`Updated event: "${title}"`);
      }
    } else {
      this.events.push(eventPayload);
      this.showToast(`Created event: "${title}"`);
    }

    this.saveEvents();
    this.sound.playChime();
    this.resetForm();
    this.render();
  }

  startEditEvent(eventId) {
    const ev = this.events.find(e => e.id === eventId);
    if (!ev) return;

    this.formEventId.value = ev.id;
    this.formTitle.value = ev.title;
    this.formDate.value = ev.date;

    const [y, m, d] = ev.date.split('-').map(Number);
    this.selectedDate = new Date(y, m - 1, d);
    this.updateDateDisplay(this.selectedDate);

    this.formCategory.value = ev.category || 'social';
    const selectedOption = this.formCategory.selectedOptions[0];
    const color = selectedOption ? selectedOption.dataset.color : '#22d3ee';
    this.categoryDotIndicator.style.backgroundColor = color;
    this.categoryDotIndicator.style.boxShadow = `0 0 8px ${color}`;

    this.formStartTime.value = ev.startTime || '09:30';
    this.formEndTime.value = ev.endTime || '14:00';
    this.formNotes.value = ev.notes || '';

    this.submitBtnText.textContent = 'Update Event';
    this.btnCancelEdit.style.display = 'inline-block';

    // Scroll smoothly to form
    document.getElementById('event-editor-card').scrollIntoView({ behavior: 'smooth' });
    this.formTitle.focus();
  }

  deleteEvent(eventId) {
    this.events = this.events.filter(e => e.id !== eventId);
    this.saveEvents();
    this.sound.playPop();
    this.render();
    this.showToast('Event removed');
  }

  resetForm() {
    this.formEventId.value = '';
    this.formTitle.value = '';
    this.formNotes.value = '';
    this.submitBtnText.textContent = 'Create';
    this.btnCancelEdit.style.display = 'none';
    this.syncDateToForm(this.selectedDate);
  }

  openEventDetails(event) {
    this.detailModal.dataset.eventId = event.id;
    this.modalEventTitle.textContent = event.title;
    this.modalEventBadge.textContent = event.category.toUpperCase();
    this.modalEventBadge.style.color = event.color || '#22d3ee';
    this.modalEventBadge.style.borderColor = event.color || '#22d3ee';
    this.modalEventBadge.style.background = `${event.color}22`;

    const [y, m, d] = event.date.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.modalEventDate.textContent = `${days[dateObj.getDay()]}, ${d} ${months[m - 1]} ${y}`;
    this.modalEventTime.textContent = `${event.startTime} - ${event.endTime}`;
    this.modalEventNotes.textContent = event.notes || 'No extra notes provided for this schedule.';

    this.modalAttendeeChips.innerHTML = '';
    if (event.attendees && event.attendees.length > 0) {
      event.attendees.forEach(name => {
        const chip = document.createElement('span');
        chip.className = 'attendee-chip';
        chip.textContent = name;
        this.modalAttendeeChips.appendChild(chip);
      });
    } else {
      this.modalAttendeeChips.innerHTML = '<span style="color:#648a9e; font-size:0.8rem;">Solo Event</span>';
    }

    this.detailModal.showModal();
  }

  // ==========================================
  // 9. EXPORT & BACKUP (iCal & JSON)
  // ==========================================
  exportICalendar() {
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Astra Cosmic Calendar//EN\nCALSCALE:GREGORIAN\n";

    this.events.forEach(ev => {
      const dateNoDash = ev.date.replace(/-/g, '');
      const startClean = ev.startTime.replace(':', '') + '00';
      const endClean = ev.endTime.replace(':', '') + '00';

      icsContent += "BEGIN:VEVENT\n";
      icsContent += `UID:${ev.id}@astracosmic.app\n`;
      icsContent += `DTSTAMP:${dateNoDash}T${startClean}Z\n`;
      icsContent += `DTSTART:${dateNoDash}T${startClean}\n`;
      icsContent += `DTEND:${dateNoDash}T${endClean}\n`;
      icsContent += `SUMMARY:${ev.title}\n`;
      icsContent += `DESCRIPTION:${ev.notes || ''}\n`;
      icsContent += "STATUS:CONFIRMED\n";
      icsContent += "END:VEVENT\n";
    });

    icsContent += "END:VCALENDAR";

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cosmic_calendar_${Date.now()}.ics`;
    a.click();
    URL.revokeObjectURL(url);
    this.showToast('Calendar exported as .ics format');
  }

  exportJSON() {
    const data = {
      events: this.events,
      tasks: this.tasks,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cosmic_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.showToast('Backup saved as JSON');
  }

  resetDemoData() {
    if (confirm('Reset to initial screenshot demo data?')) {
      this.events = [...DEFAULT_EVENTS];
      this.tasks = [...DEFAULT_TASKS];
      this.currentDate = new Date(2022, 1, 16);
      this.selectedDate = new Date(2022, 1, 16);
      this.saveEvents();
      this.saveTasks();
      this.render();
      this.showToast('Reset to original demo data');
    }
  }

  // ==========================================
  // 10. UTILITIES & TOAST ALERTS
  // ==========================================
  formatDateKey(year, month, day) {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  }

  showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" stroke-width="2.5">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
      <span>${message}</span>
    `;

    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px) scale(0.95)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, 2800);
  }
}

// Initialize Application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new CosmicBackground('cosmic-canvas');
  window.app = new CosmicCalendarApp();
});
