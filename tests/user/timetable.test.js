const path = require('path');
const ejs = require('ejs');

describe('user/timetable Unit Test', () => {
  const viewPath = path.join(__dirname, '../../views/user/timetable.ejs');

  it('Renders the timetable page and list the visits appropriately', async () => {
    const html = await ejs.renderFile(viewPath, {
      user: {},
      weekOffset: 0,
      weekDates: [new Date(), new Date(), new Date(), new Date(), new Date(), new Date(), new Date()],
      visits: []
    }, {
      filename: viewPath,
      views: [path.join(__dirname, '../../views')]
    });

    expect(html).toContain('Week of');
    expect(html).toContain('No visits');
  });
});
