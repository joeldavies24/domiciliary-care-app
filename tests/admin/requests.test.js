const path = require('path');
const ejs = require('ejs');

describe('admin/requests Unit Test', () => {
  const viewPath = path.join(__dirname, '../../views/admin/requests.ejs');

  const mockUser = { username: 'admin', userForename: 'Admin', userSurname: 'User' };

  const requests = [
    { _id: 'r1', requesterId: { username: 'brichard' }, requestType: 'General Enquiry', status: 'Pending' },
  ];

  it('Renders the requests table correctly', async () => {
    const html = await ejs.renderFile(viewPath, {
      requests,
      currentFilter: 'Pending',
      user: mockUser
    }, {
      filename: viewPath,
      views: [path.join(__dirname, '../../views')],
    });

    expect(html).toContain('Request List');
    expect(html).toContain('Pending');
    expect(html).toContain('Resolved');
    expect(html).toContain('brichard');
    expect(html).toContain('General Enquiry');
    expect(html).toContain('Mark Resolved');
    expect(html).toContain('View Details');
    expect(html).toContain('Back to Admin');
  });
});
