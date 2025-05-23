const PAGE_PATH = '/uni_modules/uni-id-pages/pages/register/register'
describe('register', () => {
	let page
	beforeAll(async () => {
		page = await program.reLaunch(PAGE_PATH)
		await page.waitFor('view')
	})
	it('注册账号', async () => {
		await page.setData({
			formData: {
				"username": "DCloud",
				"nickname": "DCloud",
				'password': "dcloud2022",
				'password2': "dcloud2022",
				"captcha": "1234",
			},
			isAgree: true,
			needPopupAgreements: false,
			isTest: true
		})
		const resLogin = await page.callMethod('submit')
		console.log("resLogin: ", resLogin.errCode);
		// expect.assertions(1);
		switch (resLogin.errCode) {
			case 0:
				console.log('注册成功')
				expect(resLogin.uid).toHaveLength(24);
				break;
			case "uni-id-account-exists":
				const expectAccountStr = ["此账号已注册", "Account exists"]
				expect(expectAccountStr).toContain(resLogin.errMsg);
				break;
			case "FunctionTimeout":
				expect(resLogin.errMsg).toBe("[uni-id-co]: 请求云函数超时");
				const captchaEl = await page.$('.captcha-box')
				await captchaEl.callMethod('getImageCaptcha')
				break;
			case "uni-captcha-verify-overdue":
				expect(resLogin.errMsg).toBe("验证码已失效");
				break;
			case "uni-captcha-verify-fail":
				expect(resLogin.errMsg).toBe("验证码错误");
				break;
			case "SYS_ERR":
				console.log("未知错误---SYS_ERR") //[uni-id-co]: request:ok
				break;
			default:
				console.log(await program.currentPage());
				break;
		}
	})
})