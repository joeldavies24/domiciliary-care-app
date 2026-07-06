const path = require('path');
const ejs = require('ejs');

describe('admin/edit_task Unit Test', () => {
  const viewPath = path.join(__dirname, '../../views/admin/edit_task.ejs');

  const mockUser = { username: 'admin', userForename: 'Admin', userSurname: 'User' };

  const mockTask = {
    _id: 't1',
    taskName: 'Morning Medication',
    category: 'Medication',
    dosage: '10mg',
    description: 'Take with water',
  };

  it('Renders the edit task page', async () => {
    const html = await ejs.renderFile(viewPath, { task: mockTask, user: mockUser }, {
      filename: viewPath,
      views: [path.join(__dirname, '../../views')],
    });

    expect(html).toContain('Edit Care Task');
    expect(html).toContain('action="/admin/edit_task/t1"');
    expect(html).toContain('Morning Medication');
    expect(html).toContain('Medication');
    expect(html).toContain('10mg');
    expect(html).toContain('Take with water');
    expect(html).toContain('Save Changes');
    expect(html).toContain('Cancel');
  });
});

