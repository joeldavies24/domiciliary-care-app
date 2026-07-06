const path = require('path');
const ejs = require('ejs');

describe('admin/create/task Unit Test', () => {
  const viewPath = path.join(__dirname, '../../views/admin/create/task.ejs');

  const mockUser = { username: 'admin', userForename: 'Admin', userSurname: 'User' };

  it('Renders the full task creation page', async () => {
    const html = await ejs.renderFile(viewPath, { user: mockUser }, {
      filename: viewPath,
      views: [path.join(__dirname, '../../views')],
    });
    expect(html).toContain('Create New Care Task');
    expect(html).toContain('action="/admin/create/task"');
    expect(html).toContain('method="POST"');
    expect(html).toContain('name="taskName"');
    expect(html).toContain('name="category"');
    expect(html).toContain('Personal Care');
    expect(html).toContain('Medication');
    expect(html).toContain('Other');
    expect(html).toContain('name="dosage"');
    expect(html).toContain('id="dosageGroup"');
    expect(html).toContain('name="description"');
    expect(html).toContain('Save Task');
    expect(html).toContain('Cancel');
  });
});
