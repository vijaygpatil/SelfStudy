# Study Time Tracking System - User Guide

## Overview

The Study Time Tracking System is designed to help parents monitor their children's daily study habits and ensure they meet their study goals. The system automatically tracks study sessions and provides detailed progress reports.

## Features

### 🎯 Daily Goal Tracking
- **Default Goal**: 1 hour (60 minutes) per day
- **Visual Progress**: Color-coded progress indicators
- **Real-time Updates**: Live tracking of current study session

### 📊 Comprehensive Reporting
- **Weekly Progress**: 7-day overview with goal achievement status
- **Study Statistics**: Total study time, session count, averages
- **Visual Charts**: Progress bars showing daily completion rates

### 🔄 Automatic Session Management
- **Auto-start**: Study sessions begin automatically when logging in
- **Smart Tracking**: Only sessions longer than 5 minutes are saved
- **Session Persistence**: Tracks time even if browser is refreshed
- **Page Visibility Tracking**: Timer automatically pauses when switching away from study website
- **Auto-Resume**: Timer resumes when returning to the study website

## How It Works

### For Students

1. **Login**: When you log into the study website, a study session automatically starts
2. **Study Tracker**: A floating widget appears in the bottom-right corner showing:
   - Today's progress toward the 1-hour goal
   - Current session time (if active)
   - Start/Stop study button
   - Report button

3. **Study Sessions**:
   - Click "Start Study" to begin a focused study session
   - Click "End Study" when finished
   - Sessions shorter than 5 minutes won't be saved

4. **Progress Tracking**: The tracker shows:
   - **Green**: Goal achieved (60+ minutes)
   - **Orange**: Halfway to goal (30-59 minutes)
   - **White**: Just started (0-29 minutes)

### For Parents

1. **Weekly Reports**: Click the "📊 Report" button to view:
   - **This Week Chart**: Visual progress for the last 7 days
   - **Daily Statistics**: Today's study time, weekly total
   - **Goal Achievement**: How many days the goal was met
   - **Session Analytics**: Average session length

2. **Progress Monitoring**: The report shows:
   - Color-coded daily progress bars
   - Exact study times for each day
   - Overall weekly performance metrics

## Study Tracker Interface

### Main Widget (Bottom-right corner)
```
📚 Study Tracker
Today: 45m / 1h
Current: 12m
[End Study] [📊 Report]
```

### Progress Report Modal
```
📊 Study Progress Report
For [Student Name]

This Week:
Mon ████████░░ 48m
Tue ██████████ 1h 5m
Wed ████░░░░░░ 24m
Thu ██████████ 1h 12m
Fri ███████░░░ 42m
Sat ░░░░░░░░░░ 0m
Sun ██████████ 1h 8m

Statistics:
Today: 45m    This Week: 5h 19m
Goals Met: 4/7    Avg Session: 28m
```

## Technical Details

### Data Storage
- **Local Storage**: All data is stored locally in the browser
- **Privacy**: No data is sent to external servers
- **Persistence**: Data survives browser restarts and computer reboots

### Session Rules
- **Minimum Duration**: 5 minutes (shorter sessions are discarded)
- **Auto-start**: Sessions begin when logging into study pages
- **Auto-end**: Sessions end when logging out or closing browser
- **Multiple Sessions**: Students can have multiple study sessions per day

### Time Tracking
- **Precision**: Tracks time to the minute
- **Real-time Updates**: Display updates every minute
- **Session Continuity**: Handles browser refreshes gracefully

## Setup Instructions

### For Existing Study Pages

Add these script tags to your HTML pages:

```html
<script src="../js/auth.js"></script>
<script src="../js/study-tracker.js"></script>
<script>
    // Initialize authentication and study tracking
    initAuth();
</script>
```

### For New Study Pages

1. Include the authentication and study tracker scripts
2. Call `initAuth()` to enable both authentication and study tracking
3. The study tracker will automatically appear for authenticated users

## Customization Options

### Changing Daily Goal
Edit the `defaultDailyGoal` in `js/study-tracker.js`:
```javascript
// Default daily goal in minutes
defaultDailyGoal: 60, // Change to desired minutes
```

### Minimum Session Time
Edit the `minSessionTime` in `js/study-tracker.js`:
```javascript
// Minimum session time to count (in minutes)
minSessionTime: 5, // Change to desired minimum
```

### Visual Styling
The study tracker uses inline CSS for portability, but you can customize:
- Colors and gradients
- Position and size
- Animation effects
- Font styles

## Data Export (Future Enhancement)

Currently, data is stored locally. Future versions could include:
- CSV export functionality
- Email reports to parents
- Cloud synchronization
- Historical data analysis

## Troubleshooting

### Study Tracker Not Appearing
1. Ensure both `auth.js` and `study-tracker.js` are loaded
2. Check that `initAuth()` is called after page load
3. Verify user is logged in successfully

### Time Not Tracking
1. Check browser's local storage permissions
2. Ensure JavaScript is enabled
3. Try refreshing the page and logging in again

### Data Loss
1. Data is stored locally - clearing browser data will reset progress
2. Each browser/device maintains separate data
3. Private/incognito mode may not persist data

## Benefits

### For Students
- **Motivation**: Visual progress encourages consistent study habits
- **Awareness**: Real-time feedback on study time
- **Goal Achievement**: Clear daily targets to work toward

### For Parents
- **Monitoring**: Easy oversight of study habits without being intrusive
- **Trends**: Weekly patterns help identify consistent vs. inconsistent study
- **Encouragement**: Data-driven conversations about study progress

### For Educators
- **Accountability**: Students take ownership of their study time
- **Insights**: Understanding of actual time spent on materials
- **Flexibility**: Works with any web-based study content

## Privacy & Security

- **Local Only**: All data stays on the student's device
- **No Tracking**: No external analytics or data collection
- **User Control**: Students can see exactly what data is being tracked
- **Transparent**: Open-source code allows full inspection

## Future Enhancements

1. **Subject-specific Tracking**: Track time per topic or subject
2. **Study Quality Metrics**: Track engagement and comprehension
3. **Parent Dashboard**: Dedicated interface for parents
4. **Mobile App**: Companion app for tracking offline study
5. **Gamification**: Badges, streaks, and achievements
6. **Social Features**: Study groups and peer comparison
7. **AI Insights**: Personalized study recommendations

---

*This study tracking system helps create accountability and awareness around study habits while respecting student privacy and autonomy.*
