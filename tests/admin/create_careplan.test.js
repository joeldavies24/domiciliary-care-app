const path = require('path');
const ejs = require('ejs');

describe('admin/create/careplan Unit Test', () => {
  const viewPath = path.join(__dirname, '../../views/admin/create/careplan.ejs');

  const mockUser = { username: 'admin', userForename: 'Admin', userSurname: 'User' };

  it('Renders the full careplan creation page', async () => {
    const html = await ejs.renderFile(viewPath, { user: mockUser, clientId: 1 }, {
      filename: viewPath,
      views: [path.join(__dirname, '../../views')],
    });

    expect(html).toContain('Create New Care Plan');
    expect(html).toContain('Create and manage a complete care profile');
    expect(html).toContain('action="/admin/create/careplan"');
    expect(html).toContain('method="POST"');
    expect(html).toContain('Medical Overview');
    expect(html).toContain('name="allergies"');
    expect(html).toContain('name="dietaryRequirements"');
    expect(html).toContain('name="mobilityRestrictions"');
    expect(html).toContain('Medical History');
    expect(html).toContain('id="history-container"');
    expect(html).toContain('onclick="addHistory()"');
    expect(html).toContain('Emergency Contacts');
    expect(html).toContain('id="contact-container"');
    expect(html).toContain('onclick="addContact()"');
    expect(html).toContain('Administrative Notes');
    expect(html).toContain('name="adminNotes"');
    expect(html).toContain('Save Care Plan');
    expect(html).toContain('Cancel');
    expect(html).toContain('href="/admin/clients"');
  });
});
