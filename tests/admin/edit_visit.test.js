const path = require('path');
const ejs = require('ejs');

describe('admin/edit_visit Unit Test', () => {
  const viewPath = path.join(__dirname, '../../views/admin/edit_visit.ejs');

  const mockUser = { username: 'admin', userForename: 'Admin', userSurname: 'User' };

  const renderData = {
    user: mockUser,
    visit: {
      _id: 'v1',
      carerId: [],
      date: new Date('2026-01-01'),
      scheduledStart: '09:00',
      scheduledEnd: '09:45',
      clientId: { _id: '1', userForename: 'Brian', userSurname: 'Richard' },
    },
    carers: [],
    clients: [],
    tasks: [],
  };

  it('Renders the edit visit page', async () => {
    const html = await ejs.renderFile(viewPath, renderData, {
      filename: viewPath,
      views: [path.join(__dirname, '../../views')],
    });

    expect(html).toContain('Edit Visit');
    expect(html).toContain('action="/admin/edit_visit/v1');
    expect(html).toContain('Brian Richard');
    expect(html).toContain('2026-01-01');
    expect(html).toContain('09:00');
    expect(html).toContain('09:45');
    expect(html).toContain('Save Changes');
    expect(html).toContain('Cancel');
  });
});