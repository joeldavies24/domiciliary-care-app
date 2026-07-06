const path = require('path');
const ejs = require('ejs');

describe('home/contact Unit Test', () => {
  const viewPath = path.join(__dirname, '../../views/home/contact.ejs');

  it('Renders the contact page appropriately', async () => {
    const html = await ejs.renderFile(viewPath, {}, {
      filename: viewPath,
      views: [path.join(__dirname, '../../views')],
    });

    expect(html).toContain('<h1>Contact Us</h1>');
    expect(html).toContain('<form action="/home/contact" method="POST">');
    expect(html).toContain('name="name"');
    expect(html).toContain('name="email"');
    expect(html).toContain('name="message"');
    expect(html).toContain('01234 567891');
    expect(html).toContain('support@hopefield.com');
  });
});
