const path = require('path');
const ejs = require('ejs');

describe('user/profile Unit Test', () => {
  const viewPath = path.join(__dirname, '../../views/user/profile.ejs');

  it('Renders the users profile page', async () => {
    const html = await ejs.renderFile(viewPath, {
      user: {
        username: "test",
        userForename: "John",
        userSurname: "Doe",
        userAddress: {}
      }
    }, {
      filename: viewPath,
      views: [path.join(__dirname, '../../views')]
    });

    expect(html).toContain('Personal Details');
    expect(html).toContain('Full Name');
    expect(html).toContain('John');
    expect(html).toContain('Doe');
  });
});