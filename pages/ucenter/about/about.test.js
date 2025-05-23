describe('about', () => {
	let page;
	if (process.env.UNI_PLATFORM === "mp-weixin" || process.env.UNI_PLATFORM === "h5") {
		it('web-mp skip', async () => {
			expect(1).toBe(1)
		})
		return
	}
	beforeAll(async () => {
		page = await program.reLaunch('/pages/ucenter/about/about')
		await page.waitFor('view')
		await page.waitFor(1000)
	})
	it('验证应用名称', async () => {
		const aboutData = await page.data('about')
		expect(aboutData.appName).toBe('uni-starter')
		expect(aboutData.slogan).toBe('云端一体应用快速开发模版')
	})
	it('验证服务协议链接', async () => {
		const serviceElements = await page.$$('.agreement')
		expect(serviceElements.length).toBe(2)
		const text1 = await serviceElements[0].text()
		const text2 = await serviceElements[1].text()
		expect(text1).toBe('《用户服务协议》')
		expect(text2).toBe('《隐私政策条款》')
	})
});