// Common JavaScript for Study Guides

// Floating Image Panel JavaScript
let isDragging = false;
let isResizing = false;
let dragOffset = { x: 0, y: 0 };
let panel = null;
let panelHeader = null;
let resizeHandle = null;

document.addEventListener('DOMContentLoaded', function() {
    panel = document.getElementById('floatingImagePanel');
    panelHeader = document.getElementById('panelHeader');
    resizeHandle = document.getElementById('resizeHandle');

    if (panel && panelHeader && resizeHandle) {
        // Make panel draggable
        panelHeader.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);

        // Make panel resizable
        resizeHandle.addEventListener('mousedown', startResize);
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);
    }
});

function showImage(imageSrc, title) {
    const panel = document.getElementById('floatingImagePanel');
    const panelTitle = document.getElementById('panelTitle');
    const panelContent = document.getElementById('panelContent');
    
    if (panel && panelTitle && panelContent) {
        panelTitle.textContent = title;
        panelContent.innerHTML = `<img src="${imageSrc}" alt="${title}" style="width: 100%; height: auto; border-radius: 5px;">`;
        panel.style.display = 'block';
    }
}

function closeImagePanel() {
    const panel = document.getElementById('floatingImagePanel');
    if (panel) {
        panel.style.display = 'none';
    }
}

// Dragging functionality
function startDrag(e) {
    if (!panel) return;
    isDragging = true;
    const rect = panel.getBoundingClientRect();
    dragOffset.x = e.clientX - rect.left;
    dragOffset.y = e.clientY - rect.top;
    panelHeader.style.cursor = 'grabbing';
}

function drag(e) {
    if (!isDragging || !panel) return;
    
    const x = e.clientX - dragOffset.x;
    const y = e.clientY - dragOffset.y;
    
    // Keep panel within viewport
    const maxX = window.innerWidth - panel.offsetWidth;
    const maxY = window.innerHeight - panel.offsetHeight;
    
    panel.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
    panel.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
    panel.style.right = 'auto';
}

function stopDrag() {
    isDragging = false;
    if (panelHeader) {
        panelHeader.style.cursor = 'move';
    }
}

// Resizing functionality
function startResize(e) {
    isResizing = true;
    e.stopPropagation();
}

function resize(e) {
    if (!isResizing || !panel) return;
    
    const rect = panel.getBoundingClientRect();
    const newWidth = e.clientX - rect.left;
    const newHeight = e.clientY - rect.top;
    
    // Set minimum and maximum sizes
    const minWidth = 250;
    const minHeight = 200;
    const maxWidth = window.innerWidth * 0.8;
    const maxHeight = window.innerHeight * 0.8;
    
    if (newWidth >= minWidth && newWidth <= maxWidth) {
        panel.style.width = newWidth + 'px';
    }
    if (newHeight >= minHeight && newHeight <= maxHeight) {
        panel.style.height = newHeight + 'px';
    }
}

function stopResize() {
    isResizing = false;
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Press Escape to close panel
    if (e.key === 'Escape') {
        closeImagePanel();
    }
});

// Prevent text selection while dragging
document.addEventListener('selectstart', function(e) {
    if (isDragging || isResizing) {
        e.preventDefault();
    }
});

// Answer toggle functionality
function toggleAnswer(questionNumber) {
    const answer = document.getElementById('answer-' + questionNumber);
    const button = event.target;
    
    if (answer && button) {
        if (answer.classList.contains('show')) {
            answer.classList.remove('show');
            button.textContent = 'Show Answer';
            button.classList.remove('answered');
        } else {
            answer.classList.add('show');
            button.textContent = 'Hide Answer';
            button.classList.add('answered');
        }
    }
}

function showAllAnswers() {
    const answers = document.querySelectorAll('.answer');
    const buttons = document.querySelectorAll('.toggle-answer-btn');
    
    answers.forEach(answer => {
        answer.classList.add('show');
    });
    
    buttons.forEach(button => {
        button.textContent = 'Hide Answer';
        button.classList.add('answered');
    });
}

function hideAllAnswers() {
    const answers = document.querySelectorAll('.answer');
    const buttons = document.querySelectorAll('.toggle-answer-btn');
    
    answers.forEach(answer => {
        answer.classList.remove('show');
    });
    
    buttons.forEach(button => {
        button.textContent = 'Show Answer';
        button.classList.remove('answered');
    });
}

// Deep Dive toggle functionality (if needed)
function toggleDeepDive(questionNumber) {
    const deepDive = document.getElementById('deep-dive-' + questionNumber);
    const button = event.target;
    
    if (deepDive && button) {
        if (deepDive.classList.contains('show')) {
            deepDive.classList.remove('show');
            button.textContent = 'Deep Dive';
            button.classList.remove('expanded');
        } else {
            deepDive.classList.add('show');
            button.textContent = 'Hide Deep Dive';
            button.classList.add('expanded');
        }
    }
}
