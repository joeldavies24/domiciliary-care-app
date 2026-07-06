const path = require('path');
const ejs = require('ejs');

describe('admin/edit_user Unit Test', () => {
  const viewPath = path.join(__dirname, '../../views/admin/edit_user.ejs');

  const mockUser = { username: 'admin', userForename: 'Admin', userSurname: 'User' };

  const mockClient = {
    _id: '1',
    userForename: 'Brian',
    userSurname: 'Richard',
    phoneNumber: '111111',
    userType: 'client',
  };

  const mockAdmin = {
    _id: '4',
    userForename: 'Yoko',
    userSurname: 'Ono',
    userType: 'admin',
  };

  it('Renders the edit user page', async () => {
    const html = await ejs.renderFile(viewPath, { editUser: mockClient, user: mockUser, error: null }, {
      filename: viewPath,
      views: [path.join(__dirname, '../../views')],
    });

    expect(html).toContain('Edit User');
    expect(html).toContain('Brian');
    expect(html).toContain('Richard');
    expect(html).toContain('111111');
    expect(html).toContain('Active');
    expect(html).toContain('Inactive');
    expect(html).not.toContain('Admin Password');
    expect(html).toContain('Save Changes');
  });

  it('Renders admin details with an admin user', async () => {
    const html = await ejs.renderFile(viewPath, { editUser: mockAdmin, user: mockUser, error: null }, {
      filename: viewPath,
      views: [path.join(__dirname, '../../views')],
    });

    expect(html).toContain('Admin Password');
  });
});
