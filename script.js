const mobileNav = document.getElementById('mobileNav');
const navToggle = document.getElementById('navToggle');
const resumeUpload = document.getElementById('resumeUpload');
const previewArea = document.getElementById('previewArea');
const pdfPreview = document.getElementById('pdfPreview');
const resumeDownload = document.getElementById('resumeDownload');
const projectsGrid = document.getElementById('projectsGrid');
const projectSelect = document.getElementById('projectSelect');
const projectTitle = document.getElementById('projectTitle');
const projectTag = document.getElementById('projectTag');
const projectDescription = document.getElementById('projectDescription');
const projectStack = document.getElementById('projectStack');
const projectDetailsPage = document.getElementById('projectDetailsPage');
const saveProjectButton = document.getElementById('saveProjectButton');
const addProjectButton = document.getElementById('addProjectButton');
const contactForm = document.getElementById('contactForm');
const contactStatus = document.getElementById('contactStatus');
const chatToggle = document.getElementById('chatToggle');
const chatWidget = document.getElementById('chatWidget');
const chatClose = document.getElementById('chatClose');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');
const chatPresets = document.getElementById('chatPresets');
const chatHistoryKey = 'portfolioChatHistory';

let projectData = [
  {
    title: 'Uplift Mission',
    tag: 'Nonprofit Website',
    description: 'Uplift Mission Incorporated mentors young men through leadership development, life-skills education, and community engagement. I helped create their website at upliftmissioninc.com.',
    stack: ['HTML', 'CSS', 'JavaScript', 'Community Impact'],
    detailsPage: 'project-uplift-mission.html'
  },
  {
    title: 'Capsule Scheduler',
    tag: 'University Tool',
    description: 'A smart semester planner that integrates deadlines, class sessions, and study sprints in one polished dashboard.',
    stack: ['JavaScript', 'CSS', 'API Design', 'Responsive UI'],
    detailsPage: 'project-capsule-scheduler.html'
  },
  {
    title: 'AI Study Companion',
    tag: 'Tech Demo',
    description: 'An interactive assistant for learning algorithms, offering code examples, explanations, and progress tracking.',
    stack: ['Python', 'Machine Learning', 'Flask', 'Data Visualization'],
    detailsPage: 'project-ai-study-companion.html'
  }
];

function loadProjectData() {
  const saved = localStorage.getItem('portfolioProjects');
  if (!saved) return;
  try {
    const storedProjects = JSON.parse(saved);
    if (Array.isArray(storedProjects) && storedProjects.length > 0) {
      projectData = storedProjects.filter(project => project.title !== 'RAMScode Coding Club' && project.title !== 'Resume Highlight');
    }
  } catch (error) {
    console.warn('Failed to load saved projects:', error);
  }
}

function saveProjectData() {
  localStorage.setItem('portfolioProjects', JSON.stringify(projectData));
}

function renderProjects() {
  if (!projectsGrid) return;
  projectsGrid.innerHTML = projectData.map(project => {
    const tags = project.stack.map(item => `<span>${item}</span>`).join('');
    return `
      <article class="project-card">
        <div class="project-tag"><span class="tag-dot"></span>${project.tag}</div>
        <h3 class="project-title">${project.title}</h3>
        <p class="project-description">${project.description}</p>
        <div class="project-stack">${tags}</div>
        <div class="project-actions">
          <a class="btn btn-link" href="${project.detailsPage}">View details</a>
        </div>
      </article>
    `;
  }).join('');
}

function populateProjectSelect() {
  if (!projectSelect || !projectData.length) return;
  projectSelect.innerHTML = projectData.map((project, index) => `
    <option value="${index}">${project.title}</option>
  `).join('');
  projectSelect.value = '0';
  fillProjectForm(0);
}

function fillProjectForm(index) {
  if (projectData[index]) {
    projectTitle.value = projectData[index].title;
    projectTag.value = projectData[index].tag;
    projectDescription.value = projectData[index].description;
    projectStack.value = projectData[index].stack.join(', ');
    projectDetailsPage.value = projectData[index].detailsPage;
  }
}

function resetProjectForm() {
  projectTitle.value = '';
  projectTag.value = '';
  projectDescription.value = '';
  projectStack.value = '';
  projectDetailsPage.value = '';
  projectSelect.selectedIndex = 0;
  fillProjectForm(0);
}

function createProjectFromForm() {
  return {
    title: projectTitle.value.trim() || 'Untitled Project',
    tag: projectTag.value.trim() || 'Project',
    description: projectDescription.value.trim() || 'No project description provided yet.',
    stack: projectStack.value.split(',').map(item => item.trim()).filter(Boolean),
    detailsPage: projectDetailsPage.value.trim() || `project-${projectTitle.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}.html`
  };
}

function handleProjectManager() {
  if (!projectSelect || !saveProjectButton || !addProjectButton) return;

  projectSelect.addEventListener('change', () => {
    fillProjectForm(Number(projectSelect.value));
  });

  saveProjectButton.addEventListener('click', () => {
    const index = Number(projectSelect.value);
    projectData[index] = createProjectFromForm();
    saveProjectData();
    renderProjects();
    populateProjectSelect();
    if (contactStatus) contactStatus.textContent = 'Project saved locally in the browser.';
  });

  addProjectButton.addEventListener('click', () => {
    projectData.push(createProjectFromForm());
    saveProjectData();
    renderProjects();
    populateProjectSelect();
    projectSelect.value = String(projectData.length - 1);
    if (contactStatus) contactStatus.textContent = 'Project added locally in the browser.';
  });
}

function handleContactForm() {
  if (!contactForm) return;

  contactForm.addEventListener('submit', event => {
    event.preventDefault();
    const name = contactForm.querySelector('[name="name"]').value.trim();
    const email = contactForm.querySelector('[name="email"]').value.trim();
    const message = contactForm.querySelector('[name="message"]').value.trim();
    const mailto = `mailto:bryantelicia54@gmail.com?subject=${encodeURIComponent('Portfolio message from ' + (name || 'visitor'))}&body=${encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + message)}`;

    contactStatus.textContent = 'Opening your email app so you can send this message directly.';
    contactStatus.classList.add('success');
    window.location.href = mailto;
    contactForm.reset();
  });
}

function appendChatMessage(content, sender = 'assistant') {
  if (!chatMessages) return;
  const message = document.createElement('div');
  message.className = `chat-message ${sender}`;
  message.textContent = content;
  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  saveChatHistory();
}

function saveChatHistory() {
  if (!chatMessages) return;
  const history = Array.from(chatMessages.children).map(node => ({
    sender: node.classList.contains('user') ? 'user' : 'assistant',
    text: node.textContent || ''
  }));
  localStorage.setItem(chatHistoryKey, JSON.stringify(history));
}

function loadChatHistory() {
  if (!chatMessages) return false;
  const saved = localStorage.getItem(chatHistoryKey);
  if (!saved) return false;

  try {
    const history = JSON.parse(saved);
    if (!Array.isArray(history) || history.length === 0) return false;
    chatMessages.innerHTML = '';
    history.forEach(entry => {
      const message = document.createElement('div');
      message.className = `chat-message ${entry.sender}`;
      message.textContent = entry.text;
      chatMessages.appendChild(message);
    });
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return true;
  } catch (error) {
    console.warn('Failed to load chat history:', error);
    return false;
  }
}

function getChatResponse(text) {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('project estimate') || lowerText.includes('estimate')) {
    return 'Project estimates depend on complexity, but a polished portfolio feature usually takes 1–2 weeks for design, development, and testing at this level of polish.';
  }
  if (lowerText.includes('skill')) {
    return 'My main skills include JavaScript, Python, Java, React, CSS, UI design, and project architecture.';
  }
  if (lowerText.includes('contact')) {
    return 'You can email me through the Contact page or use the GitHub link in the header for direct outreach.';
  }
  if (lowerText.includes('resume')) {
    return 'The resume section includes a downloadable PDF, preview support, and a simple workspace-style resume manager.';
  }
  if (lowerText.includes('tour') || lowerText.includes('workspace') || lowerText.includes('guide')) {
    return 'Use the Projects section for demos, Skills to see my expertise, Resume to download the PDF, and Contact for direct communication.';
  }
  return 'Nice question! You can scroll to Projects, Skills, or Resume to learn more about this portfolio.';
}

function processChatInput(text) {
  if (!text) return;
  appendChatMessage(text, 'user');
  const reply = getChatResponse(text);
  setTimeout(() => appendChatMessage(reply, 'assistant'), 700);
}

function handleChatWidget() {
  if (!chatToggle || !chatWidget || !chatClose || !chatForm || !chatInput || !chatMessages || !chatPresets) return;

  const hadHistory = loadChatHistory();
  if (!hadHistory) {
    saveChatHistory();
  }

  chatToggle.addEventListener('click', () => {
    chatWidget.classList.toggle('hidden');
    if (!chatWidget.classList.contains('hidden')) {
      chatInput.focus();
    }
  });

  chatClose.addEventListener('click', () => {
    chatWidget.classList.add('hidden');
  });

  chatPresets.addEventListener('click', event => {
    if (event.target.tagName !== 'BUTTON') return;
    const text = event.target.textContent.trim();
    processChatInput(text);
  });

  chatForm.addEventListener('submit', event => {
    event.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;
    processChatInput(text);
    chatInput.value = '';
  });
}

function handleMobileNav() {
  if (!mobileNav) return;
  navToggle.addEventListener('click', () => {
    mobileNav.classList.toggle('show-mobile');
  });
  mobileNav.addEventListener('click', event => {
    if (event.target.tagName === 'A') {
      mobileNav.classList.remove('show-mobile');
    }
  });
}

function handleResumeUpload() {
  if (!resumeUpload) return;
  resumeUpload.addEventListener('change', event => {
    const file = event.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    pdfPreview.innerHTML = `<iframe src="${url}" frameborder="0" width="100%" height="100%"></iframe>`;
    previewArea.querySelector('.preview-note')?.remove();
    resumeDownload.href = url;
    resumeDownload.download = file.name;
    resumeDownload.textContent = 'Open Uploaded Resume';
  });
}

function setupScrollReveal() {
  const revealTargets = document.querySelectorAll('.section, .project-card, .glass-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'none';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach(target => {
    target.style.opacity = '0';
    target.style.transform = 'translateY(24px)';
    target.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
    observer.observe(target);
  });
}

loadProjectData();
if (projectsGrid) {
  renderProjects();
}
populateProjectSelect();
handleProjectManager();
handleMobileNav();
handleResumeUpload();
handleContactForm();
handleChatWidget();
setupScrollReveal();
