const path = require('path');
const ejs = require('ejs');

describe('admin/visitdetail Unit Test', () => {
  const viewPath = path.join(__dirname, '../../views/admin/visitdetail.ejs');

  const mockUser = { username: 'admin' };

  const visit = {
    _id: 'v1',
    date: new Date('2024-06-01'),
    scheduledStart: '09:00',
    scheduledEnd: '10:00',
    clientId: { userForename: 'Brian', userSurname: 'Richard' },
    carerId: [{ _id: '1', userForename: 'Jane', userSurname: 'Smith' }]
  };

  it('Renders the details of the visit', async () => {
    const html = await ejs.renderFile(viewPath, { visit, user: mockUser }, {
      filename: viewPath,
      views: [path.join(__dirname, '../../views')],
    });

    expect(html).toContain('Visit Information');
    expect(html).toContain('Brian Richard');
    expect(html).toContain('09:00');
    expect(html).toContain('10:00');
    expect(html).toContain('Scheduled');
  });
});
