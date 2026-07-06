const path = require('path');
const ejs = require('ejs');

describe('admin/clients Unit Test', () => {
  const viewPath = path.join(__dirname, '../../views/admin/clients.ejs');

  const mockUser = {
    username: 'admin',
    userForename: 'Admin',
    userSurname: 'User',
  };

  const mockUsers = [
    {
      _id: '1',
      username: 'brichard',
      userForename: 'Brian',
      userSurname: 'Richard',
      userType: 'client',
      nhsNumber: '123456789',
      userDOB: new Date('2000-01-01'),
      userStatus: true,
    },
    {
      _id: '2',
      username: 'emartin',
      userForename: 'Emily',
      userSurname: 'Martin',
      userType: 'client',
      nhsNumber: null,
      userDOB: null,
      userStatus: false,
    },
    {
      _id: '3',
      username: 'gmartin',
      userForename: 'George',
      userSurname: 'Martin',
      userType: 'carer',
    },
  ];

  const render = () =>
    ejs.renderFile(viewPath, { users: mockUsers, user: mockUser }, {
      filename: viewPath,
      views: [path.join(__dirname, '../../views')],
    });

  let html;

  beforeAll(async () => {
    html = await render();
  });

  it('Renders the details of the table, Carer accounts not listed', () => {
    expect(html).toContain('<h2>Client List</h2>');
    expect(html).toContain('Register New Client');
    expect(html).toContain('href="/admin/create/user"');
    expect(html).toContain('id="clientSearch"');
    expect(html).toContain('<th>User</th>');
    expect(html).toContain('<th>NHS Number</th>');
    expect(html).toContain('<th>DOB</th>');
    expect(html).toContain('<th>Status</th>');
    expect(html).toContain('<th>Actions</th>');
    expect(html).toContain('Brian Richard');
    expect(html).toContain('Emily Martin');
    expect(html).not.toContain('George Martin');
    expect(html).toContain('@brichard');
    expect(html).toContain('@emartin');
    expect(html).toContain('123456789');
    expect(html).toContain('01/01/2000');
    expect(html).toContain('N/A');
    expect(html).toContain('Active');
    expect(html).toContain('Inactive');
    expect(html).toContain('href="/user/details/1"');
    expect(html).toContain('href="/admin/edit_user/1"');
    expect(html).toContain('action="/admin/delete_user/1"');
    expect(html).toContain('href="/admin/index"');
  });
});
