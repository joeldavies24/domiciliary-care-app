const path = require('path');
const ejs = require('ejs');

describe('user/careplan Unit Test', () => {
  const viewPath = path.join(__dirname, '../../views/user/careplandetail.ejs');

  it('Renders the careplan page', async () => {
    const html = await ejs.renderFile(viewPath, {
      user: {},
      carePlan: {
        clientId: "1",
        lastReviewDate: new Date(),
        dietaryRequirements: [],
        emergencyContacts: []
      }
    }, {
      filename: viewPath,
      views: [path.join(__dirname, '../../views')]
    });

    expect(html).toContain('Care Plan');
    expect(html).toContain('Medical Overview');
    expect(html).toContain('1');
  });
});
