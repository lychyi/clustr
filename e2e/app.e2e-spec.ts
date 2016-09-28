import { ClustrPage } from './app.po';

describe('clustr App', function() {
  let page: ClustrPage;

  beforeEach(() => {
    page = new ClustrPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
