export const metrics = [
  { label: 'Registered users', value: '12,840', change: '+12.8%', detail: 'Compared with last month', tone: 'blue', icon: 'users' },
  { label: 'Active sharing sessions', value: '1,284', change: '+8.2%', detail: 'Currently authorized', tone: 'green', icon: 'radio' },
  { label: 'Locations synchronized', value: '48,392', change: '+18.4%', detail: 'Records received today', tone: 'violet', icon: 'map' },
  { label: 'Pending requests', value: '326', change: '-4.6%', detail: 'Awaiting user response', tone: 'amber', icon: 'clock' }
]

export const sharingSessions = [
  { name: 'Abel Tesfaye', phone: '+251 91 ••• ••42', area: 'Bole, Addis Ababa', device: 'Android device', updated: 'Just now', status: 'Sharing' },
  { name: 'Hana Mekonnen', phone: '+251 92 ••• ••18', area: 'Kazanchis, Addis Ababa', device: 'Android device', updated: '2 min ago', status: 'Sharing' },
  { name: 'Dawit Alemu', phone: '+251 93 ••• ••67', area: 'Bahir Dar, Amhara', device: 'Android device', updated: '8 min ago', status: 'Offline' },
  { name: 'Mimi Bekele', phone: '+251 94 ••• ••03', area: 'Adama, Oromia', device: 'Android device', updated: '12 min ago', status: 'Sharing' }
]

export const activities = [
  { title: 'New user registered', description: 'A new account completed phone verification.', time: '2 minutes ago', kind: 'user' },
  { title: 'Location sync completed', description: '184 offline records were synchronized.', time: '18 minutes ago', kind: 'sync' },
  { title: 'Sharing request accepted', description: 'A user approved a contact sharing request.', time: '32 minutes ago', kind: 'share' },
  { title: 'Security review completed', description: 'A reported account was reviewed by support.', time: '1 hour ago', kind: 'security' }
]

export const syncDevices = [
  { device: 'Pixel 7', owner: 'Abel Tesfaye', state: 'Synced', last: '10:42 AM', percent: 100 },
  { device: 'Samsung A54', owner: 'Hana Mekonnen', state: 'Syncing', last: '10:39 AM', percent: 68 },
  { device: 'Redmi Note 12', owner: 'Dawit Alemu', state: 'Waiting for connection', last: 'Yesterday', percent: 0 }
]
