const path = require('path');
const ejs = require('ejs');

describe('admin/create/routine Unit Test', () => {
  const viewPath = path.join(__dirname, '../../views/admin/create/routine.ejs');

  const mockUser = { username: 'admin', userForename: 'Admin', userSurname: 'User' };

  const mockClients = [
    { _id: '1', userForename: 'Brian', userSurname: 'Richard' },
    { _id: '2', userForename: 'Emily', userSurname: 'Martin' },
  ];

  const mockTasks = [
    { _id: 't1', taskName: 'Morning Medication', category: 'Medication' },
    { _id: 't2', taskName: 'Personal Hygiene', category: 'Personal Care' },
  ];

  it('Renders the full routine creation page', async () => {
    const html = await ejs.renderFile(viewPath, {
      user: mockUser,
      clients: mockClients,
      tasks: mockTasks
    }, {
      filename: viewPath,
      views: [path.join(__dirname, '../../views')]
    });
    expect(html).toContain('Create New Care Routine');
    expect(html).toContain('action="/admin/create/routine"');
    expect(html).toContain('method="POST"');
    expect(html).toContain('name="routineName"');
    expect(html).toContain('Brian Richard');
    expect(html).toContain('Emily Martin');
    expect(html).toContain('name="clientId"');
    expect(html).toContain('id="realClientId"');
    expect(html).toContain('Morning Medication');
    expect(html).toContain('Personal Hygiene');
    expect(html).toContain('name="tasks"');
    expect(html).toContain('name="description"');
    expect(html).toContain('Save Routine');
    expect(html).toContain('Cancel');
  });
});
