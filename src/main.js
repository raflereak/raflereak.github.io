// All portfolio facts come from the supplied CV, except the current HwaljaLab
// role, which was supplied directly by Taehun. Project art is conceptual.
const projects = {
  rag: {
    en: { title: 'RAG Report System', type: 'AI SYSTEM / 2024', description: 'A comprehensive report-writing system for an external organization, using large language models and retrieval-augmented generation. I was responsible for the integrated development of the system.', facts: [['Role', 'End-to-end system development'], ['Period', 'February – September 2024'], ['Organization', 'External organization'], ['Focus', 'LLMs · Retrieval-augmented generation · Report writing']] },
    ko: { title: 'RAG 종합보고서 시스템', type: 'AI 시스템 / 2024', description: '외부기관을 위해 LLM과 검색 증강 생성(RAG)을 활용한 종합보고서 작성 시스템을 개발했습니다. 시스템 종합 개발을 담당했습니다.', facts: [['역할', '시스템 종합 개발'], ['기간', '2024년 2월 – 9월'], ['기관', '외부기관'], ['주요 분야', 'LLM · 검색 증강 생성(RAG) · 보고서 작성']] },
  },
  workme: {
    en: { title: 'WorkMe', type: 'LLM WEB SERVICE / AM', description: 'An LLM solution web service at startup AM. I joined the project as CTO and developer, working on the technology and its implementation.', facts: [['Role', 'CTO & Developer'], ['Started', 'December 2023'], ['Organization', 'Startup AM'], ['Focus', 'LLM solutions · Web service development']] },
    ko: { title: 'WorkMe', type: 'LLM 웹서비스 / AM', description: '스타트업 AM에서 개발한 LLM 솔루션 웹서비스입니다. CTO·개발자로 참여해 기술과 서비스 구현을 담당했습니다.', facts: [['역할', 'CTO · 개발자'], ['시작', '2023년 12월'], ['소속', '스타트업 AM'], ['주요 분야', 'LLM 솔루션 · 웹서비스 개발']] },
  },
  maque: {
    en: { title: 'MaQue — Adaptive Game Systems', type: 'REINFORCEMENT LEARNING / GAME SYSTEMS', description: 'MaQue1st and MaQue2st explore demand-responsive, reinforcement-learning-based game systems. This work connects with my 2023 paper on the influence of a central manager in real-time adaptive quest generation.', facts: [['MaQue1st', 'September – December 2022'], ['MaQue2st', 'February – June 2023 · Developer'], ['Organization', 'Sunmoon University'], ['Focus', 'Reinforcement learning · Responsive game systems · Quest generation']] },
    ko: { title: 'MaQue — 반응형 게임 시스템', type: '강화학습 / 게임 시스템', description: 'MaQue1st와 MaQue2st는 강화학습 기반의 수요 반응형 게임 시스템을 탐구한 프로젝트입니다. 2023년에는 실시간 반응형 퀘스트 생성에서 중앙 관리자의 영향력을 연구한 논문을 발표했습니다.', facts: [['MaQue1st', '2022년 9월 – 12월'], ['MaQue2st', '2023년 2월 – 6월 · 개발자'], ['소속', '선문대학교'], ['주요 분야', '강화학습 · 반응형 게임 시스템 · 퀘스트 생성']] },
  },
  corpus: {
    en: { title: 'NIA Corpus Data Project', type: 'LANGUAGE DATA / UNIVA', description: 'Participated as a developer in the NIA corpus data construction project at UNIVA.', facts: [['Role', 'Developer'], ['Period', 'June – December 2023'], ['Organization', 'UNIVA'], ['Focus', 'Corpus data construction']] },
    ko: { title: 'NIA 말뭉치 데이터 구축', type: '언어 데이터 / UNIVA', description: 'UNIVA에서 진행한 NIA 말뭉치 데이터 구축 프로젝트에 개발자로 참여했습니다.', facts: [['역할', '개발자'], ['기간', '2023년 6월 – 12월'], ['소속', 'UNIVA'], ['주요 분야', '말뭉치 데이터 구축']] },
  },
};

let language = 'en';
let openProject = null;
let returnFocus = null;
let toastTimeout;
const dialog = document.querySelector('#project-dialog');
const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');

function updateDialog() {
  if (!openProject) return;
  const project = projects[openProject][language];
  document.querySelector('#dialog-title').textContent = project.title;
  document.querySelector('#dialog-eyebrow').textContent = project.type;
  document.querySelector('#dialog-description').textContent = project.description;
  const facts = document.querySelector('#dialog-facts');
  facts.replaceChildren(...project.facts.map(([label, value]) => {
    const row = document.createElement('div');
    const dt = document.createElement('dt');
    const dd = document.createElement('dd');
    dt.textContent = label;
    dd.textContent = value;
    row.append(dt, dd);
    return row;
  }));
}

function setLanguage(nextLanguage) {
  language = nextLanguage === 'ko' ? 'ko' : 'en';
  document.documentElement.lang = language;
  document.querySelectorAll('[data-en][data-ko]').forEach(element => {
    element.textContent = element.dataset[language];
  });
  document.querySelectorAll('[data-aria-en][data-aria-ko]').forEach(element => {
    element.setAttribute('aria-label', element.getAttribute(`data-aria-${language}`));
  });
  document.querySelectorAll('[data-language]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.language === language));
  });
  document.title = language === 'ko'
    ? '김태훈 — HwaljaLab CTO · AI 개발자 & 연구자'
    : 'Taehun Kim — AI, with a human perspective';
  document.querySelector('meta[name="description"]').content = language === 'ko'
    ? 'HwaljaLab CTO · 메인 개발자 김태훈. 사람과 AI의 상호작용을 연구하고, LLM·RAG·에이전트 기술을 실제 시스템으로 연결합니다.'
    : 'Taehun Kim — CTO & Lead Developer at HwaljaLab. Building AI systems with a human perspective, from LLM agents and RAG to interactive experiences.';
  updateDialog();
  updateMenuLabel();
  try { localStorage.setItem('portfolio-language', language); } catch { /* Reading works without storage. */ }
}

function updateMenuLabel() {
  const expanded = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-label', language === 'ko'
    ? (expanded ? '메뉴 닫기' : '메뉴 열기')
    : (expanded ? 'Close menu' : 'Open menu'));
}

function setMenu(expanded) {
  mobileNav.hidden = !expanded;
  menuButton.setAttribute('aria-expanded', String(expanded));
  updateMenuLabel();
}

document.querySelectorAll('[data-language]').forEach(button => {
  button.addEventListener('click', () => setLanguage(button.dataset.language));
});
menuButton.addEventListener('click', () => setMenu(mobileNav.hidden));
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !mobileNav.hidden) {
    setMenu(false);
    menuButton.focus();
  }
});
document.addEventListener('click', event => {
  if (!mobileNav.hidden && !event.target.closest('.site-header')) setMenu(false);
});
window.matchMedia('(min-width: 621px)').addEventListener('change', event => {
  if (event.matches) setMenu(false);
});

document.querySelectorAll('[data-project]').forEach(button => {
  button.addEventListener('click', () => {
    openProject = button.dataset.project;
    returnFocus = button;
    updateDialog();
    dialog.showModal();
    document.body.classList.add('dialog-open');
  });
});
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target === dialog) {
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  }
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  openProject = null;
  returnFocus?.focus({ preventScroll: true });
});

function showToast(message) {
  const toast = document.querySelector('#toast');
  clearTimeout(toastTimeout);
  toast.textContent = message;
  toast.classList.add('visible');
  toastTimeout = setTimeout(() => toast.classList.remove('visible'), 3500);
}
document.querySelector('.copy-email').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText('raflereak@gmail.com');
    showToast(language === 'ko' ? '이메일 주소를 복사했습니다.' : 'Email address copied.');
  } catch {
    showToast(language === 'ko' ? '이메일 주소를 직접 복사해 주세요: raflereak@gmail.com' : 'Please copy the address: raflereak@gmail.com');
  }
});

// Wireframe torus: a small, original vector illustration of connected systems.
// No canvas, image service, network calls, or continuous animation is needed.
function drawField() {
  const ns = 'http://www.w3.org/2000/svg';
  const group = document.querySelector('#field-lines');
  const rings = [];
  function project(u, v) {
    const radius = 114 + 46 * Math.cos(v);
    const x = radius * Math.cos(u);
    const y = radius * Math.sin(u);
    const z = 46 * Math.sin(v);
    const ax = 1.06;
    const az = -.56;
    const y1 = y * Math.cos(ax) - z * Math.sin(ax);
    const z1 = y * Math.sin(ax) + z * Math.cos(ax);
    const x2 = x * Math.cos(az) - y1 * Math.sin(az);
    const y2 = x * Math.sin(az) + y1 * Math.cos(az);
    return [240 + x2 * 1.04, 214 + y2 * 1.14, z1];
  }
  for (let i = 0; i < 68; i++) {
    const u = i / 68 * Math.PI * 2;
    const points = [];
    let depth = 0;
    for (let j = 0; j <= 72; j++) {
      const p = project(u, j / 72 * Math.PI * 2);
      points.push(`${p[0].toFixed(2)},${p[1].toFixed(2)}`);
      depth += p[2];
    }
    rings.push({ points, depth: depth / 73, rib: true });
  }
  for (let i = 0; i < 24; i++) {
    const v = i / 24 * Math.PI * 2;
    const points = [];
    let depth = 0;
    for (let j = 0; j <= 144; j++) {
      const p = project(j / 144 * Math.PI * 2, v);
      points.push(`${p[0].toFixed(2)},${p[1].toFixed(2)}`);
      depth += p[2];
    }
    rings.push({ points, depth: depth / 145, rib: false });
  }
  rings.sort((a, b) => a.depth - b.depth).forEach(ring => {
    const line = document.createElementNS(ns, 'polyline');
    line.setAttribute('points', ring.points.join(' '));
    line.setAttribute('fill', 'none');
    line.setAttribute('stroke', ring.rib ? '#617d4a' : '#7b915c');
    line.setAttribute('stroke-width', ring.rib ? '.9' : '.55');
    line.setAttribute('opacity', String(ring.rib ? .43 + (ring.depth + 140) / 560 : .36));
    group.append(line);
  });
}

const navLinks = [...document.querySelectorAll('.desktop-nav a')];
const sections = [...document.querySelectorAll('#about, #work, #research, #contact')];
const observer = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
  }
}, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });
sections.forEach(section => observer.observe(section));

document.querySelector('#year').textContent = new Date().getFullYear();
try { setLanguage(localStorage.getItem('portfolio-language') || 'en'); } catch { setLanguage('en'); }
drawField();
