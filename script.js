/* ==========================================================================
   GYMSYNC — APP SCRIPT
   Phase 1: navigation between views + animated indicator positioning
   ========================================================================== */

(() => {
  'use strict';

  /* ------------------------------------------------------------------ *
   * STORAGE — thin, namespaced wrapper around localStorage.
   * Every later phase (workouts, history, streaks) reads/writes through
   * this same helper, so there's one place that handles JSON + failures.
   * ------------------------------------------------------------------ */
  const Storage = {
    prefix: 'gymsync:',

    /**
     * @param {string} key
     * @param {*} fallback - returned if the key is missing or unreadable
     */
    get(key, fallback = null) {
      try {
        const raw = localStorage.getItem(Storage.prefix + key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch (error) {
        console.warn(`GymSync: couldn't read "${key}" from storage.`, error);
        return fallback;
      }
    },

    /** @param {string} key @param {*} value - any JSON-serializable value */
    set(key, value) {
      try {
        localStorage.setItem(Storage.prefix + key, JSON.stringify(value));
        return true;
      } catch (error) {
        console.warn(`GymSync: couldn't save "${key}" to storage.`, error);
        return false;
      }
    },

    remove(key) {
      localStorage.removeItem(Storage.prefix + key);
    },
  };

  /** Cached DOM references used across this module. */
  const navLinks = Array.from(document.querySelectorAll('.nav__link'));
  const indicator = document.getElementById('navIndicator');
  const viewPanels = Array.from(document.querySelectorAll('[data-view-panel]'));

  /**
   * Switches the visible content view and updates the active nav link.
   * @param {string} viewName - matches a button's data-view / panel's data-view-panel
   */
  function setActiveView(viewName) {
    navLinks.forEach((link) => {
      link.classList.toggle('is-active', link.dataset.view === viewName);
    });

    viewPanels.forEach((panel) => {
      panel.hidden = panel.dataset.viewPanel !== viewName;
    });

    moveIndicatorToActiveLink();

    if (viewName === 'workout') {
      WorkoutScreen.onEnter();
    }
  }

  /**
   * Positions the glowing indicator pill under (mobile) or behind (desktop)
   * the currently active nav link, based on real layout measurements so it
   * stays correct across breakpoints and screen sizes.
   */
  function moveIndicatorToActiveLink() {
    const activeLink = navLinks.find((link) => link.classList.contains('is-active'));
    if (!activeLink || !indicator) return;

    const isDesktopSidebar = window.matchMedia('(min-width: 900px)').matches;

    if (isDesktopSidebar) {
      // Vertical stack: slide indicator down to the active row.
      const offsetTop = activeLink.parentElement.offsetTop;
      indicator.style.transform = `translateY(${offsetTop}px)`;
    } else {
      // Horizontal bar: slide indicator across to the active column.
      const linkRect = activeLink.getBoundingClientRect();
      const listRect = activeLink.closest('.nav__list').getBoundingClientRect();
      const offsetLeft = linkRect.left - listRect.left;
      indicator.style.transform = `translateX(${offsetLeft}px)`;
    }

    // Reveal only after the first real measurement, so it can never flash
    // in its CSS fallback position (which sits over the wrong tab).
    indicator.classList.add('is-ready');
  }

  /** Wires up click handlers for each nav link. */
  function initNavigation() {
    navLinks.forEach((link) => {
      link.addEventListener('click', () => setActiveView(link.dataset.view));
    });

    // Keep the indicator aligned if the viewport crosses the responsive breakpoint.
    window.addEventListener('resize', debounce(moveIndicatorToActiveLink, 120));

    // iOS Safari doesn't always fire 'resize' on rotation; cover it explicitly.
    window.addEventListener('orientationchange', () => {
      setTimeout(moveIndicatorToActiveLink, 50);
    });

    // Fonts/icons finishing their swap can shift column widths by a pixel or two;
    // re-measure once everything has fully loaded.
    window.addEventListener('load', moveIndicatorToActiveLink);
  }

  /**
   * Basic debounce helper so resize handling doesn't run on every pixel change.
   * @param {Function} fn
   * @param {number} delay
   */
  function debounce(fn, delay) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  }

  /* ------------------------------------------------------------------ *
   * ONBOARDING — first-launch name capture.
   * Shown once; the saved name gates it out on every visit after.
   * ------------------------------------------------------------------ */
  const onboarding = document.getElementById('onboarding');
  const onboardingForm = document.getElementById('onboardingForm');
  const nameInput = document.getElementById('nameInput');
  const continueBtn = document.getElementById('continueBtn');
  const appShell = document.querySelector('.app');

  /** @returns {string|null} the saved user name, or null if none yet. */
  function getSavedName() {
    return Storage.get('userName', null);
  }

  /** Enables the Continue button only once there's real, trimmed input. */
  function updateContinueButtonState() {
    continueBtn.disabled = nameInput.value.trim().length === 0;
  }

  /**
   * Reveals the first-launch screen and locks interaction out of the app
   * shell behind it (both visually, via layering, and for assistive tech).
   */
  function showOnboarding() {
    onboarding.hidden = false;
    if (appShell) appShell.setAttribute('inert', '');
    // Slight delay so autofocus doesn't fight the fade-in animation.
    requestAnimationFrame(() => nameInput.focus());
  }

  /** Saves the name, then animates the first-launch screen away for good. */
  function completeOnboarding(name) {
    Storage.set('userName', name);
    Dashboard.renderGreeting();

    onboarding.classList.add('is-leaving');
    if (appShell) appShell.removeAttribute('inert');

    // Remove from the layout once the fade/scale transition finishes.
    window.setTimeout(() => {
      onboarding.hidden = true;
    }, 450); // matches --duration-slow
  }

  /** Wires up the onboarding form's input + submit behaviour. */
  function initOnboarding() {
    const savedName = getSavedName();

    if (savedName) {
      onboarding.hidden = true; // returning user: skip it entirely
      return;
    }

    showOnboarding();

    nameInput.addEventListener('input', updateContinueButtonState);

    onboardingForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = nameInput.value.trim();
      if (!name) return; // guarded by disabled button too, belt-and-braces
      completeOnboarding(name);
    });
  }

  /* ------------------------------------------------------------------ *
   * DATE KEYS — local (not UTC) yyyy-mm-dd keys, used to compare "days"
   * for streak and weekly-completion logic without timezone drift.
   * ------------------------------------------------------------------ */
  function toDateKey(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function addDays(date, amount) {
    const result = new Date(date);
    result.setDate(result.getDate() + amount);
    return result;
  }

  /** @returns {string} date key for the Monday that starts this date's week. */
  function getWeekStartKey(date) {
    const dayIndex = date.getDay(); // 0 = Sunday
    const daysSinceMonday = (dayIndex + 6) % 7;
    return toDateKey(addDays(date, -daysSinceMonday));
  }

  /* ------------------------------------------------------------------ *
   * WORKOUT LOGIC (Phase 4)
   * Two responsibilities: (1) map each weekday to its split, and
   * (2) map each split to the exercises that make it up. Together these
   * answer "what is today's workout" — Phase 5's Workout Screen renders
   * whatever this module returns, rather than owning any of this logic.
   * ------------------------------------------------------------------ */
  const WORKOUT_SPLIT_BY_DAY = [
    'REST', // Sunday
    'PUSH', // Monday
    'PULL', // Tuesday
    'LEGS', // Wednesday
    'PUSH', // Thursday
    'PULL', // Friday
    'LEGS', // Saturday
  ];

  const TRAINING_DAYS_PER_WEEK = WORKOUT_SPLIT_BY_DAY.filter((s) => s !== 'REST').length;

  /** @param {Date} [date] @returns {string} one of PUSH / PULL / LEGS / REST */
  function getTodaySplit(date = new Date()) {
    return WORKOUT_SPLIT_BY_DAY[date.getDay()];
  }

  /** Exercise definitions per split. targetReps is a range string, not a hard rule. */
  const EXERCISES_BY_SPLIT = {
    PUSH: [
      { id: 'push-01', name: 'Bench Press', targetSets: 4, targetReps: '6-8' },
      { id: 'push-02', name: 'Overhead Press', targetSets: 3, targetReps: '8-10' },
      { id: 'push-03', name: 'Incline Dumbbell Press', targetSets: 3, targetReps: '8-12' },
      { id: 'push-04', name: 'Lateral Raise', targetSets: 3, targetReps: '12-15' },
      { id: 'push-05', name: 'Tricep Pushdown', targetSets: 3, targetReps: '10-12' },
    ],
    PULL: [
      { id: 'pull-01', name: 'Deadlift', targetSets: 3, targetReps: '5-6' },
      { id: 'pull-02', name: 'Pull-Ups', targetSets: 3, targetReps: '6-10' },
      { id: 'pull-03', name: 'Barbell Row', targetSets: 3, targetReps: '8-10' },
      { id: 'pull-04', name: 'Face Pull', targetSets: 3, targetReps: '12-15' },
      { id: 'pull-05', name: 'Bicep Curl', targetSets: 3, targetReps: '10-12' },
    ],
    LEGS: [
      { id: 'legs-01', name: 'Back Squat', targetSets: 4, targetReps: '6-8' },
      { id: 'legs-02', name: 'Romanian Deadlift', targetSets: 3, targetReps: '8-10' },
      { id: 'legs-03', name: 'Leg Press', targetSets: 3, targetReps: '10-12' },
      { id: 'legs-04', name: 'Leg Curl', targetSets: 3, targetReps: '10-12' },
      { id: 'legs-05', name: 'Standing Calf Raise', targetSets: 4, targetReps: '12-15' },
    ],
    REST: [],
  };

  /** @param {string} split @returns {Array} exercise definitions for that split */
  function getExercisesForSplit(split) {
    return EXERCISES_BY_SPLIT[split] ?? [];
  }

  /**
   * Resolves the full workout for a given date: its split plus that
   * split's exercises. This is the one function later phases should call
   * rather than re-deriving split/exercise logic themselves.
   * @param {Date} [date]
   */
  function getTodaysWorkout(date = new Date()) {
    const split = getTodaySplit(date);
    return { split, exercises: getExercisesForSplit(split) };
  }

  /* ------------------------------------------------------------------ *
   * DASHBOARD — Home view: greeting, live clock, today's split,
   * quick stats, and the motivational quote.
   * ------------------------------------------------------------------ */
  const QUOTES = [
    { text: 'The only bad workout is the one that didn\u2019t happen.', author: 'Unknown' },
    { text: 'Discipline is choosing between what you want now and what you want most.', author: 'Abraham Lincoln' },
    { text: 'Strength doesn\u2019t come from what you can do. It comes from overcoming what you once couldn\u2019t.', author: 'Rikki Rogers' },
    { text: 'The body achieves what the mind believes.', author: 'Unknown' },
    { text: 'Small daily improvements are the key to staggering long-term results.', author: 'Unknown' },
    { text: 'Consistency is what transforms average into excellence.', author: 'Unknown' },
    { text: 'You don\u2019t have to be extreme, just consistent.', author: 'Unknown' },
  ];

  /** Picks a quote deterministically from the date, so it holds steady all day. */
  function getQuoteForToday(date = new Date()) {
    const start = new Date(date.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((date - start) / 86400000);
    return QUOTES[dayOfYear % QUOTES.length];
  }

  const dayFormatter = new Intl.DateTimeFormat(undefined, { weekday: 'long' });
  const dateFormatter = new Intl.DateTimeFormat(undefined, { month: 'long', day: 'numeric' });
  const clockFormatter = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' });

  const Dashboard = {
    els: {
      greeting: document.getElementById('greeting'),
      currentDay: document.getElementById('currentDay'),
      currentDate: document.getElementById('currentDate'),
      liveClock: document.getElementById('liveClock'),
      splitCard: document.getElementById('splitCard'),
      splitName: document.getElementById('splitName'),
      splitSub: document.getElementById('splitSub'),
      statStreak: document.getElementById('statStreak'),
      statCompleted: document.getElementById('statCompleted'),
      statLastWorkout: document.getElementById('statLastWorkout'),
      quoteText: document.getElementById('quoteText'),
      quoteAuthor: document.getElementById('quoteAuthor'),
      startWorkoutBtn: document.getElementById('startWorkoutBtn'),
    },

    /** Renders "Welcome back, {Name}" — falls back gracefully if unset. */
    renderGreeting() {
      const name = getSavedName();
      this.els.greeting.textContent = name ? `Welcome back, ${name}` : 'Welcome back';
    },

    /** Renders weekday + date once; the clock ticks separately every second. */
    renderDateAndDay(date = new Date()) {
      this.els.currentDay.textContent = dayFormatter.format(date);
      this.els.currentDate.textContent = dateFormatter.format(date);
    },

    renderClock(date = new Date()) {
      this.els.liveClock.textContent = clockFormatter.format(date);
    },

    /** Starts the live clock, ticking once a second. */
    startLiveClock() {
      this.renderClock();
      window.setInterval(() => this.renderClock(), 1000);
    },

    /** Renders today's split, with a visually calmer state for rest days. */
    renderSplit(date = new Date()) {
      const { split, exercises } = getTodaysWorkout(date);
      const isRest = split === 'REST';

      this.els.splitName.textContent = isRest ? 'REST DAY' : split;
      this.els.splitSub.textContent = isRest
        ? 'Recover today \u2014 you\u2019ve earned it.'
        : `${exercises.length} exercises scheduled`;

      this.els.splitCard.classList.toggle('is-rest', isRest);
      this.els.startWorkoutBtn.classList.toggle('is-rest', isRest);
      this.els.startWorkoutBtn.textContent = isRest ? 'No Workout Today' : 'Start Workout';
    },

    /** Reads whatever real progress exists in storage; defaults are honest zeros. */
    renderStats() {
      const streak = Storage.get('streak', 0);
      const completedThisWeek = Storage.get('completedThisWeek', 0);
      const lastWorkout = Storage.get('lastWorkout', null);

      this.els.statStreak.textContent = String(streak);
      this.els.statCompleted.textContent = `${completedThisWeek}/${TRAINING_DAYS_PER_WEEK}`;
      this.els.statLastWorkout.textContent = lastWorkout
        ? `${lastWorkout.split} \u2014 ${lastWorkout.dateLabel}`
        : 'No workouts yet';
    },

    renderQuote(date = new Date()) {
      const quote = getQuoteForToday(date);
      this.els.quoteText.textContent = `\u201C${quote.text}\u201D`;
      this.els.quoteAuthor.textContent = `\u2014 ${quote.author}`;
    },

    /** Full render pass; called on load and whenever the saved name changes. */
    renderAll() {
      const now = new Date();
      this.renderGreeting();
      this.renderDateAndDay(now);
      this.renderSplit(now);
      this.renderStats();
      this.renderQuote(now);
    },

    init() {
      this.renderAll();
      this.startLiveClock();

      // The Workout screen itself arrives in Phase 5; for now this just
      // takes the person to that tab using the existing nav logic.
      this.els.startWorkoutBtn.addEventListener('click', () => setActiveView('workout'));
    },
  };

  /* ------------------------------------------------------------------ *
   * WORKOUT SCREEN (Phase 5)
   * Renders today's exercises from the Workout Logic module, tracks a
   * live elapsed timer, and lets the person log weight/notes and check
   * exercises off. Persistence and the full summary belong to Phase 6 —
   * this module only owns the live interaction.
   * ------------------------------------------------------------------ */
  const WorkoutScreen = {
    els: {
      restState: document.getElementById('workoutRestState'),
      activeState: document.getElementById('workoutActiveState'),
      splitLabel: document.getElementById('workoutSplitLabel'),
      splitTitle: document.getElementById('workoutSplitTitle'),
      timerValue: document.getElementById('workoutTimer'),
      progressTrack: document.getElementById('progressTrack'),
      progressFill: document.getElementById('progressFill'),
      progressLabel: document.getElementById('progressLabel'),
      exerciseList: document.getElementById('exerciseList'),
      finishBtn: document.getElementById('finishWorkoutBtn'),
      summaryOverlay: document.getElementById('workoutSummary'),
      summarySplit: document.getElementById('summarySplit'),
      summaryDuration: document.getElementById('summaryDuration'),
      summaryExercises: document.getElementById('summaryExercises'),
      summaryCalories: document.getElementById('summaryCalories'),
      summaryDoneBtn: document.getElementById('summaryDoneBtn'),
    },

    // Rough average for resistance training; good enough for a personal estimate,
    // not a substitute for a heart-rate-based calculation.
    CALORIES_PER_MINUTE: 6.5,

    hasEntered: false, // guards against re-rendering / re-timing on every tab switch
    timerIntervalId: null,
    startTime: null,
    totalExercises: 0,
    currentSplit: null,

    /** Builds one exercise card as real DOM nodes (no innerHTML with data). */
    buildExerciseCard(exercise) {
      const li = document.createElement('li');
      li.className = 'card exercise-card';
      li.dataset.exerciseId = exercise.id;

      const top = document.createElement('div');
      top.className = 'exercise-card__top';

      const info = document.createElement('div');
      const name = document.createElement('p');
      name.className = 'exercise-card__name';
      name.textContent = exercise.name;
      const target = document.createElement('p');
      target.className = 'exercise-card__target';
      target.textContent = `${exercise.targetSets} sets \u00d7 ${exercise.targetReps} reps`;
      info.append(name, target);

      const checkWrap = document.createElement('div');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'exercise-card__checkbox';
      checkbox.id = `check-${exercise.id}`;
      const checkLabel = document.createElement('label');
      checkLabel.className = 'exercise-card__check-visual';
      checkLabel.setAttribute('for', checkbox.id);
      checkLabel.setAttribute('aria-label', `Mark ${exercise.name} complete`);
      checkLabel.innerHTML = '&#10003;'; // checkmark glyph, static markup only
      checkWrap.append(checkbox, checkLabel);

      top.append(info, checkWrap);

      const inputs = document.createElement('div');
      inputs.className = 'exercise-card__inputs';

      const weightLabel = document.createElement('label');
      const weightSpan = document.createElement('span');
      weightSpan.textContent = 'Weight (kg)';
      const weightInput = document.createElement('input');
      weightInput.type = 'number';
      weightInput.inputMode = 'decimal';
      weightInput.min = '0';
      weightInput.step = '0.5';
      weightInput.placeholder = '0';
      weightInput.className = 'exercise-card__weight';
      weightLabel.append(weightSpan, weightInput);

      const notesLabel = document.createElement('label');
      const notesSpan = document.createElement('span');
      notesSpan.textContent = 'Notes';
      const notesInput = document.createElement('input');
      notesInput.type = 'text';
      notesInput.maxLength = 80;
      notesInput.placeholder = 'Optional notes';
      notesInput.className = 'exercise-card__notes';
      notesLabel.append(notesSpan, notesInput);

      inputs.append(weightLabel, notesLabel);
      li.append(top, inputs);

      checkbox.addEventListener('change', () => this.updateProgress());

      return li;
    },

    /** Renders every exercise for today's split into the list. */
    renderExercises(exercises) {
      this.els.exerciseList.innerHTML = '';
      exercises.forEach((exercise) => {
        this.els.exerciseList.appendChild(this.buildExerciseCard(exercise));
      });
      this.totalExercises = exercises.length;
      this.updateProgress();
    },

    /** Recalculates the progress bar/label from however many boxes are checked. */
    updateProgress() {
      const checked = this.els.exerciseList.querySelectorAll(
        '.exercise-card__checkbox:checked'
      ).length;
      const percent = this.totalExercises === 0 ? 0 : Math.round((checked / this.totalExercises) * 100);

      this.els.progressFill.style.width = `${percent}%`;
      this.els.progressTrack.setAttribute('aria-valuenow', String(percent));
      this.els.progressLabel.textContent = `${checked} of ${this.totalExercises} exercises completed`;
    },

    /** Formats elapsed milliseconds as MM:SS, or H:MM:SS past the hour mark. */
    formatElapsed(ms) {
      const totalSeconds = Math.floor(ms / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      const pad = (n) => String(n).padStart(2, '0');

      return hours > 0
        ? `${hours}:${pad(minutes)}:${pad(seconds)}`
        : `${pad(minutes)}:${pad(seconds)}`;
    },

    /** Starts the live elapsed-time timer, ticking once a second. */
    startTimer() {
      this.startTime = Date.now();
      this.timerIntervalId = window.setInterval(() => {
        this.els.timerValue.textContent = this.formatElapsed(Date.now() - this.startTime);
      }, 1000);
    },

    stopTimer() {
      if (this.timerIntervalId) {
        window.clearInterval(this.timerIntervalId);
        this.timerIntervalId = null;
      }
    },

    /**
     * Persists this workout's result: updates the streak (only once per
     * calendar day), the weekly completion count (reset each Monday), and
     * the last-workout record the dashboard displays.
     */
    persistProgress({ split, exercisesCompleted, totalExercises, durationLabel }) {
      const now = new Date();
      const todayKey = toDateKey(now);
      const lastWorkoutDateKey = Storage.get('lastWorkoutDateKey', null);
      const isNewTrainingDay = lastWorkoutDateKey !== todayKey;

      if (isNewTrainingDay) {
        // Streak: only continues if the previous logged day was yesterday.
        const yesterdayKey = toDateKey(addDays(now, -1));
        const currentStreak = Storage.get('streak', 0);
        const nextStreak = lastWorkoutDateKey === yesterdayKey ? currentStreak + 1 : 1;
        Storage.set('streak', nextStreak);

        // Weekly completion: resets whenever we've crossed into a new Monday.
        const thisWeekStartKey = getWeekStartKey(now);
        const storedWeekStartKey = Storage.get('completedWeekStartKey', null);
        const priorCompleted = storedWeekStartKey === thisWeekStartKey
          ? Storage.get('completedThisWeek', 0)
          : 0;
        Storage.set('completedThisWeek', priorCompleted + 1);
        Storage.set('completedWeekStartKey', thisWeekStartKey);

        Storage.set('lastWorkoutDateKey', todayKey);
      }

      Storage.set('lastWorkout', {
        split,
        dateLabel: dateFormatter.format(now),
        durationLabel,
        exercisesCompleted,
        totalExercises,
      });
    },

    /** Ends the live workout: stops the timer, saves progress, shows the summary. */
    finishWorkout() {
      this.stopTimer();
      this.els.finishBtn.disabled = true;

      const durationMs = Date.now() - this.startTime;
      const durationLabel = this.formatElapsed(durationMs);
      const exercisesCompleted = this.els.exerciseList.querySelectorAll(
        '.exercise-card__checkbox:checked'
      ).length;
      const calories = Math.round((durationMs / 60000) * this.CALORIES_PER_MINUTE);

      this.persistProgress({
        split: this.currentSplit,
        exercisesCompleted,
        totalExercises: this.totalExercises,
        durationLabel,
      });

      this.els.summarySplit.textContent = this.currentSplit;
      this.els.summaryDuration.textContent = durationLabel;
      this.els.summaryExercises.textContent = `${exercisesCompleted}/${this.totalExercises}`;
      this.els.summaryCalories.textContent = String(calories);
      this.els.summaryOverlay.hidden = false;
    },

    /**
     * Called every time the Workout tab becomes active. Only does the real
     * setup work once per day's workout — repeat visits just leave things
     * exactly as the person left them.
     */
    onEnter() {
      const { split, exercises } = getTodaysWorkout();
      const isRest = split === 'REST';

      this.els.restState.hidden = !isRest;
      this.els.activeState.hidden = isRest;

      if (isRest || this.hasEntered) return;

      this.hasEntered = true;
      this.currentSplit = split;
      this.els.splitLabel.textContent = split;
      this.els.splitTitle.textContent = `${split.charAt(0)}${split.slice(1).toLowerCase()} Day`;
      this.renderExercises(exercises);
      this.startTimer();

      this.els.finishBtn.addEventListener('click', () => this.finishWorkout());
      this.els.summaryDoneBtn.addEventListener('click', () => {
        this.els.summaryOverlay.hidden = true;
        Dashboard.renderStats();
        setActiveView('home');
      });
    },
  };

  /** App entry point. */
  function init() {
    initOnboarding();
    initNavigation();
    Dashboard.init();
    // Position the indicator once layout has settled on first paint.
    // No need to wait for DOMContentLoaded: this script sits at the end of
    // <body>, so every element above it is already parsed and in the DOM.
    requestAnimationFrame(moveIndicatorToActiveLink);
  }

  init();
})();