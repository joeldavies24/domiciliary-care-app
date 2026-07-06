const path = require('path');
const ejs = require('ejs');

describe('user/edit Unit Test', () => {
  const viewPath = path.join(__dirname, '../../views/user/edit.ejs');

  it('Renders the user edit page appropriately', async () => {
    const html = await ejs.renderFile(viewPath, {
      user: {
        username: "test",
        userForename: "John",
        userSurname: "Doe",
        userAddress: {}
      },
      dob: "2000-01-01"
    }, {
      filename: viewPath,
      views: [path.join(__dirname, '../../views')]
    });

    expect(html).toContain('<form action="/user/profile/edit" method="POST"');
    expect(html).toContain('name="username"');
    expect(html).toContain('John');
    expect(html).toContain('Doe');
  });
});
