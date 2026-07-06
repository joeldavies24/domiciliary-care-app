const path = require('path');
const ejs = require('ejs');

describe('admin/staff Unit Test', () => {
  const viewPath = path.join(__dirname, '../../views/admin/staff.ejs');

  const mockUser = { _id: 'admin001', username: 'admin' };

  const users = [
    { _id: '3', userForename: 'George', userSurname: 'Martin', userType: 'carer' },
    { _id: '4', userForename: 'Yoko', userSurname: 'Ono', userType: 'admin' },
  ];

  it('Renders the staff table appropriately', async () => {
    const html = await ejs.renderFile(viewPath, { users, user: mockUser }, {
      filename: viewPath,
      views: [path.join(__dirname, '../../views')],
    });

    expect(html).toContain('Staff List');
    expect(html).toContain('Register New Staff');
    expect(html).toContain('George Martin');
    expect(html).toContain('Yoko Ono');
    expect(html).toContain('Edit');
    expect(html).toContain('Back to Admin');
  });
});
