const path = require('path');
const ejs = require('ejs');

describe('admin/create/visit Unit Test', () => {
  const viewPath = path.join(__dirname, '../../views/admin/create/visit.ejs');

  const mockUser = { username: 'admin', userForename: 'Admin', userSurname: 'User' };

  const renderData = {
    user: mockUser,
    carers: [
      { _id: '3', userForename: 'George', userSurname: 'Martin' },
      { _id: '4', userForename: 'Yoko', userSurname: 'Ono' },
    ],
    clients: [
      { _id: '1', userForename: 'Brian', userSurname: 'Richard' },
    ],
    routines: [
      { _id: 'r1', routineName: 'Morning Care' },
    ],
    tasks: [
      { _id: 't1', taskName: 'Morning Medication', category: 'Medication' },
      { _id: 't2', taskName: 'Personal Hygiene', category: 'Personal Care' },
    ],
  };

  it('Renders the full visit creation page', async () => {
    const html = await ejs.renderFile(viewPath, renderData, {
      filename: viewPath,
      views: [path.join(__dirname, '../../views')],
    });

    expect(html).toContain('Schedule New Visit');
    expect(html).toContain('action="/admin/create/visit"');
    expect(html).toContain('George Martin');
    expect(html).toContain('Yoko Ono');
    expect(html).toContain('Brian Richard');
    expect(html).toContain('Morning Care');
    expect(html).toContain('No Routine');
    expect(html).toContain('Morning Medication');
    expect(html).toContain('Personal Hygiene');
    expect(html).toContain('name="date"');
    expect(html).toContain('name="scheduledStart"');
    expect(html).toContain('name="scheduledEnd"');
    expect(html).toContain('Create Visit');
    expect(html).toContain('Cancel');
  });
});
