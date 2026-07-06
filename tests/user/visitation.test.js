const path = require('path');
const ejs = require('ejs');

describe('user/visitation Unit Test', () => {
  const viewPath = path.join(__dirname, '../../views/user/visitation.ejs');

  const mockVisit = {
    _id: "123",
    scheduledStart: "10:00",
    scheduledEnd: "11:00",
    clientId: {
      _id: "c1",
      userForename: "John",
      userSurname: "Doe",
      userAddress: {}
    },
    carerId: [],
    tasks: []
  };

  const render = () =>
    ejs.renderFile(viewPath, { visit: mockVisit, user: {} }, {
      filename: viewPath,
      views: [path.join(__dirname, '../../views')]
    });

  let html;

  beforeAll(async () => {
    html = await render();
  });

  it('Renders the visitation page correctly', () => {
    expect(html).toContain('Visit Information');
    expect(html).toContain('Scheduled Time');
    expect(html).toContain('John Doe');
    expect(html).toContain('10:00');
    expect(html).toContain('11:00');
  });
});
