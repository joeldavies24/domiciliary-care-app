const path = require('path');
const ejs = require('ejs');

describe('admin/tasks Unit Test', () => {
  const viewPath = path.join(__dirname, '../../views/admin/tasks.ejs');

  const mockUser = { username: 'admin' };

  const tasks = [
    { _id: 't1', taskName: 'Morning Medication', category: 'Medication', dosage: '10mg' },
  ];

  it('Renders the tasks table appropriately', async () => {
    const html = await ejs.renderFile(viewPath, { tasks, user: mockUser }, {
      filename: viewPath,
      views: [path.join(__dirname, '../../views')],
    });

    expect(html).toContain('Task List');
    expect(html).toContain('Add New Task');
    expect(html).toContain('Morning Medication');
    expect(html).toContain('Medication');
    expect(html).toContain('10mg');
    expect(html).toContain('Edit');
    expect(html).toContain('Back to Admin');
  });
});
