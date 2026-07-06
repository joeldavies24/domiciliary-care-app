const path = require('path');
const ejs = require('ejs');

describe('admin/routines Unit Test', () => {
  const viewPath = path.join(__dirname, '../../views/admin/routines.ejs');

  const mockUser = { username: 'admin', userForename: 'Admin', userSurname: 'User' };

  const routines = [
    { _id: 'r1', routineName: 'Morning Care', clientId: { userForename: 'Brian', userSurname: 'Richard' }, tasks: [1,2] },
  ];

  it('Renders the routine table correctly', async () => {
    const html = await ejs.renderFile(viewPath, { routines, user: mockUser }, {
      filename: viewPath,
      views: [path.join(__dirname, '../../views')],
    });

    expect(html).toContain('Care Routine List');
    expect(html).toContain('Create New Routine');
    expect(html).toContain('Morning Care');
    expect(html).toContain('Brian Richard');
    expect(html).toContain('2 tasks');
    expect(html).toContain('View');
    expect(html).toContain('Edit');
    expect(html).toContain('Back to Admin');
  });
});
