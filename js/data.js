// ============================================================
// IdeaNest – Data Store (localStorage-backed)
// ============================================================

const DB = {
  IDEAS_KEY:    'ideaNestIdeas',
  USER_KEY:     'ideaNestUser',
  INVESTORS_KEY:'ideaNestInvestors',

  getIdeas() {
    return JSON.parse(localStorage.getItem(this.IDEAS_KEY) || '[]');
  },
  saveIdeas(ideas) {
    localStorage.setItem(this.IDEAS_KEY, JSON.stringify(ideas));
  },
  getUser() {
    return JSON.parse(localStorage.getItem(this.USER_KEY) || '{}');
  },
  getInvestors() {
    return JSON.parse(localStorage.getItem(this.INVESTORS_KEY) || '[]');
  }
};

// ---- Seed data ----
(function seedIfEmpty() {
  if (DB.getIdeas().length === 0) {
    const seedIdeas = [
      {
        id: 'idea_seed_1',
        title: 'EcoTrack – Personal Carbon Footprint AI',
        category: 'startup',
        desc: 'An AI-powered app that tracks your daily carbon footprint through bank transactions, travel data, and diet logs, then suggests personalised actions to reduce it.',
        problem: 'Most people have no idea how much carbon they emit daily. Existing tools require manual entry and are too cumbersome.',
        stage: 'validated',
        votes: 142,
        teamNeeds: ['Developer','Designer','Marketing'],
        authorName: 'Arjun Kumar',
        authorEmail: 'arjun@example.com',
        market: 'Climate-conscious millennials & corporates needing ESG reporting',
        budget: '10-50k',
        comments: [
          { id:'c1', author:'Priya S', text:'Love this! Have you looked at integrating with UPI transaction APIs?', time: Date.now() - 86400000 },
          { id:'c2', author:'Vikram R', text:'Great idea. Would be interested in collaborating on the ML pipeline.', time: Date.now() - 43200000 }
        ],
        createdAt: Date.now() - 1209600000,
        trending: true
      },
      {
        id: 'idea_seed_2',
        title: 'PeerMentor – Student-to-Student Learning Platform',
        category: 'edtech',
        desc: 'A peer learning marketplace where students can book sessions with senior students or recent graduates for affordable mentorship on academics, career, and skills.',
        problem: 'Professional mentorship is expensive and inaccessible for most students. Peer knowledge is underutilized.',
        stage: 'progress',
        votes: 98,
        teamNeeds: ['Developer','Business Dev'],
        authorName: 'Sneha Patel',
        authorEmail: 'sneha@example.com',
        market: 'College students in Tier-1 and Tier-2 Indian cities',
        budget: '<10k',
        comments: [
          { id:'c3', author:'Rohit M', text:'This is exactly what I needed when I was in college. Would love to beta test!', time: Date.now() - 72000000 }
        ],
        createdAt: Date.now() - 864000000,
        trending: true
      },
      {
        id: 'idea_seed_3',
        title: 'MindBridge – Mental Wellness for Remote Teams',
        category: 'health',
        desc: 'A B2B mental wellness platform that integrates with Slack and Teams to provide daily mood check-ins, anonymous peer support circles, and therapist booking.',
        problem: 'Remote work burnout is at an all-time high. HR teams lack real-time visibility into employee mental health.',
        stage: 'funded',
        votes: 211,
        teamNeeds: [],
        authorName: 'Kavya Menon',
        authorEmail: 'kavya@example.com',
        market: 'SMEs with 50-500 employees in tech sector',
        budget: '50-200k',
        comments: [
          { id:'c4', author:'Dev Anand', text:'Our company really needs something like this. When is the beta?', time: Date.now() - 36000000 },
          { id:'c5', author:'Aisha B', text:'Have you considered integration with health insurance platforms?', time: Date.now() - 18000000 }
        ],
        createdAt: Date.now() - 2592000000,
        trending: true
      },
      {
        id: 'idea_seed_4',
        title: 'RuralPay – UPI for Feature Phones',
        category: 'fintech',
        desc: 'A USSD-based payment system that brings UPI functionality to feature phones without internet, targeting the 300M rural Indians still on non-smartphones.',
        problem: 'Digital payments require smartphones. Rural India is largely excluded from the fintech revolution.',
        stage: 'concept',
        votes: 67,
        teamNeeds: ['Developer','Finance','Domain Expert'],
        authorName: 'Manish Gupta',
        authorEmail: 'manish@example.com',
        market: 'Rural India, 300M+ feature phone users',
        budget: '10-50k',
        comments: [],
        createdAt: Date.now() - 432000000,
        trending: false
      },
      {
        id: 'idea_seed_5',
        title: 'LocalHero – Hyperlocal Volunteer Network',
        category: 'social',
        desc: 'A platform connecting local volunteers with community needs—elderly care, tutoring, disaster relief—using skill-matching and verified micro-task management.',
        problem: 'Volunteerism is declining due to poor matching between volunteers and needs. Coordination is still done via WhatsApp groups.',
        stage: 'concept',
        votes: 45,
        teamNeeds: ['Designer','Marketing','Business Dev'],
        authorName: 'Nandini Roy',
        authorEmail: 'nandini@example.com',
        market: 'Urban and semi-urban communities, NGOs',
        budget: '<10k',
        comments: [
          { id:'c6', author:'Suresh T', text:'We tried something like this in Chennai. Would love to share learnings.', time: Date.now() - 7200000 }
        ],
        createdAt: Date.now() - 604800000,
        trending: false
      },
      {
        id: 'idea_seed_6',
        title: 'AgriSense – Crop Disease Early Warning',
        category: 'startup',
        desc: 'IoT soil sensors + satellite imagery + AI to detect crop diseases 2-3 weeks before visual symptoms appear, giving farmers time to act and save their yield.',
        problem: 'Farmers lose 15-30% of yield to preventable diseases detected too late.',
        stage: 'validated',
        votes: 189,
        teamNeeds: ['Developer','Data Scientist'],
        authorName: 'Ravi Shankar',
        authorEmail: 'ravi@example.com',
        market: 'Indian farmers, 600M+ in agriculture',
        budget: '50-200k',
        comments: [],
        createdAt: Date.now() - 1728000000,
        trending: true
      }
    ];
    DB.saveIdeas(seedIdeas);
  }

  if (DB.getInvestors().length === 0) {
    const seedInvestors = [
      { id:'inv1', name:'Rahul Mehta', initials:'RM', firm:'Blume Ventures', focus:['startup','edtech','fintech'], bio:'Early-stage investor with a focus on Bharat-first solutions. 12 years of experience in VC.', minTicket:'₹25L', maxTicket:'₹5Cr', portfolio:18, exits:4 },
      { id:'inv2', name:'Deepa Krishnan', initials:'DK', firm:'Kalaari Capital', focus:['health','edtech','social'], bio:'Healthcare and EdTech specialist. Former founder turned investor. Passionate about impact.', minTicket:'₹50L', maxTicket:'₹10Cr', portfolio:24, exits:7 },
      { id:'inv3', name:'Vikram Anand', initials:'VA', firm:'Accel Partners', focus:['fintech','startup'], bio:'SaaS and Fintech focused. Formerly at Goldman Sachs. Looking for product-led growth plays.', minTicket:'₹1Cr', maxTicket:'₹20Cr', portfolio:31, exits:9 },
      { id:'inv4', name:'Sana Sheikh', initials:'SS', firm:'Sequoia Surge', focus:['social','health','startup'], bio:'Impact-first investing. Looking for solutions that work for the next 500 million.', minTicket:'₹25L', maxTicket:'₹5Cr', portfolio:15, exits:3 },
      { id:'inv5', name:'Aryan Joshi', initials:'AJ', firm:'100X.VC', focus:['edtech','startup','fintech'], bio:'Angel investor in 60+ startups. Focus on founders who have domain expertise.', minTicket:'₹10L', maxTicket:'₹1Cr', portfolio:62, exits:11 },
      { id:'inv6', name:'Meera Nair', initials:'MN', firm:'Indian Angel Network', focus:['health','social'], bio:'Doctor turned investor. Healthcare and HealthTech are my primary domains.', minTicket:'₹10L', maxTicket:'₹2Cr', portfolio:22, exits:5 },
    ];
    localStorage.setItem(DB.INVESTORS_KEY, JSON.stringify(seedInvestors));
  }
})();
