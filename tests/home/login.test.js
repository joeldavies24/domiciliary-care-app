const path = require('path');
const ejs = require('ejs');

describe('home/login Unit Test', () => {
  const viewPath = path.join(__dirname, '../../views/home/login.ejs');

  it('Renders the login page appropriately', async () => {
    const html = await ejs.renderFile(viewPath, {}, {
      filename: viewPath,
      views: [path.join(__dirname, '../../views')],
    });

    expect(html).toContain('<form action="/home/login" method="POST">');
    expect(html).toContain('name="username"');
    expect(html).toContain('name="password"');
  });
});


