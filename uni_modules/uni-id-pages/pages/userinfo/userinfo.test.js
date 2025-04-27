// uni-app自动化测试教程: uni-app自动化测试教程: https://uniapp.dcloud.io/collocation/auto/hbuilderx-extension/index
const PAGE_PATH = '/uni_modules/uni-id-pages/pages/userinfo/userinfo'
jest.setTimeout(30000);
describe('userinfo', () => {
	let page, userInfo;
	if (process.env.uniTestPlatformInfo == 'ios_simulator 13.7') {
		it('userinfo-ios', async () => {
			expect(1).toBe(1)
		})
		return
	} 
	beforeAll(async () => {
		page = await program.navigateTo(PAGE_PATH)
		await page.waitFor("view")
		userInfo = await page.callMethod('userInfoTest')
		console.log("userInfo",userInfo)
		if (!userInfo._id) {
			console.log("未登录测试失败")
			return
		}
	});
	it("昵称", async () => {
		const nickname = "数字天堂DCloud" + Math.round(Math.random() * 10);
		await page.waitFor(300)
		await page.callMethod("setNickname", nickname)
		await page.waitFor(5000)
		userInfo = await page.callMethod('userInfoTest')
		expect(userInfo.nickname).toBe(nickname)
	})
});