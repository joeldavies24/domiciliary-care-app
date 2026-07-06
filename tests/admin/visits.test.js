const path = require('path');
const ejs = require('ejs');

describe('admin/visits Unit Test', () => {
  const viewPath = path.join(__dirname, '../../views/admin/visits.ejs');

  const mockVisits = [
    {
      _id: 'v1',
      date: new Date('2026-01-01'),
      scheduledStart: '09:00',
      scheduledEnd: '11:00',
      clientId: { _id: '1', userForename: 'Brian', userSurname: 'Richard' },
      carerId: [{ _id: '3', userForename: 'George', userSurname: 'Martin' }],
      checkIn: null,
      checkOut: null,
    },
    {
      _id: 'v2',
      date: new Date('2026-01-02'),
      scheduledStart: '13:00',
      scheduledEnd: '14:00',
      clientId: { _id: '2', userForename: 'Emily', userSurname: 'Martin' },
      carerId: [{ _id: '4', userForename: 'Yoko', userSurname: 'Ono' }],
      checkIn: new Date(),
      checkOut: null,
    },
    {
      _id: 'v3',
      date: new Date('2026-01-03'),
      scheduledStart: '10:00',
      scheduledEnd: '12:00',
      clientId: { _id: '5', userForename: 'Linda', userSurname: 'Eastman' },
      carerId: [],
      checkIn: new Date(),
      checkOut: new Date(),
    },
  ];

  const mockUser = { username: 'admin', userForename: 'Admin', userSurname: 'User' };

  const render = (visits = mockVisits) =>
    ejs.renderFile(viewPath, { visits, user: mockUser }, {
      filename: viewPath,
      views: [path.join(__dirname, '../../views')],
    });

  let html;

  beforeAll(async () => {
    html = await render();
  });

  it('Renders the visits table appropriately', () => {
    expect(html).toContain('<h2>Visit List</h2>');
    expect(html).toContain('Schedule New Visit');
    expect(html).toContain('href="/admin/create/visit"');
    expect(html).toContain('id="visitSearch"');
    expect(html).toContain('<th>Date</th>');
    expect(html).toContain('<th>Time</th>');
    expect(html).toContain('<th>Client</th>');
    expect(html).toContain('<th>Carer(s)</th>');
    expect(html).toContain('<th>Status</th>');
    expect(html).toContain('<th>Actions</th>');
    expect(html).toContain('Brian Richard');
    expect(html).toContain('George Martin');
    expect(html).toContain('Emily Martin');
    expect(html).toContain('Yoko Ono');
    expect(html).toContain('Linda Eastman');
    expect(html).toContain('Scheduled');
    expect(html).toContain('In Progress');
    expect(html).toContain('Complete');
    expect(html).toContain('href="/admin/visit/v1"');
    expect(html).toContain('href="/admin/edit_visit/v1"');
    expect(html).toContain('action="/admin/delete_visit/v1"');
  });
});
