const path = require('path');
const ejs = require('ejs');

describe('admin/create/user Unit Test', () => {
  const viewPath = path.join(__dirname, '../../views/admin/create/user.ejs');

  const mockUser = { username: 'admin', userForename: 'Admin', userSurname: 'User' };

  it('Renders the full user creation page', async () => {
    const html = await ejs.renderFile(viewPath, { user: mockUser }, {
      filename: viewPath,
      views: [path.join(__dirname, '../../views')],
    });
    expect(html).toContain('Register New User');
    expect(html).toContain('action="/admin/create/user"');
    expect(html).toContain('name="userForename"');
    expect(html).toContain('name="userSurname"');
    expect(html).toContain('name="username"');
    expect(html).toContain('name="password"');
    expect(html).toContain('id="power-point"');
    expect(html).toContain('name="userType"');
    expect(html).toContain('value="client"');
    expect(html).toContain('value="carer"');
    expect(html).toContain('value="admin"');
    expect(html).toContain('name="nhsNumber"');
    expect(html).toContain('name="userAddress[street]"');
    expect(html).toContain('id="verify-btn"');
    expect(html).toContain('name="adminSecret"');
    expect(html).toContain('Create Account');
    expect(html).toContain('Cancel');
  });
});
