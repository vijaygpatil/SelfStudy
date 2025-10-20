// Study Time Tracking System for Solar System Self Study
// Tracks daily study sessions and provides progress reports

// Configuration
const STUDY_TRACKER_CONFIG = {
    // Storage keys
    storageKeys: {
        studySessions: 'sss_study_sessions',
        dailyGoal: 'sss_daily_goal',
        currentSession: 'sss_current_session',
        pausedSession: 'sss_paused_session'
    },

    // Default daily goal in minutes
    defaultDailyGoal: 60, // 1 hour

    // Minimum session time to count (in minutes)
    minSessionTime: 5,

    // Page visibility tracking
    isPageVisible: true,
    pausedTime: 0
};

/**
 * Get today's date as a string (YYYY-MM-DD)
 * @returns {string} - Today's date
 */
function getTodayString() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

/**
 * Get all study sessions from localStorage
 * @returns {Object} - Object with dates as keys and session arrays as values
 */
function getAllStudySessions() {
    const sessions = localStorage.getItem(STUDY_TRACKER_CONFIG.storageKeys.studySessions);
    return sessions ? JSON.parse(sessions) : {};
}

/**
 * Save study sessions to localStorage
 * @param {Object} sessions - Sessions object to save
 */
function saveStudySessions(sessions) {
    localStorage.setItem(STUDY_TRACKER_CONFIG.storageKeys.studySessions, JSON.stringify(sessions));
}

/**
 * Pause the current study session
 */
function pauseStudySession() {
    if (!isInStudySession()) return;

    const pauseTime = new Date().getTime();
    const pausedData = {
        pauseTime: pauseTime,
        totalPausedTime: STUDY_TRACKER_CONFIG.pausedTime
    };

    localStorage.setItem(STUDY_TRACKER_CONFIG.storageKeys.pausedSession, JSON.stringify(pausedData));
    console.log('Study session paused at:', new Date(pauseTime));
}

/**
 * Resume the current study session
 */
function resumeStudySession() {
    const pausedSessionStr = localStorage.getItem(STUDY_TRACKER_CONFIG.storageKeys.pausedSession);
    if (!pausedSessionStr) return;

    const pausedData = JSON.parse(pausedSessionStr);
    const resumeTime = new Date().getTime();
    const pauseDuration = resumeTime - pausedData.pauseTime;

    // Add this pause duration to total paused time
    STUDY_TRACKER_CONFIG.pausedTime = pausedData.totalPausedTime + pauseDuration;

    // Remove paused session marker
    localStorage.removeItem(STUDY_TRACKER_CONFIG.storageKeys.pausedSession);

    console.log('Study session resumed. Paused for:', Math.round(pauseDuration / (1000 * 60)), 'minutes');
}

/**
 * Check if session is currently paused
 */
function isSessionPaused() {
    return localStorage.getItem(STUDY_TRACKER_CONFIG.storageKeys.pausedSession) !== null;
}

/**
 * Start a new study session
 */
function startStudySession() {
    const startTime = new Date().getTime();
    const sessionData = {
        startTime: startTime,
        date: getTodayString(),
        username: getCurrentUser()
    };

    // Reset paused time for new session
    STUDY_TRACKER_CONFIG.pausedTime = 0;

    localStorage.setItem(STUDY_TRACKER_CONFIG.storageKeys.currentSession, JSON.stringify(sessionData));
    console.log('Study session started at:', new Date(startTime));
}

/**
 * End the current study session
 * @returns {number} - Duration of the session in minutes
 */
function endStudySession() {
    const currentSessionStr = localStorage.getItem(STUDY_TRACKER_CONFIG.storageKeys.currentSession);

    if (!currentSessionStr) {
        console.log('No active study session found');
        return 0;
    }

    const currentSession = JSON.parse(currentSessionStr);
    const endTime = new Date().getTime();
    const duration = Math.round((endTime - currentSession.startTime) / (1000 * 60)); // Convert to minutes

    // Only save sessions longer than minimum time
    if (duration >= STUDY_TRACKER_CONFIG.minSessionTime) {
        const sessions = getAllStudySessions();
        const today = getTodayString();

        if (!sessions[today]) {
            sessions[today] = [];
        }

        sessions[today].push({
            startTime: currentSession.startTime,
            endTime: endTime,
            duration: duration,
            username: currentSession.username
        });

        saveStudySessions(sessions);
        console.log(`Study session ended. Duration: ${duration} minutes`);
    } else {
        console.log(`Session too short (${duration} minutes). Not saved.`);
    }

    // Clear current session
    localStorage.removeItem(STUDY_TRACKER_CONFIG.storageKeys.currentSession);

    return duration;
}

/**
 * Get today's total study time in minutes
 * @returns {number} - Total minutes studied today
 */
function getTodayStudyTime() {
    const sessions = getAllStudySessions();
    const today = getTodayString();
    const todaySessions = sessions[today] || [];

    return todaySessions.reduce((total, session) => total + session.duration, 0);
}

/**
 * Get study time for a specific date
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {number} - Total minutes studied on that date
 */
function getStudyTimeForDate(date) {
    const sessions = getAllStudySessions();
    const dateSessions = sessions[date] || [];

    return dateSessions.reduce((total, session) => total + session.duration, 0);
}

/**
 * Get study progress for the last 7 days
 * @returns {Array} - Array of objects with date and study time
 */
function getWeeklyProgress() {
    const progress = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        const studyTime = getStudyTimeForDate(dateString);

        progress.push({
            date: dateString,
            dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
            studyTime: studyTime,
            goalMet: studyTime >= STUDY_TRACKER_CONFIG.defaultDailyGoal
        });
    }

    return progress;
}

/**
 * Get study statistics
 * @returns {Object} - Object with various statistics
 */
function getStudyStatistics() {
    const sessions = getAllStudySessions();
    const weeklyProgress = getWeeklyProgress();

    let totalStudyTime = 0;
    let totalSessions = 0;
    let daysStudied = 0;

    Object.keys(sessions).forEach(date => {
        const dayTotal = sessions[date].reduce((total, session) => total + session.duration, 0);
        totalStudyTime += dayTotal;
        totalSessions += sessions[date].length;
        if (dayTotal > 0) daysStudied++;
    });

    const weeklyTotal = weeklyProgress.reduce((total, day) => total + day.studyTime, 0);
    const daysGoalMet = weeklyProgress.filter(day => day.goalMet).length;

    return {
        totalStudyTime: totalStudyTime,
        totalSessions: totalSessions,
        daysStudied: daysStudied,
        weeklyTotal: weeklyTotal,
        daysGoalMet: daysGoalMet,
        averageSessionLength: totalSessions > 0 ? Math.round(totalStudyTime / totalSessions) : 0,
        todayStudyTime: getTodayStudyTime()
    };
}

/**
 * Format minutes into hours and minutes
 * @param {number} minutes - Minutes to format
 * @returns {string} - Formatted time string
 */
function formatStudyTime(minutes) {
    if (minutes === 0) return '0 min';

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) {
        return `${mins} min`;
    } else if (mins === 0) {
        return `${hours}h`;
    } else {
        return `${hours}h ${mins}m`;
    }
}

/**
 * Check if currently in a study session
 * @returns {boolean} - True if in active session
 */
function isInStudySession() {
    return localStorage.getItem(STUDY_TRACKER_CONFIG.storageKeys.currentSession) !== null;
}

/**
 * Get current session duration in minutes (excluding paused time)
 * @returns {number} - Current session duration in minutes
 */
function getCurrentSessionDuration() {
    const currentSessionStr = localStorage.getItem(STUDY_TRACKER_CONFIG.storageKeys.currentSession);

    if (!currentSessionStr) {
        return 0;
    }

    const currentSession = JSON.parse(currentSessionStr);
    const currentTime = new Date().getTime();
    let totalDuration = Math.round((currentTime - currentSession.startTime) / (1000 * 60));

    // Subtract total paused time
    let totalPausedMinutes = Math.round(STUDY_TRACKER_CONFIG.pausedTime / (1000 * 60));

    // If currently paused, add current pause duration
    if (isSessionPaused()) {
        const pausedSessionStr = localStorage.getItem(STUDY_TRACKER_CONFIG.storageKeys.pausedSession);
        if (pausedSessionStr) {
            const pausedData = JSON.parse(pausedSessionStr);
            const currentPauseDuration = currentTime - pausedData.pauseTime;
            totalPausedMinutes += Math.round(currentPauseDuration / (1000 * 60));
        }
    }

    return Math.max(0, totalDuration - totalPausedMinutes);
}

/**
 * Get current session duration in seconds (excluding paused time)
 * @returns {number} - Current session duration in seconds
 */
function getCurrentSessionDurationInSeconds() {
    const currentSessionStr = localStorage.getItem(STUDY_TRACKER_CONFIG.storageKeys.currentSession);

    if (!currentSessionStr) {
        return 0;
    }

    const currentSession = JSON.parse(currentSessionStr);
    const currentTime = new Date().getTime();
    let totalDurationSeconds = Math.floor((currentTime - currentSession.startTime) / 1000);

    // Subtract total paused time in seconds
    let totalPausedSeconds = Math.floor(STUDY_TRACKER_CONFIG.pausedTime / 1000);

    // If currently paused, add current pause duration
    if (isSessionPaused()) {
        const pausedSessionStr = localStorage.getItem(STUDY_TRACKER_CONFIG.storageKeys.pausedSession);
        if (pausedSessionStr) {
            const pausedData = JSON.parse(pausedSessionStr);
            const currentPauseDuration = currentTime - pausedData.pauseTime;
            totalPausedSeconds += Math.floor(currentPauseDuration / 1000);
        }
    }

    return Math.max(0, totalDurationSeconds - totalPausedSeconds);
}

/**
 * Format seconds into minutes:seconds format for current session display
 * @param {number} totalSeconds - Total seconds to format
 * @returns {string} - Formatted time string (MM:SS)
 */
function formatCurrentSessionTime(totalSeconds) {
    if (totalSeconds === 0) return '0:00';

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // Pad seconds with leading zero if needed
    const paddedSeconds = seconds.toString().padStart(2, '0');

    return `${minutes}:${paddedSeconds}`;
}

/**
 * Add study tracker UI to a page
 * @param {string} containerId - ID of container to add tracker to
 */
function addStudyTracker(containerId = 'header') {
    const container = document.querySelector(`.${containerId}`) || document.querySelector(`#${containerId}`) || document.body;

    if (!container) {
        console.warn('Could not find container for study tracker');
        return;
    }

    // Create study tracker container
    const trackerContainer = document.createElement('div');
    trackerContainer.className = 'study-tracker';
    trackerContainer.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px;
        border-radius: 15px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        font-family: Arial, sans-serif;
        font-size: 14px;
        z-index: 1000;
        min-width: 250px;
    `;

    // Create tracker content
    const trackerContent = document.createElement('div');
    trackerContent.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 10px; text-align: center;">
            📚 Study Tracker
        </div>
        <div id="study-stats" style="margin-bottom: 10px;">
            <div>Today: <span id="today-time">0 min</span> / 1h</div>
            <div id="current-session" style="display: none;">
                Current: <span id="session-time">0 min</span>
            </div>
        </div>
        <div style="text-align: center;">
            <button id="study-toggle" style="
                background: #4CAF50;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 20px;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.3s ease;
            ">Start Study</button>
            <button id="study-report" style="
                background: #2196F3;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 20px;
                cursor: pointer;
                font-weight: bold;
                margin-left: 5px;
                transition: all 0.3s ease;
            ">📊 Report</button>
        </div>
    `;

    trackerContainer.appendChild(trackerContent);
    document.body.appendChild(trackerContainer);

    // Add event listeners
    const toggleBtn = document.getElementById('study-toggle');
    const reportBtn = document.getElementById('study-report');

    toggleBtn.addEventListener('click', toggleStudySession);
    reportBtn.addEventListener('click', showStudyReport);

    // Update display
    updateStudyDisplay();

    // Update every second for real-time current session display
    setInterval(updateStudyDisplay, 1000);
}

/**
 * Toggle study session (start/stop)
 */
function toggleStudySession() {
    if (isInStudySession()) {
        const duration = endStudySession();
        if (duration >= STUDY_TRACKER_CONFIG.minSessionTime) {
            alert(`Study session completed! You studied for ${formatStudyTime(duration)}.`);
        } else {
            alert(`Session was too short (${formatStudyTime(duration)}). Try studying for at least ${STUDY_TRACKER_CONFIG.minSessionTime} minutes.`);
        }
    } else {
        startStudySession();
        alert('Study session started! Good luck with your studies! 📚');
    }
    updateStudyDisplay();
}

/**
 * Update the study tracker display
 */
function updateStudyDisplay() {
    const todayTimeEl = document.getElementById('today-time');
    const sessionTimeEl = document.getElementById('session-time');
    const currentSessionEl = document.getElementById('current-session');
    const toggleBtn = document.getElementById('study-toggle');
    const trackerContainer = document.querySelector('.study-tracker');

    if (!todayTimeEl) return;

    const todayTime = getTodayStudyTime();
    todayTimeEl.textContent = formatStudyTime(todayTime);

    if (isInStudySession()) {
        const sessionDurationSeconds = getCurrentSessionDurationInSeconds();
        const sessionTimeFormatted = formatCurrentSessionTime(sessionDurationSeconds);
        sessionTimeEl.textContent = sessionTimeFormatted;
        currentSessionEl.style.display = 'block';
        toggleBtn.textContent = 'End Study';
        toggleBtn.style.background = '#f44336';

        // Update display based on paused state
        if (isSessionPaused()) {
            sessionTimeEl.textContent = sessionTimeFormatted + ' ⏸️';
            trackerContainer.style.background = 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)';
            currentSessionEl.innerHTML = 'Current: <span id="session-time">' + sessionTimeFormatted + ' ⏸️</span> (Paused - Switch back to continue)';
        } else {
            trackerContainer.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            currentSessionEl.innerHTML = 'Current: <span id="session-time">' + sessionTimeFormatted + '</span>';
        }
    } else {
        currentSessionEl.style.display = 'none';
        toggleBtn.textContent = 'Start Study';
        toggleBtn.style.background = '#4CAF50';
        trackerContainer.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }

    // Update progress color
    const progressPercent = (todayTime / STUDY_TRACKER_CONFIG.defaultDailyGoal) * 100;
    if (progressPercent >= 100) {
        todayTimeEl.style.color = '#4CAF50';
        todayTimeEl.style.fontWeight = 'bold';
    } else if (progressPercent >= 50) {
        todayTimeEl.style.color = '#FF9800';
    } else {
        todayTimeEl.style.color = 'white';
    }
}

/**
 * Show study report modal
 */
function showStudyReport() {
    const stats = getStudyStatistics();
    const weeklyProgress = getWeeklyProgress();

    // Create modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 15px;
        max-width: 500px;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    `;

    // Generate weekly progress chart
    let weeklyChart = '';
    weeklyProgress.forEach(day => {
        const percentage = Math.min((day.studyTime / STUDY_TRACKER_CONFIG.defaultDailyGoal) * 100, 100);
        const color = day.goalMet ? '#4CAF50' : (percentage >= 50 ? '#FF9800' : '#f44336');

        weeklyChart += `
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <div style="width: 40px; font-size: 12px;">${day.dayName}</div>
                <div style="flex: 1; background: #eee; height: 20px; border-radius: 10px; margin: 0 10px; overflow: hidden;">
                    <div style="width: ${percentage}%; height: 100%; background: ${color}; transition: width 0.3s ease;"></div>
                </div>
                <div style="width: 60px; font-size: 12px; text-align: right;">${formatStudyTime(day.studyTime)}</div>
            </div>
        `;
    });

    modalContent.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #333; margin: 0;">📊 Study Progress Report</h2>
            <p style="color: #666; margin: 5px 0;">For ${getCurrentUser()}</p>
        </div>

        <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 10px 0; color: #333;">This Week</h3>
            ${weeklyChart}
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
            <div style="background: #e3f2fd; padding: 15px; border-radius: 10px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #1976d2;">${formatStudyTime(stats.todayStudyTime)}</div>
                <div style="font-size: 12px; color: #666;">Today</div>
            </div>
            <div style="background: #f3e5f5; padding: 15px; border-radius: 10px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #7b1fa2;">${formatStudyTime(stats.weeklyTotal)}</div>
                <div style="font-size: 12px; color: #666;">This Week</div>
            </div>
            <div style="background: #e8f5e8; padding: 15px; border-radius: 10px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #388e3c;">${stats.daysGoalMet}/7</div>
                <div style="font-size: 12px; color: #666;">Goals Met</div>
            </div>
            <div style="background: #fff3e0; padding: 15px; border-radius: 10px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #f57c00;">${formatStudyTime(stats.averageSessionLength)}</div>
                <div style="font-size: 12px; color: #666;">Avg Session</div>
            </div>
        </div>

        <div style="text-align: center;">
            <button onclick="this.parentElement.parentElement.parentElement.remove()" style="
                background: #2196F3;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 25px;
                cursor: pointer;
                font-weight: bold;
            ">Close Report</button>
        </div>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

/**
 * Handle page visibility changes
 */
function handleVisibilityChange() {
    if (document.hidden) {
        // Page is now hidden (user switched away)
        if (isInStudySession() && !isSessionPaused()) {
            STUDY_TRACKER_CONFIG.isPageVisible = false;
            pauseStudySession();
            updateStudyDisplay();
            console.log('Page hidden - study session paused');
        }
    } else {
        // Page is now visible (user switched back)
        if (isInStudySession() && isSessionPaused()) {
            STUDY_TRACKER_CONFIG.isPageVisible = true;
            resumeStudySession();
            updateStudyDisplay();
            console.log('Page visible - study session resumed');
        }
    }
}

/**
 * Initialize study tracker
 */
function initStudyTracker() {
    // Auto-start session when user logs in (if not already in session)
    if (!isInStudySession()) {
        startStudySession();
    }

    // Add study tracker UI
    addStudyTracker();

    // Set up page visibility tracking
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Also handle window focus/blur as backup
    window.addEventListener('focus', () => {
        if (isInStudySession() && isSessionPaused()) {
            STUDY_TRACKER_CONFIG.isPageVisible = true;
            resumeStudySession();
            updateStudyDisplay();
        }
    });

    window.addEventListener('blur', () => {
        if (isInStudySession() && !isSessionPaused()) {
            STUDY_TRACKER_CONFIG.isPageVisible = false;
            pauseStudySession();
            updateStudyDisplay();
        }
    });

    console.log('Study tracker initialized with page visibility tracking');
}

// Auto-end session when user logs out or session expires
window.addEventListener('beforeunload', () => {
    if (isInStudySession()) {
        endStudySession();
    }
});

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        startStudySession,
        endStudySession,
        getTodayStudyTime,
        getWeeklyProgress,
        getStudyStatistics,
        initStudyTracker,
        formatStudyTime,
        isInStudySession
    };
}
