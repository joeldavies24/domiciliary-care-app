const path = require('path');
const ejs = require('ejs');

describe('user/request Unit Test', () => {
  const viewPath = path.join(__dirname, '../../views/user/request.ejs');

  it('Renders the request page appropriately', async () => {
    const html = await ejs.renderFile(viewPath, { user: {} }, {
      filename: viewPath,
      views: [path.join(__dirname, '../../views')]
    });

    expect(html).toContain('<form action="/user/request" method="POST"');
    expect(html).toContain('name="details"');
  });
});
