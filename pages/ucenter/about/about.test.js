describe('about', () => {
	let page;
	if(process.env.UNI_PLATFORM === "mp-weixin" || process.env.UNI_PLATFORM === "h5"){
		it('web-mp skip', async () => {
			expect(1).toBe(1)
		})
		return
	}
  beforeAll(async () => {
  	page = await program.reLaunch('/pages/ucenter/about/about')
  	await page.waitFor('view')
  })
  it('appName', async () => {
  	expect.assertions(1);
  	expect((await page.data('about')).appName).toBe('uni-starter')
  })
});
