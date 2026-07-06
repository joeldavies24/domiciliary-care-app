const path = require('path');
const ejs = require('ejs');

describe('user/userdetail Unit Test', () => {
  const viewPath = path.join(__dirname, '../../views/user/userdetail.ejs');

  it('Renders the userdetail page correctly', async () => {
    const html = await ejs.renderFile(viewPath, {
      user: {},
      profileUser: {
        username: "test",
        userForename: "John",
        userSurname: "Doe",
        userType: "client",
        userStatus: true,
        userAddress: {}
      },
      carePlan: null
    }, {
      filename: viewPath,
      views: [path.join(__dirname, '../../views')]
    });

    expect(html).toContain('Profile');
    expect(html).toContain('John');
    expect(html).toContain('Doe');
  });
});

