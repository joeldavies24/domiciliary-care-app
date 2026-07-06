const path = require('path');
const ejs = require('ejs');

describe('admin/edit_careplan Unit Test', () => {
  const viewPath = path.join(__dirname, '../../views/admin/edit_careplan.ejs');

  const mockUser = { username: 'admin', userForename: 'Admin', userSurname: 'User' };

  const mockCarePlan = {
    _id: 'c1',
    clientId: { userForename: 'Brian', userSurname: 'Richard' },
    allergies: ['Nuts'],
    dietaryRequirements: ['Vegan'],
    mobilityRestrictions: 'Uses a wheelchair',
    medicalHistory: [],
    emergencyContacts: [],
    adminNotes: 'Review regularly.',
  };

  it('Renders the edit careplan page', async () => {
    const html = await ejs.renderFile(viewPath, { carePlan: mockCarePlan, user: mockUser }, {
      filename: viewPath,
      views: [path.join(__dirname, '../../views')],
    });
    expect(html).toContain('Edit Care Plan');
    expect(html).toContain('Brian');
    expect(html).toContain('Richard');
    expect(html).toContain('action="/careplan/edit/c1"');
    expect(html).toContain('Nuts');
    expect(html).toContain('Vegan');
    expect(html).toContain('Uses a wheelchair');
    expect(html).toContain('Medical History');
    expect(html).toContain('Emergency Contacts');
    expect(html).toContain('name="adminNotes"');
    expect(html).toContain('Save Changes');
    expect(html).toContain('Cancel');
  });
});
