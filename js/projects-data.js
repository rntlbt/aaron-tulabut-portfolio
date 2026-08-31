/*
  PORTFOLIO DATA MODEL
  --------------------
  This is intentionally centralized so the portfolio can grow without rewriting the UI logic.

  ADDING A NEW PROJECT:
  1. Duplicate one object inside PROJECT_DATA.
  2. Change `id`, `title`, `subtitle`, `year`, `description`, `features`, `stack`, and `screenshotGroups`.
  3. Create a matching image folder at:
       assets/images/projects/<your-project-folder>/
  4. Put your screenshots there.
  5. In `screenshotGroups`, add one object per role:
       {
         role: "Admin",
         images: [
           { src: "assets/images/projects/<folder>/Admin/01-dashboard.jpg", caption: "Dashboard", alt: "Project dashboard screenshot" }
         ]
       }
  6. No other JavaScript changes are required.
*/
const PROJECT_DATA = [
  {
    id: 'simon-dost3',
    title: 'Smart ICT Management and Operations Network System for DOST Region III (SIMON-DOST3)',
    subtitle: 'SIMON-DOST3',
    year: '2026',
    description: 'A web-based ICT management system for asset tracking, repair and borrowing workflows, preventive maintenance, role-based access, and predictive maintenance.',
    features: [
      'ICT asset tracking and inventory management',
      'Repair and borrowing workflows',
      'Preventive maintenance support',
      'Role-based access and system workflows',
      'Predictive models integrated through FastAPI'
    ],
    stack: ['Laravel', 'PostgreSQL', 'Inertia', 'FastAPI'],
    screenshotGroups: [
      {
        role: "Login Page",
        images: [
          { src: 'assets/images/projects/simon-dost3/Login.png', caption: 'Login Page', alt: 'SIMON-DOST3 login page' }
        ]
      },
      {
        role: 'Admin',
        images: [
          { src: 'assets/images/projects/simon-dost3/Admin/85QlVFtgPM.png', caption: 'Dashboard', alt: 'SIMON-DOST3 Admin dashboard and analytics overview' },
          { src: 'assets/images/projects/simon-dost3/Admin/6iotirv7ms.png', caption: 'Asset Management', alt: 'SIMON-DOST3 Admin asset inventory management page' },
          { src: 'assets/images/projects/simon-dost3/Admin/fXqQ5wcgnx.png', caption: 'Repair Ticket Management', alt: 'SIMON-DOST3 Admin repair ticket management page' },
          { src: 'assets/images/projects/simon-dost3/Admin/o7MZdYUXfk.png', caption: 'Borrow Request Management', alt: 'SIMON-DOST3 Admin borrow request management page' },
          { src: 'assets/images/projects/simon-dost3/Admin/V46C5d2QBQ.png', caption: 'ICT Advisory Dashboard', alt: 'SIMON-DOST3 Admin ICT advisory dashboard page' },
          { src: 'assets/images/projects/simon-dost3/Admin/UF1GoNwSQs.png', caption: 'Preventive Maintenance', alt: 'SIMON-DOST3 Admin preventive maintenance page' },
          { src: 'assets/images/projects/simon-dost3/Admin/brave_yxTaMPqMuK.png', caption: 'Troubleshooting Guides', alt: 'SIMON-DOST3 Admin troubleshooting guides page' },
          { src: 'assets/images/projects/simon-dost3/Admin/brave_mwskjwACYH.png', caption: 'Messages', alt: 'SIMON-DOST3 Admin messages page' },
          { src: 'assets/images/projects/simon-dost3/Admin/brave_MgEs10pxiG.png', caption: 'Employee Management', alt: 'SIMON-DOST3 Admin employee management page' },
          { src: 'assets/images/projects/simon-dost3/Admin/brave_NvXsLrZolD.png', caption: 'Office Management', alt: 'SIMON-DOST3 Admin office management page' },
          { src: 'assets/images/projects/simon-dost3/Admin/brave_2EWyZGhPYP.png', caption: 'Roles & Permissions', alt: 'SIMON-DOST3 Admin roles and permissions page' },
          { src: 'assets/images/projects/simon-dost3/Admin/brave_M4MMs5eOUk.png', caption: 'Asset Configuration', alt: 'SIMON-DOST3 Admin asset configuration page' },
          { src: 'assets/images/projects/simon-dost3/Admin/BIqZphIYMk.png', caption: 'Model Settings', alt: 'SIMON-DOST3 Admin model settings page' }
        ]
      }
    ]
  },
  {
    id: 'magset',
    title: 'Management of Activities, Gatherings, Schedules, Events, and Tickets (MAGSET)',
    subtitle: 'MAGSET',
    year: '2025',
    description: 'MAGSET is a role-based web platform designed to simplify how people discover, organize, and participate in events. Visitors can browse upcoming events, while registered users can join events, cancel participation, save favorites, receive notifications, and submit event reports.',
    features: [
      'Browse and discover upcoming events',
      'Join events and manage participation',
      'Create and manage events as an approved organizer',
      'Support tickets, pricing, sponsors, suppliers, and logistics',
      'Manage reports, notifications, permissions, and audit records'
    ],
    stack: ['Laravel', 'MySQL', 'Livewire', 'Filament'],
    screenshotGroups: []
  }
];

const ROLE_DISPLAY_ORDER = ['Login Page', 'Superadmin', 'Admin', 'User'];

function getProjectById(projectId) {
  return PROJECT_DATA.find(item => item.id === projectId);
}

function getScreenshotGroups(project) {
  if (Array.isArray(project?.screenshotGroups) && project.screenshotGroups.length > 0) {
    return project.screenshotGroups
      .filter(group => Array.isArray(group.images) && group.images.length > 0)
      .slice()
      .sort((first, second) => roleOrderIndex(first.role) - roleOrderIndex(second.role));
  }

  if (Array.isArray(project?.images) && project.images.length > 0) {
    return [{ role: 'Screenshots', images: project.images }];
  }

  return [];
}

function roleOrderIndex(role) {
  const index = ROLE_DISPLAY_ORDER.findIndex(item => item.toLowerCase() === String(role).toLowerCase());
  return index === -1 ? ROLE_DISPLAY_ORDER.length : index;
}
