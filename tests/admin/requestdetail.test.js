const path = require('path');
const ejs = require('ejs');

describe('admin/requestdetail Unit Test', () => {
  const viewPath = path.join(__dirname, '../../views/admin/requestdetail.ejs');

  const mockUser = { username: 'admin', userForename: 'Admin', userSurname: 'User' };

  const baseRequest = {
    _id: 'r1',
    status: 'Pending',
    requestType: 'General Enquiry',
    details: 'Help needed',
    requesterId: {
      userForename: 'Brian',
      userSurname: 'Richard',
      username: 'brichard',
      email: 'brian@example.com',
    },
    createdAt: new Date()
  };

  it('Renders the request detail page', async () => {
    const html = await ejs.renderFile(viewPath, { request: baseRequest, user: mockUser }, {
      filename: viewPath,
      views: [path.join(__dirname, '../../views')],
    });

    expect(html).toContain('Request');
    expect(html).toContain('Pending');
    expect(html).toContain('Brian Richard');
    expect(html).toContain('brichard');
    expect(html).toContain('General Enquiry');
    expect(html).toContain('Help needed');
    expect(html).toContain('Admin Notes');
    expect(html).toContain('Save and Mark Resolved');
  });
});
